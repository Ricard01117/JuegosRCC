import {
  useEffect,
  useState,
} from "react";


const URL_ARCADE =
  "https://ricard01117.github.io/Arcade_RC/";


const URL_SERVIDOR =
  "https://arcade-rc-api.onrender.com/api/salud";


function PuenteArcadeServidor({
  abierto,
  cerrar,
}) {
  const [
    estado,
    setEstado,
  ] = useState(
    "conectando"
  );


  const [
    segundos,
    setSegundos,
  ] = useState(
    0
  );


  const [
    intento,
    setIntento,
  ] = useState(
    0
  );


  useEffect(() => {
    if (!abierto) {
      return undefined;
    }


    setEstado(
      "conectando"
    );


    setSegundos(
      0
    );


    const controlador =
      new AbortController();


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


    const timeout =
      window.setTimeout(
        () => {
          controlador.abort();
        },
        70000
      );


    const despertar =
      async () => {
        try {
          const respuesta =
            await fetch(
              URL_SERVIDOR,
              {
                signal:
                  controlador.signal,

                cache:
                  "no-store",
              }
            );


          if (
            !respuesta.ok
          ) {
            throw new Error(
              "Servidor no disponible"
            );
          }


          setEstado(
            "conectado"
          );
        } catch (error) {
          console.error(
            error
          );


          setEstado(
            "error"
          );
        }
      };


    despertar();


    return () => {
      controlador.abort();

      window.clearInterval(
        reloj
      );

      window.clearTimeout(
        timeout
      );
    };
  }, [
    abierto,
    intento,
  ]);


  if (!abierto) {
    return null;
  }


  const abrirArcade =
    () => {
      window.open(
        URL_ARCADE,
        "_blank",
        "noopener,noreferrer"
      );
    };


  return (
    <div className="puente-overlay">

      <section className="puente-servidor">

        <button
          type="button"
          className="cerrar-puente"
          onClick={
            cerrar
          }
        >
          ×
        </button>


        <span className="puente-marca">
          ARCADE_RC
        </span>


        {estado ===
          "conectando" && (
          <>
            <div className="maquina-arcade-carga">

              <div className="pantalla-maquina">
                RC
              </div>

              <div className="controles-maquina">
                <span />
                <i />
                <i />
              </div>

            </div>


            <h2>
              ACTIVANDO ARCADE_RC
            </h2>


            <p>
              Espera unos segundos.
              El servidor gratuito
              puede estar iniciando.
            </p>


            <div className="estado-conexion">

              <span />

              CONECTANDO

            </div>


            <small>
              {segundos} s
            </small>
          </>
        )}


        {estado ===
          "conectado" && (
          <>
            <div className="servidor-listo">
              ✓
            </div>


            <h2>
              SERVIDOR LISTO
            </h2>


            <p>
              Arcade_RC está preparado.
            </p>


            <div className="acciones-error">

              <button
                type="button"
                onClick={
                  abrirArcade
                }
              >
                ENTRAR A ARCADE_RC
              </button>


              <button
                type="button"
                onClick={
                  cerrar
                }
              >
                VOLVER A JUEGOSRCC
              </button>

            </div>
          </>
        )}


        {estado ===
          "error" && (
          <>
            <div className="servidor-error">
              !
            </div>


            <h2>
              SIN RESPUESTA
            </h2>


            <p>
              Puedes intentarlo otra
              vez o regresar.
            </p>


            <div className="acciones-error">

              <button
                type="button"
                onClick={
                  () =>
                    setIntento(
                      (actual) =>
                        actual + 1
                    )
                }
              >
                REINTENTAR
              </button>


              <button
                type="button"
                onClick={
                  abrirArcade
                }
              >
                ABRIR DE TODOS MODOS
              </button>


              <button
                type="button"
                onClick={
                  cerrar
                }
              >
                VOLVER
              </button>

            </div>
          </>
        )}

      </section>

    </div>
  );
}


export default PuenteArcadeServidor;