// Importamos las clases que necesita Juego
import Temporizador from "./temporizador.js";
import Serpiente from "./serpiente.js";
import Comida from "./comida.js";
import Obstaculos from "./obstaculos.js";

class Juego {
  constructor() {
    // --- Propiedades del Juego ---
    this.estadoJuego = "MENU"; // 'MENU', 'JUGANDO', 'GAME_OVER', 'PAUSADO'
    this.modoActual = "classic";
    this.puntuacion = 0;
    this.nivel = 1;
    this.tamanoCuadricula = 0;
    this.numCeldasX = 15;
    this.numCeldasY = 15;
    this.intervaloBucleJuego = null;
    this.comidasConsumidas = 0;
    this.velocidadBase = 150;

    // --- Instancias de otras clases ---
    this.serpiente = new Serpiente();
    this.comida = new Comida();
    this.obstaculos = new Obstaculos();
    this.temporizador = new Temporizador();
  }

  // --- Métodos de Ciclo de Vida del Juego ---
  iniciarJuego() {
    if (this.intervaloBucleJuego) {
      clearInterval(this.intervaloBucleJuego);
      this.intervaloBucleJuego = null;
    }
    this.temporizador.detener();

    // Leer configuraciones centralizadas (lógica original)
    const settings = this.leerConfiguracion();
    const modeKey = localStorage.getItem("snakeMode") || "classic";
    const sizeN =
      this.MAPA_TAMANOS[settings.boardSize] || this.MAPA_TAMANOS.small;

    this.modoActual = modeKey;
    this.numCeldasX = sizeN;
    this.numCeldasY = sizeN;
    this.puntuacion = 0;
    this.nivel = 1;
    this.comidasConsumidas = 0;
    this.estadoJuego = "MENU";

    // Calcular tamanoCuadricula (lógica original)
    const gameArea = document.querySelector(".snake-game-area");
    if (gameArea) {
      const rect = gameArea.getBoundingClientRect();
      const areaWidth = rect.width || gameArea.clientWidth || 500;
      const areaHeight = rect.height || gameArea.clientHeight || 500;
      this.tamanoCuadricula = Math.min(
        areaWidth / this.numCeldasX,
        areaHeight / this.numCeldasY
      );
    }

    // Inicializar serpiente
    const startX = Math.floor(this.numCeldasX / 2);
    const startY = Math.floor(this.numCeldasY / 2);
    this.serpiente.iniciar(startX, startY, 3);

    // Configurar el Temporizador usando la nueva instancia
    if (this.modoActual === "timeAttack") {
      this.temporizador = new Temporizador("COUNTDOWN", 120);
      // Asignamos la función de callback para cuando el tiempo se acabe
      this.temporizador.alTiempoAgotado = () => this.terminarJuego();
    } else {
      this.temporizador = new Temporizador("STOPWATCH");
    }
    this.temporizador.mostrar();

    // Inicializar obstáculos y comida
    if (this.modoActual === "obstacles") {
      this.obstaculos.generarAleatorio(
        this.serpiente.cuerpo,
        this.numCeldasX,
        this.numCeldasY
      );
    } else {
      this.obstaculos.limpiar();
    }
    this.comida.generar(
      this.serpiente.cuerpo,
      this.obstaculos.lista,
      this.numCeldasX,
      this.numCeldasY
    );

    this.actualizarUI();
    this.renderizar();
  }
// Inicia el bucle principal del juego
  empezarJuego() {
    if (this.estadoJuego === "PLAYING") return;
    if (this.intervaloBucleJuego) clearInterval(this.intervaloBucleJuego);
    if (this.estadoJuego === "MENU" || this.estadoJuego === "GAME_OVER") {
      this.iniciarJuego();
    }

    this.estadoJuego = "PLAYING";
    this.temporizador.iniciar();

    let speed = this.velocidadBase;
    if (this.modoActual === "timeAttack") {
      speed = Math.max(50, this.velocidadBase - (this.nivel - 1) * 10);
    }

    this.intervaloBucleJuego = setInterval(() => this.actualizar(), speed);
    this.actualizarBannerModo("JUGANDO");
  }
// Pausa el juego actual 
  pausarJuego() {
    if (this.estadoJuego !== "PLAYING") return;
    this.estadoJuego = "PAUSED";
    this.temporizador.detener();
    if (this.intervaloBucleJuego) {
      clearInterval(this.intervaloBucleJuego);
      this.intervaloBucleJuego = null;
    }
    this.actualizarBannerModo("PAUSADO (Presiona SPACE para continuar)");
  }

