
// Estos son los datos centrales de los temas disponibles en el juego
const THEMES = {
  neonGreen: {
    id: "neonGreen",
    name: "Modo Clásico Verde",
    colors: {
      primary: "#39FF14",
      secondary: "#00FF88",
      accent: "#00F0FF",
      background: "#0A0F0D",
      surface: "#101010",
      text: "#EAEAEA",
      textSecondary: "#AAAAAA",
      glow: "rgba(57, 255, 20, 0.8)",
      food: "#00bb9d",
      snake: ["#39FF14", "#00FF88", "#00F0FF"],
    },
    snake: {
      style: "digital",
      hasGlow: true,
      animated: true,
    },
    music: "Cyber Arcade Beat",
  },
  royalGold: {
    id: "royalGold",
    name: "Modo Oro Regio",
    colors: {
      primary: "#FFD700", 
      secondary: "#D4AF37", 
      accent: "#BE8C29", 
      background: "#121212", 
      surface: "#292929", 
      text: "#FDEBD0", 
      glow: "rgba(255, 215, 0, 0.6)", 
      food: "#b5cb00", 
      snake: ["#FFD700", "#D4AF37", "#BE8C29"], 
    },
    snake: {
      style: "holográfico", 
      hasGlow: true,
      animated: false, 
    },
    music: "Velvet Jazz Lounge", 
  },

  lavaVolcano: {
    id: "lavaVolcano",
    name: "Modo Volcán de Lava",
    colors: {
      primary: "#FF4500", 
      secondary: "#FF8C00", 
      accent: "#FFA500", 
      background: "#330A00", 
      surface: "#661A00",
      text: "#FDEBD0", 
      textSecondary: "#FFDAB9", 
      glow: "rgba(255, 165, 0, 0.8)", 
      food: "#ff0056", 
      snake: ["#FF4500", "#FF8C00", "#FFA500"], 
    },
    snake: {
      style: "gelatinoso",
      hasGlow: true,
      animated: true,
    },
    music: "Molten Core Pulse", 
  },

  darkSpace: {
    id: "darkSpace",
    name: "Modo Espacio Oscuro",
    colors: {
      primary: "#9370DB",
      secondary: "#4B0082",
      accent: "#6A5ACD",
      background: "#000011",
      surface: "#1A1A2E",
      text: "#E6E6FA",
      textSecondary: "#C8B2DB",
      glow: "rgba(147, 112, 219, 0.8)",
      food: "#e76cc4",
      snake: ["#9370DB", "#4B0082", "#6A5ACD"],
    },
    snake: {
      style: "holographic",
      hasGlow: true,
      animated: true,
    },
    music: "Cosmic Void",
  },
  deepSea: {
    id: "deepSea",
    name: "Modo Abismo Azul",
    colors: {
      primary: "#00FFFF", 
      secondary: "#00BFFF", 
      background: "#000033", 
      surface: "#003366", 
      text: "#F0FFFF", 
      textSecondary: "#ADD8E6",
      glow: "rgba(0, 255, 255, 0.7)", 
      food: "#00dcff",
      snake: ["#00FFFF", "#00BFFF", "#1E90FF"], 
    },
    snake: {
      style: "gelatinoso", 
      hasGlow: true,
      animated: true,
    },
    music: "Oceanic Synth Current", 
  },
  ancientDesert: {
    id: 'ancientDesert',
    name: 'Modo Ruinas del Sol',
    colors: {
        primary: '#FF8C00',       
        secondary: '#FF8C00',    
        accent: '#C2B280',         
        background: '#4A2A00',   
        surface: '#F0E68C',       
        text: '#FDF3E6',           
        textSecondary: '#D4AA77', 
        glow: 'rgba(255, 140, 0, 0.4)',
        food: '#be9500',           
        snake: ['#3a1a09ff', '#FF8C00', '#C2B280']
    },
    snake: {
        style: 'digital',
        hasGlow: true,
        animated: true
    },
    music: 'Desert Drum Rhythms'
  }
};

const STYLE_NAMES = {
  digital: "Digital",
  gelatinous: "Gelatinoso",
  holographic: "Holográfico",
  classic: "Clásico",
  cute: "Kawaii",
};
