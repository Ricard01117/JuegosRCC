import {
  createRoot,
} from "react-dom/client";


import App from "./App";


import {
  ProveedorJuego,
} from "./contexto/ContextoJuego";


import {
  ProveedorTema,
} from "./contexto/ContextoTema";


import "./estilos/global.css";

import "./estilos/inicio.css";

import "./estilos/juegos.css";

import "./estilos/responsive.css";

import "./estilos/tetris.css";

import "./estilos/asteroids.css";

import "./estilos/flappy.css";

import "./estilos/pacman.css";


createRoot(
  document.getElementById(
    "root"
  )
).render(

  <ProveedorTema>

    <ProveedorJuego>

      <App />

    </ProveedorJuego>

  </ProveedorTema>

);