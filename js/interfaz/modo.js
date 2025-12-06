// Modos de juego disponibles y sus descripciones
const GAME_MODES = {
    classic: {
        name: 'Clásico',
        description: 'El modo tradicional de Snake. Come y crece sin límites.',
        icon: '🎮',
        specialRules: [
            'La serpiente crece al comer',
            'Sin límite de tiempo',
            'Velocidad constante',
            'El juego termina al chocar'
        ]
    },
    timeAttack: {
        name: 'Contra el Tiempo',
        description: 'Come toda la comida antes de que se acabe el tiempo.',
        icon: '⏱️',
        timeLimit: 120,
        specialRules: [
            'Límite de 120 segundos',
            'La serpiente crece al comer',
            'Velocidad aumenta con el tiempo',
            'Obtén la mayor puntuación'
        ]
    },
    endless: {
        name: 'Modo Sin Fin',
        description: 'Juego relajado sin colisiones de paredes. Perfecto para practicar.',
        icon: '♾️',
        specialRules: [
            'Ideal para practicar',
            'Sin límite de tiempo',
            'La serpiente no crece',
            'El juego nunca termina'
        ]
    },
    obstacles: {
        name: 'Modo Obstáculos',
        description: 'Evita obstáculos dinámicos mientras juegas Snake clásico.',
        icon: '⚠️',
        specialRules: [
            'Evita los obstáculos',
            'La serpiente crece al comer',
            'Mapa con elementos fijos',
            'Dificultad extra añadida'
        ]
    }
};

(function () {
    const modeCards = document.querySelectorAll('.mode-card');
    const selectedLabel = document.getElementById('selected-mode');

    // Guarda el modo seleccionado en localStorage
    function saveMode(key) {
        localStorage.setItem('snakeMode', key);
        // notify other pages
        window.dispatchEvent(new Event('storage'));
    }
    // Actualiza la interfaz para reflejar el modo seleccionado
    function setSelected(key) {
        const MODE_DISPLAY = (window.GameUtils && window.GameUtils.MODE_DISPLAY) || {};

        modeCards.forEach(card => {
            const m = card.dataset.mode;
            if (m === key) card.classList.add('selected');
            else card.classList.remove('selected');
        });
        if (selectedLabel) selectedLabel.textContent = MODE_DISPLAY[key] || selectedLabel.textContent;
    }
    // Inicializa la selección al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
        // load previous
        const saved = localStorage.getItem('snakeMode') || 'classic';
        setSelected(saved);

        modeCards.forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                setSelected(mode);
                saveMode(mode);
            });
        });

        // React to storage events (changes from other tabs)
        window.addEventListener('storage', () => {
            const remote = localStorage.getItem('snakeMode') || 'classic';
            setSelected(remote);
        });
    });
})();