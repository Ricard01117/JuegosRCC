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


function formatearTiempo(segundos) {
  const minutos =
    Math.floor(
      segundos / 60
    );

  const resto =
    segundos % 60;

  return `${String(minutos).padStart(
    2,
    "0"
  )}:${String(resto).padStart(
    2,
    "0"
  )}`;
}


function enviarControl(
  juego,
  accion
) {
  window.dispatchEvent(
    new CustomEvent(
      "juegosrcc-control",
      {
        detail: {
          juego,
          accion,
          activo: true,
        },
      }
    )
  );

  window.setTimeout(
    () => {
      window.dispatchEvent(
        new CustomEvent(
          "juegosrcc-control",
          {
            detail: {
              juego,
              accion,
              activo: false,
            },
          }
        )
      );
    },
    90
  );
}


function JuegoModal() {
  const {
    juegoActivo,
    cerrarJuego,
  } = useJuego();

  const [
    pausado,
    setPausado,
  ] = useState(true);

  const [
    segundos,
    setSegundos,
  ] = useState(0);

  const [
    mostrarConfiguracion,
    setMostrarConfiguracion,
  ] = useState(false);

  const [
    configuracion,
    setConfiguracion,
  ] = useState(null);


  const juego =
    useMemo(
      () =>
        JUEGOS.find(
          (elemento) =>
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

    setPausado(true);

    setSegundos(0);

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
            (actual) =>
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
  BLOQUEAR SCROLL DE LA PÁGINA
  ==========================================================
  */

  useEffect(() => {
    if (
      !juegoActivo
    ) {
      return undefined;
    }

    const anterior =
      document.body.style
        .overflow;

    document.body.style
      .overflow =
      "hidden";

    return () => {
      document.body.style
        .overflow =
        anterior;
    };
  }, [
    juegoActivo,
  ]);


  /*
  ==========================================================
  CONTROL DE TECLADO
  ==========================================================
  */

  useEffect(() => {
    if (
      !juegoActivo
    ) {
      return undefined;
    }


    const obtenerAccion =
      (tecla) => {
        const normalizada =
          tecla.toLowerCase();


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


        if (
          tecla ===
            "ArrowDown" ||
          normalizada ===
            "s"
        ) {
          return "abajo";
        }


        if (
          tecla ===
            "ArrowLeft" ||
          normalizada ===
            "a"
        ) {
          return "izquierda";
        }


        if (
          tecla ===
            "ArrowRight" ||
          normalizada ===
            "d"
        ) {
          return "derecha";
        }


        if (
          tecla === " "
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

          return null;
        }


        return null;
      };


    const bajarTecla =
      (evento) => {
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
            (actual) =>
              !actual
          );

          return;
        }


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


        /*
        La primera tecla también
        comienza la partida.
        */

        if (
          pausado
        ) {
          setPausado(false);

          /*
          En Flappy la primera tecla
          también debe producir salto.
          */

          if (
            esFlappy
          ) {
            window.setTimeout(
              () =>
                enviarControl(
                  "flappy",
                  "saltar"
                ),
              60
            );
          }

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

                activo: true,
              },
            }
          )
        );
      };


    const subirTecla =
      (evento) => {
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

        window.dispatchEvent(
          new CustomEvent(
            "juegosrcc-control",
            {
              detail: {
                juego:
                  juegoActivo,

                accion,

                activo: false,
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
    pausado,
    esTetris,
    esAsteroids,
    esFlappy,
    esPacman,
  ]);


  /*
  ==========================================================
  INICIAR TOCANDO LA PANTALLA
  ==========================================================

  TETRIS:
  Primer toque = iniciar.

  FLAPPY:
  Primer toque = iniciar + saltar.

  PAC-MAN:
  Primer toque = iniciar.

  ASTEROIDES:
  Se inicia desde sus controles ergonómicos.
  ==========================================================
  */

  const tocarLienzo =
    (evento) => {
      if (
        mostrarConfiguracion ||
        !pausado
      ) {
        return;
      }


      if (
        !esTetris &&
        !esFlappy &&
        !esPacman
      ) {
        return;
      }


      const objetivo =
        evento.target;


      if (
        objetivo.closest?.(
          "button"
        )
      ) {
        return;
      }


      setPausado(false);


      if (
        esFlappy
      ) {
        window.setTimeout(
          () => {
            enviarControl(
              "flappy",
              "saltar"
            );
          },
          80
        );
      }
    };


  if (
    !juegoActivo ||
    !juego ||
    !configuracion
  ) {
    return null;
  }


  const restablecer =
    () => {
      setConfiguracion(
        restablecerConfiguracionJuego(
          juegoActivo
        )
      );
    };


  const abrirConfiguracion =
    () => {
      setPausado(true);

      setMostrarConfiguracion(
        true
      );
    };


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


  return (
    <div className="juego-modal-overlay">

      <section
        className={
          claseModal
        }
      >

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
              onClick={() =>
                setPausado(
                  (actual) =>
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


        <div
          className="lienzo-juego-contenedor"
          onPointerDown={
            tocarLienzo
          }
        >

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

        </div>


        {esAsteroids && (
          <ControlesTouch
            juego="asteroids"
            onComenzar={() =>
              setPausado(false)
            }
          />
        )}


        {esTetris && (
          <div className="ayuda-juego">

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
              Móvil: tocar + arrastrar
            </span>

          </div>
        )}


        {esAsteroids && (
          <div className="ayuda-juego">

            <span>
              ← → girar
            </span>

            <span>
              ↑ propulsor
            </span>

            <span>
              ESPACIO disparar
            </span>

            <span>
              Móvil: barra + 2 botones
            </span>

          </div>
        )}


        {esFlappy && (
          <div className="ayuda-juego">

            <span>
              ESPACIO / ↑
            </span>

            <span>
              Móvil: tocar pantalla
            </span>

            <span>
              P pausa
            </span>

          </div>
        )}


        {esPacman && (
          <div className="ayuda-juego">

            <span>
              Flechas / WASD
            </span>

            <span>
              Móvil: deslizar
            </span>

            <span>
              5 s de ventaja por nivel
            </span>

            <span>
              🍒 fruta = comer fantasmas
            </span>

            <span>
              +1 vida por nivel
            </span>

          </div>
        )}

      </section>


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
          onCerrar={() =>
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