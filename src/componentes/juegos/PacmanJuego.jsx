import { useEffect, useMemo, useRef, useState } from "react";

const TAMANO = 17;

const DIRECCIONES = {
  arriba: { x: 0, y: -1 },
  abajo: { x: 0, y: 1 },
  izquierda: { x: -1, y: 0 },
  derecha: { x: 1, y: 0 },
};

const OPUESTA = {
  arriba: "abajo",
  abajo: "arriba",
  izquierda: "derecha",
  derecha: "izquierda",
};

const COLORES_INICIALES = {
  pacman: "#ffe600",
  muros: "#0e2340",
  puntos: "#90ffff",
  fruta: "#ff5a8a",
  asustado: "#4aa8ff",
};

const FANTASMAS_BASE = [
  { x: 8, y: 8, color: "#ff4d8d" },
  { x: 8, y: 9, color: "#34d8ff" },
  { x: 9, y: 8, color: "#ffb703" },
  { x: 7, y: 8, color: "#9b5cff" },
];

const FRUTAS = [
  { x: 8, y: 1 },
  { x: 1, y: 8 },
  { x: 15, y: 8 },
  { x: 8, y: 15 },
];

const CELDAS_PROTEGIDAS = new Set([
  "1,1",
  "1,2",
  "2,1",
  "8,8",
  "8,9",
  "9,8",
  "7,8",
  "8,7",
  "9,9",
  "7,9",
  "13,13",
  "14,13",
  "13,14",
]);

const EXTRAS_NIVEL = [
  [5, 1],
  [11, 1],
  [1, 5],
  [15, 5],
  [5, 5],
  [11, 5],
  [5, 9],
  [11, 9],
  [1, 11],
  [15, 11],
  [5, 13],
  [11, 13],
  [3, 13],
  [13, 3],
  [3, 3],
  [13, 13],
];

function clave(x, y) {
  return `${x},${y}`;
}

function crearLaberintoBase() {
  const laberinto = Array.from({ length: TAMANO }, (_, y) =>
    Array.from({ length: TAMANO }, (_, x) =>
      x === 0 || y === 0 || x === TAMANO - 1 || y === TAMANO - 1 ? 1 : 0
    )
  );

  const filas = [3, 7, 11];
  const aperturasFila = {
    3: [2, 8, 14],
    7: [4, 8, 12],
    11: [2, 8, 14],
  };

  filas.forEach((fila) => {
    for (let x = 1; x < TAMANO - 1; x += 1) {
      if (!aperturasFila[fila].includes(x)) {
        laberinto[fila][x] = 1;
      }
    }
  });

  const columnas = [4, 8, 12];
  const aperturasColumna = {
    4: [1, 5, 9, 13, 15],
    8: [3, 7, 11, 15],
    12: [1, 5, 9, 13, 15],
  };

  columnas.forEach((columna) => {
    for (let y = 1; y < TAMANO - 1; y += 1) {
      if (!aperturasColumna[columna].includes(y)) {
        laberinto[y][columna] = 1;
      }
    }
  });

  for (let y = 7; y <= 9; y += 1) {
    for (let x = 7; x <= 9; x += 1) {
      laberinto[y][x] = 0;
    }
  }

  laberinto[1][1] = 0;
  laberinto[1][2] = 0;
  laberinto[2][1] = 0;
  laberinto[2][2] = 0;

  laberinto[15][15] = 0;
  laberinto[15][14] = 0;
  laberinto[14][15] = 0;

  return laberinto;
}

function construirLaberinto(nivel) {
  const laberinto = crearLaberintoBase();
  const cantidadExtras = Math.min(EXTRAS_NIVEL.length, Math.max(0, nivel - 1));

  for (let i = 0; i < cantidadExtras; i += 1) {
    const [x, y] = EXTRAS_NIVEL[i];
    if (!CELDAS_PROTEGIDAS.has(clave(x, y)) && laberinto[y][x] === 0) {
      laberinto[y][x] = 1;
    }
  }

  laberinto[8][8] = 0;
  laberinto[8][9] = 0;
  laberinto[9][8] = 0;
  laberinto[7][8] = 0;
  laberinto[1][1] = 0;

  return laberinto;
}