  reanudarJuego() {
    if (this.estadoJuego !== "PAUSED") return;
    this.empezarJuego();
  }
// Termina el juego y muestra la pantalla de Game Over
  terminarJuego() {
    this.estadoJuego = "GAME_OVER";
    this.temporizador.detener();
    if (this.intervaloBucleJuego) {
      clearInterval(this.intervaloBucleJuego);
      this.intervaloBucleJuego = null;
    }

    const bestScoreKey = `snakeBestScore_${this.modoActual}`;
    const currentBest = parseInt(localStorage.getItem(bestScoreKey) || "0", 10);
    if (this.puntuacion > currentBest) {
      localStorage.setItem(bestScoreKey, this.puntuacion.toString());
    }
    this.actualizarUI();

    if (this.modoActual !== "endless" && window.AudioManager) {
      window.AudioManager.playSoundEffect("gameover");
    }

    const modal = document.getElementById("gameOverModal");
    if (modal) {
      document.getElementById("modalScore").textContent = String(
        this.puntuacion
      ).padStart(6, "0");
      document.getElementById("modalLevel").textContent = String(
        this.nivel
      ).padStart(2, "0");
      modal.classList.add("show");
    }
    this.actualizarBannerModo(
      `GAME OVER - Puntuación: ${this.puntuacion} - Presiona SPACE o haz click START para jugar de nuevo`
    );
  }

  // --- Métodos de Actualización y Renderizado ---
  actualizar() {
    if (this.estadoJuego !== "PLAYING") return;

    this.serpiente.mover();

    if (this.modoActual === "endless") {
      const head = this.serpiente.cuerpo[0];
      if (head.x < 0) head.x = this.numCeldasX - 1;
      if (head.x >= this.numCeldasX) head.x = 0;
      if (head.y < 0) head.y = this.numCeldasY - 1;
      if (head.y >= this.numCeldasY) head.y = 0;
    }

    let collision = false;
    if (this.modoActual !== "endless") {
      const head = this.serpiente.cuerpo[0];
      if (!head || typeof head.x !== "number" || typeof head.y !== "number") {
        console.error("Coordenadas de cabeza inválidas:", head);
        return;
      }
      collision = this.serpiente.verificarColision(
        true,
        true,
        this.numCeldasX,
        this.numCeldasY
      );
      if (!collision && this.modoActual === "obstacles") {
        for (const obs of this.obstaculos.lista) {
          if (head.x === obs.x && head.y === obs.y) {
            collision = true;
            break;
          }
        }
      }
    }

    if (collision) {
      this.terminarJuego();
      return;
    }

    const head = this.serpiente.cuerpo[0];
    if (
      head.x === this.comida.posicion.x &&
      head.y === this.comida.posicion.y
    ) {
      if (window.AudioManager) window.AudioManager.playSoundEffect("eat");
      this.puntuacion += 10 * this.nivel;
      this.comidasConsumidas++;

      if (this.modoActual !== "endless") {
        this.serpiente.crecer();
      }

      if (this.comidasConsumidas % 5 === 0) {
        this.nivel++;
        if (this.modoActual === "timeAttack") {
          this.intervaloBucleJuego && clearInterval(this.intervaloBucleJuego);
          const newSpeed = Math.max(
            50,
            this.velocidadBase - (this.nivel - 1) * 10
          );
          this.intervaloBucleJuego = setInterval(
            () => this.actualizar(),
            newSpeed
          );
        }
      }

      this.comida.generar(
        this.serpiente.cuerpo,
        this.obstaculos.lista,
        this.numCeldasX,
        this.numCeldasY
      );
      this.actualizarUI();
    }

    this.renderizar();
    if (this.modoActual === "obstacles") {
      this.obstaculos.renderizar();
    }
  }
// Llama al motor de renderizado para dibujar el estado actual del juego
  renderizar() {
    if (window.Renderer && typeof window.Renderer.render === "function") {
      window.Renderer.render(this);
    }
  }

