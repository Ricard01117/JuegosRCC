import {
  ETIQUETAS_COLORES,
} from "../../datos/configuracionJuegos";


function ConfiguracionJuego({
  juego,
  configuracion,
  onCambiar,
  onRestablecer,
  onCerrar,
}) {
  if (
    !juego ||
    !configuracion
  ) {
    return null;
  }


  const etiquetas =
    ETIQUETAS_COLORES[
      juego.codigo
    ] || {};


  const esTetris =
    juego.codigo ===
    "tetris";


  const esFlappy =
    juego.codigo ===
    "flappy";


  const esPacman =
    juego.codigo ===
    "pacman";


  const nivelesAutomaticos =
    esTetris ||
    esFlappy ||
    esPacman;


  let cantidadNiveles = 0;

  let descripcionNiveles = "";


  if (
    esTetris
  ) {
    cantidadNiveles = 12;

    descripcionNiveles =
      "La velocidad aumenta automáticamente cada 5 líneas completadas.";
  }


  if (
    esFlappy
  ) {
    cantidadNiveles = 10;

    descripcionNiveles =
      "La velocidad aumenta y el espacio entre obstáculos se reduce cada 5 puntos.";
  }


  if (
    esPacman
  ) {
    cantidadNiveles = 10;

    descripcionNiveles =
      "Comienzas con 4 vidas. Cada nivel completado suma 1 vida, cambia el laberinto y aumenta la velocidad de los fantasmas.";
  }


  const cambiarDificultad =
    (dificultad) => {
      onCambiar({
        ...configuracion,

        dificultad,
      });
    };


  const cambiarColor =
    (
      nombre,
      valor
    ) => {
      onCambiar({
        ...configuracion,

        colores: {
          ...configuracion.colores,

          [nombre]:
            valor,
        },
      });
    };


  return (
    <div className="configuracion-overlay">

      <section className="configuracion-juego">

        <header className="configuracion-header">

          <div>

            <span>
              CONFIGURACIÓN
            </span>


            <h2>
              {juego.nombre}
            </h2>

          </div>


          <button
            type="button"
            className="configuracion-cerrar"
            onClick={
              onCerrar
            }
          >
            ×
          </button>

        </header>


        {nivelesAutomaticos ? (

          <div className="configuracion-niveles-auto">

            <span>
              PROGRESIÓN AUTOMÁTICA
            </span>


            <strong>
              {cantidadNiveles}
              {" "}
              niveles
            </strong>


            <p>
              {descripcionNiveles}
            </p>

          </div>

        ) : (

          <div className="configuracion-seccion">

            <strong>
              Dificultad
            </strong>


            <div className="selector-dificultad">

              <button
                type="button"
                className={
                  configuracion
                    .dificultad ===
                  "facil"
                    ? "activo"
                    : ""
                }
                onClick={
                  () =>
                    cambiarDificultad(
                      "facil"
                    )
                }
              >
                Fácil
              </button>


              <button
                type="button"
                className={
                  configuracion
                    .dificultad ===
                  "medio"
                    ? "activo"
                    : ""
                }
                onClick={
                  () =>
                    cambiarDificultad(
                      "medio"
                    )
                }
              >
                Medio
              </button>


              <button
                type="button"
                className={
                  configuracion
                    .dificultad ===
                  "dificil"
                    ? "activo"
                    : ""
                }
                onClick={
                  () =>
                    cambiarDificultad(
                      "dificil"
                    )
                }
              >
                Difícil
              </button>

            </div>

          </div>

        )}


        <div className="configuracion-seccion">

          <strong>
            Colores
          </strong>


          <div className="lista-colores">

            {Object.entries(
              configuracion.colores
            ).map(
              ([
                nombre,
                valor,
              ]) => (

                <label
                  className="fila-color"
                  key={
                    nombre
                  }
                >

                  <span>
                    {etiquetas[
                      nombre
                    ] ||
                      nombre}
                  </span>


                  <input
                    type="color"
                    value={
                      valor
                    }
                    onChange={
                      (
                        evento
                      ) =>
                        cambiarColor(
                          nombre,

                          evento
                            .target
                            .value
                        )
                    }
                  />

                </label>

              )
            )}

          </div>

        </div>


        <footer className="configuracion-footer">

          <button
            type="button"
            className="boton-restablecer"
            onClick={
              onRestablecer
            }
          >
            Restablecer
          </button>


          <button
            type="button"
            className="boton-listo"
            onClick={
              onCerrar
            }
          >
            Listo
          </button>

        </footer>

      </section>

    </div>
  );
}


export default ConfiguracionJuego;