function IconoTetris() {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Tetris"
    >
      <defs>
        <filter id="brillo-tetris">
          <feGaussianBlur
            stdDeviation="3"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        className="icono-svg-trazo"
        filter="url(#brillo-tetris)"
      >
        <rect x="27" y="23" width="24" height="24" rx="4" />
        <rect x="53" y="23" width="24" height="24" rx="4" />
        <rect x="53" y="49" width="24" height="24" rx="4" />
        <rect x="79" y="49" width="24" height="24" rx="4" />

        <path d="M27 87H93" />
        <path d="M37 97H83" />
      </g>
    </svg>
  );
}


function IconoAsteroides() {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Asteroides"
    >
      <defs>
        <filter id="brillo-asteroides">
          <feGaussianBlur
            stdDeviation="3"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        className="icono-svg-trazo"
        filter="url(#brillo-asteroides)"
      >
        <path
          className="nave-svg"
          d="
            M60 18
            L79 72
            L60 62
            L41 72
            Z
          "
        />

        <path d="M60 62V91" />
        <path d="M51 82L60 98L69 82" />

        <circle cx="26" cy="33" r="7" />
        <circle cx="94" cy="37" r="5" />
        <circle cx="91" cy="83" r="8" />

        <path d="M20 33L15 27" />
        <path d="M98 32L104 27" />
        <path d="M95 89L102 95" />
      </g>
    </svg>
  );
}


function IconoFlappy() {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Flappy"
    >
      <defs>
        <filter id="brillo-flappy">
          <feGaussianBlur
            stdDeviation="3"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        className="icono-svg-trazo"
        filter="url(#brillo-flappy)"
      >
        <circle
          className="flappy-cuerpo"
          cx="57"
          cy="56"
          r="25"
        />

        <path
          className="flappy-ala"
          d="
            M43 56
            C27 47 24 65 40 72
            C49 75 54 69 57 63
          "
        />

        <path
          className="flappy-pico"
          d="
            M79 51
            L103 59
            L79 66
            Z
          "
        />

        <circle
          className="flappy-ojo"
          cx="68"
          cy="47"
          r="7"
        />

        <circle
          className="flappy-pupila"
          cx="70"
          cy="47"
          r="2.5"
        />

        <path d="M28 90H91" />
        <path d="M38 100H81" />
      </g>
    </svg>
  );
}


function IconoPacman() {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Pac-Man"
    >
      <defs>
        <filter id="brillo-pacman">
          <feGaussianBlur
            stdDeviation="3"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#brillo-pacman)">
        <path
          className="pacman-svg"
          d="
            M54 21
            A39 39 0 1 0 54 99
            A39 39 0 0 0 91 72
            L59 60
            L91 48
            A39 39 0 0 0 54 21
            Z
          "
        />

        <circle
          className="pacman-ojo-svg"
          cx="58"
          cy="39"
          r="4"
        />

        <circle
          className="pacman-punto-svg"
          cx="101"
          cy="60"
          r="6"
        />
      </g>
    </svg>
  );
}


function IconoJuego({
  codigo,
}) {
  if (codigo === "tetris") {
    return <IconoTetris />;
  }


  if (codigo === "asteroids") {
    return <IconoAsteroides />;
  }


  if (codigo === "flappy") {
    return <IconoFlappy />;
  }


  if (codigo === "pacman") {
    return <IconoPacman />;
  }


  return null;
}


export default IconoJuego;