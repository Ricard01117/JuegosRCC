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
}) {
  const activar =
    (evento) => {
      evento.preventDefault();

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


function Cruceta({
  juego,
  mostrarArriba = true,
  mostrarAbajo = true,
}) {
  return (
    <div className="cruceta-touch">

      {mostrarArriba ? (
        <BotonControl
          juego={juego}
          accion="arriba"
          clase="control-arriba"
        >
          ▲
        </BotonControl>
      ) : (
        <span />
      )}


      <BotonControl
        juego={juego}
        accion="izquierda"
        clase="control-izquierda"
      >
        ◀
      </BotonControl>


      <div className="centro-cruceta" />


      <BotonControl
        juego={juego}
        accion="derecha"
        clase="control-derecha"
      >
        ▶
      </BotonControl>


      {mostrarAbajo ? (
        <BotonControl
          juego={juego}
          accion="abajo"
          clase="control-abajo"
        >
          ▼
        </BotonControl>
      ) : (
        <span />
      )}

    </div>
  );
}


function ControlesTouch({
  juego,
}) {
  /*
  ==========================================
  TETRIS

  No utiliza botones táctiles.
  Se controla directamente
  tocando y arrastrando el tablero.
  ==========================================
  */

  if (
    juego ===
    "tetris"
  ) {
    return null;
  }


  if (
    juego ===
    "flappy"
  ) {
    return (
      <div className="controles-touch controles-flappy">

        <BotonControl
          juego={juego}
          accion="saltar"
          clase="boton-touch-grande"
        >
          SALTAR
        </BotonControl>

      </div>
    );
  }


  if (
    juego ===
    "asteroids"
  ) {
    return (
      <div className="controles-touch controles-con-accion">

        <Cruceta
          juego={juego}
          mostrarAbajo={
            false
          }
        />


        <BotonControl
          juego={juego}
          accion="disparar"
          clase="boton-accion-touch"
        >
          A
        </BotonControl>

      </div>
    );
  }


  return (
    <div className="controles-touch">

      <Cruceta
        juego={juego}
      />

    </div>
  );
}


export default ControlesTouch;