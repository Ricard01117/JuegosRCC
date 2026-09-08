import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  NIVELES_PACMAN,
} from "../../datos/configuracionJuegos";


const TAMANO = 21;

const VENTAJA_FANTASMAS_MS =
  5000;


const DIRECCIONES = {
  arriba: {
    x: 0,
    y: -1,
  },

  abajo: {
    x: 0,
    y: 1,
  },

  izquierda: {
    x: -1,
    y: 0,
  },

  derecha: {
    x: 1,
    y: 0,
  },
};


const OPUESTAS = {
  arriba: "abajo",
  abajo: "arriba",
  izquierda: "derecha",
  derecha: "izquierda",
};


const COLORES_FANTASMAS = [
  "#ff315f",
  "#ff7bd5",
  "#00eaff",
  "#ff9f1c",
];


const UMBRALES_FRUTA = [
  0.32,
  0.68,
];


function clave(
  x,
  y
) {
  return `${x},${y}`;
}


function crearAleatorio(
  semilla
) {
  let valor =
    semilla >>> 0;


  return () => {
    valor +=
      0x6D2B79F5;


    let t =
      valor;


    t =
      Math.imul(
        t ^
          (
            t >>> 15
          ),

        t | 1
      );


    t ^=
      t +
      Math.imul(
        t ^
          (
            t >>> 7
          ),

        t | 61
      );


    return (
      (
        t ^
        (
          t >>> 14
        )
      ) >>>
      0
    ) /
      4294967296;
  };
}


function mezclar(
  elementos,
  aleatorio
) {
  const copia = [
    ...elementos,
  ];


  for (
    let i =
      copia.length - 1;

    i > 0;

    i -= 1
  ) {
    const j =
      Math.floor(
        aleatorio() *
          (
            i + 1
          )
      );


    [
      copia[i],
      copia[j],
    ] = [
      copia[j],
      copia[i],
    ];
  }


  return copia;
}


function generarLaberinto(
  nivel,
  vueltas
) {
  const laberinto =
    Array.from(
      {
        length:
          TAMANO,
      },

      () =>
        Array(
          TAMANO
        ).fill(
          1
        )
    );


  const aleatorio =
    crearAleatorio(
      1511 +
        nivel *
          7919
    );


  const pila = [
    {
      x: 1,
      y: 1,
    },
  ];


  laberinto[1][1] =
    0;


  while (
    pila.length > 0
  ) {
    const actual =
      pila[
        pila.length - 1
      ];


    const posibilidades =
      mezclar(
        [
          {
            x: 0,
            y: -2,
          },

          {
            x: 2,
            y: 0,
          },

          {
            x: 0,
            y: 2,
          },

          {
            x: -2,
            y: 0,
          },
        ],

        aleatorio
      );


    let encontrado =
      false;


    for (
      const direccion
      of posibilidades
    ) {
      const nuevoX =
        actual.x +
        direccion.x;


      const nuevoY =
        actual.y +
        direccion.y;


      if (
        nuevoX <= 0 ||
        nuevoY <= 0 ||
        nuevoX >=
          TAMANO - 1 ||
        nuevoY >=
          TAMANO - 1
      ) {
        continue;
      }


      if (
        laberinto[
          nuevoY
        ][
          nuevoX
        ] === 0
      ) {
        continue;
      }


      laberinto[
        actual.y +
          direccion.y / 2
      ][
        actual.x +
          direccion.x / 2
      ] =
        0;


      laberinto[
        nuevoY
      ][
        nuevoX
      ] =
        0;


      pila.push({
        x:
          nuevoX,

        y:
          nuevoY,
      });


      encontrado =
        true;


      break;
    }


    if (
      !encontrado
    ) {
      pila.pop();
    }
  }


  /*
  ==========================================================
  CONEXIONES EXTRA

  Conforme aumentan los niveles,
  el laberinto conserva menos
  caminos sencillos.
  ==========================================================
  */

  let conexiones =
    0;

  let intentos =
    0;


  while (
    conexiones <
      vueltas &&
    intentos < 1500
  ) {
    intentos += 1;


    const x =
      1 +
      Math.floor(
        aleatorio() *
          (
            TAMANO - 2
          )
      );


    const y =
      1 +
      Math.floor(
        aleatorio() *
          (
            TAMANO - 2
          )
      );


    if (
      laberinto[y][x] !==
      1
    ) {
      continue;
    }


    const horizontal =
      laberinto[y][x - 1] ===
        0 &&
      laberinto[y][x + 1] ===
        0;


    const vertical =
      laberinto[y - 1][x] ===
        0 &&
      laberinto[y + 1][x] ===
        0;


    if (
      horizontal ||
      vertical
    ) {
      laberinto[y][x] =
        0;

      conexiones += 1;
    }
  }


  return laberinto;
}


