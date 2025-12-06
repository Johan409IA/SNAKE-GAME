/**
 * Modulo de utilidades para el juego Snake 
 * Refactorizado a clases para mejor organización y mantenibilidad
 */

/**
 * Clase para gestionar la configuración del juego
 * Maneja lectura/escritura de settings y gestión de temas
 */
class GameConfig {
  // ===== CONSTANTES ESTÁTICAS =====
  static DEFAULT_THEME_ID = 'neonGreen';
  
  static DEFAULTS = {
    boardSize: "small",
    grid: true,
    foodShape: "square",
    theme: GameConfig.DEFAULT_THEME_ID,
  };

  static SIZE_MAP = {
    small: 15,
    medium: 20,
    large: 25,
  };

  static MODE_DISPLAY = {
    classic: "Modo Clásico",
    timeAttack: "Contra el Tiempo",
    endless: "Modo Sin Fin",
    obstacles: "Modo Obstáculos",
  };

  // ===== MÉTODOS DE CONFIGURACIÓN =====

  /**
   * Lee las configuraciones guardadas en localStorage
   */
  static readSettings() {
    try {
      const raw = localStorage.getItem("snakeSettings");
      return raw ? JSON.parse(raw) : { ...GameConfig.DEFAULTS };
    } catch (e) {
      console.warn("Error al leer configuraciones:", e);
      return { ...GameConfig.DEFAULTS };
    }
  }

  /**
   * Guarda las configuraciones en localStorage
   */
  static writeSettings(settings) {
    try {
      localStorage.setItem("snakeSettings", JSON.stringify(settings));

      // Claves individuales para compatibilidad con código legacy
      localStorage.setItem("snakeTheme", settings.theme || GameConfig.DEFAULTS.theme);
      localStorage.setItem(
        "snakeBoardSize",
        settings.boardSize || GameConfig.DEFAULTS.boardSize
      );
      localStorage.setItem("snakeGrid", settings.grid ? "1" : "0");
      localStorage.setItem(
        "snakeFoodShape",
        settings.foodShape || GameConfig.DEFAULTS.foodShape
      );

      // Disparar evento personalizado
      window.dispatchEvent(
        new CustomEvent("snakeSettingsChanged", { detail: settings })
      );

      return true;
    } catch (e) {
      console.error("Error al guardar configuraciones:", e);
      return false;
    }
  }

  /**
   * Obtiene el ID del tema actual
   */
  static getCurrentThemeId() {
    return (
      localStorage.getItem("arcade-snake-theme") ||
      localStorage.getItem("snakeTheme") ||
      GameConfig.DEFAULT_THEME_ID
    );
  }

  /**
   * Aplica un tema visual (fallback si applyThemeColors no existe)
   */
  static applyTheme(themeId) {
    if (typeof window.applyThemeColors === "function") {
      return window.applyThemeColors(themeId, {
        persist: false,
        dispatchEvent: false,
      });
    }

    console.warn(
      `La función 'applyThemeColors' no está cargada. No se puede aplicar el tema: ${themeId}`
    );
    return null;
  }
}

/**
 * Clase para validaciones del juego
 * Proporciona métodos estáticos para validar datos
 */
class GameValidators {
  /**
   * Valida coordenadas de una posición
   */
  static isValidPosition(pos) {
    return (
      pos &&
      typeof pos.x === "number" &&
      typeof pos.y === "number" &&
      !isNaN(pos.x) &&
      !isNaN(pos.y)
    );
  }

  /**
   * Valida dimensiones del tablero
   */
  static isValidBoardSize(width, height) {
    return (
      typeof width === "number" &&
      typeof height === "number" &&
      !isNaN(width) &&
      !isNaN(height) &&
      width > 0 &&
      height > 0
    );
  }
}

// ===== COMPATIBILIDAD HACIA ATRÁS =====
// Mantener GameUtils para código legacy que aún lo usa
window.GameUtils = {
  // Constantes
  DEFAULTS: GameConfig.DEFAULTS,
  SIZE_MAP: GameConfig.SIZE_MAP,
  MODE_DISPLAY: GameConfig.MODE_DISPLAY,
  DEFAULT_THEME_ID: GameConfig.DEFAULT_THEME_ID,

  // Funciones de configuración
  readSettings: GameConfig.readSettings.bind(GameConfig),
  writeSettings: GameConfig.writeSettings.bind(GameConfig),
  getCurrentThemeId: GameConfig.getCurrentThemeId.bind(GameConfig),
  applyTheme: GameConfig.applyTheme.bind(GameConfig),

  // Funciones de validación
  isValidPosition: GameValidators.isValidPosition.bind(GameValidators),
  isValidBoardSize: GameValidators.isValidBoardSize.bind(GameValidators),
};

// Exponer las nuevas clases
window.GameConfig = GameConfig;
window.GameValidators = GameValidators;

console.log("GameConfig y GameValidators cargados correctamente");
