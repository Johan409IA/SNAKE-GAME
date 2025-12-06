// Intentamos obtener el ID por defecto de forma centralizada.
const DEFAULT_THEME_ID = (window.GameUtils && window.GameUtils.DEFAULT_THEME_ID) || 'neonGreen'; 
let currentTheme = localStorage.getItem('arcade-snake-theme') || DEFAULT_THEME_ID;

// ===== FUNCIONES DE TEMA =====
function getThemesRegistry() {
    return typeof THEMES !== 'undefined' ? THEMES : {};
}
// Obtiene un tema por ID, con fallback al tema por defecto
function getTheme(themeId) {
    const registry = getThemesRegistry();
    const fallback = registry[DEFAULT_THEME_ID] || Object.values(registry)[0];
    return registry[themeId] || fallback || null;
}
// Obtiene el nombre legible de un estilo de serpiente
function getStyleName(styleKey) {
    const registry = typeof STYLE_NAMES !== 'undefined' ? STYLE_NAMES : {};
    return registry[styleKey] || styleKey || '';
}
// Convierte un color hex o rgb a rgba con la opacidad dada
function withAlpha(color, alpha, fallback) {
    if (typeof color !== 'string') {
        return fallback;
    }

    const trimmed = color.trim();
    const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        const normalized = hex.length === 3 ? hex.split('').map(ch => ch + ch).join('') : hex;
        const r = parseInt(normalized.substring(0, 2), 16);
        const g = parseInt(normalized.substring(2, 4), 16);
        const b = parseInt(normalized.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const rgbaMatch = trimmed.match(/^rgba\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\)$/i);
    if (rgbaMatch) {
        const [, r, g, b] = rgbaMatch;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const rgbMatch = trimmed.match(/^rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)$/i);
    if (rgbMatch) {
        const [, r, g, b] = rgbMatch;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return fallback || trimmed;
}
// Aplica los colores de un tema dado su ID
function applyThemeColors(themeId, options = {}) {
    const {
        persist = true,
        dispatchEvent = true
    } = options;

    const theme = getTheme(themeId);
    if (!theme || !theme.colors) {
        return null;
    }

    const root = document.documentElement;
    const fallbackColors = getTheme(DEFAULT_THEME_ID)?.colors || {};
    const colors = theme.colors;
    const tokens = {
        '--color-background': colors.background ?? fallbackColors.background,
        '--color-surface': colors.surface ?? fallbackColors.surface,
        '--color-text': colors.text ?? fallbackColors.text,
        '--color-text-secondary': colors.textSecondary ?? fallbackColors.textSecondary,
        '--color-primary': colors.primary ?? fallbackColors.primary,
        '--color-secondary': colors.secondary ?? fallbackColors.secondary,
        '--color-accent': colors.accent ?? fallbackColors.accent,
        '--color-glow': colors.glow ?? fallbackColors.glow,
        '--color-food': colors.food ?? fallbackColors.food
    };

    Object.entries(tokens).forEach(([token, value]) => {
        if (value) {
            root.style.setProperty(token, value);
        }
    });

    const primarySoft = withAlpha(colors.primary ?? fallbackColors.primary, 0.12, fallbackColors.primarySoft);
    if (primarySoft) {
        root.style.setProperty('--color-primary-soft', primarySoft);
    }

    const secondarySoft = withAlpha(colors.secondary ?? fallbackColors.secondary, 0.12, fallbackColors.secondarySoft);
    if (secondarySoft) {
        root.style.setProperty('--color-secondary-soft', secondarySoft);
    }

    const fallbackSnake = Array.isArray(fallbackColors.snake) ? fallbackColors.snake : [];
    const snakeColors = Array.isArray(colors.snake) ? colors.snake : fallbackSnake;
    snakeColors.slice(0, 5).forEach((value, index) => {
        if (value) {
            root.style.setProperty(`--color-snake-${index + 1}`, value);
        }
    });

    root.dataset.theme = theme.id;

    if (persist) {
        try {
            localStorage.setItem('arcade-snake-theme', theme.id);
            localStorage.setItem('snakeTheme', theme.id);
        } catch (error) {
            console.warn('No se pudo guardar el tema en localStorage:', error);
        }
    }

    if (dispatchEvent && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('snakeThemeApplied', { detail: { theme } }));
    }

    return theme;
}

