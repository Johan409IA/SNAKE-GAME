
class Comida {
  // El constructor inicializa las propiedades de la instancia.
  // Para la comida, solo necesitamos establecer su posición inicial.
  constructor() {
    this.posicion = { x: 0, y: 0 };
  }

  generar(cuerpoSerpiente, listaObstaculos, numCeldasX, numCeldasY) {
    // Creamos un Set para almacenar todas las posiciones ocupadas.
    // Usar un Set es más eficiente para búsquedas que un array.
    const occupied = new Set();
    cuerpoSerpiente.forEach((segment) => occupied.add(`${segment.x},${segment.y}`));
    listaObstaculos.forEach((obs) => occupied.add(`${obs.x},${obs.y}`));

    // Buscamos todas las celdas disponibles.
    const available = [];
    for (let x = 0; x < numCeldasX; x++) {
      for (let y = 0; y < numCeldasY; y++) {
        if (!occupied.has(`${x},${y}`)) {
          available.push({ x, y });
        }
      }
    }

    // Si no hay celdas disponibles (caso extremo), la colocamos en el centro.
    if (available.length === 0) {
      this.posicion = {
        x: Math.floor(numCeldasX / 2),
        y: Math.floor(numCeldasY / 2),
      };
      return;
    }

    // Elegimos una posición aleatoria de las disponibles.
    const randomIndex = Math.floor(Math.random() * available.length);
    this.posicion = available[randomIndex];
  }
}

// Exportamos la clase para poder usarla como un módulo ES6.
export default Comida;
// También la exponemos globalmente para compatibilidad con otros scripts.
window.Comida = Comida;