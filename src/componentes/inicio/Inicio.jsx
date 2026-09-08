import { useJuego } from "../../contexto/ContextoJuego";

const JUEGOS_INICIO = [
  {
    codigo: "tetris",
    numero: "01",
    nombre: "Tetris",
    categoria: "PUZZLE",
    descripcion:
      "Completa líneas, supera niveles y evita que las piezas lleguen hasta arriba.",
  },
  {
    codigo: "asteroids",
    numero: "02",
    nombre: "Asteroides",
    categoria: "ESPACIAL",
    descripcion:
      "Pilota tu nave, destruye asteroides y sobrevive a oleadas cada vez más rápidas.",
  },
  {
    codigo: "flappy",
    numero: "03",
    nombre: "Flappy",
    categoria: "REFLEJOS",
    descripcion:
      "Mantén el vuelo, cruza obstáculos y avanza por niveles cada vez más rápidos.",
  },
  {
    codigo: "pacman",
    numero: "04",
    nombre: "Pac-Man",
    categoria: "LABERINTO",
    descripcion:
      "Come puntos, consigue frutas, supera laberintos y escapa de los fantasmas.",
  },
];

function IconoTetris() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <g className="icono-trazo">
        <rect x="21" y="23" width="27" height="27" rx="4" />
        <rect x="50" y="23" width="27" height="27" rx="4" />
        <rect x="50" y="52" width="27" height="27" rx="4" />
        <rect x="79" y="52" width="27" height="27" rx="4" />
        <path d="M22 96H98" />
      </g>
    </svg>
  );
}

function IconoAsteroides() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <g className="icono-trazo">
        <path
          className="icono-relleno-suave"
          d="M60 15 L82 76 L60 65 L38 76 Z"
        />
        <path d="M60 65V95" />
        <path d="M50 83L60 102L70 83" />
        <path
          className="asteroide-forma"
          d="M18 30 L25 21 L38 23 L43 34 L34 43 L21 40 Z"
        />
        <path
          className="asteroide-forma"
          d="M87 28 L97 23 L106 31 L103 43 L91 46 L83 38 Z"
        />
        <path
          className="asteroide-forma"
          d="M88 78 L101 75 L108 87 L100 98 L87 96 L82 87 Z"
        />
      </g>
    </svg>
  );
}

function IconoFlappy() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <g className="icono-trazo">
        <ellipse className="icono-relleno-suave" cx="55" cy="57" rx="29" ry="24" />
        <path
          className="icono-relleno-suave"
          d="M42 58 C27 47 20 60 31 72 C40 81 51 72 55 65"
        />
        <path className="flappy-pico" d="M81 52 L105 60 L81 68 Z" />
        <circle className="flappy-ojo" cx="67" cy="48" r="7" />
        <circle className="flappy-pupila" cx="69" cy="48" r="2.5" />
        <path d="M27 94H94" />
      </g>
    </svg>
  );
}

function IconoPacman() {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path
        className="pacman-icono-cuerpo"
        d="M54 20 A40 40 0 1 0 54 100 A40 40 0 0 0 94 72 L60 60 L94 48 A40 40 0 0 0 54 20 Z"
      />
      <circle className="pacman-icono-ojo" cx="59" cy="39" r="4" />
      <circle className="pacman-icono-punto" cx="106" cy="60" r="6" />
    </svg>
  );
}

function IconoJuego({ codigo }) {
  if (codigo === "tetris") return <IconoTetris />;
  if (codigo === "asteroids") return <IconoAsteroides />;
  if (codigo === "flappy") return <IconoFlappy />;
  return <IconoPacman />;
}

