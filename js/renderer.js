// archivo para reenderizar elementos del juego en el área de juego
(function () {
  // Renderiza la serpiente y la comida en el área de juego
  function render(juego) {
    const gameArea = document.querySelector(".snake-game-area");
    if (!gameArea) return;

    const rect = gameArea.getBoundingClientRect();
    const areaWidth = rect.width || gameArea.clientWidth;
    const areaHeight = rect.height || gameArea.clientHeight;
    const cellWidth = areaWidth / juego.numCeldasX;
    const cellHeight = areaHeight / juego.numCeldasY;
    const cellSize = Math.min(cellWidth, cellHeight);

    const snakeHead = gameArea.querySelector(".snake-head");
    if (snakeHead && juego.serpiente.cuerpo.length > 0) {
      const head = juego.serpiente.cuerpo[0];
      snakeHead.style.left = `${head.x * cellWidth}px`;
      snakeHead.style.top = `${head.y * cellHeight}px`;
      snakeHead.style.width = `${cellSize}px`;
      snakeHead.style.height = `${cellSize}px`;
      snakeHead.style.display = "block";
      snakeHead.style.position = "absolute";
      snakeHead.style.transform = "none";
    }

    // Aqui se renderiza el cuerpo de la serpiente
    const existingBody = gameArea.querySelectorAll(".snake-body-segment");
    existingBody.forEach((el) => el.remove());
    for (let i = 1; i < juego.serpiente.cuerpo.length; i++) {
      const segment = juego.serpiente.cuerpo[i];
      const bodyEl = document.createElement("div");
      bodyEl.className = "snake-body-segment";
      bodyEl.style.position = "absolute";
      bodyEl.style.left = `${segment.x * cellWidth}px`;
      bodyEl.style.top = `${segment.y * cellHeight}px`;
      bodyEl.style.width = `${cellSize}px`;
      bodyEl.style.height = `${cellSize}px`;
      bodyEl.style.transform = "none";
      bodyEl.style.backgroundColor = "var(--color-primary)";
      bodyEl.style.border = "1px solid var(--color-secondary)";
      bodyEl.style.boxSizing = "border-box";
      bodyEl.style.zIndex = "2";
      gameArea.appendChild(bodyEl);
    }

    // La comida
    const foodEl = gameArea.querySelector(".food");
    if (foodEl) {
      foodEl.style.position = "absolute";
      foodEl.style.left = `${juego.comida.posicion.x * cellWidth}px`;
      foodEl.style.top = `${juego.comida.posicion.y * cellHeight}px`;
      foodEl.style.width = `${cellSize}px`;
      foodEl.style.height = `${cellSize}px`;
      foodEl.style.transform = "none";
      foodEl.style.right = "auto";
      foodEl.style.display = "block";
      foodEl.setAttribute("data-game-controlled", "true");
    }
  }

  window.Renderer = { render };
})();
