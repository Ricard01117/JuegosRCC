import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";


import {
  ALTO_MUNDO,
  ANCHO_MUNDO,
  TIEMPO_INVULNERABLE,
  actualizarAsteroide,
  actualizarDisparo,
  actualizarNave,
  colisionCirculos,
  crearDisparo,
  crearNave,
  crearOleadaAsteroides,
  dividirAsteroide,
} from "./motorAsteroids";


import {
  PARAMETROS_DIFICULTAD,
} from "../../datos/configuracionJuegos";


const MAXIMO_DISPAROS = 7;


function Asteroids({
  pausado,
  configuracion,
}) {
  const canvasRef =
    useRef(null);


  const frameRef =
    useRef(null);


  const ultimoTiempoRef =
    useRef(
      performance.now()
    );


  const naveRef =
    useRef(
      crearNave()
    );


  const asteroidesRef =
    useRef([]);


  const disparosRef =
    useRef([]);


  const controlesRef =
    useRef({
      izquierda: false,

      derecha: false,

      arriba: false,
    });


  const ultimoDisparoRef =
    useRef(0);


  const cambiandoNivelRef =
    useRef(false);


  const estadoRef =
    useRef({
      pausado,

      gameOver: false,
    });


  const [
    puntos,
    setPuntos,
  ] = useState(0);


  const [
    vidas,
    setVidas,
  ] = useState(3);


  const [
    nivel,
    setNivel,
  ] = useState(1);


  const [
    asteroidesRestantes,
    setAsteroidesRestantes,
  ] = useState(0);


  const [
    gameOver,
    setGameOver,
  ] = useState(false);


  const [
    avisoNivel,
    setAvisoNivel,
  ] = useState(null);


  const dificultad =
    useMemo(
      () =>
        PARAMETROS_DIFICULTAD
          .asteroids[
            configuracion
              .dificultad
          ] ||
        PARAMETROS_DIFICULTAD
          .asteroids
          .medio,

      [
        configuracion
          .dificultad,
      ]
    );


  useEffect(() => {
    estadoRef.current.pausado =
      pausado;
  }, [
    pausado,
  ]);


  useEffect(() => {
    estadoRef.current.gameOver =
      gameOver;
  }, [
    gameOver,
  ]);


  /*
  ==========================================
  CREAR NIVEL
  ==========================================
  */

  const cargarNivel =
    useCallback(
      (
        numeroNivel
      ) => {
        const cantidad =
          dificultad
            .cantidadInicial +
          Math.floor(
            (
              numeroNivel -
              1
            ) *
              0.8
          );


        const nuevaOleada =
          crearOleadaAsteroides(
            cantidad,

            numeroNivel,

            dificultad
              .velocidadAsteroides
          );


        asteroidesRef.current =
          nuevaOleada;


        disparosRef.current =
          [];


        naveRef.current =
          crearNave();


        setAsteroidesRestantes(
          nuevaOleada.length
        );


        setAvisoNivel(
          `NIVEL ${numeroNivel}`
        );


        cambiandoNivelRef.current =
          false;


        const temporizador =
          window.setTimeout(
            () => {
              setAvisoNivel(
                null
              );
            },

            1400
          );


        return () => {
          window.clearTimeout(
            temporizador
          );
        };
      },

      [
        dificultad,
      ]
    );


  /*
  ==========================================
  REINICIAR
  ==========================================
  */

  const reiniciar =
    useCallback(() => {
      setPuntos(
        0
      );


      setVidas(
        3
      );


      setNivel(
        1
      );


      setGameOver(
        false
      );


      estadoRef.current.gameOver =
        false;


      cambiandoNivelRef.current =
        false;


      controlesRef.current = {
        izquierda:
          false,

        derecha:
          false,

        arriba:
          false,
      };


      cargarNivel(
        1
      );
    }, [
      cargarNivel,
    ]);


  useEffect(() => {
    reiniciar();
  }, [
    reiniciar,
  ]);


  /*
  ==========================================
  DISPARAR
  ==========================================
  */

  const disparar =
    useCallback(() => {
      if (
        estadoRef.current
          .pausado ||
        estadoRef.current
          .gameOver
      ) {
        return;
      }


      const ahora =
        performance.now();


      if (
        ahora -
          ultimoDisparoRef
            .current <
        150
      ) {
        return;
      }


      if (
        disparosRef.current
          .length >=
        MAXIMO_DISPAROS
      ) {
        return;
      }


      disparosRef.current.push(
        crearDisparo(
          naveRef.current
        )
      );


      ultimoDisparoRef.current =
        ahora;
    }, []);


  /*
  ==========================================
  CONTROLES
  ==========================================
  */

  useEffect(() => {
    const controlar =
      (evento) => {
        const {
          juego,
          accion,
          activo,
        } =
          evento.detail || {};


        if (
          juego !==
          "asteroids"
        ) {
          return;
        }


        if (
          accion ===
          "disparar"
        ) {
          if (
            activo
          ) {
            disparar();
          }

          return;
        }


        if (
          accion ===
            "izquierda" ||
          accion ===
            "derecha" ||
          accion ===
            "arriba"
        ) {
          controlesRef.current[
            accion
          ] =
            Boolean(
              activo
            );
        }
      };


    window.addEventListener(
      "juegosrcc-control",
      controlar
    );


    return () => {
      window.removeEventListener(
        "juegosrcc-control",
        controlar
      );
    };
  }, [
    disparar,
  ]);


  /*
  ==========================================
  PERDER VIDA
  ==========================================
  */

  const perderVida =
    useCallback(() => {
      setVidas(
        (
          actuales
        ) => {
          const restantes =
            actuales - 1;


          if (
            restantes <= 0
          ) {
            setGameOver(
              true
            );


            estadoRef.current
              .gameOver =
              true;


            return 0;
          }


          const nuevaNave =
            crearNave();


          nuevaNave
            .invulnerableHasta =
            performance.now() +
            TIEMPO_INVULNERABLE;


          naveRef.current =
            nuevaNave;


          return restantes;
        }
      );
    }, []);


  /*
  ==========================================
  IMPACTOS
  ==========================================
  */

  const resolverImpactos =
    useCallback(() => {
      const asteroides =
        [
          ...asteroidesRef
            .current,
        ];


      const disparosActivos =
        [];


      for (
        const disparo
        of disparosRef.current
      ) {
        let destruido =
          false;


        for (
          let indice =
            asteroides.length -
            1;

          indice >= 0;

          indice -= 1
        ) {
          const asteroide =
            asteroides[
              indice
            ];


          if (
            !colisionCirculos(
              disparo,

              asteroide
            )
          ) {
            continue;
          }


          destruido =
            true;


          asteroides.splice(
            indice,
            1
          );


          const fragmentos =
            dividirAsteroide(
              asteroide,

              nivel,

              dificultad
                .velocidadAsteroides
            );


          asteroides.push(
            ...fragmentos
          );


          setPuntos(
            (
              actuales
            ) =>
              actuales +
              asteroide
                .puntos *
                nivel
          );


          break;
        }


        if (
          !destruido &&
          disparo.vida > 0
        ) {
          disparosActivos.push(
            disparo
          );
        }
      }


      disparosRef.current =
        disparosActivos;


      asteroidesRef.current =
        asteroides;


      setAsteroidesRestantes(
        asteroides.length
      );
    }, [
      dificultad,
      nivel,
    ]);


  /*
  ==========================================
  COLISIÓN DE NAVE
  ==========================================
  */

  const revisarColisionNave =
    useCallback(() => {
      const nave =
        naveRef.current;


      if (
        performance.now() <
        nave.invulnerableHasta
      ) {
        return;
      }


      const colision =
        asteroidesRef.current
          .some(
            (
              asteroide
            ) =>
              colisionCirculos(
                nave,

                asteroide
              )
          );


      if (
        colision
      ) {
        perderVida();
      }
    }, [
      perderVida,
    ]);


  /*
  ==========================================
  PASAR DE NIVEL
  ==========================================
  */

  const comprobarNivel =
    useCallback(() => {
      if (
        cambiandoNivelRef
          .current ||
        asteroidesRef.current
          .length !== 0 ||
        estadoRef.current
          .gameOver
      ) {
        return;
      }


      cambiandoNivelRef.current =
        true;


      setNivel(
        (
          actual
        ) => {
          const siguiente =
            actual + 1;


          window.setTimeout(
            () => {
              cargarNivel(
                siguiente
              );
            },

            550
          );


          return siguiente;
        }
      );
    }, [
      cargarNivel,
    ]);


  /*
  ==========================================
  DIBUJAR
  ==========================================
  */

  const dibujar =
    useCallback(() => {
      const canvas =
        canvasRef.current;


      if (
        !canvas
      ) {
        return;
      }


      const ctx =
        canvas.getContext(
          "2d"
        );


      const colores =
        configuracion
          .colores;


      ctx.fillStyle =
        colores.fondo;


      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );


      /*
      ESTRELLAS
      */

      ctx.fillStyle =
        "#ffffff";


      ctx.globalAlpha =
        0.3;


      for (
        let i = 0;
        i < 75;
        i += 1
      ) {
        const x =
          (
            i * 193
          ) %
          canvas.width;


        const y =
          (
            i * 107
          ) %
          canvas.height;


        const tamano =
          i % 7 === 0
            ? 2
            : 1;


        ctx.fillRect(
          x,
          y,
          tamano,
          tamano
        );
      }


      ctx.globalAlpha =
        1;


      const escalaX =
        canvas.width /
        ANCHO_MUNDO;


      const escalaY =
        canvas.height /
        ALTO_MUNDO;


      ctx.save();


      ctx.scale(
        escalaX,
        escalaY
      );


      /*
      ASTEROIDES
      */

      for (
        const asteroide
        of asteroidesRef.current
      ) {
        ctx.save();


        ctx.translate(
          asteroide.x,
          asteroide.y
        );


        ctx.rotate(
          asteroide.rotacion
        );


        ctx.beginPath();


        const cantidad =
          asteroide
            .vertices
            .length;


        asteroide
          .vertices
          .forEach(
            (
              factor,
              indice
            ) => {
              const angulo =
                (
                  indice /
                  cantidad
                ) *
                Math.PI *
                2;


              const radio =
                asteroide
                  .radio *
                factor;


              const x =
                Math.cos(
                  angulo
                ) *
                radio;


              const y =
                Math.sin(
                  angulo
                ) *
                radio;


              if (
                indice === 0
              ) {
                ctx.moveTo(
                  x,
                  y
                );
              } else {
                ctx.lineTo(
                  x,
                  y
                );
              }
            }
          );


        ctx.closePath();


        ctx.strokeStyle =
          colores
            .asteroide;


        ctx.lineWidth =
          3;


        ctx.shadowColor =
          colores
            .asteroide;


        ctx.shadowBlur =
          10;


        ctx.stroke();


        ctx.restore();
      }


      ctx.shadowBlur =
        0;


      /*
      DISPAROS
      */

      for (
        const disparo
        of disparosRef.current
      ) {
        ctx.beginPath();


        ctx.arc(
          disparo.x,
          disparo.y,
          disparo.radio,
          0,
          Math.PI * 2
        );


        ctx.fillStyle =
          colores.disparo;


        ctx.shadowColor =
          colores.disparo;


        ctx.shadowBlur =
          14;


        ctx.fill();
      }


      ctx.shadowBlur =
        0;


      /*
      NAVE
      */

      const nave =
        naveRef.current;


      const visible =
        performance.now() >=
          nave
            .invulnerableHasta ||
        Math.floor(
          performance.now() /
          100
        ) %
          2 ===
          0;


      if (
        visible
      ) {
        ctx.save();


        ctx.translate(
          nave.x,
          nave.y
        );


        ctx.rotate(
          nave.angulo
        );


        ctx.strokeStyle =
          colores.nave;


        ctx.lineWidth =
          3;


        ctx.shadowColor =
          colores.nave;


        ctx.shadowBlur =
          17;


        ctx.beginPath();


        ctx.moveTo(
          nave.radio +
            9,
          0
        );


        ctx.lineTo(
          -nave.radio,
          nave.radio *
            0.74
        );


        ctx.lineTo(
          -nave.radio *
            0.55,
          0
        );


        ctx.lineTo(
          -nave.radio,
          -nave.radio *
            0.74
        );


        ctx.closePath();


        ctx.stroke();


        if (
          nave.acelerando
        ) {
          ctx.beginPath();


          ctx.moveTo(
            -nave.radio *
              0.55,
            nave.radio *
              0.35
          );


          ctx.lineTo(
            -nave.radio -
              18 -
              Math.random() *
                7,
            0
          );


          ctx.lineTo(
            -nave.radio *
              0.55,
            -nave.radio *
              0.35
          );


          ctx.strokeStyle =
            colores.disparo;


          ctx.stroke();
        }


        ctx.restore();
      }


      ctx.restore();
    }, [
      configuracion,
    ]);


  /*
  ==========================================
  LOOP PRINCIPAL
  ==========================================
  */

  useEffect(() => {
    ultimoTiempoRef.current =
      performance.now();


    const animar =
      (
        tiempo
      ) => {
        const delta =
          Math.min(
            2,

            (
              tiempo -
              ultimoTiempoRef
                .current
            ) /
              16.67
          );


        ultimoTiempoRef.current =
          tiempo;


        if (
          !estadoRef.current
            .pausado &&
          !estadoRef.current
            .gameOver
        ) {
          actualizarNave(
            naveRef.current,

            controlesRef.current,

            delta
          );


          asteroidesRef.current
            .forEach(
              (
                asteroide
              ) => {
                actualizarAsteroide(
                  asteroide,

                  delta
                );
              }
            );


          disparosRef.current
            .forEach(
              (
                disparo
              ) => {
                actualizarDisparo(
                  disparo,

                  delta
                );
              }
            );


          disparosRef.current =
            disparosRef.current
              .filter(
                (
                  disparo
                ) =>
                  disparo.vida >
                  0
              );


          resolverImpactos();


          revisarColisionNave();


          comprobarNivel();
        }


        dibujar();


        frameRef.current =
          requestAnimationFrame(
            animar
          );
      };


    frameRef.current =
      requestAnimationFrame(
        animar
      );


    return () => {
      if (
        frameRef.current
      ) {
        cancelAnimationFrame(
          frameRef.current
        );
      }
    };
  }, [
    comprobarNivel,
    dibujar,
    resolverImpactos,
    revisarColisionNave,
  ]);


  return (
    <div className="asteroids-juego">

      <div className="asteroids-hud">

        <div>
          <span>
            PUNTOS
          </span>

          <strong>
            {puntos}
          </strong>
        </div>


        <div>
          <span>
            VIDAS
          </span>

          <strong>
            {"♥".repeat(
              vidas
            )}
          </strong>
        </div>


        <div>
          <span>
            NIVEL
          </span>

          <strong>
            {nivel}
          </strong>
        </div>


        <div>
          <span>
            ASTEROIDES
          </span>

          <strong>
            {asteroidesRestantes}
          </strong>
        </div>

      </div>


      <div className="asteroids-canvas-wrapper">

        <canvas
          ref={
            canvasRef
          }
          width="1000"
          height="650"
          className="canvas-asteroids"
        />


        {pausado &&
          !gameOver && (
          <div className="overlay-estado-juego">

            <strong>
              ASTEROIDES
            </strong>


            <small>
              Pulsa ▶ para comenzar
            </small>


            <div className="instrucciones-asteroids">

              <span>
                ◀ ▶ Girar
              </span>


              <span>
                ▲ Acelerar
              </span>


              <span>
                A / ESPACIO Disparar
              </span>

            </div>

          </div>
        )}


        {avisoNivel && (
          <div className="aviso-nivel-asteroids">
            {avisoNivel}
          </div>
        )}


        {gameOver && (
          <div className="overlay-estado-juego">

            <strong>
              FIN DE LA PARTIDA
            </strong>


            <span>
              {puntos} puntos
            </span>


            <span>
              Nivel alcanzado:
              {" "}
              {nivel}
            </span>


            <button
              type="button"
              onClick={
                reiniciar
              }
            >
              JUGAR DE NUEVO
            </button>

          </div>
        )}

      </div>

    </div>
  );
}


export default Asteroids;