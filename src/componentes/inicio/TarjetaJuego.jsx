import { useJuego } from "../../contexto/ContextoJuego";

function TarjetaJuego({ juego, numero }) {
  const { abrirJuego } = useJuego();

  return (
    <article className={`tarjeta-juego tarjeta-${juego.codigo}`}>
      <div className="tarjeta-reflejo" />
      <div className="tarjeta-scanline" />

      <div className="tarjeta-superior">
        <span className="numero-juego">0{numero}</span>
        <span className="tipo-juego">{juego.etiqueta}</span>
      </div>

      <div className="icono-juego">{juego.icono}</div>

      <div className="contenido-tarjeta">
        <h2>{juego.nombre}</h2>
        <p>{juego.descripcion}</p>
      </div>

      <div className="pie-tarjeta">
        <small>{juego.controles}</small>

        <button
          type="button"
          className="boton-jugar"
          onClick={() => abrirJuego(juego.codigo)}
        >
          <span>JUGAR</span>
          <strong>▶</strong>
        </button>
      </div>
    </article>
  );
}

export default TarjetaJuego;