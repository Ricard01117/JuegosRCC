function enviarControl(
  juego,
  accion,
  activo
) {
  window.dispatchEvent(
    new CustomEvent(
      "juegosrcc-control",
      {
        detail: {
          juego,
          accion,
          activo,
        },
      }
    )
  );
}


function BotonControl({
  juego,
  accion,
  children,
  clase = "",
  onComenzar,
  ariaLabel,
}) {
  const activar = (
    evento
  ) => {
    evento.preventDefault();

    evento.currentTarget
      .setPointerCapture?.(
        evento.pointerId
      );

    onComenzar?.();

    enviarControl(
      juego,
      accion,
      true
    );
  };


  const desactivar = (
    evento
  ) => {
    evento.preventDefault();

    enviarControl(
      juego,
      accion,
      false
    );
  };


  return (
    <button
      type="button"
      className={
        `control-touch-boton ${clase}`
      }
      aria-label={
        ariaLabel
      }
      onPointerDown={
        activar
      }
      onPointerUp={
        desactivar
      }
      onPointerCancel={
        desactivar
      }
      onLostPointerCapture={
        desactivar
      }
      onContextMenu={
        (evento) =>
          evento.preventDefault()
      }
    >
      {children}
    </button>
  );
}


function ControlesTouch({
  juego,
  onComenzar,
}) {
  /*
  ==========================================================
  TETRIS
  ==========================================================
  */

  if (
    juego === "tetris"
  ) {
    return null;
  }


  /*
  ==========================================================
  PAC-MAN
  ==========================================================
  */

  if (
    juego === "pacman"
  ) {
    return null;
  }


  /*
  ==========================================================
  FLAPPY
  ==========================================================
  */

  if (
    juego === "flappy"
  ) {
    return null;
  }


  /*
  ==========================================================
  ASTEROIDES
  ==========================================================

            ▲

  PROPULSOR ◀ ● ▶ DISPARAR

            ▼

  La cruceta únicamente orienta
  la nave.

  El propulsor es independiente.

  El disparo es independiente.
  ==========================================================
  */

  if (
    juego === "asteroids"
  ) {
    return (
      <div
        className="
          controles-touch
          controles-asteroids-pad
        "
      >

        {/* ===============================================
            PROPULSOR
        =============================================== */}

        <div className="asteroids-zona-accion asteroids-zona-propulsor">

          <BotonControl
            juego="asteroids"
            accion="propulsar"
            clase="asteroids-boton-accion asteroids-propulsor"
            onComenzar={
              onComenzar
            }
            ariaLabel="Propulsor"
          >

            <span className="asteroids-icono-propulsor">
              ▲
            </span>

            <strong>
              PROPULSOR
            </strong>

          </BotonControl>

        </div>


        {/* ===============================================
            CRUCETA CENTRAL
        =============================================== */}

        <div className="asteroids-mando-central">

          <span className="asteroids-mando-titulo">
            DIRECCIÓN
          </span>


          <div className="asteroids-cruceta">

            <BotonControl
              juego="asteroids"
              accion="apuntar_arriba"
              clase="asteroids-direccion asteroids-arriba"
              onComenzar={
                onComenzar
              }
              ariaLabel="Apuntar arriba"
            >
              ▲
            </BotonControl>


            <BotonControl
              juego="asteroids"
              accion="apuntar_izquierda"
              clase="asteroids-direccion asteroids-izquierda"
              onComenzar={
                onComenzar
              }
              ariaLabel="Apuntar izquierda"
            >
              ◀
            </BotonControl>


            <div
              className="asteroids-centro-mando"
              aria-hidden="true"
            >
              ●
            </div>


            <BotonControl
              juego="asteroids"
              accion="apuntar_derecha"
              clase="asteroids-direccion asteroids-derecha"
              onComenzar={
                onComenzar
              }
              ariaLabel="Apuntar derecha"
            >
              ▶
            </BotonControl>


            <BotonControl
              juego="asteroids"
              accion="apuntar_abajo"
              clase="asteroids-direccion asteroids-abajo"
              onComenzar={
                onComenzar
              }
              ariaLabel="Apuntar abajo"
            >
              ▼
            </BotonControl>

          </div>

        </div>


        {/* ===============================================
            DISPARO
        =============================================== */}

        <div className="asteroids-zona-accion asteroids-zona-disparo">

          <BotonControl
            juego="asteroids"
            accion="disparar"
            clase="asteroids-boton-accion asteroids-disparo"
            onComenzar={
              onComenzar
            }
            ariaLabel="Disparar"
          >

            <span className="asteroids-icono-disparo">
              ●
            </span>

            <strong>
              DISPARAR
            </strong>

          </BotonControl>

        </div>

      </div>
    );
  }


  return null;
}


export default ControlesTouch;