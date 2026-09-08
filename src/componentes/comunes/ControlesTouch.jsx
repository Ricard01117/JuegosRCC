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
}) {
  const activar =
    (evento) => {
      evento.preventDefault();

      onComenzar?.();

      enviarControl(
        juego,
        accion,
        true
      );
    };


  const desactivar =
    (evento) => {
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
      onPointerDown={
        activar
      }
      onPointerUp={
        desactivar
      }
      onPointerCancel={
        desactivar
      }
      onPointerLeave={
        desactivar
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
  Tetris y Pac-Man se controlan
  directamente sobre el tablero.
  */

  if (
    juego === "tetris" ||
    juego === "pacman"
  ) {
    return null;
  }


  /*
  Flappy se controla tocando
  directamente el juego.
  */

  if (
    juego === "flappy"
  ) {
    return null;
  }


  /*
  ASTEROIDES

  Izquierda:
  barra de dirección.

  Derecha:
  propulsor y disparo separados.
  */

  if (
    juego === "asteroids"
  ) {
    return (
      <div className="controles-touch controles-asteroids-nuevos">

        <div className="asteroids-direccion">

          <span className="asteroids-control-titulo">
            GIRO
          </span>


          <div className="asteroids-barra-giro">

            <BotonControl
              juego="asteroids"
              accion="izquierda"
              clase="asteroids-giro-izquierda"
              onComenzar={
                onComenzar
              }
            >
              ◀
            </BotonControl>


            <div className="asteroids-barra-centro">
              ◇
            </div>


            <BotonControl
              juego="asteroids"
              accion="derecha"
              clase="asteroids-giro-derecha"
              onComenzar={
                onComenzar
              }
            >
              ▶
            </BotonControl>

          </div>

        </div>


        <div className="asteroids-acciones">

          <BotonControl
            juego="asteroids"
            accion="arriba"
            clase="asteroids-propulsor"
            onComenzar={
              onComenzar
            }
          >
            <span>
              ▲
            </span>

            <strong>
              PROPULSOR
            </strong>
          </BotonControl>


          <BotonControl
            juego="asteroids"
            accion="disparar"
            clase="asteroids-disparo"
            onComenzar={
              onComenzar
            }
          >
            <span>
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