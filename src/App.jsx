import {
  useEffect,
  useState,
} from "react";

import Inicio from "./componentes/inicio/Inicio";
import JuegoModal from "./componentes/comunes/JuegoModal";


const TEMAS = [
  {
    codigo: "arcade-neon",
    nombre: "ARCADE NEON",
  },

  {
    codigo: "moderno",
    nombre: "MODERNO",
  },

  {
    codigo: "retro90",
    nombre: "RETRO 90",
  },
];


const URL_ARCADE_RC =
  "https://ricard01117.github.io/Arcade_RC/";


function obtenerTemaInicial() {
  try {
    const guardado =
      localStorage.getItem(
        "juegosrcc_tema_visual"
      );


    const indice =
      TEMAS.findIndex(
        (tema) =>
          tema.codigo ===
          guardado
      );


    if (
      indice >= 0
    ) {
      return indice;
    }
  } catch {
    // Si localStorage no está disponible,
    // simplemente usamos el tema moderno.
  }


  return 1;
}


function App() {
  const [
    indiceTema,
    setIndiceTema,
  ] = useState(
    obtenerTemaInicial
  );


  const [
    mostrarPuente,
    setMostrarPuente,
  ] = useState(
    false
  );


  const tema =
    TEMAS[
      indiceTema
    ];


  /*
  ==========================================================
  APLICAR TEMA
  ==========================================================
  */

  useEffect(() => {
    document.documentElement
      .setAttribute(
        "data-tema-rcc",
        tema.codigo
      );


    document.body
      .setAttribute(
        "data-tema-rcc",
        tema.codigo
      );


    try {
      localStorage.setItem(
        "juegosrcc_tema_visual",
        tema.codigo
      );
    } catch {
      // No afecta el funcionamiento.
    }
  }, [
    tema,
  ]);


  /*
  ==========================================================
  CAMBIAR ENTRE LOS 3 DISEÑOS
  ==========================================================
  */

  const cambiarTema =
    () => {
      setIndiceTema(
        (actual) =>
          (
            actual + 1
          ) %
          TEMAS.length
      );
    };


  /*
  ==========================================================
  PUENTE A ARCADE_RC
  ==========================================================
  */

  const abrirArcade =
    () => {
      setMostrarPuente(
        true
      );
    };


  const continuarArcade =
    () => {
      window.open(
        URL_ARCADE_RC,
        "_blank",
        "noopener,noreferrer"
      );


      setMostrarPuente(
        false
      );
    };


  return (
    <div
      className={
        `rcc-app tema-${tema.codigo}`
      }
    >

      {/* ==================================================
          HEADER
      =================================================== */}

      <header className="rcc-header">

        <div className="rcc-header-marca">

          <div className="rcc-logo">
            RC
          </div>


          <div className="rcc-marca-texto">

            <strong>
              JUEGOSRCC
            </strong>


            <span>
              ARCADE COLLECTION
            </span>

          </div>

        </div>


        <div className="rcc-header-acciones">

          <button
            type="button"
            className="rcc-boton-header boton-atencion"
            onClick={
              abrirArcade
            }
          >

            <span className="rcc-boton-signo">
              +
            </span>


            <strong>
              VER MÁS JUEGOS
            </strong>

          </button>


          <button
            type="button"
            className="rcc-selector-tema boton-atencion"
            onClick={
              cambiarTema
            }
            aria-label="Cambiar diseño"
            title="Cambiar diseño"
          >

            <span className="rcc-selector-etiqueta">
              ESTILO
            </span>


            <strong>
              {tema.nombre}
            </strong>


            <small>
              {indiceTema + 1}/3
            </small>

          </button>

        </div>

      </header>


      {/* ==================================================
          PORTADA
      =================================================== */}

      <Inicio
        onAbrirArcade={
          abrirArcade
        }
      />


      {/* ==================================================
          JUEGOS
      =================================================== */}

      <JuegoModal />


      {/* ==================================================
          PUENTE AL PROYECTO ORIGINAL
      =================================================== */}

      {mostrarPuente && (

        <div
          className="puente-overlay"
          onClick={
            () =>
              setMostrarPuente(
                false
              )
          }
        >

          <section
            className="puente-modal"
            onClick={
              (evento) =>
                evento.stopPropagation()
            }
          >

            <button
              type="button"
              className="puente-cerrar"
              onClick={
                () =>
                  setMostrarPuente(
                    false
                  )
              }
              aria-label="Cerrar"
            >
              ×
            </button>


            <span className="puente-etiqueta">
              ARCADE_RC
            </span>


            <div className="puente-maquina">

              <div className="puente-pantalla">
                RC
              </div>


              <div className="puente-controles">

                <i />

                <i />

                <i />

              </div>

            </div>


            <h2>
              ACTIVANDO ARCADE_RC
            </h2>


            <p>
              Espera unos segundos mientras
              se enciende el servidor.
            </p>


            <small>
              Arcade_RC utiliza un backend
              conectado para guardar y consultar
              las partidas.
            </small>


            <button
              type="button"
              className="puente-continuar boton-atencion"
              onClick={
                continuarArcade
              }
            >

              <strong>
                ABRIR ARCADE_RC
              </strong>


              <span>
                ↗
              </span>

            </button>

          </section>

        </div>

      )}

    </div>
  );
}


export default App;