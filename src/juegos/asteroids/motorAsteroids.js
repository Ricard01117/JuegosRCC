export const ANCHO_MUNDO = 1000;

export const ALTO_MUNDO = 650;

export const RADIO_NAVE = 16;

export const VELOCIDAD_GIRO = 0.067;

export const ACELERACION_NAVE = 0.14;

export const FRICCION_NAVE = 0.992;

export const VELOCIDAD_DISPARO = 9;

export const DURACION_DISPARO = 80;

export const TIEMPO_INVULNERABLE = 1800;


function aleatorio(
  minimo,
  maximo
) {
  return (
    minimo +
    Math.random() *
      (
        maximo -
        minimo
      )
  );
}


export function distancia(
  primero,
  segundo
) {
  const dx =
    primero.x -
    segundo.x;

  const dy =
    primero.y -
    segundo.y;

  return Math.sqrt(
    dx * dx +
    dy * dy
  );
}


export function envolverObjeto(
  objeto,
  margen = 0
) {
  if (
    objeto.x <
    -margen
  ) {
    objeto.x =
      ANCHO_MUNDO +
      margen;
  }


  if (
    objeto.x >
    ANCHO_MUNDO +
      margen
  ) {
    objeto.x =
      -margen;
  }


  if (
    objeto.y <
    -margen
  ) {
    objeto.y =
      ALTO_MUNDO +
      margen;
  }


  if (
    objeto.y >
    ALTO_MUNDO +
      margen
  ) {
    objeto.y =
      -margen;
  }
}


export function crearNave() {
  return {
    x:
      ANCHO_MUNDO / 2,

    y:
      ALTO_MUNDO / 2,

    angulo:
      -Math.PI / 2,

    velocidadX: 0,

    velocidadY: 0,

    radio:
      RADIO_NAVE,

    acelerando:
      false,

    invulnerableHasta:
      performance.now() +
      TIEMPO_INVULNERABLE,
  };
}


export function crearAsteroide({
  nivel = 1,
  multiplicadorVelocidad = 1,
  tamano = "grande",
  x = null,
  y = null,
} = {}) {
  let radio = 44;

  let puntos = 20;


  if (
    tamano ===
    "mediano"
  ) {
    radio = 28;
    puntos = 50;
  }


  if (
    tamano ===
    "pequeno"
  ) {
    radio = 16;
    puntos = 100;
  }


  let posicionX =
    x ??
    aleatorio(
      0,
      ANCHO_MUNDO
    );


  let posicionY =
    y ??
    aleatorio(
      0,
      ALTO_MUNDO
    );


  /*
  Evita crear un asteroide
  inmediatamente encima de la nave.
  */

  if (
    x === null &&
    y === null
  ) {
    const centro = {
      x:
        ANCHO_MUNDO / 2,

      y:
        ALTO_MUNDO / 2,
    };


    let intentos = 0;


    while (
      distancia(
        {
          x:
            posicionX,

          y:
            posicionY,
        },

        centro
      ) < 190 &&
      intentos < 25
    ) {
      posicionX =
        aleatorio(
          0,
          ANCHO_MUNDO
        );


      posicionY =
        aleatorio(
          0,
          ALTO_MUNDO
        );


      intentos += 1;
    }
  }


  const direccion =
    Math.random() *
    Math.PI *
    2;


  const velocidadBase =
    (
      0.75 +
      nivel *
        0.06
    ) *
    multiplicadorVelocidad;


  const velocidad =
    velocidadBase *
    aleatorio(
      0.8,
      1.25
    );


  const cantidadVertices =
    Math.floor(
      aleatorio(
        8,
        13
      )
    );


  const vertices =
    Array.from(
      {
        length:
          cantidadVertices,
      },

      () =>
        aleatorio(
          0.72,
          1.18
        )
    );


  return {
    id:
      `${Date.now()}-${Math.random()}`,

    x:
      posicionX,

    y:
      posicionY,

    velocidadX:
      Math.cos(
        direccion
      ) *
      velocidad,

    velocidadY:
      Math.sin(
        direccion
      ) *
      velocidad,

    radio,

    tamano,

    puntos,

    rotacion:
      Math.random() *
      Math.PI *
      2,

    velocidadRotacion:
      aleatorio(
        -0.018,
        0.018
      ),

    vertices,
  };
}


