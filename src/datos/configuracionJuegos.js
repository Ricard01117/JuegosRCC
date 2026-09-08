export const CONFIGURACIONES_PREDETERMINADAS = {
  tetris: {
    colores: {
      tablero: "#08101a",
      pieza: "#00eaff",
      sombra: "#314b5f",
      linea: "#ffffff",
    },
  },

  asteroids: {
    dificultad: "medio",

    colores: {
      fondo: "#050812",
      nave: "#00eaff",
      asteroide: "#ff8a3d",
      disparo: "#ffffff",
    },
  },

  flappy: {
    colores: {
      fondo: "#071b2c",
      jugador: "#ffd84d",
      obstaculo: "#39e67b",
      suelo: "#a77b45",
    },
  },

  pacman: {
    colores: {
      fondo: "#02030a",
      laberinto: "#1768ff",
      jugador: "#ffe600",
      puntos: "#b8ffff",
      fruta: "#ff2e75",
      fantasma: "#ff3b78",
      asustado: "#168cff",
    },
  },
};


export const ETIQUETAS_COLORES = {
  tetris: {
    tablero: "Tablero",
    pieza: "Piezas",
    sombra: "Sombra",
    linea: "Líneas",
  },

  asteroids: {
    fondo: "Espacio",
    nave: "Nave",
    asteroide: "Asteroides",
    disparo: "Disparos",
  },

  flappy: {
    fondo: "Cielo",
    jugador: "Jugador",
    obstaculo: "Obstáculos",
    suelo: "Suelo",
  },

  pacman: {
    fondo: "Fondo",
    laberinto: "Laberinto",
    jugador: "Pac-Man",
    puntos: "Puntitos",
    fruta: "Frutas",
    fantasma: "Fantasmas",
    asustado: "Fantasmas vulnerables",
  },
};


/* ==========================================================
   TETRIS
========================================================== */

export const LINEAS_POR_NIVEL_TETRIS = 5;


export const NIVELES_TETRIS = [
  { nivel: 1, velocidad: 850 },
  { nivel: 2, velocidad: 720 },
  { nivel: 3, velocidad: 610 },
  { nivel: 4, velocidad: 510 },
  { nivel: 5, velocidad: 425 },
  { nivel: 6, velocidad: 350 },
  { nivel: 7, velocidad: 285 },
  { nivel: 8, velocidad: 230 },
  { nivel: 9, velocidad: 185 },
  { nivel: 10, velocidad: 145 },
  { nivel: 11, velocidad: 110 },
  { nivel: 12, velocidad: 85 },
];


/* ==========================================================
   FLAPPY
========================================================== */

export const PUNTOS_POR_NIVEL_FLAPPY = 5;


export const NIVELES_FLAPPY = [
  {
    nivel: 1,
    velocidad: 2.5,
    gravedad: 0.30,
    salto: -5.8,
    hueco: 205,
    separacion: 365,
  },

  {
    nivel: 2,
    velocidad: 2.8,
    gravedad: 0.31,
    salto: -5.9,
    hueco: 195,
    separacion: 355,
  },

  {
    nivel: 3,
    velocidad: 3.1,
    gravedad: 0.32,
    salto: -6.0,
    hueco: 185,
    separacion: 345,
  },

  {
    nivel: 4,
    velocidad: 3.4,
    gravedad: 0.33,
    salto: -6.0,
    hueco: 175,
    separacion: 335,
  },

  {
    nivel: 5,
    velocidad: 3.7,
    gravedad: 0.34,
    salto: -6.1,
    hueco: 165,
    separacion: 325,
  },

  {
    nivel: 6,
    velocidad: 4.0,
    gravedad: 0.35,
    salto: -6.15,
    hueco: 155,
    separacion: 315,
  },

  {
    nivel: 7,
    velocidad: 4.35,
    gravedad: 0.36,
    salto: -6.2,
    hueco: 145,
    separacion: 305,
  },

  {
    nivel: 8,
    velocidad: 4.7,
    gravedad: 0.38,
    salto: -6.25,
    hueco: 135,
    separacion: 295,
  },

  {
    nivel: 9,
    velocidad: 5.1,
    gravedad: 0.40,
    salto: -6.3,
    hueco: 122,
    separacion: 285,
  },

  {
    nivel: 10,
    velocidad: 5.6,
    gravedad: 0.42,
    salto: -6.4,
    hueco: 108,
    separacion: 275,
  },
];


/* ==========================================================
   PAC-MAN

   vueltas:
   número de conexiones extra en el laberinto.
   Entre menos haya, más difícil resulta escapar.
========================================================== */

export const NIVELES_PACMAN = [
  {
    nivel: 1,
    velocidad: 190,
    fantasmas: 2,
    fantasmaCada: 2,
    poderMs: 8000,
    vueltas: 18,
  },

  {
    nivel: 2,
    velocidad: 175,
    fantasmas: 2,
    fantasmaCada: 2,
    poderMs: 7600,
    vueltas: 16,
  },

  {
    nivel: 3,
    velocidad: 160,
    fantasmas: 3,
    fantasmaCada: 2,
    poderMs: 7200,
    vueltas: 14,
  },

  {
    nivel: 4,
    velocidad: 148,
    fantasmas: 3,
    fantasmaCada: 1,
    poderMs: 6800,
    vueltas: 12,
  },

  {
    nivel: 5,
    velocidad: 136,
    fantasmas: 4,
    fantasmaCada: 1,
    poderMs: 6400,
    vueltas: 10,
  },

  {
    nivel: 6,
    velocidad: 124,
    fantasmas: 4,
    fantasmaCada: 1,
    poderMs: 6000,
    vueltas: 9,
  },

  {
    nivel: 7,
    velocidad: 112,
    fantasmas: 4,
    fantasmaCada: 1,
    poderMs: 5600,
    vueltas: 8,
  },

  {
    nivel: 8,
    velocidad: 101,
    fantasmas: 4,
    fantasmaCada: 1,
    poderMs: 5200,
    vueltas: 7,
  },

  {
    nivel: 9,
    velocidad: 91,
    fantasmas: 4,
    fantasmaCada: 1,
    poderMs: 4800,
    vueltas: 6,
  },

  {
    nivel: 10,
    velocidad: 82,
    fantasmas: 4,
    fantasmaCada: 1,
    poderMs: 4400,
    vueltas: 4,
  },
];


/* ==========================================================
   ASTEROIDES
========================================================== */

export const PARAMETROS_DIFICULTAD = {
  asteroids: {
    facil: {
      velocidadAsteroides: 0.7,
      cantidadInicial: 3,
    },

    medio: {
      velocidadAsteroides: 1,
      cantidadInicial: 5,
    },

    dificil: {
      velocidadAsteroides: 1.4,
      cantidadInicial: 7,
    },
  },
};