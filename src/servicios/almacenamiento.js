import {
  CONFIGURACIONES_PREDETERMINADAS,
} from "../datos/configuracionJuegos";


function copiar(valor) {
  return JSON.parse(
    JSON.stringify(valor)
  );
}


function claveConfiguracion(
  codigoJuego
) {
  return `juegosrcc_config_${codigoJuego}`;
}


function usaNivelesAutomaticos(
  codigoJuego
) {
  return (
    codigoJuego === "tetris" ||
    codigoJuego === "flappy" ||
    codigoJuego === "pacman"
  );
}


export function cargarConfiguracionJuego(
  codigoJuego
) {
  const predeterminada =
    CONFIGURACIONES_PREDETERMINADAS[
      codigoJuego
    ];


  if (!predeterminada) {
    return null;
  }


  try {
    const guardada =
      localStorage.getItem(
        claveConfiguracion(
          codigoJuego
        )
      );


    if (!guardada) {
      return copiar(
        predeterminada
      );
    }


    const datos =
      JSON.parse(
        guardada
      );


    const configuracion = {
      ...copiar(
        predeterminada
      ),

      ...datos,

      colores: {
        ...predeterminada.colores,

        ...(
          datos.colores ||
          {}
        ),
      },
    };


    if (
      usaNivelesAutomaticos(
        codigoJuego
      )
    ) {
      delete configuracion
        .dificultad;
    }


    return configuracion;
  } catch (error) {
    console.error(
      "No se pudo cargar la configuración:",
      error
    );


    return copiar(
      predeterminada
    );
  }
}


export function guardarConfiguracionJuego(
  codigoJuego,
  configuracion
) {
  try {
    const datos = {
      ...configuracion,
    };


    if (
      usaNivelesAutomaticos(
        codigoJuego
      )
    ) {
      delete datos
        .dificultad;
    }


    localStorage.setItem(
      claveConfiguracion(
        codigoJuego
      ),

      JSON.stringify(
        datos
      )
    );
  } catch (error) {
    console.error(
      "No se pudo guardar la configuración:",
      error
    );
  }
}


export function restablecerConfiguracionJuego(
  codigoJuego
) {
  const predeterminada =
    CONFIGURACIONES_PREDETERMINADAS[
      codigoJuego
    ];


  if (!predeterminada) {
    return null;
  }


  const nueva =
    copiar(
      predeterminada
    );


  guardarConfiguracionJuego(
    codigoJuego,
    nueva
  );


  return nueva;
}