function esTransitable(
  laberinto,
  x,
  y
) {
  return (
    x >= 0 &&
    y >= 0 &&
    x < TAMANO &&
    y < TAMANO &&
    laberinto[y][x] ===
      0
  );
}


function obtenerPasillos(
  laberinto
) {
  const resultado = [];


  for (
    let y = 0;
    y < TAMANO;
    y += 1
  ) {
    for (
      let x = 0;
      x < TAMANO;
      x += 1
    ) {
      if (
        laberinto[y][x] ===
        0
      ) {
        resultado.push({
          x,
          y,
        });
      }
    }
  }


  return resultado;
}


function obtenerCasaFantasmas(
  laberinto,
  cantidad
) {
  const centro = {
    x:
      Math.floor(
        TAMANO / 2
      ),

    y:
      Math.floor(
        TAMANO / 2
      ),
  };


  const pasillos =
    obtenerPasillos(
      laberinto
    );


  pasillos.sort(
    (
      primero,
      segundo
    ) => {
      const distanciaPrimero =
        Math.abs(
          primero.x -
            centro.x
        ) +
        Math.abs(
          primero.y -
            centro.y
        );


      const distanciaSegundo =
        Math.abs(
          segundo.x -
            centro.x
        ) +
        Math.abs(
          segundo.y -
            centro.y
        );


      return (
        distanciaPrimero -
        distanciaSegundo
      );
    }
  );


  return pasillos
    .filter(
      (
        posicion
      ) =>
        !(
          posicion.x ===
            1 &&
          posicion.y ===
            1
        )
    )
    .slice(
      0,
      cantidad
    );
}


function crearPellets(
  laberinto,
  casas
) {
  const pellets =
    new Set();


  const casasSet =
    new Set(
      casas.map(
        (
          posicion
        ) =>
          clave(
            posicion.x,
            posicion.y
          )
      )
    );


  for (
    let y = 0;
    y < TAMANO;
    y += 1
  ) {
    for (
      let x = 0;
      x < TAMANO;
      x += 1
    ) {
      if (
        laberinto[y][x] !==
        0
      ) {
        continue;
      }


      if (
        x === 1 &&
        y === 1
      ) {
        continue;
      }


      if (
        casasSet.has(
          clave(
            x,
            y
          )
        )
      ) {
        continue;
      }


      pellets.add(
        clave(
          x,
          y
        )
      );
    }
  }


  return pellets;
}


function cargarRecord() {
  const valor =
    Number(
      localStorage.getItem(
        "juegosrcc_pacman_record"
      )
    );


  return Number.isFinite(
    valor
  )
    ? valor
    : 0;
}


function guardarRecord(
  record
) {
  localStorage.setItem(
    "juegosrcc_pacman_record",

    String(
      record
    )
  );
}


function crearFantasmas(
  laberinto,
  cantidad
) {
  const casas =
    obtenerCasaFantasmas(
      laberinto,
      cantidad
    );


  return casas.map(
    (
      casa,
      indice
    ) => ({
      id:
        indice,

      x:
        casa.x,

      y:
        casa.y,

      casaX:
        casa.x,

      casaY:
        casa.y,

      direccion:
        indice % 2 === 0
          ? "izquierda"
          : "derecha",

      color:
        COLORES_FANTASMAS[
          indice %
            COLORES_FANTASMAS.length
        ],
    })
  );
}


function crearEstadoNivel(
  nivel,
  puntos,
  vidas,
  record
) {
  const indiceNivel =
    Math.min(
      nivel,
      NIVELES_PACMAN.length
    ) - 1;


  const parametros =
    NIVELES_PACMAN[
      indiceNivel
    ];


  const laberinto =
    generarLaberinto(
      nivel,
      parametros.vueltas
    );


  const fantasmas =
    crearFantasmas(
      laberinto,
      parametros.fantasmas
    );


  const casas =
    fantasmas.map(
      (
        fantasma
      ) => ({
        x:
          fantasma.casaX,

        y:
          fantasma.casaY,
      })
    );


  const pellets =
    crearPellets(
      laberinto,
      casas
    );


  return {
    nivel,

    puntos,

    vidas,

    record,

    laberinto,

    pellets,

    totalPellets:
      pellets.size,


    pacman: {
      x: 1,
      y: 1,

      direccion:
        "derecha",

      deseada:
        "derecha",
    },


    fantasmas,


    /*
    ========================================================
    VENTAJA DE 5 SEGUNDOS

    El contador solamente disminuye
    mientras la partida está activa.

    Los fantasmas permanecen visibles,
    pero completamente inmóviles.
    ========================================================
    */

    ventajaFantasmasMs:
      VENTAJA_FANTASMAS_MS,


    fruta: null,

    frutaEtapa: 0,

    poderHasta: 0,


    invulnerableHasta:
      Date.now() +
      1200,


    /*
    Pac-Man ya no permanece bloqueado
    al iniciar el nivel.
    */

    bloqueadoHasta:
      0,


    tick: 0,

    gameOver: false,

    victoria: false,


    mensaje:
      "PREPÁRATE",
  };
}


