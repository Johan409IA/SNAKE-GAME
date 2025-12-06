
(function () {
  /**
   * Obtiene el ID del tema almacenado
   */
  function getStoredThemeId() {
    const DEFAULT_ID = (window.GameUtils && window.GameUtils.DEFAULT_THEME_ID) || 'neonGreen';
    return (
      localStorage.getItem('arcade-snake-theme') ||
      localStorage.getItem('snakeTheme') ||
      DEFAULT_ID 
    );
  }

  /**
   * Resuelve un tema desde el registro THEMES
   */
  function resolveTheme(themeId) {
    if (typeof THEMES === 'undefined') {
      console.warn('THEMES no está definido aún');
      return null;
    }
    return THEMES[themeId] || THEMES.neonGreen || Object.values(THEMES)[0];
  }

  /**
   * Actualiza los metadatos del tema en el DOM
   */
  function updateThemeMetadata(theme) {
    if (!theme) return;

    const nameTarget = document.querySelector('[data-theme-name]');
    if (nameTarget) {
      nameTarget.textContent = theme.name;
    }

    const musicTarget = document.querySelector('[data-theme-music]');
    if (musicTarget) {
      musicTarget.textContent = theme.music ? `🎵 ${theme.music} 🎵` : '';
    }

    const descriptionTarget = document.querySelector('[data-theme-description]');
    if (descriptionTarget) {
      descriptionTarget.textContent = `${theme.name.toUpperCase()} | JUEGO DE ALTA ENERGÍA`;
    }
  }

  /**
   * Aplica el tema almacenado
   */
  function applyStoredTheme() {
    const themeId = getStoredThemeId();
    let theme = resolveTheme(themeId);

    // Intenta aplicar colores usando la función global
    if (typeof window.applyThemeColors === 'function') {
      theme = window.applyThemeColors(themeId, {
        persist: false,
        dispatchEvent: false,
      }) || theme;
    }

    // Actualiza metadatos si existen en la página
    updateThemeMetadata(theme);
  }

  /**
   * Inicialización cuando el DOM está listo
   */
  function init() {
    applyStoredTheme();
  }

  /**
   * Maneja cambios desde otras pestañas
   */
  function handleStorageChange(event) {
    if (
      !event ||
      (event.key &&
        event.key !== 'arcade-snake-theme' &&
        event.key !== 'snakeTheme')
    ) {
      return;
    }
    applyStoredTheme();
  }

  /**
   * Maneja eventos de cambio de tema
   */
  function handleThemeApplied(event) {
    const themeId =
      event &&
      event.detail &&
      event.detail.theme &&
      event.detail.theme.id;
    if (!themeId) return;

    let theme = resolveTheme(themeId);
    if (typeof window.applyThemeColors === 'function') {
      theme = window.applyThemeColors(themeId, {
        persist: false,
        dispatchEvent: false,
      }) || theme;
    }
    updateThemeMetadata(theme);
  }

  // Auto-inicialización
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Escuchar eventos
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('snakeThemeApplied', handleThemeApplied);

  // Exponer API pública si es necesario
  window.ThemeLoader = {
    applyStoredTheme: applyStoredTheme,
    getStoredThemeId: getStoredThemeId,
  };
})();
