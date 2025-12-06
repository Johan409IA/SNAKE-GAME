
// Clase Temporizador para manejar un temporizador de cuenta regresiva o cronómetro.
class Temporizador {
  constructor(tipo = 'STOPWATCH', tiempoInicial = 0) {
    this.tiempoActual = tipo === 'COUNTDOWN' ? tiempoInicial : 0;
    this.estaCorriendo = false;
    this.tipo = tipo; // 'STOPWATCH' or 'COUNTDOWN'
    this.intervaloId = null;
    this.tiempoInicial = tiempoInicial;
  }
// Reinicia el temporizador al estado inicial.
  reiniciar() {
    this.detener();
    this.tiempoActual = this.tipo === "COUNTDOWN" ? this.tiempoInicial : 0;
    this.mostrar();
  }
// Inicia el temporizador.
  iniciar() {
    if (this.estaCorriendo) return;
    this.estaCorriendo = true;
    this.intervaloId = setInterval(() => {
      this.actualizar();
    }, 1000);
  }
// Detiene el temporizador.
  detener() {
    this.estaCorriendo = false;
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
      this.intervaloId = null;
    }
  }
// Actualiza el tiempo del temporizador y lo muestra.
  actualizar() {
    if (this.tipo === "COUNTDOWN") {
      this.tiempoActual--;
      if (this.tiempoActual <= 0) {
        this.tiempoActual = 0;
        this.detener();
        // Notificamos al juego que el tiempo se acabó
        if (this.alTiempoAgotado && typeof this.alTiempoAgotado === 'function') {
          this.alTiempoAgotado();
        }
      }
    } else {
      this.tiempoActual++;
    }
    this.mostrar();
  }
// Muestra el tiempo actual en el formato MM:SS en el elemento HTML correspondiente.
  mostrar() {
    const minutes = Math.floor(this.tiempoActual / 60);
    const seconds = this.tiempoActual % 60;
    const timeString = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    // CAMBIO CLAVE: Ahora buscamos el span con la clase '.temporizador'
    const timerElement = document.querySelector('[data-timer]');

    if (timerElement) {
        timerElement.textContent = timeString;
    }
}
}

export default Temporizador;