function contarPuntos(laberinto) {
  let total = 0;

  for (let y = 0; y < laberinto.length; y += 1) {
    for (let x = 0; x < laberinto[y].length; x += 1) {
      if (laberinto[y][x] === 0) {
        total += 1;
      }
    }
  }

  return total;
}

function puedeMoverse(laberinto, x, y) {
  return (
    y >= 0 &&
    y < laberinto.length &&
    x >= 0 &&
    x < laberinto[0].length &&
    laberinto[y][x] !== 1
  );
}

function distancia(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function anguloPacman(direccion) {
  if (direccion === "arriba") return 270;
  if (direccion === "abajo") return 90;
  if (direccion === "izquierda") return 180;
  return 0;
}

function crearEntidades(nivel) {
  const cantidadFantasmas = Math.min(4, 2 + Math.floor((nivel - 1) / 2));

  return {
    pacman: {
      x: 1,
      y: 1,
      direccion: "derecha",
      siguiente: "derecha",
    },
    fantasmas: FANTASMAS_BASE.slice(0, cantidadFantasmas).map((fantasma, indice) => ({
      id: indice + 1,
      x: fantasma.x,
      y: fantasma.y,
      inicioX: fantasma.x,
      inicioY: fantasma.y,
      direccion: indice % 2 === 0 ? "izquierda" : "derecha",
      color: fantasma.color,
    })),
  };
}

function crearEstadoNivel(nivel, puntos = 0, vidas = 4, record = 0, tiempo = 0) {
  const laberinto = construirLaberinto(nivel);
  const { pacman, fantasmas } = crearEntidades(nivel);
  const totalPuntos = contarPuntos(laberinto);

  return {
    nivel,
    puntos,
    vidas,
    record,
    tiempo,
    laberinto,
    pacman,
    fantasmas,
    totalPuntos,
    puntosRestantes: totalPuntos,
    fruta: null,
    frutaConsumida: false,
    poder: 0,
    iniciado: false,
    terminado: false,
    mensaje: "Pulsa jugar para comenzar",
  };
}

function elegirFruta(laberinto) {
  for (const fruta of FRUTAS) {
    if (puedeMoverse(laberinto, fruta.x, fruta.y)) {
      return fruta;
    }
  }
  return null;
}

function elegirDireccionFantasma(fantasma, laberinto, pacman, asustado) {
  const opciones = Object.entries(DIRECCIONES)
    .map(([nombre, dir]) => ({
      nombre,
      x: fantasma.x + dir.x,
      y: fantasma.y + dir.y,
    }))
    .filter((opcion) => puedeMoverse(laberinto, opcion.x, opcion.y));

  if (opciones.length === 0) {
    return fantasma.direccion;
  }

  let opcionesFinales = opciones.filter(
    (opcion) => opcion.nombre !== OPUESTA[fantasma.direccion]
  );

  if (opcionesFinales.length === 0) {
    opcionesFinales = opciones;
  }

  opcionesFinales.sort((a, b) => {
    const da = distancia({ x: a.x, y: a.y }, pacman);
    const db = distancia({ x: b.x, y: b.y }, pacman);

    if (asustado) {
      return db - da;
    }

    return da - db;
  });

  return opcionesFinales[0].nombre;
}

function formatearTiempo(segundos) {
  const mins = String(Math.floor(segundos / 60)).padStart(2, "0");
  const secs = String(segundos % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function PacmanJuego() {
  const [juego, setJuego] = useState(() => crearEstadoNivel(1));
  const [colores, setColores] = useState(COLORES_INICIALES);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);

  const toqueInicial = useRef({ x: 0, y: 0 });

  const velocidad = useMemo(
    () => Math.max(95, 210 - (juego.nivel - 1) * 10),
    [juego.nivel]
  );

  const setDireccion = (direccion) => {
    setJuego((anterior) => ({
      ...anterior,
      pacman: {
        ...anterior.pacman,
        siguiente: direccion,
      },
    }));
  };

  const reiniciarJuego = () => {
    setJuego((anterior) =>
      crearEstadoNivel(1, 0, 4, anterior.record, 0)
    );
  };

  const reiniciarPosiciones = (anterior, vidasRestantes) => {
    const entidades = crearEntidades(anterior.nivel);

    return {
      ...anterior,
      vidas: vidasRestantes,
      pacman: entidades.pacman,
      fantasmas: entidades.fantasmas,
      poder: 0,
      fruta: null,
      iniciado: false,
      mensaje: vidasRestantes > 0 ? "Perdiste una vida. Pulsa jugar" : "Fin del juego",
      terminado: vidasRestantes <= 0,
      record: Math.max(anterior.record, anterior.puntos),
    };
  };

  const avanzarJuego = (anterior) => {
    if (!anterior.iniciado || anterior.terminado) {
      return anterior;
    }

    const laberinto = anterior.laberinto.map((fila) => [...fila]);
    let pacman = { ...anterior.pacman };
    let fantasmas = anterior.fantasmas.map((fantasma) => ({ ...fantasma }));
    let puntos = anterior.puntos;
    let puntosRestantes = anterior.puntosRestantes;
    let fruta = anterior.fruta ? { ...anterior.fruta } : null;
    let frutaConsumida = anterior.frutaConsumida;
    let poder = Math.max(0, anterior.poder - 1);
    let mensaje = anterior.mensaje;
    let vidas = anterior.vidas;
    let record = anterior.record;

    const dirDeseada = DIRECCIONES[pacman.siguiente];
    if (
      dirDeseada &&
      puedeMoverse(
        laberinto,
        pacman.x + dirDeseada.x,
        pacman.y + dirDeseada.y
      )
    ) {
      pacman.direccion = pacman.siguiente;
    }

    const dirActual = DIRECCIONES[pacman.direccion];
    if (
      dirActual &&
      puedeMoverse(
        laberinto,
        pacman.x + dirActual.x,
        pacman.y + dirActual.y
      )
    ) {
      pacman = {
        ...pacman,
        x: pacman.x + dirActual.x,
        y: pacman.y + dirActual.y,
      };
    }

    if (laberinto[pacman.y][pacman.x] === 0) {
      laberinto[pacman.y][pacman.x] = 2;
      puntos += 10;
      puntosRestantes -= 1;
      record = Math.max(record, puntos);
    }

    if (
      !fruta &&
      !frutaConsumida &&
      puntosRestantes <= Math.floor(anterior.totalPuntos * 0.6)
    ) {
      fruta = elegirFruta(laberinto);
      mensaje = "Apareció una fruta especial";
    }

    if (fruta && fruta.x === pacman.x && fruta.y === pacman.y) {
      fruta = null;
      frutaConsumida = true;
      poder = Math.max(28, 52 - anterior.nivel * 2);
      puntos += 150;
      record = Math.max(record, puntos);
      mensaje = "¡Ahora puedes comerte fantasmas!";
    }

    fantasmas = fantasmas.map((fantasma) => {
      const direccion = elegirDireccionFantasma(
        fantasma,
        laberinto,
        pacman,
        poder > 0
      );
      const dir = DIRECCIONES[direccion];
      const siguienteX = fantasma.x + dir.x;
      const siguienteY = fantasma.y + dir.y;

      if (!puedeMoverse(laberinto, siguienteX, siguienteY)) {
        return fantasma;
      }

      return {
        ...fantasma,
        direccion,
        x: siguienteX,
        y: siguienteY,
      };
    });

    for (let i = 0; i < fantasmas.length; i += 1) {
      const fantasma = fantasmas[i];

      if (fantasma.x === pacman.x && fantasma.y === pacman.y) {
        if (poder > 0) {
          puntos += 200;
          record = Math.max(record, puntos);
          fantasmas[i] = {
            ...fantasma,
            x: fantasma.inicioX,
            y: fantasma.inicioY,
            direccion: "izquierda",
          };
          mensaje = "¡Fantasma comido!";
        } else {
          vidas -= 1;
          return reiniciarPosiciones(
            {
              ...anterior,
              puntos,
              record,
              laberinto,
              puntosRestantes,
            },
            vidas
          );
        }
      }
    }

    if (puntosRestantes <= 0) {
      const nuevoNivel = anterior.nivel + 1;
      const nuevasVidas = vidas + 1;

      return {
        ...crearEstadoNivel(
          nuevoNivel,
          puntos + 500,
          nuevasVidas,
          Math.max(record, puntos + 500),
          anterior.tiempo
        ),
        mensaje: `Nivel ${nuevoNivel} listo. Ganaste una vida`,
      };
    }

    return {
      ...anterior,
      laberinto,
      pacman,
      fantasmas,
      fruta,
      frutaConsumida,
      poder,
      puntos,
      puntosRestantes,
      vidas,
      record,
      mensaje,
    };
  };

  useEffect(() => {
    if (!juego.iniciado || juego.terminado) return;

    const intervalo = setInterval(() => {
      setJuego((anterior) => avanzarJuego(anterior));
    }, velocidad);

    return () => clearInterval(intervalo);
  }, [juego.iniciado, juego.terminado, velocidad]);

  useEffect(() => {
    if (!juego.iniciado || juego.terminado) return;

    const reloj = setInterval(() => {
      setJuego((anterior) => ({
        ...anterior,
        tiempo: anterior.tiempo + 1,
      }));
    }, 1000);

    return () => clearInterval(reloj);
  }, [juego.iniciado, juego.terminado]);

  useEffect(() => {
    const onKeyDown = (evento) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(evento.key)) {
        evento.preventDefault();
      }

      if (evento.key === "ArrowUp") setDireccion("arriba");
      if (evento.key === "ArrowDown") setDireccion("abajo");
      if (evento.key === "ArrowLeft") setDireccion("izquierda");
      if (evento.key === "ArrowRight") setDireccion("derecha");

      if (evento.key === " ") {
        setJuego((anterior) => ({
          ...anterior,
          iniciado: anterior.terminado ? false : !anterior.iniciado,
          mensaje: anterior.iniciado ? "Juego en pausa" : "Jugando...",
        }));
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const iniciarToque = (evento) => {
    const toque = evento.touches[0];
    toqueInicial.current = { x: toque.clientX, y: toque.clientY };
  };

  const terminarToque = (evento) => {
    const toque = evento.changedTouches[0];
    const dx = toque.clientX - toqueInicial.current.x;
    const dy = toque.clientY - toqueInicial.current.y;

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      setDireccion(dx > 0 ? "derecha" : "izquierda");
    } else {
      setDireccion(dy > 0 ? "abajo" : "arriba");
    }
  };

  const iniciarJuego = () => {
    setJuego((anterior) => ({
      ...anterior,
      iniciado: true,
      mensaje: "Jugando...",
    }));
  };

  const pausarJuego = () => {
    setJuego((anterior) => ({
      ...anterior,
      iniciado: false,
      mensaje: "Juego en pausa",
    }));
  };

  return (
    <>
      <div className="pacman-juego">
        <div className="pacman-superior">
          <div className="pacman-paneles">
            <div className="pacman-panel">
              <span>Puntos</span>
              <strong>{juego.puntos}</strong>
            </div>

            <div className="pacman-panel">
              <span>Récord</span>
              <strong>{juego.record}</strong>
            </div>

            <div className="pacman-panel">
              <span>Nivel</span>
              <strong>{juego.nivel}</strong>
            </div>

            <div className="pacman-panel">
              <span>Vidas</span>
              <strong className="pacman-vidas">
                <span
                  className="mini-pacman"
                  style={{
                    background: `conic-gradient(from 35deg, transparent 0 55deg, ${colores.pacman} 55deg 360deg)`,
                  }}
                />
                x{juego.vidas}
              </strong>
            </div>

            <div className="pacman-panel">
              <span>Tiempo</span>
              <strong>{formatearTiempo(juego.tiempo)}</strong>
            </div>
          </div>

          <div className="pacman-acciones">
            <button
              type="button"
              className="pacman-boton"
              onClick={juego.iniciado ? pausarJuego : iniciarJuego}
            >
              {juego.iniciado ? "Pausar" : "Jugar"}
            </button>

            <button
              type="button"
              className="pacman-boton"
              onClick={() => setMostrarConfiguracion(true)}
            >
              Configurar
            </button>

            <button
              type="button"
              className="pacman-boton"
              onClick={reiniciarJuego}
            >
              Reiniciar
            </button>
          </div>
        </div>

        <div className="pacman-mensaje">
          {juego.poder > 0 ? "Modo caza fantasmas activado" : juego.mensaje}
        </div>

        <div
          className="pacman-tablero"
          onTouchStart={iniciarToque}
          onTouchEnd={terminarToque}
        >
          {juego.laberinto.map((fila, y) =>
            fila.map((celda, x) => {
              const fantasma = juego.fantasmas.find(
                (item) => item.x === x && item.y === y
              );
              const esPacman = juego.pacman.x === x && juego.pacman.y === y;
              const esFruta = juego.fruta && juego.fruta.x === x && juego.fruta.y === y;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`pacman-celda ${celda === 1 ? "es-muro" : ""}`}
                  style={{
                    "--muro-color": colores.muros,
                    "--punto-color": colores.puntos,
                    "--fruta-color": colores.fruta,
                  }}
                >
                  {celda !== 1 && celda === 0 && !esPacman && !fantasma && !esFruta && (
                    <div className="pacman-punto" />
                  )}

                  {esFruta && <div className="pacman-fruta" />}

                  {fantasma && (
                    <div
                      className={`pacman-fantasma ${juego.poder > 0 ? "fantasma-asustado" : ""}`}
                      style={{
                        backgroundColor:
                          juego.poder > 0 ? colores.asustado : fantasma.color,
                      }}
                    >
                      <span className="fantasma-ojos">
                        <span />
                        <span />
                      </span>
                    </div>
                  )}

                  {esPacman && (
                    <div
                      className="pacman-jugador"
                      style={{
                        background: `conic-gradient(from 35deg, transparent 0 55deg, ${colores.pacman} 55deg 360deg)`,
                        transform: `rotate(${anguloPacman(juego.pacman.direccion)}deg)`,
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="pacman-instrucciones">
          <span>PC: flechas + espacio</span>
          <span>Móvil: desliza el dedo</span>
          <span>Fruta = puedes comerte fantasmas</span>
        </div>
      </div>

      {mostrarConfiguracion && (
        <div className="configuracion-overlay">
          <div className="configuracion-juego">
            <div className="configuracion-header">
              <div>
                <span>CONFIGURACIÓN</span>
                <h2>Pac-Man</h2>
              </div>

              <button
                type="button"
                className="configuracion-cerrar"
                onClick={() => setMostrarConfiguracion(false)}
              >
                ×
              </button>
            </div>

            <div className="configuracion-niveles-auto">
              <span>PROGRESIÓN AUTOMÁTICA</span>
              <strong>12 niveles</strong>
              <p>
                Inicias con 4 vidas. Cada nivel te da 1 vida extra,
                aumenta la velocidad y el laberinto se vuelve más difícil.
              </p>
            </div>

            <div className="configuracion-seccion">
              <strong>Colores</strong>

              <div className="lista-colores">
                <label className="fila-color">
                  <span>Pac-Man</span>
                  <input
                    type="color"
                    value={colores.pacman}
                    onChange={(e) =>
                      setColores((anterior) => ({
                        ...anterior,
                        pacman: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="fila-color">
                  <span>Muros</span>
                  <input
                    type="color"
                    value={colores.muros}
                    onChange={(e) =>
                      setColores((anterior) => ({
                        ...anterior,
                        muros: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="fila-color">
                  <span>Puntitos</span>
                  <input
                    type="color"
                    value={colores.puntos}
                    onChange={(e) =>
                      setColores((anterior) => ({
                        ...anterior,
                        puntos: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="fila-color">
                  <span>Frutita</span>
                  <input
                    type="color"
                    value={colores.fruta}
                    onChange={(e) =>
                      setColores((anterior) => ({
                        ...anterior,
                        fruta: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </div>

            <div className="configuracion-footer">
              <button
                type="button"
                className="boton-restablecer"
                onClick={() => setColores(COLORES_INICIALES)}
              >
                Restablecer
              </button>

              <button
                type="button"
                className="boton-listo"
                onClick={() => setMostrarConfiguracion(false)}
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}