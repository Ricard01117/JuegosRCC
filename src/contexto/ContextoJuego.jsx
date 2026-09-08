import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";


const ContextoJuego =
  createContext(null);


export function ProveedorJuego({
  children,
}) {
  const [
    juegoActivo,
    setJuegoActivo,
  ] = useState(null);


  const abrirJuego =
    (codigoJuego) => {
      setJuegoActivo(
        codigoJuego
      );
    };


  const cerrarJuego =
    () => {
      setJuegoActivo(
        null
      );
    };


  const valor =
    useMemo(
      () => ({
        juegoActivo,
        abrirJuego,
        cerrarJuego,
      }),
      [
        juegoActivo,
      ]
    );


  return (
    <ContextoJuego.Provider
      value={valor}
    >
      {children}
    </ContextoJuego.Provider>
  );
}


export function useJuego() {
  const contexto =
    useContext(
      ContextoJuego
    );


  if (!contexto) {
    throw new Error(
      "useJuego debe utilizarse dentro de ProveedorJuego"
    );
  }


  return contexto;
}