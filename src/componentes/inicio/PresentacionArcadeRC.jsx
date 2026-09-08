function PresentacionArcadeRC({
  onEntrar,
  onJugar,
}) {
  const base =
    import.meta.env.BASE_URL;


  return (
    <section className="presentacion-arcade-rc">

      <div className="info-arcade-rc">

        <span className="etiqueta-proyecto">
          PROYECTO ORIGINAL
        </span>


        <h1>
          ARCADE
          <strong>
            _RC
          </strong>
        </h1>


        <p className="descripcion-arcade">
          La primera versión del arcade
          incluye estadísticas, récords,
          logros y seguimiento del tiempo
          jugado mediante un backend
          conectado.
        </p>


        <div className="funciones-arcade">

          <article>
            <span>
              01
            </span>

            <div>
              <strong>
                Estadísticas
              </strong>

              <small>
                Comparación de partidas
                entre los juegos.
              </small>
            </div>
          </article>


          <article>
            <span>
              02
            </span>

            <div>
              <strong>
                Récords
              </strong>

              <small>
                Guarda las mejores
                puntuaciones.
              </small>
            </div>
          </article>


          <article>
            <span>
              03
            </span>

            <div>
              <strong>
                Logros
              </strong>

              <small>
                Objetivos desbloqueados
                durante las partidas.
              </small>
            </div>
          </article>


          <article>
            <span>
              04
            </span>

            <div>
              <strong>
                Tiempo jugado
              </strong>

              <small>
                Seguimiento del tiempo
                acumulado por juego.
              </small>
            </div>
          </article>

        </div>


        <button
          type="button"
          className="boton-entrar-arcade"
          onClick={
            onEntrar
          }
        >
          <div>
            <span>
              ENTRAR A ARCADE_RC
            </span>

            <small>
              Espera unos segundos a que
              se encienda Render
            </small>
          </div>


          <strong>
            ↗
          </strong>
        </button>


        <button
          type="button"
          className="boton-ir-juegos"
          onClick={
            onJugar
          }
        >
          <span>
            JUGAR JUEGOS
          </span>

          <strong>
            ↓
          </strong>
        </button>

      </div>


      <div className="galeria-arcade">

        <div className="marco-captura captura-estadisticas">

          <div className="barra-captura">

            <span />
            <span />
            <span />

            <small>
              ESTADÍSTICAS
            </small>

          </div>


          <img
            src={
              `${base}imagenes/arcade_rc_estadisticas.png`
            }
            alt="Estadísticas de Arcade_RC"
          />

        </div>


        <div className="marco-captura captura-portada">

          <div className="barra-captura">

            <span />
            <span />
            <span />

            <small>
              PORTADA
            </small>

          </div>


          <img
            src={
              `${base}imagenes/arcade_rc_portada.png`
            }
            alt="Portada de Arcade_RC"
          />

        </div>

      </div>

    </section>
  );
}


export default PresentacionArcadeRC;