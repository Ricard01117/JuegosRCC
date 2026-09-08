import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


const ContextoTema =
  createContext(null);


const TEMAS = [
  {
    codigo: "arcade",
    nombre: "ARCADE NEON",
  },

  {
    codigo: "moderno",
    nombre: "MODERNO",
  },

  {
    codigo: "retro90",
    nombre: "RETRO 90",
  },
];


function obtenerTemaInicial() {
  const guardado =
    localStorage.getItem(
      "juegosrcc_tema"
    );


  const existe =
    TEMAS.some(
      (tema) =>
        tema.codigo ===
        guardado
    );


  return existe
    ? guardado
    : "arcade";
}


export function ProveedorTema({
  children,
}) {
  const [
    tema,
    setTema,
  ] = useState(
    obtenerTemaInicial
  );


  useEffect(() => {
    document
      .documentElement
      .dataset
      .tema =
      tema;


    localStorage.setItem(
      "juegosrcc_tema",
      tema
    );
  }, [
    tema,
  ]);


  const indice =
    TEMAS.findIndex(
      (elemento) =>
        elemento.codigo ===
        tema
    );


  const posicion =
    indice >= 0
      ? indice
      : 0;


  const temaActual =
    TEMAS[posicion];


  const siguienteTema =
    () => {
      const siguiente =
        (
          posicion + 1
        ) %
        TEMAS.length;


      setTema(
        TEMAS[
          siguiente
        ].codigo
      );
    };


  const valor =
    useMemo(
      () => ({
        tema,

        temaActual,

        indice:
          posicion + 1,

        total:
          TEMAS.length,

        siguienteTema,
      }),
      [
        tema,
        temaActual,
        posicion,
      ]
    );


  return (
    <ContextoTema.Provider
      value={valor}
    >
      {children}
    </ContextoTema.Provider>
  );
}


export function useTema() {
  const contexto =
    useContext(
      ContextoTema
    );


  if (!contexto) {
    throw new Error(
      "useTema debe utilizarse dentro de ProveedorTema"
    );
  }


  return contexto;
}