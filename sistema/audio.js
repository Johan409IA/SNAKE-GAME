/**
 * Clase AudioManager - Maneja todo el sistema de audio del juego
 * Gestiona música de fondo y efectos de sonido con estado encapsulado
 */
class AudioManager {
  constructor() {
    // Constantes de almacenamiento
    this.STORAGE_KEYS = {
      musicEnabled: "snakeMusicEnabled",
      soundEffectsEnabled: "snakeSoundEffectsEnabled",
      musicVolume: "snakeMusicVolume",
      sfxVolume: "snakeSoundEffectsVolume",
    };

    // Configuraciones por defecto
    this.DEFAULTS = {
      musicEnabled: false,
      soundEffectsEnabled: true,
      musicVolume: 0.5,
      sfxVolume: 0.7,
    };

    // Estado interno del audio
    this.currentMusic = null;
    this.eatSound = null;
    this.gameOverSound = null;
  }

  /**
   * Obtener el estado de audio desde localStorage
   */
  getAudioState() {
    return {
      musicEnabled: localStorage.getItem(this.STORAGE_KEYS.musicEnabled) === "true",
      soundEffectsEnabled:
        localStorage.getItem(this.STORAGE_KEYS.soundEffectsEnabled) !== "false", // Default true
      musicVolume: parseFloat(
        localStorage.getItem(this.STORAGE_KEYS.musicVolume) || this.DEFAULTS.musicVolume
      ),
      sfxVolume: parseFloat(
        localStorage.getItem(this.STORAGE_KEYS.sfxVolume) || this.DEFAULTS.sfxVolume
      ),
    };
  }

  /**
   * Guardar el estado de audio en localStorage
   */
  saveAudioState(state) {
    if (state.musicEnabled !== undefined) {
      localStorage.setItem(
        this.STORAGE_KEYS.musicEnabled,
        state.musicEnabled.toString()
      );
    }
    if (state.soundEffectsEnabled !== undefined) {
      localStorage.setItem(
        this.STORAGE_KEYS.soundEffectsEnabled,
        state.soundEffectsEnabled.toString()
      );
    }
    if (state.musicVolume !== undefined) {
      localStorage.setItem(
        this.STORAGE_KEYS.musicVolume,
        state.musicVolume.toString()
      );
    }
    if (state.sfxVolume !== undefined) {
      localStorage.setItem(this.STORAGE_KEYS.sfxVolume, state.sfxVolume.toString());
    }
  }

  /**
   * Obtener el tema actual para cargar la música correspondiente
   */
  getCurrentThemeId() {
    // MEJORA: Reutilizamos la función de tema-cargar.js
    if (
      window.ThemeLoader &&
      typeof window.ThemeLoader.getStoredThemeId === "function"
    ) {
      return window.ThemeLoader.getStoredThemeId();
    }

    console.warn("ThemeLoader no está disponible, usando fallback.");
    return (
      localStorage.getItem("arcade-snake-theme") ||
      localStorage.getItem("snakeTheme") ||
      "neonGreen"
    );
  }

  /**
   * Obtener la ruta del archivo de música basado en el tema
   */
  getMusicPath(themeId) {
    return `./assets/audio/musica/${themeId}.mp3`;
  }

  /**
   * Obtener la ruta del archivo de efecto de sonido
   */
  getSoundEffectPath(name) {
    return `./assets/audio/sfx/${name}.mp3`;
  }

  /**
   * Crear un objeto de audio con opciones
   */
  createAudio(src, options = {}) {
    const audio = new Audio(src);
    audio.volume = options.volume !== undefined ? options.volume : 1;
    audio.loop = options.loop || false;

    // Manejo de errores si el archivo no se encuentra
    audio.addEventListener("error", function () {
      console.warn(
        `Audio file not found: ${src}. Please add your audio file to this path.`
      );
    });

    return audio;
  }

  /**
   * Iniciar la música de fondo
   */
  playMusic(themeId) {
    const state = this.getAudioState();

    if (!state.musicEnabled) {
      return;
    }

    // Parar música actual si existe
    this.stopMusic();

    const activeThemeId = themeId || this.getCurrentThemeId();
    const musicPath = this.getMusicPath(activeThemeId);

    // Crear y reproducir nueva música
    this.currentMusic = this.createAudio(musicPath, {
      volume: state.musicVolume,
      loop: true,
    });

    this.currentMusic.play().catch((error) => {
      console.warn("Could not play music:", error);
      console.info(`To enable music, add your music file at: ${musicPath}`);
    });
  }

  /**
   * Parar la música de fondo
   */
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  /**
   * Encender/apagar la música de fondo
   */
  toggleMusic() {
    const state = this.getAudioState();
    const newState = !state.musicEnabled;

    this.saveAudioState({ musicEnabled: newState });

    if (newState) {
      this.playMusic();
    } else {
      this.stopMusic();
    }

    this.updateMusicButtonUI();
    this.updateWaveformAnimation();

    return newState;
  }

