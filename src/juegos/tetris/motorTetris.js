export const COLUMNAS = 10;
export const FILAS = 20;

const FORMAS = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  O: [
    [1, 1],
    [1, 1],
  ],

  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],

  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],

  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],

  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

const TIPOS = Object.keys(FORMAS);

export function crearTablero() {
  return Array.from(
    { length: FILAS },
    () => Array(COLUMNAS).fill(0)
  );
}

function copiarMatriz(matriz) {
  return matriz.map((fila) => [...fila]);
}

export function crearPiezaAleatoria() {
  const tipo =
    TIPOS[
      Math.floor(
        Math.random() * TIPOS.length
      )
    ];

  const matriz =
    copiarMatriz(FORMAS[tipo]);

  return {
    tipo,
    matriz,
    x:
      Math.floor(
        COLUMNAS / 2
      ) -
      Math.ceil(
        matriz[0].length / 2
      ),
    y: -1,
  };
}

export function rotarMatriz(matriz) {
  const filas = matriz.length;
  const columnas = matriz[0].length;

  const nueva =
    Array.from(
      { length: columnas },
      () =>
        Array(filas).fill(0)
    );

  for (
    let fila = 0;
    fila < filas;
    fila += 1
  ) {
    for (
      let columna = 0;
      columna < columnas;
      columna += 1
    ) {
      nueva[columna][
        filas - 1 - fila
      ] =
        matriz[fila][columna];
    }
  }

  return nueva;
}

export function hayColision(
  tablero,
  pieza,
  desplazamientoX = 0,
  desplazamientoY = 0,
  matriz = pieza.matriz
) {
  for (
    let fila = 0;
    fila < matriz.length;
    fila += 1
  ) {
    for (
      let columna = 0;
      columna <
      matriz[fila].length;
      columna += 1
    ) {
      if (!matriz[fila][columna]) {
        continue;
      }

      const x =
        pieza.x +
        columna +
        desplazamientoX;

      const y =
        pieza.y +
        fila +
        desplazamientoY;

      if (
        x < 0 ||
        x >= COLUMNAS ||
        y >= FILAS
      ) {
        return true;
      }

      if (
        y >= 0 &&
        tablero[y][x]
      ) {
        return true;
      }
    }
  }

  return false;
}

export function fijarPieza(
  tablero,
  pieza
) {
  const nuevo =
    tablero.map(
      (fila) => [...fila]
    );

  for (
    let fila = 0;
    fila <
    pieza.matriz.length;
    fila += 1
  ) {
    for (
      let columna = 0;
      columna <
      pieza.matriz[fila].length;
      columna += 1
    ) {
      if (
        !pieza.matriz[fila][columna]
      ) {
        continue;
      }

      const x =
        pieza.x + columna;

      const y =
        pieza.y + fila;

      if (
        y >= 0 &&
        y < FILAS &&
        x >= 0 &&
        x < COLUMNAS
      ) {
        nuevo[y][x] =
          pieza.tipo;
      }
    }
  }

  return nuevo;
}

export function limpiarLineas(
  tablero
) {
  const restantes =
    tablero.filter(
      (fila) =>
        fila.some(
          (celda) => !celda
        )
    );

  const eliminadas =
    FILAS -
    restantes.length;

  while (
    restantes.length < FILAS
  ) {
    restantes.unshift(
      Array(COLUMNAS).fill(0)
    );
  }

  return {
    tablero: restantes,
    lineas: eliminadas,
  };
}

export function calcularPuntos(
  lineas
) {
  switch (lineas) {
    case 1:
      return 100;

    case 2:
      return 300;

    case 3:
      return 500;

    case 4:
      return 800;

    default:
      return 0;
  }
}

export function obtenerPosicionFantasma(
  tablero,
  pieza
) {
  let desplazamiento = 0;

  while (
    !hayColision(
      tablero,
      pieza,
      0,
      desplazamiento + 1
    )
  ) {
    desplazamiento += 1;
  }

  return {
    ...pieza,
    y:
      pieza.y +
      desplazamiento,
  };
}

export function intentarRotar(
  tablero,
  pieza
) {
  const rotada =
    rotarMatriz(
      pieza.matriz
    );

  if (
    !hayColision(
      tablero,
      pieza,
      0,
      0,
      rotada
    )
  ) {
    return {
      ...pieza,
      matriz: rotada,
    };
  }

  if (
    !hayColision(
      tablero,
      pieza,
      -1,
      0,
      rotada
    )
  ) {
    return {
      ...pieza,
      x: pieza.x - 1,
      matriz: rotada,
    };
  }

  if (
    !hayColision(
      tablero,
      pieza,
      1,
      0,
      rotada
    )
  ) {
    return {
      ...pieza,
      x: pieza.x + 1,
      matriz: rotada,
    };
  }

  return pieza;
}