function vecinosValidos(
  laberinto,
  posicion
) {
  return Object.entries(
    DIRECCIONES
  )
    .map(
      ([
        nombre,
        direccion,
      ]) => ({
        nombre,

        x:
          posicion.x +
          direccion.x,

        y:
          posicion.y +
          direccion.y,
      })
    )
    .filter(
      (
        candidato
      ) =>
        esTransitable(
          laberinto,
          candidato.x,
          candidato.y
        )
    );
}


function siguientePasoBfs(
  laberinto,
  inicio,
  objetivo
) {
  const cola = [
    {
      x:
        inicio.x,

      y:
        inicio.y,

      primerPaso:
        null,
    },
  ];


  const visitados =
    new Set([
      clave(
        inicio.x,
        inicio.y
      ),
    ]);


  while (
    cola.length > 0
  ) {
    const actual =
      cola.shift();


    if (
      actual.x ===
        objetivo.x &&
      actual.y ===
        objetivo.y
    ) {
      return actual.primerPaso;
    }


    const vecinos =
      vecinosValidos(
        laberinto,
        actual
      );


    for (
      const vecino
      of vecinos
    ) {
      const id =
        clave(
          vecino.x,
          vecino.y
        );


      if (
        visitados.has(
          id
        )
      ) {
        continue;
      }


      visitados.add(
        id
      );


      cola.push({
        x:
          vecino.x,

        y:
          vecino.y,

        primerPaso:
          actual.primerPaso ||
          vecino.nombre,
      });
    }
  }


  return null;
}


function direccionFantasma(
  fantasma,
  laberinto,
  pacman,
  asustado
) {
  const opciones =
    vecinosValidos(
      laberinto,
      fantasma
    );


  if (
    opciones.length === 0
  ) {
    return fantasma
      .direccion;
  }


  if (
    asustado
  ) {
    const ordenadas = [
      ...opciones,
    ];


    ordenadas.sort(
      (
        a,
        b
      ) => {
        const distanciaA =
          Math.abs(
            a.x -
              pacman.x
          ) +
          Math.abs(
            a.y -
              pacman.y
          );


        const distanciaB =
          Math.abs(
            b.x -
              pacman.x
          ) +
          Math.abs(
            b.y -
              pacman.y
          );


        return (
          distanciaB -
          distanciaA
        );
      }
    );


    return ordenadas[0]
      .nombre;
  }


  const direccion =
    siguientePasoBfs(
      laberinto,
      fantasma,
      pacman
    );


  if (
    direccion
  ) {
    return direccion;
  }


  const sinRegreso =
    opciones.filter(
      (
        opcion
      ) =>
        opcion.nombre !==
        OPUESTAS[
          fantasma
            .direccion
        ]
    );


  return (
    sinRegreso[0] ||
    opciones[0]
  ).nombre;
}


function encontrarFruta(
  laberinto,
  pellets,
  pacman
) {
  const candidatos = [];


  for (
    const posicion
    of obtenerPasillos(
      laberinto
    )
  ) {
    if (
      !pellets.has(
        clave(
          posicion.x,
          posicion.y
        )
      )
    ) {
      continue;
    }


    candidatos.push({
      ...posicion,

      distancia:
        Math.abs(
          posicion.x -
            pacman.x
        ) +
        Math.abs(
          posicion.y -
            pacman.y
        ),
    });
  }


  candidatos.sort(
    (
      a,
      b
    ) =>
      b.distancia -
      a.distancia
  );


  return candidatos[0] ||
    null;
}


function colisionMismaCelda(
  primero,
  segundo
) {
  return (
    primero.x ===
      segundo.x &&
    primero.y ===
      segundo.y
  );
}


function rotacionPacman(
  direccion
) {
  switch (
    direccion
  ) {
    case "abajo":
      return "90deg";

    case "izquierda":
      return "180deg";

    case "arriba":
      return "270deg";

    default:
      return "0deg";
  }
}


