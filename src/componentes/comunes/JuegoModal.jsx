import {
  useEffect,
  useMemo,
  useState,
} from "react";


import {
  useJuego,
} from "../../contexto/ContextoJuego";


import {
  JUEGOS,
} from "../../datos/juegos";


import {
  cargarConfiguracionJuego,
  guardarConfiguracionJuego,
  restablecerConfiguracionJuego,
} from "../../servicios/almacenamiento";


import ConfiguracionJuego from "./ConfiguracionJuego";

import ControlesTouch from "./ControlesTouch";


import Tetris from "../../juegos/tetris/Tetris";

import Asteroids from "../../juegos/asteroids/Asteroids";

import Flappy from "../../juegos/flappy/Flappy";

import Pacman from "../../juegos/pacman/Pacman";


function formatearTiempo(
  segundos
) {
  const minutos =
    Math.floor(
      segundos / 60
    );


  const resto =
    segundos % 60;


  return `${String(
    minutos
  ).padStart(
    2,
    "0"
  )}:${String(
    resto
  ).padStart(
    2,
    "0"
  )}`;
}


function JuegoModal() {
  const {
    juegoActivo,
    cerrarJuego,
  } = useJuego();


  const [
    pausado,
    setPausado,
  ] = useState(
    true
  );


  const [
    segundos,
    setSegundos,
  ] = useState(
    0
  );


  const [
    mostrarConfiguracion,
    setMostrarConfiguracion,
  ] = useState(
    false
  );


  const [
    configuracion,
    setConfiguracion,
  ] = useState(
    null
  );


  const juego =
    useMemo(
      () =>
        JUEGOS.find(
          (
            elemento
          ) =>
            elemento.codigo ===
            juegoActivo
        ),

      [
        juegoActivo,
      ]
    );


  const esTetris =
    juegoActivo ===
    "tetris";


  const esAsteroids =
    juegoActivo ===
    "asteroids";


  const esFlappy =
    juegoActivo ===
    "flappy";


  const esPacman =
    juegoActivo ===
    "pacman";


  /*
  ==========================================================
  CARGAR JUEGO
  ==========================================================
  */

  useEffect(() => {
    if (
      !juegoActivo
    ) {
      return;
    }


    setPausado(
      true
    );


    setSegundos(
      0
    );


    setMostrarConfiguracion(
      false
    );


    setConfiguracion(
      cargarConfiguracionJuego(
        juegoActivo
      )
    );
  }, [
    juegoActivo,
  ]);


  /*
  ==========================================================
  GUARDAR CONFIGURACIÓN
  ==========================================================
  */

  useEffect(() => {
    if (
      !juegoActivo ||
      !configuracion
    ) {
      return;
    }


    guardarConfiguracionJuego(
      juegoActivo,
      configuracion
    );
  }, [
    juegoActivo,
    configuracion,
  ]);


  /*
  ==========================================================
  RELOJ
  ==========================================================
  */

  useEffect(() => {
    if (
      !juegoActivo ||
      pausado ||
      mostrarConfiguracion
    ) {
      return undefined;
    }


    const reloj =
      window.setInterval(
        () => {
          setSegundos(
            (
              actual
            ) =>
              actual + 1
          );
        },

        1000
      );


    return () => {
      window.clearInterval(
        reloj
      );
    };
  }, [
    juegoActivo,
    pausado,
    mostrarConfiguracion,
  ]);


  /*
  ==========================================================
  BLOQUEAR SCROLL EXTERIOR
  ==========================================================
  */

  useEffect(() => {
    if (
      !juegoActivo
    ) {
      return undefined;
    }


    const overflowAnterior =
      document.body.style
        .overflow;


    document.body.style
      .overflow =
      "hidden";


    return () => {
      document.body.style
        .overflow =
        overflowAnterior;
    };
  }, [
    juegoActivo,
  ]);


  /*
  ==========================================================
  TECLADO
  ==========================================================
  */

  useEffect(() => {
    if (
      !juegoActivo
    ) {
      return undefined;
    }


    const obtenerAccion =
      (
        tecla
      ) => {
        const normalizada =
          tecla.toLowerCase();


        /*
        ARRIBA
        */

        if (
          tecla ===
            "ArrowUp" ||
          normalizada ===
            "w"
        ) {
          if (
            esFlappy
          ) {
            return "saltar";
          }


          return "arriba";
        }


        /*
        ABAJO
        */

        if (
          tecla ===
            "ArrowDown" ||
          normalizada ===
            "s"
        ) {
          return "abajo";
        }


        /*
        IZQUIERDA
        */

        if (
          tecla ===
            "ArrowLeft" ||
          normalizada ===
            "a"
        ) {
          return "izquierda";
        }


        /*
        DERECHA
        */

        if (
          tecla ===
            "ArrowRight" ||
          normalizada ===
            "d"
        ) {
          return "derecha";
        }


        /*
        ESPACIO
        */

        if (
          tecla ===
          " "
        ) {
          if (
            esFlappy
          ) {
            return "saltar";
          }


          if (
            esAsteroids
          ) {
            return "disparar";
          }


          if (
            esTetris
          ) {
            return "caer";
          }


          /*
          Pac-Man solamente
          utiliza direcciones.
          */

          if (
            esPacman
          ) {
            return null;
          }


          return "accion";
        }


        return null;
      };


    const bajarTecla =
      (
        evento
      ) => {
        /*
        ESC
        */

        if (
          evento.key ===
          "Escape"
        ) {
          evento.preventDefault();


          if (
            mostrarConfiguracion
          ) {
            setMostrarConfiguracion(
              false
            );

            return;
          }


          cerrarJuego();


          return;
        }


        /*
        P = PAUSA
        */

        if (
          evento.key
            .toLowerCase() ===
          "p"
        ) {
          if (
            mostrarConfiguracion
          ) {
            return;
          }


          evento.preventDefault();


          setPausado(
            (
              actual
            ) =>
              !actual
          );


          return;
        }


        /*
        IGNORAR CONTROLES
        MIENTRAS ESTÁ ABIERTA
        LA CONFIGURACIÓN
        */

        if (
          mostrarConfiguracion
        ) {
          return;
        }


        const accion =
          obtenerAccion(
            evento.key
          );


        if (
          !accion
        ) {
          return;
        }


        evento.preventDefault();


        window.dispatchEvent(
          new CustomEvent(
            "juegosrcc-control",

            {
              detail: {
                juego:
                  juegoActivo,

                accion,

                activo:
                  true,
              },
            }
          )
        );
      };


    const subirTecla =
      (
        evento
      ) => {
        if (
          mostrarConfiguracion
        ) {
          return;
        }


        const accion =
          obtenerAccion(
            evento.key
          );


        if (
          !accion
        ) {
          return;
        }


        evento.preventDefault();


        window.dispatchEvent(
          new CustomEvent(
            "juegosrcc-control",

            {
              detail: {
                juego:
                  juegoActivo,

                accion,

                activo:
                  false,
              },
            }
          )
        );
      };


    window.addEventListener(
      "keydown",
      bajarTecla
    );


    window.addEventListener(
      "keyup",
      subirTecla
    );


    return () => {
      window.removeEventListener(
        "keydown",
        bajarTecla
      );


      window.removeEventListener(
        "keyup",
        subirTecla
      );
    };
  }, [
    juegoActivo,
    cerrarJuego,
    mostrarConfiguracion,
    esTetris,
    esAsteroids,
    esFlappy,
    esPacman,
  ]);


  /*
  ==========================================================
  SIN JUEGO
  ==========================================================
  */

  if (
    !juegoActivo ||
    !juego ||
    !configuracion
  ) {
    return null;
  }


  /*
  ==========================================================
  RESTABLECER
  ==========================================================
  */

  const restablecer =
    () => {
      const nueva =
        restablecerConfiguracionJuego(
          juegoActivo
        );


      setConfiguracion(
        nueva
      );
    };


  /*
  ==========================================================
  ABRIR CONFIGURACIÓN
  ==========================================================
  */

  const abrirConfiguracion =
    () => {
      setPausado(
        true
      );


      setMostrarConfiguracion(
        true
      );
    };


  /*
  ==========================================================
  CLASE DEL MODAL
  ==========================================================
  */

  let claseModal =
    "juego-modal juego-modal-nuevo";


  if (
    esTetris
  ) {
    claseModal +=
      " juego-modal-tetris";
  }


  if (
    esAsteroids
  ) {
    claseModal +=
      " juego-modal-asteroids";
  }


  if (
    esFlappy
  ) {
    claseModal +=
      " juego-modal-flappy";
  }


  if (
    esPacman
  ) {
    claseModal +=
      " juego-modal-pacman";
  }


  /*
  ==========================================================
  TEXTO DEL NIVEL
  ==========================================================
  */

  let textoProgresion =
    configuracion
      .dificultad
      ?.toUpperCase() ||
    "";


  if (
    esTetris
  ) {
    textoProgresion =
      "12 NIVELES AUTOMÁTICOS";
  }


  if (
    esFlappy
  ) {
    textoProgresion =
      "10 NIVELES AUTOMÁTICOS";
  }


  if (
    esPacman
  ) {
    textoProgresion =
      "10 NIVELES AUTOMÁTICOS";
  }


  /*
  ==========================================================
  RENDER
  ==========================================================
  */

  return (
    <div className="juego-modal-overlay">

      <section
        className={
          claseModal
        }
      >

        {/* ================================================
            CABECERA
        ================================================= */}

        <header className="barra-juego">

          <div className="barra-juego-identidad">

            <span>
              JUEGOSRCC
            </span>


            <h2>
              {juego.nombre}
            </h2>


            <small>
              {textoProgresion}
            </small>

          </div>


          <div className="barra-juego-acciones">

            <span className="reloj-juego">

              {formatearTiempo(
                segundos
              )}

            </span>


            <button
              type="button"
              className="boton-control-superior"
              onClick={
                () =>
                  setPausado(
                    (
                      actual
                    ) =>
                      !actual
                  )
              }
              title={
                pausado
                  ? "Jugar"
                  : "Pausar"
              }
              aria-label={
                pausado
                  ? "Jugar"
                  : "Pausar"
              }
            >
              {pausado
                ? "▶"
                : "Ⅱ"}
            </button>


            <button
              type="button"
              className="boton-control-superior"
              onClick={
                abrirConfiguracion
              }
              title="Configuración"
              aria-label="Configuración"
            >
              ⚙
            </button>


            <button
              type="button"
              className="boton-control-superior"
              onClick={
                cerrarJuego
              }
              title="Cerrar"
              aria-label="Cerrar"
            >
              ×
            </button>

          </div>

        </header>


        {/* ================================================
            JUEGO
        ================================================= */}

        <div className="lienzo-juego-contenedor">

          {esTetris && (

            <Tetris
              pausado={
                pausado ||
                mostrarConfiguracion
              }
              configuracion={
                configuracion
              }
            />

          )}


          {esAsteroids && (

            <Asteroids
              pausado={
                pausado ||
                mostrarConfiguracion
              }
              configuracion={
                configuracion
              }
            />

          )}


          {esFlappy && (

            <Flappy
              pausado={
                pausado ||
                mostrarConfiguracion
              }
              configuracion={
                configuracion
              }
            />

          )}


          {esPacman && (

            <Pacman
              pausado={
                pausado ||
                mostrarConfiguracion
              }
              configuracion={
                configuracion
              }
            />

          )}


          {!esTetris &&
            !esAsteroids &&
            !esFlappy &&
            !esPacman && (

            <div className="lienzo-juego-provisional">

              <strong>
                {juego.icono}
              </strong>


              <h3>
                PULSA ▶ PARA JUGAR
              </h3>


              <small>
                Juego en desarrollo.
              </small>

            </div>

          )}

        </div>


        {/* ================================================
            CONTROLES TOUCH
        ================================================= */}

        {esAsteroids && (

          <ControlesTouch
            juego="asteroids"
          />

        )}


        {esFlappy && (

          <ControlesTouch
            juego="flappy"
          />

        )}


        {/* ================================================
            AYUDA
        ================================================= */}

        {esTetris && (

          <div className="ayuda-juego ayuda-tetris">

            <span>
              ← → mover
            </span>


            <span>
              ↑ girar
            </span>


            <span>
              ↓ bajar
            </span>


            <span>
              ESPACIO caer
            </span>


            <span>
              Móvil: arrastrar + tocar
            </span>


            <span>
              P pausa
            </span>


            <span>
              ESC salir
            </span>

          </div>

        )}


        {esAsteroids && (

          <div className="ayuda-juego ayuda-asteroids">

            <span>
              ← → girar
            </span>


            <span>
              ↑ acelerar
            </span>


            <span>
              ESPACIO disparar
            </span>


            <span>
              Móvil: botones touch
            </span>


            <span>
              P pausa
            </span>


            <span>
              ESC salir
            </span>

          </div>

        )}


        {esFlappy && (

          <div className="ayuda-juego ayuda-flappy">

            <span>
              ESPACIO / ↑
            </span>


            <span>
              Móvil: tocar pantalla
            </span>


            <span>
              P pausa
            </span>


            <span>
              ESC salir
            </span>

          </div>

        )}


        {esPacman && (

          <div className="ayuda-juego ayuda-pacman">

            <span>
              Flechas / WASD
            </span>


            <span>
              Móvil: deslizar
            </span>


            <span>
              🍒 fruta = comer fantasmas
            </span>


            <span>
              +1 vida por nivel
            </span>


            <span>
              P pausa
            </span>


            <span>
              ESC salir
            </span>

          </div>

        )}

      </section>


      {/* ================================================
          CONFIGURACIÓN
      ================================================= */}

      {mostrarConfiguracion && (

        <ConfiguracionJuego
          juego={
            juego
          }
          configuracion={
            configuracion
          }
          onCambiar={
            setConfiguracion
          }
          onRestablecer={
            restablecer
          }
          onCerrar={
            () =>
              setMostrarConfiguracion(
                false
              )
          }
        />

      )}

    </div>
  );
}


export default JuegoModal;