  /**
   * Reproducir efectos de sonido
   */
  playSoundEffect(name) {
    const state = this.getAudioState();

    if (!state.soundEffectsEnabled) {
      return;
    }

    const soundPath = this.getSoundEffectPath(name);
    let sound = null;

    if (name === "eat") {
      if (!this.eatSound) {
        this.eatSound = this.createAudio(soundPath, {
          volume: state.sfxVolume,
          loop: false,
        });
      }
      sound = this.eatSound;
    } else if (name === "gameover") {
      if (!this.gameOverSound) {
        this.gameOverSound = this.createAudio(soundPath, {
          volume: state.sfxVolume,
          loop: false,
        });
      }
      sound = this.gameOverSound;
    } else {
      sound = this.createAudio(soundPath, {
        volume: state.sfxVolume,
        loop: false,
      });
    }

    // Resetear y reproducir
    sound.currentTime = 0;
    sound.play().catch((error) => {
      console.warn(`Could not play sound effect: ${name}`, error);
      console.info(
        `To enable sound effects, add your sound file at: ${soundPath}`
      );
    });
  }

  /**
   * Apagar/encender los efectos de sonido
   */
  toggleSoundEffects() {
    const state = this.getAudioState();
    const newState = !state.soundEffectsEnabled;

    this.saveAudioState({ soundEffectsEnabled: newState });
    this.updateSoundEffectsButtonUI();

    return newState;
  }

  /**
   * Actualizar el botón de música en juego.html
   */
  updateMusicButtonUI() {
    const state = this.getAudioState();
    const musicButton = document.querySelector(
      ".audio-system .btn-audio:first-of-type"
    );

    if (musicButton) {
      musicButton.textContent = state.musicEnabled
        ? "🎵 MUSICA ON"
        : "🎵 MUSICA OFF";
    }
  }

  /**
   * Actualizar el botón de efectos de sonido en juego.html
   */
  updateSoundEffectsButtonUI() {
    const state = this.getAudioState();
    const sfxButton = document.querySelector(
      ".audio-system .btn-audio:last-of-type"
    );

    if (sfxButton) {
      sfxButton.textContent = state.soundEffectsEnabled
        ? "🔊 EFECTOS SONIDO ON"
        : "🔊 EFECTOS SONIDO OFF";
    }
  }

  /**
   * Actualizar la animación de la forma de onda
   */
  updateWaveformAnimation() {
    const state = this.getAudioState();
    const waveform = document.querySelector(".waveform");

    if (waveform) {
      if (state.musicEnabled) {
        waveform.classList.add("animated");
      } else {
        waveform.classList.remove("animated");
      }
    }
  }

  /**
   * Actualizar el botón de música en el menú principal
   */
  updateMenuMusicButtonUI() {
    const state = this.getAudioState();
    const menuMusicButton = document.querySelector(".btn-music");

    if (menuMusicButton) {
      const textNode =
        menuMusicButton.childNodes[menuMusicButton.childNodes.length - 1];
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = ` MÚSICA: ${state.musicEnabled ? "ON" : "OFF"}`;
      } else {
        const icon = menuMusicButton.querySelector(".icon");
        if (icon) {
          menuMusicButton.innerHTML =
            icon.outerHTML + ` MÚSICA: ${state.musicEnabled ? "ON" : "OFF"}`;
        } else {
          menuMusicButton.textContent = `MÚSICA: ${
            state.musicEnabled ? "ON" : "OFF"
          }`;
        }
      }
    }
  }

  /**
   * Inicializar el sistema de audio al cargar la página
   */
  init() {
    const state = this.getAudioState();

    // Actualizar la UI
    this.updateMusicButtonUI();
    this.updateSoundEffectsButtonUI();
    this.updateWaveformAnimation();
    this.updateMenuMusicButtonUI();

    // Si la música está activada, empezar a reproducir
    if (state.musicEnabled) {
      this.playMusic();
    }
  }

  /**
   * Cambia la música cuando se cambia el tema
   */
  onThemeChange() {
    const state = this.getAudioState();
    if (state.musicEnabled && this.currentMusic) {
      // Restart music with new theme
      this.playMusic();
    }
  }

  /**
   * Actualizar toda la UI de audio
   */
  updateUI() {
    this.updateMusicButtonUI();
    this.updateSoundEffectsButtonUI();
    this.updateWaveformAnimation();
    this.updateMenuMusicButtonUI();
  }
}

// Crear instancia global del AudioManager
const audioManagerInstance = new AudioManager();

// Exponer la instancia globalmente para compatibilidad
window.AudioManager = audioManagerInstance;

// Auto-inicialización cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => audioManagerInstance.init());
} else {
  audioManagerInstance.init();
}

// Escuchar cambios de tema
window.addEventListener("snakeThemeApplied", () => audioManagerInstance.onThemeChange());

// Escuchar cambios de almacenamiento
window.addEventListener("storage", (e) => {
  if (e.key === "arcade-snake-theme" || e.key === "snakeTheme") {
    audioManagerInstance.onThemeChange();
  }
  if (
    e.key === audioManagerInstance.STORAGE_KEYS.musicEnabled ||
    e.key === audioManagerInstance.STORAGE_KEYS.soundEffectsEnabled
  ) {
    audioManagerInstance.updateUI();
    if (e.key === audioManagerInstance.STORAGE_KEYS.musicEnabled) {
      const state = audioManagerInstance.getAudioState();
      if (state.musicEnabled) {
        audioManagerInstance.playMusic();
      } else {
        audioManagerInstance.stopMusic();
      }
      audioManagerInstance.updateWaveformAnimation();
    }
  }
});
