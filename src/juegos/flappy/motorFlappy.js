export const ANCHO_FLAPPY = 900;

export const ALTO_FLAPPY = 520;

export const RADIO_JUGADOR = 18;

export const ANCHO_OBSTACULO = 76;

export const POSICION_X_JUGADOR = 190;


export function crearJugador() {
  return {
    x:
      POSICION_X_JUGADOR,

    y:
      ALTO_FLAPPY / 2,

    velocidadY: 0,

    radio:
      RADIO_JUGADOR,

    rotacion: 0,
  };
}


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


export function crearObstaculo(
  x,
  configuracionNivel
) {
  const margenSuperior =
    60;


  const margenInferior =
    70;


  const mitadHueco =
    configuracionNivel
      .hueco / 2;


  const minimo =
    margenSuperior +
    mitadHueco;


  const maximo =
    ALTO_FLAPPY -
    margenInferior -
    mitadHueco;


  return {
    x,

    ancho:
      ANCHO_OBSTACULO,

    centroHueco:
      aleatorio(
        minimo,
        maximo
      ),

    hueco:
      configuracionNivel
        .hueco,

    contado:
      false,
  };
}


export function crearObstaculosIniciales(
  configuracionNivel
) {
  return [
    crearObstaculo(
      650,
      configuracionNivel
    ),

    crearObstaculo(
      650 +
        configuracionNivel
          .separacion,
      configuracionNivel
    ),

    crearObstaculo(
      650 +
        configuracionNivel
          .separacion *
          2,
      configuracionNivel
    ),
  ];
}


export function saltarJugador(
  jugador,
  configuracionNivel
) {
  jugador.velocidadY =
    configuracionNivel
      .salto;
}


export function actualizarJugador(
  jugador,
  configuracionNivel,
  delta
) {
  jugador.velocidadY +=
    configuracionNivel
      .gravedad *
    delta;


  jugador.y +=
    jugador.velocidadY *
    delta;


  jugador.rotacion =
    Math.max(
      -0.45,

      Math.min(
        1.15,

        jugador.velocidadY *
          0.075
      )
    );
}


export function actualizarObstaculo(
  obstaculo,
  configuracionNivel,
  delta
) {
  obstaculo.x -=
    configuracionNivel
      .velocidad *
    delta;
}


export function colisionJugadorObstaculo(
  jugador,
  obstaculo
) {
  const izquierda =
    obstaculo.x;


  const derecha =
    obstaculo.x +
    obstaculo.ancho;


  const superiorHueco =
    obstaculo
      .centroHueco -
    obstaculo.hueco / 2;


  const inferiorHueco =
    obstaculo
      .centroHueco +
    obstaculo.hueco / 2;


  const jugadorIzquierda =
    jugador.x -
    jugador.radio;


  const jugadorDerecha =
    jugador.x +
    jugador.radio;


  const jugadorArriba =
    jugador.y -
    jugador.radio;


  const jugadorAbajo =
    jugador.y +
    jugador.radio;


  const estaHorizontalmente =
    jugadorDerecha >
      izquierda &&
    jugadorIzquierda <
      derecha;


  if (
    !estaHorizontalmente
  ) {
    return false;
  }


  return (
    jugadorArriba <
      superiorHueco ||
    jugadorAbajo >
      inferiorHueco
  );
}


export function fueraDePantalla(
  jugador
) {
  return (
    jugador.y -
      jugador.radio <=
      0 ||
    jugador.y +
      jugador.radio >=
      ALTO_FLAPPY
  );
}