window.applyThemeColors = applyThemeColors;
// ===== INTERFAZ DE SELECCIÓN DE TEMA =====
function init() {
    createStars();
    renderThemes();
    setupEventListeners();
    applyCurrentTheme({ persist: false, dispatchEvent: false });
}
// Crea estrellas animadas de fondo
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) {
        return;
    }

    const starCount = 50;
    const theme = getTheme(currentTheme);
    const primaryColor = theme?.colors?.primary || '#39FF14';
    const secondaryColor = theme?.colors?.secondary || '#00FF88';
    const glowColor = theme?.colors?.glow || 'rgba(57, 255, 20, 0.5)';

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 3 + 1;
        const speed = Math.random() * 0.5 + 0.1;
        const opacity = Math.random() * 0.8 + 0.2;

        star.style.left = x + 'px';
        star.style.top = y + 'px';
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.backgroundColor = i % 2 === 0 ? primaryColor : secondaryColor;
        star.style.opacity = opacity;
        star.style.boxShadow = `0 0 ${size * 2}px ${glowColor}`;

        starsContainer.appendChild(star);

        animateStar(star, speed);
    }
}
// Anima una estrella moviéndose hacia abajo
function animateStar(star, speed) {
    let currentY = parseFloat(star.style.top);
    let currentX = parseFloat(star.style.left);

    function animate() {
        currentY += speed;
        currentX += Math.sin(currentY * 0.01) * 0.5;

        if (currentY > window.innerHeight) {
            currentY = -10;
        }

        star.style.top = currentY + 'px';
        star.style.left = currentX + 'px';

        requestAnimationFrame(animate);
    }

    animate();
}

// Renderiza las tarjetas de tema en la cuadrícula
function renderThemes() {
    const grid = document.getElementById('themesGrid');
    if (!grid) {
        return;
    }

    grid.innerHTML = '';

    const themesRegistry = getThemesRegistry();
    const themeIds = Object.keys(themesRegistry);

    themeIds.forEach((themeId, index) => {
        const theme = themesRegistry[themeId];
        const card = createThemeCard(theme, index);
        grid.appendChild(card);
    });
}