export function crearOleadaAsteroides(
  cantidad,
  nivel,
  multiplicadorVelocidad
) {
  return Array.from(
    {
      length:
        cantidad,
    },

    () =>
      crearAsteroide({
        nivel,

        multiplicadorVelocidad,

        tamano:
          "grande",
      })
  );
}


export function dividirAsteroide(
  asteroide,
  nivel,
  multiplicadorVelocidad
) {
  if (
    asteroide.tamano ===
    "pequeno"
  ) {
    return [];
  }


  const nuevoTamano =
    asteroide.tamano ===
    "grande"
      ? "mediano"
      : "pequeno";


  return [
    crearAsteroide({
      nivel,

      multiplicadorVelocidad:
        multiplicadorVelocidad *
        1.08,

      tamano:
        nuevoTamano,

      x:
        asteroide.x,

      y:
        asteroide.y,
    }),

    crearAsteroide({
      nivel,

      multiplicadorVelocidad:
        multiplicadorVelocidad *
        1.08,

      tamano:
        nuevoTamano,

      x:
        asteroide.x,

      y:
        asteroide.y,
    }),
  ];
}


export function crearDisparo(
  nave
) {
  return {
    id:
      `${Date.now()}-${Math.random()}`,

    x:
      nave.x +
      Math.cos(
        nave.angulo
      ) *
        (
          nave.radio +
          10
        ),

    y:
      nave.y +
      Math.sin(
        nave.angulo
      ) *
        (
          nave.radio +
          10
        ),

    velocidadX:
      Math.cos(
        nave.angulo
      ) *
        VELOCIDAD_DISPARO +
      nave.velocidadX,

    velocidadY:
      Math.sin(
        nave.angulo
      ) *
        VELOCIDAD_DISPARO +
      nave.velocidadY,

    vida:
      DURACION_DISPARO,

    radio: 3,
  };
}


export function actualizarNave(
  nave,
  controles,
  delta = 1
) {
  if (
    controles.izquierda
  ) {
    nave.angulo -=
      VELOCIDAD_GIRO *
      delta;
  }


  if (
    controles.derecha
  ) {
    nave.angulo +=
      VELOCIDAD_GIRO *
      delta;
  }


  nave.acelerando =
    Boolean(
      controles.arriba
    );


  if (
    controles.arriba
  ) {
    nave.velocidadX +=
      Math.cos(
        nave.angulo
      ) *
      ACELERACION_NAVE *
      delta;


    nave.velocidadY +=
      Math.sin(
        nave.angulo
      ) *
      ACELERACION_NAVE *
      delta;
  }


  nave.velocidadX *=
    Math.pow(
      FRICCION_NAVE,
      delta
    );


  nave.velocidadY *=
    Math.pow(
      FRICCION_NAVE,
      delta
    );


  const magnitud =
    Math.sqrt(
      nave.velocidadX *
        nave.velocidadX +
      nave.velocidadY *
        nave.velocidadY
    );


  const maxima =
    6.4;


  if (
    magnitud >
    maxima
  ) {
    nave.velocidadX =
      (
        nave.velocidadX /
        magnitud
      ) *
      maxima;


    nave.velocidadY =
      (
        nave.velocidadY /
        magnitud
      ) *
      maxima;
  }


  nave.x +=
    nave.velocidadX *
    delta;


  nave.y +=
    nave.velocidadY *
    delta;


  envolverObjeto(
    nave,
    nave.radio
  );
}


export function actualizarAsteroide(
  asteroide,
  delta = 1
) {
  asteroide.x +=
    asteroide.velocidadX *
    delta;


  asteroide.y +=
    asteroide.velocidadY *
    delta;


  asteroide.rotacion +=
    asteroide.velocidadRotacion *
    delta;


  envolverObjeto(
    asteroide,
    asteroide.radio
  );
}


export function actualizarDisparo(
  disparo,
  delta = 1
) {
  disparo.x +=
    disparo.velocidadX *
    delta;


  disparo.y +=
    disparo.velocidadY *
    delta;


  disparo.vida -=
    delta;


  envolverObjeto(
    disparo,
    4
  );
}


export function colisionCirculos(
  primero,
  segundo
) {
  return (
    distancia(
      primero,
      segundo
    ) <
    primero.radio +
      segundo.radio
  );
}