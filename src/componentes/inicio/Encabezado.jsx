import { useTema } from "../../contexto/ContextoTema";

function Encabezado({ onVerMasJuegos }) {
  const { temaActual, indice, total, siguienteTema } = useTema();

  return (
    <header className="encabezado-principal">
      <div className="marca-juegos">
        <div className="logo-rcc">RC</div>

        <div className="marca-textos">
          <strong>JUEGOSRCC</strong>
          <small>ARCADE COLLECTION</small>
        </div>
      </div>

      <div className="acciones-header">
        <button
          type="button"
          className="boton-mas-juegos"
          onClick={onVerMasJuegos}
        >
          <span>+</span>
          VER MÁS JUEGOS
        </button>

        <button
          type="button"
          className="boton-tema"
          onClick={siguienteTema}
        >
          <span>ESTILO</span>
          <strong>{temaActual.nombre}</strong>
          <small>
            {indice}/{total}
          </small>
        </button>
      </div>
    </header>
  );
}

export default Encabezado;