// Crea una tarjeta de tema individual
function createThemeCard(theme, index) {
    const card = document.createElement('div');
    card.className = 'theme-card';
    card.dataset.themeId = theme.id;
    card.style.borderColor = theme.id === currentTheme ? theme.colors.primary : `${theme.colors.primary}66`;
    card.style.animationDelay = `${index * 0.1}s`;

    if (theme.id === currentTheme) {
        card.classList.add('selected');
        card.style.boxShadow = `0 0 30px ${theme.colors.glow}`;
    }

    const checkIcon = document.createElement('div');
    checkIcon.className = 'check-icon';
    checkIcon.style.backgroundColor = theme.colors.primary;
    checkIcon.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="${theme.colors.background}" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    card.appendChild(checkIcon);

    const preview = document.createElement('div');
    preview.className = 'theme-preview';
    preview.style.backgroundColor = theme.colors.background;

    const previewGrid = document.createElement('div');
    previewGrid.className = 'preview-grid';
    previewGrid.style.color = theme.colors.primary;
    preview.appendChild(previewGrid);

    const previewContent = document.createElement('div');
    previewContent.className = 'preview-content';

    const snakePreview = document.createElement('div');
    snakePreview.className = 'snake-preview';

    theme.colors.snake.slice(0, 3).forEach((color, i) => {
        const segment = document.createElement('div');
        segment.className = `snake-segment ${getSegmentClass(theme.snake.style)}`;
        segment.style.backgroundColor = color;
        segment.style.animationDelay = `${i * 0.2}s`;

        if (theme.snake.hasGlow) {
            segment.style.boxShadow = `0 0 10px ${color}`;
        }

        snakePreview.appendChild(segment);
    });

    previewContent.appendChild(snakePreview);

    const food = document.createElement('div');
    food.className = 'food-preview';
    food.style.backgroundColor = theme.colors.food;
    food.style.boxShadow = `0 0 8px ${theme.colors.food}`;
    previewContent.appendChild(food);

    preview.appendChild(previewContent);
    card.appendChild(preview);

    const info = document.createElement('div');
    info.className = 'theme-info';

    const name = document.createElement('h3');
    name.className = 'theme-name';
    name.style.color = theme.colors.primary;
    name.textContent = theme.name;
    info.appendChild(name);

    const colorDots = document.createElement('div');
    colorDots.className = 'color-dots';
    theme.colors.snake.slice(0, 3).forEach(color => {
        const dot = document.createElement('div');
        dot.className = 'color-dot';
        dot.style.backgroundColor = color;
        colorDots.appendChild(dot);
    });
    info.appendChild(colorDots);

    const style = document.createElement('p');
    style.className = 'theme-style';
    style.textContent = `Estilo: ${getStyleName(theme.snake.style)}`;
    info.appendChild(style);

    if (theme.music) {
        const music = document.createElement('p');
        music.className = 'theme-music';
        music.style.color = theme.colors.accent;
        music.textContent = `♪ ${theme.music}`;
        info.appendChild(music);
    }

    card.appendChild(info);

    card.addEventListener('click', () => selectTheme(theme.id));

    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05)';
        card.style.boxShadow = `0 0 25px ${theme.colors.glow}`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
        if (theme.id === currentTheme) {
            card.style.boxShadow = `0 0 30px ${theme.colors.glow}`;
        } else {
            card.style.boxShadow = `0 0 10px ${theme.colors.glow}66`;
        }
    });

    return card;
}

// Obtiene el nombre de la clase CSS para un estilo de segmento de serpiente
function getSegmentClass(style) {
    switch (style) {
        case 'cute':
            return 'rounded';
        case 'gelatinous':
            return 'rounded';
        case 'holographic':
            return 'rounded';
        case 'digital':
            return 'rounded';
        default:
            return 'square';
    }
}

// Selecciona un tema y actualiza la interfaz
function selectTheme(themeId) {
    currentTheme = themeId;

    const cards = document.querySelectorAll('.theme-card');
    const themesRegistry = getThemesRegistry();
    cards.forEach(card => {
        const cardThemeId = card.dataset.themeId;
        const theme = themesRegistry[cardThemeId];
        if (!theme) {
            return;
        }

        if (cardThemeId === themeId) {
            card.classList.add('selected');
            card.style.borderColor = theme.colors.primary;
            card.style.boxShadow = `0 0 30px ${theme.colors.glow}`;
        } else {
            card.classList.remove('selected');
            card.style.borderColor = `${theme.colors.primary}66`;
            card.style.boxShadow = `0 0 10px ${theme.colors.glow}66`;
        }
    });

    applyCurrentTheme({ persist: false, dispatchEvent: false });
}

// Aplica el tema actualmente seleccionado
function applyCurrentTheme(options = {}) {
    return applyThemeColors(currentTheme, options);
}

// Configura los listeners de eventos para la interfaz
function setupEventListeners() {
    const applyButton = document.getElementById('applyButton');
    if (applyButton) {
        applyButton.addEventListener('click', applyTheme);
    }
}

// Maneja la aplicación del tema cuando se hace clic en el botón
function applyTheme() {
    const theme = applyThemeColors(currentTheme, { persist: true, dispatchEvent: true });
    if (theme) {
        alert(`Tema "${theme.name}" aplicado correctamente!`);
    }
}

document.addEventListener('DOMContentLoaded', init);