function Inicio({ onAbrirArcade }) {
  const { abrirJuego } = useJuego();
  const base = import.meta.env.BASE_URL;

  const bajarAJuegos = () => {
    document.getElementById("juegos-locales")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="rcc-contenido">
      <section className="arcade-presentacion">
        <div className="arcade-info">
          <span className="arcade-etiqueta">PROYECTO ORIGINAL</span>

          <h1 className="arcade-titulo">
            ARCADE
            <strong>_RC</strong>
          </h1>

          <p className="arcade-resumen">
            Arcade web conectado a un backend. Ahí se maneja el análisis de datos
            de las partidas y se representa con gráficas para ver estadísticas,
            récords, logros y tiempo jugado de una forma clara y fácil de entender.
          </p>

          <div className="arcade-caracteristicas">
            <article className="arcade-dato">
              <span>01</span>
              <div>
                <strong>Análisis de datos</strong>
                <p>
                  Cada partida genera información útil para comparar resultados,
                  detectar el juego más usado y revisar el rendimiento general.
                </p>
              </div>
            </article>

            <article className="arcade-dato">
              <span>02</span>
              <div>
                <strong>Gráficas y métricas</strong>
                <p>
                  Se muestran barras, líneas, donas y resúmenes visuales para
                  representar partidas, logros, récords y tiempo acumulado.
                </p>
              </div>
            </article>

            <article className="arcade-dato">
              <span>03</span>
              <div>
                <strong>API y backend</strong>
                <p>
                  Se apoya en FastAPI para la lógica, SQLAlchemy para la conexión
                  y PostgreSQL para guardar la información de cada juego.
                </p>
              </div>
            </article>

            <article className="arcade-dato">
              <span>04</span>
              <div>
                <strong>Frontend y juegos</strong>
                <p>
                  La interfaz fue hecha con React, Vite, JavaScript, HTML5 Canvas,
                  CSS y SVG para lograr una experiencia visual arcade.
                </p>
              </div>
            </article>
          </div>

          <div className="arcade-tags">
            <span>React</span>
            <span>Vite</span>
            <span>JavaScript</span>
            <span>HTML5 Canvas</span>
            <span>CSS</span>
            <span>SVG</span>
            <span>FastAPI</span>
            <span>SQLAlchemy</span>
            <span>PostgreSQL</span>
          </div>

          <div className="arcade-acciones">
            <button
              type="button"
              className="arcade-boton boton-atencion"
              onClick={onAbrirArcade}
            >
              <span>
                <strong>ENTRAR A ARCADE_RC</strong>
                <small>Espera unos segundos a que se encienda Render</small>
              </span>
              <b>↗</b>
            </button>

            <button
              type="button"
              className="arcade-boton boton-atencion"
              onClick={bajarAJuegos}
            >
              <strong>JUGAR JUEGOS</strong>
              <b>↓</b>
            </button>
          </div>
        </div>

        <div className="arcade-imagenes">
          <figure className="arcade-captura captura-estadisticas">
            <div className="captura-barra">
              <div>
                <i />
                <i />
                <i />
              </div>
              <span>ESTADÍSTICAS</span>
            </div>

            <img
              src={`${base}imagenes/arcade_rc_estadisticas.png`}
              alt="Estadísticas y gráficas del proyecto Arcade RC"
            />
          </figure>

          <figure className="arcade-captura captura-portada">
            <div className="captura-barra">
              <div>
                <i />
                <i />
                <i />
              </div>
              <span>PORTADA</span>
            </div>

            <img
              src={`${base}imagenes/arcade_rc_portada.png`}
              alt="Portada del proyecto Arcade RC"
            />
          </figure>
        </div>
      </section>

      <section className="juegos-inicio" id="juegos-locales">
        <header className="juegos-inicio-header">
          <div>
            <span>JUEGOSRCC</span>
            <h2>JUEGOS LOCALES</h2>
          </div>

          <small>TOUCH + TECLADO</small>
        </header>

        <div className="juegos-grid">
          {JUEGOS_INICIO.map((juego, indice) => (
            <article
              className={`juego-tarjeta juego-${indice + 1}`}
              key={juego.codigo}
            >
              <div className="juego-tarjeta-top">
                <span>{juego.numero}</span>
                <small>{juego.categoria}</small>
              </div>

              <div className="juego-icono">
                <IconoJuego codigo={juego.codigo} />
              </div>

              <div className="juego-texto">
                <h3>{juego.nombre}</h3>
                <p>{juego.descripcion}</p>
                <small>Teclado + Touch</small>
              </div>

              <button
                type="button"
                className="juego-boton"
                onClick={() => abrirJuego(juego.codigo)}
              >
                <strong>JUGAR</strong>
                <span>▶</span>
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Inicio;