function Pacman({
  pausado,
  configuracion,
}) {
  const inicioArrastreRef =
    useRef({
      x: 0,
      y: 0,
    });


  const [
    estado,
    setEstado,
  ] = useState(
    () =>
      crearEstadoNivel(
        1,
        0,
        4,
        cargarRecord()
      )
  );


  const parametros =
    useMemo(
      () =>
        NIVELES_PACMAN[
          Math.min(
            estado.nivel,
            NIVELES_PACMAN.length
          ) - 1
        ],

      [
        estado.nivel,
      ]
    );


  const colores = {
    fondo:
      configuracion
        ?.colores
        ?.fondo ||
      "#02030a",

    laberinto:
      configuracion
        ?.colores
        ?.laberinto ||
      "#1768ff",

    jugador:
      configuracion
        ?.colores
        ?.jugador ||
      "#ffe600",

    puntos:
      configuracion
        ?.colores
        ?.puntos ||
      "#b8ffff",

    fruta:
      configuracion
        ?.colores
        ?.fruta ||
      "#ff2e75",

    fantasma:
      configuracion
        ?.colores
        ?.fantasma ||
      "#ff3b78",

    asustado:
      configuracion
        ?.colores
        ?.asustado ||
      "#168cff",
  };


  /*
  ==========================================================
  CAMBIAR DIRECCIÓN
  ==========================================================
  */

  const cambiarDireccion =
    useCallback(
      (
        direccion
      ) => {
        if (
          !DIRECCIONES[
            direccion
          ]
        ) {
          return;
        }


        setEstado(
          (
            anterior
          ) => ({
            ...anterior,

            pacman: {
              ...anterior.pacman,

              deseada:
                direccion,
            },
          })
        );
      },

      []
    );


  /*
  ==========================================================
  CONTROLES DESDE JUEGOMODAL
  ==========================================================
  */

  useEffect(() => {
    const controlar =
      (
        evento
      ) => {
        const {
          juego,
          accion,
          activo,
        } =
          evento.detail ||
          {};


        if (
          juego !==
            "pacman" ||
          !activo
        ) {
          return;
        }


        if (
          DIRECCIONES[
            accion
          ]
        ) {
          cambiarDireccion(
            accion
          );
        }
      };


    window.addEventListener(
      "juegosrcc-control",
      controlar
    );


    return () => {
      window.removeEventListener(
        "juegosrcc-control",
        controlar
      );
    };
  }, [
    cambiarDireccion,
  ]);


  /*
  ==========================================================
  MOVIMIENTO TOUCH

  En teléfono el usuario desliza
  directamente sobre el laberinto.
  ==========================================================
  */

  const iniciarArrastre =
    (
      evento
    ) => {
      inicioArrastreRef.current = {
        x:
          evento.clientX,

        y:
          evento.clientY,
      };


      evento.currentTarget
        .setPointerCapture?.(
          evento.pointerId
        );
    };


  const terminarArrastre =
    (
      evento
    ) => {
      const dx =
        evento.clientX -
        inicioArrastreRef
          .current.x;


      const dy =
        evento.clientY -
        inicioArrastreRef
          .current.y;


      if (
        Math.abs(
          dx
        ) < 18 &&
        Math.abs(
          dy
        ) < 18
      ) {
        return;
      }


      if (
        Math.abs(
          dx
        ) >
        Math.abs(
          dy
        )
      ) {
        cambiarDireccion(
          dx > 0
            ? "derecha"
            : "izquierda"
        );

        return;
      }


      cambiarDireccion(
        dy > 0
          ? "abajo"
          : "arriba"
      );
    };


  /*
  ==========================================================
  REINICIAR PARTIDA

  Siempre vuelve a:
  nivel 1
  4 vidas
  5 segundos de ventaja
  ==========================================================
  */

  const reiniciar =
    useCallback(() => {
      setEstado(
        (
          anterior
        ) =>
          crearEstadoNivel(
            1,
            0,
            4,
            anterior.record
          )
      );
    }, []);


  /*
  ==========================================================
  CICLO PRINCIPAL
  ==========================================================
  */

  useEffect(() => {
    if (
      pausado ||
      estado.gameOver ||
      estado.victoria
    ) {
      return undefined;
    }


    const intervalo =
      window.setInterval(
        () => {
          setEstado(
            (
              anterior
            ) => {
              if (
                anterior.gameOver ||
                anterior.victoria
              ) {
                return anterior;
              }


              const ahora =
                Date.now();


              /*
              Este bloqueo se conserva
              por compatibilidad, pero
              normalmente vale 0.
              */

              if (
                ahora <
                anterior
                  .bloqueadoHasta
              ) {
                return {
                  ...anterior,

                  tick:
                    anterior.tick +
                    1,
                };
              }


              /*
              ==================================================
              COPIA DEL ESTADO

              El contador disminuye únicamente cuando
              este intervalo está ejecutándose.

              Si el usuario pausa el juego,
              los 5 segundos también se pausan.
              ==================================================
              */

              const siguiente = {
                ...anterior,

                ventajaFantasmasMs:
                  Math.max(
                    0,

                    (
                      anterior
                        .ventajaFantasmasMs ??
                      0
                    ) -
                      parametros
                        .velocidad
                  ),

                pellets:
                  new Set(
                    anterior.pellets
                  ),

                pacman: {
                  ...anterior.pacman,
                },

                fantasmas:
                  anterior
                    .fantasmas
                    .map(
                      (
                        fantasma
                      ) => ({
                        ...fantasma,
                      })
                    ),

                tick:
                  anterior.tick +
                  1,
              };


              /*
              Mientras sea mayor a cero:
              - fantasmas quietos
              - no pueden matar
              - Pac-Man sí se mueve
              */

              const fantasmasEnEspera =
                siguiente
                  .ventajaFantasmasMs >
                0;


              const pacmanAnterior = {
                x:
                  anterior
                    .pacman.x,

                y:
                  anterior
                    .pacman.y,
              };


              /*
              ==================================================
              PAC-MAN
              ==================================================
              */

              const deseada =
                DIRECCIONES[
                  siguiente
                    .pacman
                    .deseada
                ];


              if (
                deseada &&
                esTransitable(
                  siguiente
                    .laberinto,

                  siguiente
                    .pacman.x +
                    deseada.x,

                  siguiente
                    .pacman.y +
                    deseada.y
                )
              ) {
                siguiente
                  .pacman
                  .direccion =
                  siguiente
                    .pacman
                    .deseada;
              }


              const actual =
                DIRECCIONES[
                  siguiente
                    .pacman
                    .direccion
                ];


              if (
                actual &&
                esTransitable(
                  siguiente
                    .laberinto,

                  siguiente
                    .pacman.x +
                    actual.x,

                  siguiente
                    .pacman.y +
                    actual.y
                )
              ) {
                siguiente
                  .pacman.x +=
                  actual.x;


                siguiente
                  .pacman.y +=
                  actual.y;
              }


              /*
              ==================================================
              PUNTITOS
              ==================================================
              */

              const posicionPacman =
                clave(
                  siguiente
                    .pacman.x,

                  siguiente
                    .pacman.y
                );


              if (
                siguiente
                  .pellets
                  .has(
                    posicionPacman
                  )
              ) {
                siguiente
                  .pellets
                  .delete(
                    posicionPacman
                  );


                siguiente.puntos +=
                  10;


                if (
                  siguiente.puntos >
                  siguiente.record
                ) {
                  siguiente.record =
                    siguiente.puntos;


                  guardarRecord(
                    siguiente.record
                  );
                }
              }


              /*
              ==================================================
              APARECER FRUTA

              Aparece dos veces por nivel.
              ==================================================
              */

              const comidos =
                siguiente
                  .totalPellets -
                siguiente
                  .pellets
                  .size;


              const progreso =
                siguiente
                  .totalPellets >
                0
                  ? comidos /
                    siguiente
                      .totalPellets

                  : 1;


              if (
                !siguiente.fruta &&
                siguiente
                  .frutaEtapa <
                  UMBRALES_FRUTA.length &&
                progreso >=
                  UMBRALES_FRUTA[
                    siguiente
                      .frutaEtapa
                  ]
              ) {
                siguiente.fruta =
                  encontrarFruta(
                    siguiente
                      .laberinto,

                    siguiente
                      .pellets,

                    siguiente
                      .pacman
                  );


                siguiente.mensaje =
                  "🍒 FRUTA ESPECIAL";
              }


              /*
              ==================================================
              COMER FRUTA
              ==================================================
              */

              if (
                siguiente.fruta &&
                siguiente
                  .pacman.x ===
                  siguiente
                    .fruta.x &&
                siguiente
                  .pacman.y ===
                  siguiente
                    .fruta.y
              ) {
                siguiente.puntos +=
                  250;


                siguiente
                  .pellets
                  .delete(
                    clave(
                      siguiente
                        .fruta.x,

                      siguiente
                        .fruta.y
                    )
                  );


                siguiente.fruta =
                  null;


                siguiente.frutaEtapa +=
                  1;


                siguiente.poderHasta =
                  ahora +
                  parametros
                    .poderMs;


                siguiente.mensaje =
                  "¡COME A LOS FANTASMAS!";


                if (
                  siguiente.puntos >
                  siguiente.record
                ) {
                  siguiente.record =
                    siguiente.puntos;


                  guardarRecord(
                    siguiente.record
                  );
                }
              }


              const conPoder =
                ahora <
                siguiente
                  .poderHasta;


              /*
              ==================================================
              FANTASMAS

              IMPORTANTE:
              durante la ventaja de cinco segundos
              este bloque NO se ejecuta.
              ==================================================
              */

              const posicionesAnteriores =
                anterior
                  .fantasmas
                  .map(
                    (
                      fantasma
                    ) => ({
                      x:
                        fantasma.x,

                      y:
                        fantasma.y,
                    })
                  );


              if (
                !fantasmasEnEspera &&
                siguiente.tick %
                  parametros
                    .fantasmaCada ===
                  0
              ) {
                siguiente.fantasmas =
                  siguiente
                    .fantasmas
                    .map(
                      (
                        fantasma
                      ) => {
                        const direccion =
                          direccionFantasma(
                            fantasma,

                            siguiente
                              .laberinto,

                            siguiente
                              .pacman,

                            conPoder
                          );


                        const movimiento =
                          DIRECCIONES[
                            direccion
                          ];


                        if (
                          !movimiento
                        ) {
                          return fantasma;
                        }


                        const nuevoX =
                          fantasma.x +
                          movimiento.x;


                        const nuevoY =
                          fantasma.y +
                          movimiento.y;


                        if (
                          !esTransitable(
                            siguiente
                              .laberinto,

                            nuevoX,

                            nuevoY
                          )
                        ) {
                          return fantasma;
                        }


                        return {
                          ...fantasma,

                          x:
                            nuevoX,

                          y:
                            nuevoY,

                          direccion,
                        };
                      }
                    );
              }


              /*
              ==================================================
              COLISIONES

              Durante los cinco segundos
              las colisiones con fantasmas
              quedan desactivadas.
              ==================================================
              */

              let perdioVida =
                false;


              siguiente.fantasmas =
                siguiente
                  .fantasmas
                  .map(
                    (
                      fantasma,
                      indice
                    ) => {
                      /*
                      Fantasma visible pero
                      completamente inofensivo.
                      */

                      if (
                        fantasmasEnEspera
                      ) {
                        return fantasma;
                      }


                      const colisionDirecta =
                        colisionMismaCelda(
                          fantasma,

                          siguiente
                            .pacman
                        );


                      const cruce =
                        posicionesAnteriores[
                          indice
                        ] &&
                        posicionesAnteriores[
                          indice
                        ].x ===
                          siguiente
                            .pacman.x &&
                        posicionesAnteriores[
                          indice
                        ].y ===
                          siguiente
                            .pacman.y &&
                        fantasma.x ===
                          pacmanAnterior.x &&
                        fantasma.y ===
                          pacmanAnterior.y;


                      if (
                        !colisionDirecta &&
                        !cruce
                      ) {
                        return fantasma;
                      }


                      /*
                      Pac-Man tiene poder:
                      se come al fantasma.
                      */

                      if (
                        conPoder
                      ) {
                        siguiente.puntos +=
                          200;


                        siguiente.mensaje =
                          "FANTASMA COMIDO +200";


                        return {
                          ...fantasma,

                          x:
                            fantasma
                              .casaX,

                          y:
                            fantasma
                              .casaY,
                        };
                      }


                      if (
                        ahora <
                        siguiente
                          .invulnerableHasta
                      ) {
                        return fantasma;
                      }


                      perdioVida =
                        true;


                      return fantasma;
                    }
                  );


              /*
              ==================================================
              PAC-MAN PIERDE UNA VIDA
              ==================================================
              */

              if (
                perdioVida
              ) {
                siguiente.vidas -=
                  1;


                /*
                GAME OVER
                */

                if (
                  siguiente.vidas <=
                  0
                ) {
                  siguiente.vidas =
                    0;


                  siguiente.gameOver =
                    true;


                  siguiente.mensaje =
                    "GAME OVER";


                  guardarRecord(
                    siguiente.record
                  );


                  return siguiente;
                }


                /*
                =================================================
                REINICIO DESPUÉS DE SER COMIDO

                - Pac-Man vuelve al inicio.
                - Fantasmas vuelven a su zona.
                - Pac-Man puede moverse inmediatamente.
                - Fantasmas esperan otros cinco segundos.
                =================================================
                */

                const nuevosFantasmas =
                  crearFantasmas(
                    siguiente
                      .laberinto,

                    parametros
                      .fantasmas
                  );


                siguiente.pacman = {
                  x: 1,
                  y: 1,

                  direccion:
                    "derecha",

                  deseada:
                    "derecha",
                };


                siguiente.fantasmas =
                  nuevosFantasmas;


                siguiente.poderHasta =
                  0;


                siguiente
                  .invulnerableHasta =
                  ahora +
                  1200;


                siguiente
                  .bloqueadoHasta =
                  0;


                /*
                AQUÍ REINICIAN LOS
                CINCO SEGUNDOS.
                */

                siguiente
                  .ventajaFantasmasMs =
                  VENTAJA_FANTASMAS_MS;


                siguiente.mensaje =
                  "PREPÁRATE";


                return siguiente;
              }


              /*
              ==================================================
              NIVEL COMPLETADO
              ==================================================
              */

              if (
                siguiente
                  .pellets
                  .size ===
                0
              ) {
                const bonificacion =
                  1000 *
                  siguiente.nivel;


                const puntosNuevos =
                  siguiente.puntos +
                  bonificacion;


                const recordNuevo =
                  Math.max(
                    siguiente.record,
                    puntosNuevos
                  );


                guardarRecord(
                  recordNuevo
                );


                /*
                Último nivel.
                */

                if (
                  siguiente.nivel >=
                  NIVELES_PACMAN.length
                ) {
                  return {
                    ...siguiente,

                    puntos:
                      puntosNuevos,

                    record:
                      recordNuevo,

                    vidas:
                      siguiente
                        .vidas +
                      1,

                    victoria:
                      true,

                    mensaje:
                      "¡ARCADE COMPLETADO!",
                  };
                }


                /*
                =================================================
                SIGUIENTE NIVEL

                +1 vida.

                crearEstadoNivel vuelve automáticamente
                a colocar 5 segundos de ventaja.
                =================================================
                */

                return crearEstadoNivel(
                  siguiente.nivel +
                    1,

                  puntosNuevos,

                  siguiente.vidas +
                    1,

                  recordNuevo
                );
              }


              return siguiente;
            }
          );
        },

        parametros.velocidad
      );


    return () => {
      window.clearInterval(
        intervalo
      );
    };
  }, [
    parametros,
    pausado,
    estado.gameOver,
    estado.victoria,
  ]);


  /*
  ==========================================================
  PODER DE LA FRUTA
  ==========================================================
  */

  const conPoder =
    Date.now() <
    estado.poderHasta;


  const segundosPoder =
    conPoder
      ? Math.ceil(
          (
            estado.poderHasta -
            Date.now()
          ) /
            1000
        )

      : 0;


  /*
  ==========================================================
  CONTADOR DE VENTAJA

  5 → 4 → 3 → 2 → 1
  ==========================================================
  */

  const segundosVentaja =
    Math.ceil(
      (
        estado
          .ventajaFantasmasMs ??
        0
      ) /
        1000
    );


  const fantasmasEnEspera =
    segundosVentaja > 0 &&
    !estado.gameOver &&
    !estado.victoria;


  /*
  ==========================================================
  INTERFAZ
  ==========================================================
  */

  return (
    <div className="pacman-juego">

      {/* =====================================================
          HUD
      ====================================================== */}

      <div className="pacman-hud">

        <div className="pacman-panel">

          <span>
            PUNTOS
          </span>

          <strong>
            {estado.puntos}
          </strong>

        </div>


        <div className="pacman-panel">

          <span>
            RÉCORD
          </span>

          <strong>
            {estado.record}
          </strong>

        </div>


        <div className="pacman-panel">

          <span>
            NIVEL
          </span>

          <strong>
            {estado.nivel}
            /10
          </strong>

        </div>


        <div className="pacman-panel">

          <span>
            VIDAS
          </span>

          <strong className="pacman-vidas">

            <i
              className="pacman-mini"
              style={{
                "--pacman-color":
                  colores.jugador,
              }}
            />

            ×{estado.vidas}

          </strong>

        </div>


        <div className="pacman-panel">

          <span>
            ESTADO
          </span>

          <strong
            className={
              conPoder
                ? "estado-caza"
                : ""
            }
          >

            {fantasmasEnEspera
              ? `VENTAJA ${segundosVentaja}s`

              : conPoder
                ? `CAZA ${segundosPoder}s`

                : "NORMAL"}

          </strong>

        </div>

      </div>


      {/* =====================================================
          MENSAJE SUPERIOR
      ====================================================== */}

      <div className="pacman-mensaje">

        {fantasmasEnEspera
          ? `PREPÁRATE · FANTASMAS EN ${segundosVentaja}s`

          : conPoder
            ? "🍒 ¡AHORA PUEDES COMERTE A LOS FANTASMAS!"

            : estado.mensaje}

      </div>


      {/* =====================================================
          LABERINTO
      ====================================================== */}

      <div
        className="pacman-tablero"
        style={{
          "--pacman-fondo":
            colores.fondo,

          "--pacman-muro":
            colores.laberinto,

          "--pacman-punto":
            colores.puntos,

          "--pacman-jugador":
            colores.jugador,

          "--pacman-fruta":
            colores.fruta,

          "--pacman-asustado":
            colores.asustado,
        }}
        onPointerDown={
          iniciarArrastre
        }
        onPointerUp={
          terminarArrastre
        }
      >

        {estado.laberinto.map(
          (
            fila,
            y
          ) =>
            fila.map(
              (
                celda,
                x
              ) => {
                const id =
                  clave(
                    x,
                    y
                  );


                const tienePunto =
                  estado.pellets.has(
                    id
                  );


                const esPacman =
                  estado
                    .pacman.x ===
                    x &&
                  estado
                    .pacman.y ===
                    y;


                const fantasma =
                  estado
                    .fantasmas
                    .find(
                      (
                        elemento
                      ) =>
                        elemento.x ===
                          x &&
                        elemento.y ===
                          y
                    );


                const esFruta =
                  estado.fruta &&
                  estado
                    .fruta.x ===
                    x &&
                  estado
                    .fruta.y ===
                    y;


                return (
                  <div
                    key={
                      id
                    }
                    className={
                      `pacman-celda ${
                        celda === 1
                          ? "pacman-muro"
                          : "pacman-pasillo"
                      }`
                    }
                  >

                    {tienePunto &&
                      !esPacman &&
                      !esFruta && (

                      <span className="pacman-punto" />

                    )}


                    {esFruta && (

                      <span className="pacman-fruta">
                        🍒
                      </span>

                    )}


                    {fantasma && (

                      <div
                        className={
                          `pacman-fantasma ${
                            conPoder
                              ? "fantasma-asustado"
                              : ""
                          }`
                        }
                        style={{
                          "--fantasma-color":
                            conPoder
                              ? colores.asustado

                              : fantasma.color ||
                                colores.fantasma,
                        }}
                      >

                        <div className="fantasma-ojos">

                          <i />

                          <i />

                        </div>

                      </div>

                    )}


                    {esPacman && (

                      <div
                        className="pacman-personaje"
                        style={{
                          "--pacman-color":
                            colores.jugador,

                          transform:
                            `rotate(${rotacionPacman(
                              estado
                                .pacman
                                .direccion
                            )})`,
                        }}
                      />

                    )}

                  </div>
                );
              }
            )
        )}


        {/* ===================================================
            PAUSA / INICIO
        ==================================================== */}

        {pausado &&
          !estado.gameOver &&
          !estado.victoria && (

          <div className="pacman-overlay">

            <div className="pacman-logo-grande">

              <span
                className="pacman-logo-personaje"
                style={{
                  "--pacman-color":
                    colores.jugador,
                }}
              />

              <strong>
                PAC-MAN
              </strong>

            </div>


            <p>
              Toca la pantalla o pulsa ▶ para comenzar
            </p>


            <div className="pacman-ayuda-overlay">

              <span>
                PC: Flechas / WASD
              </span>

              <span>
                Móvil: deslizar
              </span>

              <span>
                5 segundos de ventaja
              </span>

              <span>
                🍒 Fruta = comer fantasmas
              </span>

            </div>

          </div>

        )}


        {/* ===================================================
            GAME OVER
        ==================================================== */}

        {estado.gameOver && (

          <div className="pacman-overlay">

            <strong className="pacman-game-over">
              GAME OVER
            </strong>


            <p>
              {estado.puntos}
              {" "}
              puntos
            </p>


            <p>
              Nivel
              {" "}
              {estado.nivel}
            </p>


            <button
              type="button"
              onClick={
                reiniciar
              }
            >
              JUGAR DE NUEVO
            </button>

          </div>

        )}


        {/* ===================================================
            VICTORIA
        ==================================================== */}

        {estado.victoria && (

          <div className="pacman-overlay">

            <strong className="pacman-victoria">
              ¡ARCADE COMPLETADO!
            </strong>


            <p>
              Récord:
              {" "}
              {estado.record}
            </p>


            <button
              type="button"
              onClick={
                reiniciar
              }
            >
              VOLVER A JUGAR
            </button>

          </div>

        )}

      </div>


      {/* =====================================================
          INSTRUCCIONES
      ====================================================== */}

      <div className="pacman-instrucciones">

        <span>
          ← ↑ ↓ → mover
        </span>

        <span>
          Móvil: deslizar
        </span>

        <span>
          5 s antes de que salgan los fantasmas
        </span>

        <span>
          🍒 fruta = cazar fantasmas
        </span>

        <span>
          +1 vida por nivel
        </span>

      </div>

    </div>
  );
}


export default Pacman;