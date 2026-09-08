function ResumenGeneral() {
  return (
    <section className="resumen-general">

      <div className="resumen-texto">

        <span className="resumen-etiqueta">
          ARCADE 100% LOCAL
        </span>


        <h1>
          Juega al instante.
          <br />

          <span>
            Sin tiempos de espera.
          </span>
        </h1>


        <p>
          Cuatro juegos clásicos
          adaptados para computadora
          y teléfono, con controles
          por teclado y pantalla táctil.
        </p>


        <div className="caracteristicas-resumen">

          <span>
            ✓ Carga inmediata
          </span>

          <span>
            ✓ Touch responsive
          </span>

          <span>
            ✓ Teclado
          </span>

          <span>
            ✓ localStorage
          </span>

        </div>

      </div>


      <div
        className="visual-resumen"
        aria-hidden="true"
      >
        <div className="orbita orbita-1" />
        <div className="orbita orbita-2" />

        <div className="nucleo-arcade">
          RCC
        </div>

        <span className="particula particula-1">
          ▦
        </span>

        <span className="particula particula-2">
          △
        </span>

        <span className="particula particula-3">
          ◆
        </span>

        <span className="particula particula-4">
          ◉
        </span>
      </div>

    </section>
  );
}


export default ResumenGeneral;