import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";


import {
  ALTO_FLAPPY,
  ANCHO_FLAPPY,
  actualizarJugador,
  actualizarObstaculo,
  colisionJugadorObstaculo,
  crearJugador,
  crearObstaculo,
  crearObstaculosIniciales,
  fueraDePantalla,
  saltarJugador,
} from "./motorFlappy";


import {
  NIVELES_FLAPPY,
  PUNTOS_POR_NIVEL_FLAPPY,
} from "../../datos/configuracionJuegos";


function obtenerNivel(
  puntos
) {
  return Math.min(
    NIVELES_FLAPPY.length,

    Math.floor(
      puntos /
      PUNTOS_POR_NIVEL_FLAPPY
    ) + 1
  );
}


function cargarRecord() {
  const valor =
    Number(
      localStorage.getItem(
        "juegosrcc_flappy_record"
      )
    );


  return Number.isFinite(
    valor
  )
    ? valor
    : 0;
}


function Flappy({
  pausado,
  configuracion,
}) {
  const canvasRef =
    useRef(null);


  const frameRef =
    useRef(null);


  const ultimoTiempoRef =
    useRef(
      performance.now()
    );


  const jugadorRef =
    useRef(
      crearJugador()
    );


  const obstaculosRef =
    useRef([]);


  const estadoRef =
    useRef({
      pausado,

      gameOver: false,
    });


  const nivelRef =
    useRef(1);


  const puntosRef =
    useRef(0);


  const [
    puntos,
    setPuntos,
  ] = useState(0);


  const [
    nivel,
    setNivel,
  ] = useState(1);


  const [
    record,
    setRecord,
  ] = useState(
    cargarRecord
  );


  const [
    gameOver,
    setGameOver,
  ] = useState(false);


  const [
    avisoNivel,
    setAvisoNivel,
  ] = useState(null);


  const nivelActual =
    useMemo(
      () =>
        NIVELES_FLAPPY[
          nivel - 1
        ],

      [
        nivel,
      ]
    );


  useEffect(() => {
    estadoRef.current.pausado =
      pausado;
  }, [
    pausado,
  ]);


  useEffect(() => {
    estadoRef.current.gameOver =
      gameOver;
  }, [
    gameOver,
  ]);


  /*
  ==========================================
  REINICIAR
  ==========================================
  */

  const reiniciar =
    useCallback(() => {
      const configuracionInicial =
        NIVELES_FLAPPY[0];


      jugadorRef.current =
        crearJugador();


      obstaculosRef.current =
        crearObstaculosIniciales(
          configuracionInicial
        );


      puntosRef.current =
        0;


      nivelRef.current =
        1;


      setPuntos(
        0
      );


      setNivel(
        1
      );


      setGameOver(
        false
      );


      setAvisoNivel(
        "NIVEL 1"
      );


      estadoRef.current.gameOver =
        false;


      ultimoTiempoRef.current =
        performance.now();


      window.setTimeout(
        () => {
          setAvisoNivel(
            null
          );
        },
        1200
      );
    }, []);


  useEffect(() => {
    reiniciar();
  }, [
    reiniciar,
  ]);


  /*
  ==========================================
  SALTAR
  ==========================================
  */

  const saltar =
    useCallback(() => {
      if (
        estadoRef.current
          .pausado ||
        estadoRef.current
          .gameOver
      ) {
        return;
      }


      const parametros =
        NIVELES_FLAPPY[
          nivelRef.current -
          1
        ];


      saltarJugador(
        jugadorRef.current,
        parametros
      );
    }, []);


  /*
  ==========================================
  CONTROLES DESDE JuegoModal
  ==========================================
  */

  useEffect(() => {
    const controlar =
      (evento) => {
        const {
          juego,
          accion,
          activo,
        } =
          evento.detail || {};


        if (
          juego !==
            "flappy" ||
          !activo
        ) {
          return;
        }


        if (
          accion ===
            "saltar" ||
          accion ===
            "arriba"
        ) {
          saltar();
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
    saltar,
  ]);


  /*
  ==========================================
  SUBIR NIVEL
  ==========================================
  */

  const registrarPunto =
    useCallback(() => {
      const nuevosPuntos =
        puntosRef.current +
        1;


      puntosRef.current =
        nuevosPuntos;


      setPuntos(
        nuevosPuntos
      );


      if (
        nuevosPuntos >
        record
      ) {
        setRecord(
          nuevosPuntos
        );


        localStorage.setItem(
          "juegosrcc_flappy_record",

          String(
            nuevosPuntos
          )
        );
      }


      const nuevoNivel =
        obtenerNivel(
          nuevosPuntos
        );


      if (
        nuevoNivel >
        nivelRef.current
      ) {
        nivelRef.current =
          nuevoNivel;


        setNivel(
          nuevoNivel
        );


        setAvisoNivel(
          `NIVEL ${nuevoNivel}`
        );


        window.setTimeout(
          () => {
            setAvisoNivel(
              null
            );
          },
          1200
        );
      }
    }, [
      record,
    ]);


  /*
  ==========================================
  GAME OVER
  ==========================================
  */

  const terminarPartida =
    useCallback(() => {
      if (
        estadoRef.current
          .gameOver
      ) {
        return;
      }


      setGameOver(
        true
      );


      estadoRef.current.gameOver =
        true;
    }, []);


  /*
  ==========================================
  DIBUJAR
  ==========================================
  */

  const dibujar =
    useCallback(() => {
      const canvas =
        canvasRef.current;


      if (!canvas) {
        return;
      }


      const ctx =
        canvas.getContext(
          "2d"
        );


      const colores =
        configuracion.colores;


      ctx.fillStyle =
        colores.fondo;


      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      const escalaX =
        canvas.width /
        ANCHO_FLAPPY;


      const escalaY =
        canvas.height /
        ALTO_FLAPPY;


      ctx.save();


      ctx.scale(
        escalaX,
        escalaY
      );


      /*
      ESTRELLAS / PARTÍCULAS
      */

      ctx.globalAlpha =
        0.23;


      ctx.fillStyle =
        "#ffffff";


      for (
        let i = 0;
        i < 55;
        i += 1
      ) {
        const x =
          (
            i * 179
          ) %
          ANCHO_FLAPPY;


        const y =
          (
            i * 83
          ) %
          ALTO_FLAPPY;


        ctx.fillRect(
          x,
          y,
          2,
          2
        );
      }


      ctx.globalAlpha =
        1;


      /*
      OBSTÁCULOS
      */

      for (
        const obstaculo
        of obstaculosRef.current
      ) {
        const superior =
          obstaculo
            .centroHueco -
          obstaculo.hueco / 2;


        const inferior =
          obstaculo
            .centroHueco +
          obstaculo.hueco / 2;


        ctx.fillStyle =
          colores.obstaculo;


        ctx.shadowColor =
          colores.obstaculo;


        ctx.shadowBlur =
          14;


        ctx.fillRect(
          obstaculo.x,
          0,
          obstaculo.ancho,
          superior
        );


        ctx.fillRect(
          obstaculo.x,
          inferior,
          obstaculo.ancho,
          ALTO_FLAPPY -
            inferior
        );


        /*
        Bordes de los tubos.
        */

        ctx.fillStyle =
          "rgba(255,255,255,0.18)";


        ctx.fillRect(
          obstaculo.x +
            7,
          0,
          5,
          superior
        );


        ctx.fillRect(
          obstaculo.x +
            7,
          inferior,
          5,
          ALTO_FLAPPY -
            inferior
        );
      }


      ctx.shadowBlur =
        0;


      /*
      SUELO
      */

      ctx.fillStyle =
        colores.suelo;


      ctx.globalAlpha =
        0.28;


      ctx.fillRect(
        0,
        ALTO_FLAPPY - 15,
        ANCHO_FLAPPY,
        15
      );


      ctx.globalAlpha =
        1;


      /*
      JUGADOR
      */

      const jugador =
        jugadorRef.current;


      ctx.save();


      ctx.translate(
        jugador.x,
        jugador.y
      );


      ctx.rotate(
        jugador.rotacion
      );


      ctx.fillStyle =
        colores.jugador;


      ctx.strokeStyle =
        "#ffffff";


      ctx.lineWidth =
        2;


      ctx.shadowColor =
        colores.jugador;


      ctx.shadowBlur =
        20;


      /*
      Cuerpo.
      */

      ctx.beginPath();


      ctx.arc(
        0,
        0,
        jugador.radio,
        0,
        Math.PI *
          2
      );


      ctx.fill();


      ctx.stroke();


      /*
      Ala.
      */

      ctx.beginPath();


      ctx.moveTo(
        -5,
        1
      );


      ctx.lineTo(
        -24,
        10
      );


      ctx.lineTo(
        -7,
        15
      );


      ctx.closePath();


      ctx.fill();


      /*
      Pico.
      */

      ctx.fillStyle =
        "#ff8b38";


      ctx.beginPath();


      ctx.moveTo(
        15,
        -3
      );


      ctx.lineTo(
        30,
        3
      );


      ctx.lineTo(
        15,
        8
      );


      ctx.closePath();


      ctx.fill();


      /*
      Ojo.
      */

      ctx.shadowBlur =
        0;


      ctx.fillStyle =
        "#ffffff";


      ctx.beginPath();


      ctx.arc(
        8,
        -7,
        5,
        0,
        Math.PI *
          2
      );


      ctx.fill();


      ctx.fillStyle =
        "#050505";


      ctx.beginPath();


      ctx.arc(
        10,
        -7,
        2.3,
        0,
        Math.PI *
          2
      );


      ctx.fill();


      ctx.restore();


      ctx.restore();
    }, [
      configuracion,
    ]);


  /*
  ==========================================
  LOOP PRINCIPAL
  ==========================================
  */

  useEffect(() => {
    ultimoTiempoRef.current =
      performance.now();


    const animar =
      (tiempo) => {
        const delta =
          Math.min(
            2,

            (
              tiempo -
              ultimoTiempoRef
                .current
            ) /
              16.67
          );


        ultimoTiempoRef.current =
          tiempo;


        if (
          !estadoRef.current
            .pausado &&
          !estadoRef.current
            .gameOver
        ) {
          const parametros =
            NIVELES_FLAPPY[
              nivelRef.current -
              1
            ];


          const jugador =
            jugadorRef.current;


          actualizarJugador(
            jugador,
            parametros,
            delta
          );


          for (
            const obstaculo
            of obstaculosRef.current
          ) {
            actualizarObstaculo(
              obstaculo,
              parametros,
              delta
            );


            if (
              !obstaculo.contado &&
              obstaculo.x +
                obstaculo.ancho <
                jugador.x
            ) {
              obstaculo.contado =
                true;


              registrarPunto();
            }
          }


          /*
          Eliminar obstáculos
          que ya salieron.
          */

          obstaculosRef.current =
            obstaculosRef.current
              .filter(
                (
                  obstaculo
                ) =>
                  obstaculo.x +
                    obstaculo.ancho >
                  -30
              );


          /*
          Crear nuevos obstáculos.
          */

          const ultimo =
            obstaculosRef.current[
              obstaculosRef.current
                .length - 1
            ];


          if (
            !ultimo ||
            ultimo.x <
              ANCHO_FLAPPY -
                parametros
                  .separacion
          ) {
            const xNuevo =
              ultimo
                ? ultimo.x +
                  parametros
                    .separacion
                : ANCHO_FLAPPY +
                  100;


            obstaculosRef.current.push(
              crearObstaculo(
                xNuevo,
                parametros
              )
            );
          }


          /*
          Colisiones.
          */

          const impacto =
            obstaculosRef.current
              .some(
                (
                  obstaculo
                ) =>
                  colisionJugadorObstaculo(
                    jugador,
                    obstaculo
                  )
              );


          if (
            impacto ||
            fueraDePantalla(
              jugador
            )
          ) {
            terminarPartida();
          }
        }


        dibujar();


        frameRef.current =
          requestAnimationFrame(
            animar
          );
      };


    frameRef.current =
      requestAnimationFrame(
        animar
      );


    return () => {
      if (
        frameRef.current
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }
    };
  }, [
    dibujar,
    registrarPunto,
    terminarPartida,
  ]);


  const faltan =
    nivel >= 10
      ? 0
      : PUNTOS_POR_NIVEL_FLAPPY -
        (
          puntos %
          PUNTOS_POR_NIVEL_FLAPPY
        );


  return (
    <div className="flappy-juego">

      <div className="flappy-hud">

        <div>
          <span>
            PUNTOS
          </span>

          <strong>
            {puntos}
          </strong>
        </div>


        <div>
          <span>
            NIVEL
          </span>

          <strong>
            {nivel}
          </strong>
        </div>


        <div>
          <span>
            RÉCORD
          </span>

          <strong>
            {record}
          </strong>
        </div>


        <div>
          <span>
            SIGUIENTE
          </span>

          <strong>
            {nivel >= 10
              ? "MAX"
              : `${faltan} pts`}
          </strong>
        </div>

      </div>


      <div
        className="flappy-canvas-wrapper"
        onPointerDown={
          (evento) => {
            evento.preventDefault();

            saltar();
          }
        }
      >

        <canvas
          ref={
            canvasRef
          }
          width="900"
          height="520"
          className="canvas-flappy"
        />


        {pausado &&
          !gameOver && (
          <div className="overlay-estado-juego">

            <strong>
              FLAPPY
            </strong>


            <small>
              Pulsa ▶ para comenzar
            </small>


            <div className="instrucciones-flappy">

              <span>
                PC: ESPACIO / ↑
              </span>


              <span>
                Móvil: toca la pantalla
              </span>

            </div>

          </div>
        )}


        {avisoNivel && (
          <div className="aviso-nivel-flappy">
            {avisoNivel}
          </div>
        )}


        {gameOver && (
          <div className="overlay-estado-juego">

            <strong>
              FIN DE LA PARTIDA
            </strong>


            <span>
              {puntos}
              {" "}
              puntos
            </span>


            <span>
              Nivel alcanzado:
              {" "}
              {nivel}
            </span>


            <span>
              Récord:
              {" "}
              {record}
            </span>


            <button
              type="button"
              onClick={
                (evento) => {
                  evento.stopPropagation();

                  reiniciar();
                }
              }
            >
              JUGAR DE NUEVO
            </button>

          </div>
        )}

      </div>

    </div>
  );
}


export default Flappy;