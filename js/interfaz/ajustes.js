(function () {

  // ===== MAPEO DE FORMAS DE COMIDA=====

  function getGameUtils() {
    if (window.GameUtils) {
      return window.GameUtils;
    }

    // Fallback de seguridad si utils.js falla en cargar
    console.error("GameUtils no está cargado. Usando fallbacks en ajustes.js.");
    const dummyDefaults = {
      boardSize: "small",
      grid: true,
      foodShape: "square",
      theme: "classic",
    };
    return {
      DEFAULTS: dummyDefaults,
      readSettings: () => ({ ...dummyDefaults }),
      writeSettings: () => {},
      applyTheme: () => {},
    };
  }



  // ===== INICIALIZACIÓN AL CARGAR LA PÁGINA =====
  document.addEventListener("DOMContentLoaded", () => {
    // MEJORA: Obtener utilidades y valores por defecto desde GameUtils
    const utils = getGameUtils();
    const DEFAULTS = utils.DEFAULTS;
    const settings = utils.readSettings();

    // Aplica el tema inmediatamente
    utils.applyTheme(
      localStorage.getItem("arcade-snake-theme") ||
        localStorage.getItem("snakeTheme") ||
        settings.theme
    );

    // ===== CONFIGURA RADIO BUTTONS DE TAMAÑO DE TABLERO =====
    const boardRadios = document.querySelectorAll('input[name="board-size"]');
    boardRadios.forEach((r) => {
      if (r.value === settings.boardSize) r.checked = true;
    });

    // ===== CONFIGURA CHECKBOX DE CUADRÍCULA =====
    const gridCheckbox = document.querySelector(
      '.toggle-switch input[type="checkbox"]'
    );
    if (gridCheckbox) {
      gridCheckbox.checked = !!settings.grid;
    }

    // ===== CONFIGURA RADIO BUTTONS DE FORMA DE COMIDA =====
    const foodRadios = document.querySelectorAll('input[name="food-shape"]');
    foodRadios.forEach((r) => {
      if (r.value === settings.foodShape) r.checked = true;
    });

    // ===== MANEJADOR DEL BOTÓN GUARDAR =====
    const saveButton = document.getElementById("save-button");
    if (saveButton) {
      saveButton.addEventListener("click", () => {
        const newSettings = {
          boardSize:
            (document.querySelector('input[name="board-size"]:checked') || {})
              .value || DEFAULTS.boardSize, 
          grid: !!(
            document.querySelector('.toggle-switch input[type="checkbox"]') ||
            {}
          ).checked,
          foodShape:
            (document.querySelector('input[name="food-shape"]:checked') || {})
              .value || DEFAULTS.foodShape, 
          theme:
            localStorage.getItem("arcade-snake-theme") ||
            localStorage.getItem("snakeTheme") ||
            DEFAULTS.theme, 
        };

        
        utils.writeSettings(newSettings);

        
        const originalHTML = saveButton.innerHTML;
        saveButton.innerHTML =
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="save-icon"><path d="M20 6L9 17l-5-5" stroke="#00ff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> GUARDADO';
        setTimeout(() => {
          saveButton.innerHTML = originalHTML;
        }, 1200);
      });
    }

    // ===== MANEJADOR DEL BOTÓN RESTABLECER =====
    const resetButton = document.querySelector(".reset-button");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        
        utils.writeSettings(DEFAULTS);

        // Actualiza la interfaz para reflejar los valores por defecto
        boardRadios.forEach(
          (r) => (r.checked = r.value === DEFAULTS.boardSize)
        );
        if (gridCheckbox) gridCheckbox.checked = DEFAULTS.grid;
        foodRadios.forEach((r) => (r.checked = r.value === DEFAULTS.foodShape));

       
        const originalHTML = resetButton.innerHTML;
        resetButton.textContent = "✓ RESTABLECIDO";
        setTimeout(() => {
          resetButton.innerHTML = originalHTML;
        }, 1200);

        
        utils.applyTheme(DEFAULTS.theme);
      });
    }

    // ===== ESCUCHA CAMBIOS DE OTRAS PESTAÑAS =====
    window.addEventListener("storage", () => {
      const utils = getGameUtils(); 
      const theme =
        localStorage.getItem("arcade-snake-theme") ||
        localStorage.getItem("snakeTheme") ||
        utils.DEFAULTS.theme; 
      utils.applyTheme(theme); 
    });

    // ===== ESCUCHA CAMBIOS EN LA MISMA PESTAÑA =====
    window.addEventListener("snakeSettingsChanged", (e) => {
      const utils = getGameUtils();
      const themeKey =
        (e && e.detail && e.detail.theme) ||
        localStorage.getItem("arcade-snake-theme") ||
        localStorage.getItem("snakeTheme") ||
        utils.DEFAULTS.theme; 
      utils.applyTheme(themeKey); 
    });
  });
})();
