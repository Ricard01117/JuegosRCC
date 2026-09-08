import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";


import {
  COLUMNAS,
  FILAS,
  calcularPuntos,
  crearPiezaAleatoria,
  crearTablero,
  fijarPieza,
  hayColision,
  intentarRotar,
  limpiarLineas,
  obtenerPosicionFantasma,
} from "./motorTetris";


import {
  LINEAS_POR_NIVEL_TETRIS,
  NIVELES_TETRIS,
} from "../../datos/configuracionJuegos";


const PASO_GESTO_HORIZONTAL = 28;

const PASO_GESTO_VERTICAL = 32;


function obtenerNivel(
  lineas
) {
  return Math.min(
    NIVELES_TETRIS.length,

    Math.floor(
      lineas /
      LINEAS_POR_NIVEL_TETRIS
    ) + 1
  );
}


function Tetris({
  pausado,
  configuracion,
}) {
  const canvasRef =
    useRef(null);


  const tableroRef =
    useRef(
      crearTablero()
    );


  const piezaRef =
    useRef(
      crearPiezaAleatoria()
    );


  const ultimoDescensoRef =
    useRef(0);


  const frameRef =
    useRef(null);


  const estadoRef =
    useRef({
      pausado,
      gameOver: false,
    });


  const gestoRef =
    useRef({
      activo: false,

      pointerId: null,

      inicioX: 0,
      inicioY: 0,

      ultimoX: 0,
      ultimoY: 0,

      movio: false,
    });


  const nivelAnteriorRef =
    useRef(1);


  const [
    puntuacion,
    setPuntuacion,
  ] = useState(0);


  const [
    lineas,
    setLineas,
  ] = useState(0);


  const [
    gameOver,
    setGameOver,
  ] = useState(false);


  const [
    version,
    setVersion,
  ] = useState(0);


  const [
    avisoNivel,
    setAvisoNivel,
  ] = useState(null);


  const nivel =
    useMemo(
      () =>
        obtenerNivel(
          lineas
        ),
      [
        lineas,
      ]
    );


  const velocidad =
    NIVELES_TETRIS[
      nivel - 1
    ].velocidad;


  const nivelMaximo =
    nivel ===
    NIVELES_TETRIS.length;


  const progresoNivel =
    lineas %
    LINEAS_POR_NIVEL_TETRIS;


  const faltan =
    nivelMaximo
      ? 0
      : LINEAS_POR_NIVEL_TETRIS -
        progresoNivel;


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
  AVISO DE NUEVO NIVEL
  ==========================================
  */

  useEffect(() => {
    if (
      nivel >
      nivelAnteriorRef.current
    ) {
      setAvisoNivel(
        `NIVEL ${nivel}`
      );


      const temporizador =
        window.setTimeout(
          () => {
            setAvisoNivel(
              null
            );
          },
          1400
        );


      nivelAnteriorRef.current =
        nivel;


      return () => {
        window.clearTimeout(
          temporizador
        );
      };
    }


    nivelAnteriorRef.current =
      nivel;


    return undefined;
  }, [
    nivel,
  ]);


  /*
  ==========================================
  REINICIAR
  ==========================================
  */

  const reiniciar =
    useCallback(() => {
      tableroRef.current =
        crearTablero();


      piezaRef.current =
        crearPiezaAleatoria();


      ultimoDescensoRef.current =
        performance.now();


      setPuntuacion(
        0
      );


      setLineas(
        0
      );


      setGameOver(
        false
      );


      setAvisoNivel(
        null
      );


      nivelAnteriorRef.current =
        1;


      estadoRef.current.gameOver =
        false;


      setVersion(
        (actual) =>
          actual + 1
      );
    }, []);


  /*
  ==========================================
  FIJAR PIEZA
  ==========================================
  */

  const fijarActual =
    useCallback(() => {
      const tableroFijado =
        fijarPieza(
          tableroRef.current,
          piezaRef.current
        );


      const resultado =
        limpiarLineas(
          tableroFijado
        );


      tableroRef.current =
        resultado.tablero;


      if (
        resultado.lineas > 0
      ) {
        setLineas(
          (actual) =>
            actual +
            resultado.lineas
        );


        setPuntuacion(
          (actual) =>
            actual +
            calcularPuntos(
              resultado.lineas
            ) *
              nivel
        );
      }


      const nueva =
        crearPiezaAleatoria();


      piezaRef.current =
        nueva;


      if (
        hayColision(
          tableroRef.current,
          nueva
        )
      ) {
        setGameOver(
          true
        );


        estadoRef.current.gameOver =
          true;
      }


      setVersion(
        (actual) =>
          actual + 1
      );
    }, [
      nivel,
    ]);


  /*
  ==========================================
  BAJAR
  ==========================================
  */

  const bajar =
    useCallback(() => {
      if (
        estadoRef.current
          .pausado ||
        estadoRef.current
          .gameOver
      ) {
        return;
      }


      const pieza =
        piezaRef.current;


      if (
        hayColision(
          tableroRef.current,
          pieza,
          0,
          1
        )
      ) {
        fijarActual();

        return;
      }


      piezaRef.current = {
        ...pieza,

        y:
          pieza.y + 1,
      };


      setVersion(
        (actual) =>
          actual + 1
      );
    }, [
      fijarActual,
    ]);


  /*
  ==========================================
  MOVER HORIZONTAL
  ==========================================
  */

  const mover =
    useCallback(
      (direccion) => {
        if (
          estadoRef.current
            .pausado ||
          estadoRef.current
            .gameOver
        ) {
          return;
        }


        const pieza =
          piezaRef.current;


        if (
          hayColision(
            tableroRef.current,
            pieza,
            direccion,
            0
          )
        ) {
          return;
        }


        piezaRef.current = {
          ...pieza,

          x:
            pieza.x +
            direccion,
        };


        setVersion(
          (actual) =>
            actual + 1
        );
      },
      []
    );


  /*
  ==========================================
  GIRAR
  ==========================================
  */

  const rotar =
    useCallback(() => {
      if (
        estadoRef.current
          .pausado ||
        estadoRef.current
          .gameOver
      ) {
        return;
      }


      piezaRef.current =
        intentarRotar(
          tableroRef.current,
          piezaRef.current
        );


      setVersion(
        (actual) =>
          actual + 1
      );
    }, []);


  /*
  ==========================================
  CAÍDA INMEDIATA
  ==========================================
  */

  const caidaRapida =
    useCallback(() => {
      if (
        estadoRef.current
          .pausado ||
        estadoRef.current
          .gameOver
      ) {
        return;
      }


      const pieza =
        piezaRef.current;


      let distancia =
        0;


      while (
        !hayColision(
          tableroRef.current,
          pieza,
          0,
          distancia + 1
        )
      ) {
        distancia += 1;
      }


      piezaRef.current = {
        ...pieza,

        y:
          pieza.y +
          distancia,
      };


      setPuntuacion(
        (actual) =>
          actual +
          distancia *
            2 *
            nivel
      );


      fijarActual();
    }, [
      fijarActual,
      nivel,
    ]);


  /*
  ==========================================
  CONTROLES DEL TECLADO
  RECIBIDOS DESDE JuegoModal
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
            "tetris" ||
          !activo
        ) {
          return;
        }


        switch (
          accion
        ) {
          case "izquierda":
            mover(-1);
            break;


          case "derecha":
            mover(1);
            break;


          case "abajo":
            bajar();
            break;


          case "arriba":
            rotar();
            break;


          case "caer":
            caidaRapida();
            break;


          default:
            break;
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
    bajar,
    caidaRapida,
    mover,
    rotar,
  ]);


  /*
  ==========================================
  GESTOS TOUCH

  TAP:
  girar

  ARRASTRAR IZQUIERDA/DERECHA:
  mover

  ARRASTRAR HACIA ABAJO:
  bajar
  ==========================================
  */

  const iniciarGesto =
    (evento) => {
      if (
        pausado ||
        gameOver
      ) {
        return;
      }


      evento.preventDefault();


      evento.currentTarget
        .setPointerCapture?.(
          evento.pointerId
        );


      gestoRef.current = {
        activo: true,

        pointerId:
          evento.pointerId,

        inicioX:
          evento.clientX,

        inicioY:
          evento.clientY,

        ultimoX:
          evento.clientX,

        ultimoY:
          evento.clientY,

        movio: false,
      };
    };


  const moverGesto =
    (evento) => {
      const gesto =
        gestoRef.current;


      if (
        !gesto.activo ||
        gesto.pointerId !==
          evento.pointerId ||
        pausado ||
        gameOver
      ) {
        return;
      }


      evento.preventDefault();


      let diferenciaX =
        evento.clientX -
        gesto.ultimoX;


      let diferenciaY =
        evento.clientY -
        gesto.ultimoY;


      /*
      MOVIMIENTO HORIZONTAL
      */

      if (
        Math.abs(
          diferenciaX
        ) >=
        PASO_GESTO_HORIZONTAL
      ) {
        const pasos =
          Math.trunc(
            diferenciaX /
            PASO_GESTO_HORIZONTAL
          );


        const direccion =
          pasos > 0
            ? 1
            : -1;


        for (
          let i = 0;
          i <
          Math.abs(
            pasos
          );
          i += 1
        ) {
          mover(
            direccion
          );
        }


        gesto.ultimoX +=
          pasos *
          PASO_GESTO_HORIZONTAL;


        gesto.movio =
          true;


        diferenciaX =
          evento.clientX -
          gesto.ultimoX;
      }


      /*
      MOVIMIENTO HACIA ABAJO
      */

      if (
        diferenciaY >=
        PASO_GESTO_VERTICAL
      ) {
        const pasos =
          Math.floor(
            diferenciaY /
            PASO_GESTO_VERTICAL
          );


        for (
          let i = 0;
          i < pasos;
          i += 1
        ) {
          bajar();
        }


        gesto.ultimoY +=
          pasos *
          PASO_GESTO_VERTICAL;


        gesto.movio =
          true;


        diferenciaY =
          evento.clientY -
          gesto.ultimoY;
      }


      gestoRef.current =
        gesto;
    };


  const terminarGesto =
    (evento) => {
      const gesto =
        gestoRef.current;


      if (
        !gesto.activo ||
        gesto.pointerId !==
          evento.pointerId
      ) {
        return;
      }


      evento.preventDefault();


      const recorridoX =
        evento.clientX -
        gesto.inicioX;


      const recorridoY =
        evento.clientY -
        gesto.inicioY;


      const fueToque =
        !gesto.movio &&
        Math.abs(
          recorridoX
        ) < 14 &&
        Math.abs(
          recorridoY
        ) < 14;


      if (
        fueToque
      ) {
        rotar();
      }


      gestoRef.current = {
        activo: false,

        pointerId: null,

        inicioX: 0,
        inicioY: 0,

        ultimoX: 0,
        ultimoY: 0,

        movio: false,
      };
    };


  /*
  ==========================================
  LOOP AUTOMÁTICO
  ==========================================
  */

  useEffect(() => {
    const animar =
      (tiempo) => {
        if (
          !estadoRef.current
            .pausado &&
          !estadoRef.current
            .gameOver
        ) {
          if (
            tiempo -
              ultimoDescensoRef
                .current >=
            velocidad
          ) {
            bajar();


            ultimoDescensoRef.current =
              tiempo;
          }
        }


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
    bajar,
    velocidad,
  ]);


  /*
  ==========================================
  DIBUJAR
  ==========================================
  */

  useEffect(() => {
    const canvas =
      canvasRef.current;


    if (!canvas) {
      return;
    }


    const contexto =
      canvas.getContext(
        "2d"
      );


    const ancho =
      canvas.width;


    const alto =
      canvas.height;


    const celda =
      Math.min(
        ancho /
          COLUMNAS,

        alto /
          FILAS
      );


    const tableroAncho =
      celda *
      COLUMNAS;


    const tableroAlto =
      celda *
      FILAS;


    const offsetX =
      (
        ancho -
        tableroAncho
      ) / 2;


    const offsetY =
      (
        alto -
        tableroAlto
      ) / 2;


    const colores =
      configuracion.colores;


    contexto.fillStyle =
      colores.tablero;


    contexto.fillRect(
      0,
      0,
      ancho,
      alto
    );


    /*
    REJILLA
    */

    contexto.strokeStyle =
      colores.linea;


    contexto.globalAlpha =
      0.08;


    contexto.lineWidth =
      1;


    for (
      let x = 0;
      x <= COLUMNAS;
      x += 1
    ) {
      contexto.beginPath();


      contexto.moveTo(
        offsetX +
          x *
            celda,

        offsetY
      );


      contexto.lineTo(
        offsetX +
          x *
            celda,

        offsetY +
          tableroAlto
      );


      contexto.stroke();
    }


    for (
      let y = 0;
      y <= FILAS;
      y += 1
    ) {
      contexto.beginPath();


      contexto.moveTo(
        offsetX,

        offsetY +
          y *
            celda
      );


      contexto.lineTo(
        offsetX +
          tableroAncho,

        offsetY +
          y *
            celda
      );


      contexto.stroke();
    }


    contexto.globalAlpha =
      1;


    function pintarBloque(
      x,
      y,
      color,
      alpha = 1
    ) {
      if (
        y < 0
      ) {
        return;
      }


      const margen =
        Math.max(
          1,
          celda *
            0.07
        );


      contexto.globalAlpha =
        alpha;


      contexto.fillStyle =
        color;


      contexto.fillRect(
        offsetX +
          x *
            celda +
          margen,

        offsetY +
          y *
            celda +
          margen,

        celda -
          margen * 2,

        celda -
          margen * 2
      );


      contexto.strokeStyle =
        "rgba(255,255,255,0.32)";


      contexto.strokeRect(
        offsetX +
          x *
            celda +
          margen,

        offsetY +
          y *
            celda +
          margen,

        celda -
          margen * 2,

        celda -
          margen * 2
      );


      contexto.globalAlpha =
        1;
    }


    /*
    PIEZAS FIJAS
    */

    tableroRef.current.forEach(
      (
        fila,
        y
      ) => {
        fila.forEach(
          (
            valor,
            x
          ) => {
            if (!valor) {
              return;
            }


            pintarBloque(
              x,
              y,
              colores.pieza
            );
          }
        );
      }
    );


    /*
    SOMBRA
    */

    const fantasma =
      obtenerPosicionFantasma(
        tableroRef.current,
        piezaRef.current
      );


    fantasma.matriz.forEach(
      (
        fila,
        y
      ) => {
        fila.forEach(
          (
            valor,
            x
          ) => {
            if (!valor) {
              return;
            }


            pintarBloque(
              fantasma.x +
                x,

              fantasma.y +
                y,

              colores.sombra,

              0.38
            );
          }
        );
      }
    );


    /*
    PIEZA ACTUAL
    */

    const actual =
      piezaRef.current;


    actual.matriz.forEach(
      (
        fila,
        y
      ) => {
        fila.forEach(
          (
            valor,
            x
          ) => {
            if (!valor) {
              return;
            }


            pintarBloque(
              actual.x +
                x,

              actual.y +
                y,

              colores.pieza
            );
          }
        );
      }
    );
  }, [
    configuracion,
    version,
  ]);


  return (
    <div className="tetris-juego">

      <div className="tetris-hud">

        <div>
          <span>
            PUNTOS
          </span>

          <strong>
            {puntuacion}
          </strong>
        </div>


        <div>
          <span>
            LÍNEAS
          </span>

          <strong>
            {lineas}
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
            SIGUIENTE
          </span>

          <strong>
            {nivelMaximo
              ? "MAX"
              : `${faltan} líneas`}
          </strong>
        </div>

      </div>


      <div
        className="tetris-canvas-wrapper"
        onPointerDown={
          iniciarGesto
        }
        onPointerMove={
          moverGesto
        }
        onPointerUp={
          terminarGesto
        }
        onPointerCancel={
          terminarGesto
        }
      >

        <canvas
          ref={
            canvasRef
          }
          width="400"
          height="600"
          className="canvas-tetris"
        />


        {pausado &&
          !gameOver && (
          <div className="overlay-estado-juego">

            <strong>
              PAUSA
            </strong>


            <small>
              Pulsa ▶ para jugar
            </small>


            <div className="instrucciones-gestos">

              <span>
                ↔ Arrastra para mover
              </span>


              <span>
                ↓ Arrastra para bajar
              </span>


              <span>
                ● Toca para girar
              </span>

            </div>

          </div>
        )}


        {avisoNivel && (
          <div className="aviso-nivel-tetris">
            {avisoNivel}
          </div>
        )}


        {gameOver && (
          <div className="overlay-estado-juego">

            <strong>
              GAME OVER
            </strong>


            <span>
              {puntuacion}
              {" "}
              puntos
            </span>


            <span>
              Nivel
              {" "}
              {nivel}
            </span>


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

      </div>

    </div>
  );
}


export default Tetris;