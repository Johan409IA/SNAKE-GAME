

import Juego from "./clases/game.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Crear la instancia ÚNICA del juego
  const juego = new Juego();
  // 2. Exponerla globalmente para que otros scripts puedan accederla.
  window.Juego = juego;



  // Construye la cuadrícula del área de juego según el tamaño dado
  function buildGrid(sizeN) {
    const area = document.querySelector(".snake-game-area");
    if (!area) return;

    let cellsContainer = area.querySelector(".cells-container");
    if (cellsContainer) area.removeChild(cellsContainer);

    cellsContainer = document.createElement("div");
    cellsContainer.className = "cells-container";
    cellsContainer.style.display = "grid";
    cellsContainer.style.gridTemplateColumns = `repeat(${sizeN}, 1fr)`;
    cellsContainer.style.gridTemplateRows = `repeat(${sizeN}, 1fr)`;
    cellsContainer.style.width = "100%";
    cellsContainer.style.height = "100%";

    const total = sizeN * sizeN;
    for (let i = 0; i < total; i++) {
      const c = document.createElement("div");
      c.className = "cell";
      c.style.boxSizing = "border-box";
      cellsContainer.appendChild(c);
    }
    area.insertBefore(
      cellsContainer,
      area.querySelector(".snake-head") || null
    );
  }
  // Actualiza los textos de modo de juego en la interfaz
  function updateModeText() {
    const MODE_DISPLAY = window.GameUtils.MODE_DISPLAY || {};
    const modeKey = localStorage.getItem("snakeMode") || "classic";

    const banner = document.querySelector(".mode-banner");
    if (banner)
      banner.textContent = `Modo: ${
        MODE_DISPLAY[modeKey] || "Modo"
      } - Presiona SPACE o haz click START para comenzar`;

    const modeInfo = document.querySelector(".mode-info");
    if (modeInfo) {
      const spans = modeInfo.querySelectorAll("span");
      if (spans.length > 0)
        spans[0].textContent = MODE_DISPLAY[modeKey] || "Modo";
      if (spans.length > 1)
        spans[1].textContent = `NIVEL 1 | ${MODE_DISPLAY[modeKey] || ""}`;
    }
  }

  // Esta función ahora usa las funciones de arriba y las de utils.js
  function applyAll() {
    // Usamos las funciones del objeto global GameUtils (de tu utils.js)
    const settings = window.GameUtils.readSettings();
    const sizeN =
      window.GameUtils.SIZE_MAP[settings.boardSize] ||
      window.GameUtils.SIZE_MAP.small;

    buildGrid(sizeN);

    const themeId =
      localStorage.getItem("arcade-snake-theme") ||
      localStorage.getItem("snakeTheme") ||
      settings.theme;

    window.GameUtils.applyTheme(themeId);
    updateModeText();
  }

  // --- AHORA SÍ, EJECUTAMOS LA LÓGICA PRINCIPAL ---
  applyAll(); // 1. Primero, configuramos la UI (grid, tema, texto)
  juego.iniciarJuego(); // 2. Luego, inicializamos la lógica del juego

  // --- CONFIGURACIÓN DE TODOS LOS LISTENERS ---
  document.addEventListener("keydown", handleKeyPress);
  const startButton = document.querySelector(".btn-start");
  if (startButton) {
    startButton.addEventListener("click", () => handleGameControlClick(juego));
  }

  // Listener para cerrar el modal de Game Over
  const modalCloseButton = document.getElementById("modalCloseButton");
  const gameOverModal = document.getElementById("gameOverModal");
  if (modalCloseButton && gameOverModal) {
    modalCloseButton.addEventListener("click", () => {
      gameOverModal.classList.remove("show");
    });
  }

  // Listener para cambios en los ajustes (desde utils.js)
  window.addEventListener("snakeSettingsChanged", () => {
    reactToSettingsChange(juego);
  });

  window.addEventListener("storage", () => {
    reactToSettingsChange(juego);
  });

  window.addEventListener("beforeunload", () => {
    if (juego.intervaloBucleJuego) clearInterval(juego.intervaloBucleJuego);
    if (juego.temporizador) juego.temporizador.detener();
  });
});

// --- FUNCIONES AUXILIARES ---
function reactToSettingsChange(juego) {
  applyAll();
  setTimeout(() => juego.iniciarJuego(), 100);
}
// Maneja las pulsaciones de teclas para controlar el juego
function handleKeyPress(event) {
  const key = event.key.toLowerCase();
  const juego = window.Juego || window.Game;

  if (key === " " || key === "spacebar") {
    event.preventDefault();
    if (juego.estadoJuego === "MENU" || juego.estadoJuego === "GAME_OVER") {
      juego.empezarJuego();
    } else if (juego.estadoJuego === "PLAYING") {
      juego.pausarJuego();
    } else if (juego.estadoJuego === "PAUSED") {
      juego.reanudarJuego();
    }
    return;
  }

  if (juego.estadoJuego !== "PLAYING") return;

  const keyMap = {
    arrowup: "UP",
    w: "UP",
    arrowdown: "DOWN",
    s: "DOWN",
    arrowleft: "LEFT",
    a: "LEFT",
    arrowright: "RIGHT",
    d: "RIGHT",
  };
  const direction = keyMap[key];
  if (direction) {
    event.preventDefault();
    juego.serpiente.establecerDireccion(direction);
  }
}
// Maneja el clic en el botón de inicio/pausa/reanudar del juego
function handleGameControlClick(juego) {
  if (juego.estadoJuego === "MENU" || juego.estadoJuego === "GAME_OVER") {
    juego.empezarJuego();
  } else if (juego.estadoJuego === "PLAYING") {
    juego.pausarJuego();
  } else if (juego.estadoJuego === "PAUSED") {
    juego.reanudarJuego();
  }
}