  // Método para Actualizar la interfaz de Usuario
  actualizarUI() {
    const findValueByLabel = (labelText) => {
      const rows = document.querySelectorAll(".status-row");
      for (const row of rows) {
        const label = row.querySelector("label");
        if (label && label.textContent.trim() === labelText) {
          return row.querySelector(".value");
        }
      }
      return null; 
    };

    // --- PUNTUACIÓN ---
    const scoreEl = findValueByLabel("PUNTUACION:");
    if (scoreEl) {
      scoreEl.textContent = String(this.puntuacion).padStart(6, "0");
    }

    // --- NIVEL ---
    const levelEl = findValueByLabel("NIVEL:");
    if (levelEl) {
      levelEl.textContent = String(this.nivel).padStart(2, "0");
    }

    // --- MEJOR PUNTUACIÓN ---
    const bestScoreKey = `snakeBestScore_${this.modoActual}`;
    const bestScore = parseInt(localStorage.getItem(bestScoreKey) || "0", 10);
    const bestEl = findValueByLabel("MEJOR:");
    if (bestEl) {
      bestEl.textContent = String(bestScore).padStart(6, "0");
    }

    // --- BARRA DE PROGRESO ---
    const progressFill = document.querySelector(".progress-fill");
    if (progressFill) {
      const progress = ((this.comidasConsumidas % 5) / 5) * 100;
      progressFill.style.width = `${progress}%`;
    }

    // --- TEXTO DE SIGUIENTE NIVEL ---
    const nextLevel = document.querySelector(".next-level");
    if (nextLevel) {
      const remaining = 5 - (this.comidasConsumidas % 5);
      nextLevel.innerHTML = `SIGUIENTE NIVEL<br />${
        remaining * 10 * this.nivel
      } PTS. RESTANTES`;
    }

    // --- INFORMACIÓN DEL MODO ---
    const modeInfo = document.querySelector(".mode-info");
    if (modeInfo) {
      const MODE_DISPLAY =
        (window.GameUtils && window.GameUtils.MODE_DISPLAY) || {};
      const spans = modeInfo.querySelectorAll("span");
      if (spans.length > 0) {
        spans[0].textContent = MODE_DISPLAY[this.modoActual] || "Modo";
      }
      if (spans.length > 1) {
        spans[1].textContent = `NIVEL ${this.nivel} | ${
          MODE_DISPLAY[this.modoActual] || ""
        }`;
      }
    }
  }

  // Método para leer la configuración del juego
  leerConfiguracion() {
    if (
      !window.GameUtils ||
      typeof window.GameUtils.readSettings !== "function"
    ) {
      console.error("GameUtils no está cargado.");
      return {
        boardSize: "small",
        grid: true,
        foodShape: "square",
        theme: "classic",
      };
    }
    return window.GameUtils.readSettings();
  }
  // Método para actualizar el banner del modo de juego
  actualizarBannerModo(status) {
    const banner = document.querySelector(".mode-banner");
    if (banner) {
      const MODE_DISPLAY =
        (window.GameUtils && window.GameUtils.MODE_DISPLAY) || {};
      banner.textContent = `Modo: ${
        MODE_DISPLAY[this.modoActual] || "Modo"
      } - ${status}`;
    }
  }

  // Exponemos las constantes que se usaban en el original
  get MAPA_TAMANOS() {
    return (window.GameUtils && window.GameUtils.SIZE_MAP) || { small: 15 };
  }
}

export default Juego;
