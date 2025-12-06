(function(){
  ;

    // ===== FUNCIÓN PARA OBTENER GameUtils =====
    function getGameUtils() {
      if (window.GameUtils) {
        return window.GameUtils;
      }
      
      // Fallback de seguridad si utils.js falla en cargar
      console.error("GameUtils no está cargado. Usando fallbacks en config.js.");
      const defaults = { boardSize: 'small', grid: true, foodShape: 'square' };
      return {
        DEFAULTS: defaults,
        SIZE_MAP: { small: 15, medium: 20, large: 25 },
        readSettings: () => defaults,
      };
    }

    // ===== MAPEO DE FORMAS DE COMIDA A SVG =====
    // Esta lógica es única de config.js y se mantiene
    const FOOD_SHAPE_TO_SVG = {
      'square': 'assets/svg/manzana.svg',   // Manzana
      'circle': 'assets/svg/uva.svg',       // Uva
      'triangle': 'assets/svg/platano.svg', // Plátano
      'star': 'assets/svg/sandia.svg'       // Sandía
    };



    // ===== FUNCIÓN PRINCIPAL PARA APLICAR CONFIGURACIONES =====
    // Aplica todas las configuraciones al tablero de juego
    function applySettings(s) {
      const utils = getGameUtils();
      const SIZE_MAP = utils.SIZE_MAP; 

      // ===== MANEJO DE ELEMENTOS DEL DOM =====
      const gameBoard = document.querySelector('.game-board');
      const gameArea = document.querySelector('.snake-game-area');
      const gridLines = document.querySelector('.grid-lines');
      const foodEl = document.querySelector('.food');

      // ===== APLICAR TAMAÑO DEL TABLERO =====
      if (gameBoard && gameArea) {
        gameBoard.classList.remove('board-small','board-medium','board-large');
        gameBoard.classList.add('board-' + (s.boardSize || 'small'));

        const cells = SIZE_MAP[s.boardSize] || SIZE_MAP.small;
        
        if (gridLines) {
          const areaW = gameArea.clientWidth || 500;
          const areaH = gameArea.clientHeight || 500;
          const cellSize = Math.floor(Math.min(areaW / cells, areaH / cells));
          gridLines.style.backgroundSize = `${cellSize}px ${cellSize}px`;
          gridLines.style.backgroundRepeat = 'repeat';
        }
      }

      // ===== APLICAR VISIBILIDAD DE CUADRÍCULA =====
      if (gridLines) {
        gridLines.style.display = s.grid ? 'block' : 'none';
        
      }

      // ===== APLICAR FORMA/IMAGEN DE LA COMIDA =====
      if (foodEl) {
        const isGameControlled = foodEl.getAttribute('data-game-controlled') === 'true';

        if (!isGameControlled) {
          foodEl.style.right = '';
          foodEl.style.top = '';
        }

        const svgPath = FOOD_SHAPE_TO_SVG[s.foodShape];

        if (svgPath) {
          foodEl.innerHTML = '';
          if (!isGameControlled) {
            foodEl.style.background = 'none';
            foodEl.style.borderRadius = '0';
            foodEl.style.clipPath = 'none';
          }
          const img = document.createElement('img');
          img.src = svgPath;
          img.alt = 'Comida';
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          foodEl.appendChild(img);
        } else {
          console.warn('SVG no encontrado, usando forma por defecto');
          foodEl.innerHTML = '';
          if (!isGameControlled) {
            foodEl.style.background = '#ff0044';
            foodEl.style.borderRadius = '50%';
          }
        }
      }
    }

    // ===== INICIALIZACIÓN AL CARGAR EL DOM =====
    document.addEventListener('DOMContentLoaded', function(){
      
      const utils = getGameUtils();
      console.log('Aplicando configuraciones iniciales...');
      applySettings(utils.readSettings());
    });

    // ===== ESCUCHA CAMBIOS DE OTRAS PESTAÑAS =====
    window.addEventListener('storage', function(){
      
      const utils = getGameUtils();
      console.log('Configuraciones actualizadas desde otra pestaña');
      applySettings(utils.readSettings());
    });

    // ===== ESCUCHA CAMBIOS EN LA MISMA PESTAÑA =====
    window.addEventListener('snakeSettingsChanged', function(e){
      console.log('Configuraciones actualizadas en esta pestaña');
      applySettings(e.detail);
    });
})();