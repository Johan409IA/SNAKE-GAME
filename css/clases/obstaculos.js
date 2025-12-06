

class Obstaculos {
  // El constructor inicializa las propiedades de la instancia.
  constructor() {
    this.lista = [];
    this.fijo = true; // Esta propiedad podría usarse para decidir si los obstáculos se regeneran en cada nivel o son fijos.
  }


  
   //Limpia la lista de obstáculos y elimina los elementos visuales del DOM.

  limpiar() {
    this.lista = [];
    const gameArea = document.querySelector(".snake-game-area");
    if (gameArea) {
      const obstacles = gameArea.querySelectorAll(".obstacle");
      obstacles.forEach((obs) => obs.remove());
    }
  }

  /**
   * Genera una lista de obstáculos en posiciones aleatorias, evitando el cuerpo de la serpiente.
  */
 
  generarAleatorio(cuerpoSerpiente, numCeldasX, numCeldasY) {
    this.limpiar();
    const occupied = new Set();
    cuerpoSerpiente.forEach((segment) => occupied.add(`${segment.x},${segment.y}`));

    // Calcula un número de obstáculos basado en el tamaño del tablero (aproximadamente 5% del área)
    const numObstacles = Math.floor((numCeldasX * numCeldasY) / 20);
    const obstacles = [];

    for (
      let i = 0;
      i < numObstacles && obstacles.length < numObstacles;
      i++
    ) {
      const x = Math.floor(Math.random() * numCeldasX);
      const y = Math.floor(Math.random() * numCeldasY);
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        obstacles.push({ x, y });
        occupied.add(key);
      }
    }

    this.lista = obstacles;
    this.renderizar();
  }

  /**
   * Dibuja los obstáculos en el área de juego.
   */
  renderizar() {
    // Dependencia del objeto global Juego/Game para obtener las dimensiones del tablero.
    const juego = window.Juego || window.Game;
    if (!juego) {
      console.error("El objeto global window.Juego no está definido. No se pueden renderizar los obstáculos.");
      return;
    }

    const gameArea = document.querySelector(".snake-game-area");
    if (!gameArea) return;

    // Elimina los obstáculos existentes antes de dibujar los nuevos.
    const existing = gameArea.querySelectorAll(".obstacle");
    existing.forEach((el) => el.remove());

    const rect = gameArea.getBoundingClientRect();
    const areaWidth = rect.width || gameArea.clientWidth;
    const areaHeight = rect.height || gameArea.clientHeight;
    const cellWidth = areaWidth / juego.numCeldasX;
    const cellHeight = areaHeight / juego.numCeldasY;
    const cellSize = Math.min(cellWidth, cellHeight);

    this.lista.forEach((obs) => {
      const obstacleEl = document.createElement("div");
      obstacleEl.className = "obstacle";
      obstacleEl.style.position = "absolute";
      obstacleEl.style.width = `${cellSize}px`;
      obstacleEl.style.height = `${cellSize}px`;
      obstacleEl.style.left = `${obs.x * cellWidth}px`;
      obstacleEl.style.top = `${obs.y * cellHeight}px`;
      obstacleEl.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
      obstacleEl.style.border = "2px solid #ff0000";
      obstacleEl.style.boxSizing = "border-box";
      obstacleEl.style.zIndex = "1";
      gameArea.appendChild(obstacleEl);
    });
  }
}

// Exportamos la clase para poder usarla como un módulo ES6.
export default Obstaculos;