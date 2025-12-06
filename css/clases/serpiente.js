/* Snake Module - como una clase ES6 */

class Serpiente {
  // El constructor se ejecuta automáticamente cuando se crea una nueva instancia con `new Serpiente()`.
  constructor(startX, startY, initialLength = 3) {
    this.iniciar(startX, startY, initialLength);
  }

// Inicializa la serpiente en una posición dada con una longitud inicial.
  iniciar(startX, startY, initialLength = 3) {
    this.cuerpo = [];
    for (let i = 0; i < initialLength; i++) {
      this.cuerpo.push({ x: startX - i, y: startY });
    }
    this.direccion = "RIGHT";
    this.siguienteDireccion = "RIGHT";
    this.crecimientoPendiente = 0;
  }

  /**
   * Establece la próxima dirección de la serpiente.
   * Evita que la serpiente pueda ir en la dirección opuesta a la actual.
   */
  establecerDireccion(nuevaDir) {
    const opposites = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    if (opposites[nuevaDir] === this.direccion) return;
    this.siguienteDireccion = nuevaDir;
  }

  /**
   * Mueve la serpiente un paso en la dirección actual.
   */
  mover() {
    this.direccion = this.siguienteDireccion;
    const head = { ...this.cuerpo[0] };
    const dirMap = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    };
    const delta = dirMap[this.direccion];
    head.x += delta.x;
    head.y += delta.y;
    this.cuerpo.unshift(head);
    if (this.crecimientoPendiente > 0) this.crecimientoPendiente--;
    else this.cuerpo.pop();
  }

  /**
   * Hace que la serpiente crezca en el siguiente movimiento.
   */
  crecer() {
    this.crecimientoPendiente++;
  }

  /**
   * Verifica si la cabeza de la serpiente ha chocado con las paredes o con su propio cuerpo.
   */
  verificarColision(verificarParedes, verificarPropio, numCeldasX, numCeldasY) {
    const head = this.cuerpo[0];
    if (verificarParedes) {
      if (
        head.x < 0 ||
        head.x >= numCeldasX ||
        head.y < 0 ||
        head.y >= numCeldasY
      )
        return true;
    }
    if (verificarPropio) {
      for (let i = 1; i < this.cuerpo.length; i++) {
        if (head.x === this.cuerpo[i].x && head.y === this.cuerpo[i].y)
          return true;
      }
    }
    return false;
  }
}


export default Serpiente;

window.Serpiente = Serpiente;