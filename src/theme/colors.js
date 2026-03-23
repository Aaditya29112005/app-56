export const DARK_THEME = {
  // Base Colors
  background: "#000000",
  surface: "#121212",
  surfaceElevated: "#1C1C1E",
  
  // Glassmorphism Tokens
  glassBackground: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.1)",
  glassAccent: "rgba(255, 138, 0, 0.1)",
  
  // Text Colors
  text: "#FFFFFF",
  textSecondary: "#888888",
  textMuted: "#636366",
  
  // UI Colors
  border: "#1F1F1F",
  divider: "#1A1A1A",
};

export const LIGHT_THEME = {
  // Base Colors
  background: "#F6F7F9",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  
  // Glassmorphism Tokens
  glassBackground: "rgba(0, 0, 0, 0.03)",
  glassBorder: "transparent",
  glassAccent: "rgba(255, 138, 0, 0.05)",
  
  // Text Colors
  text: "#111111",
  textSecondary: "#555555",
  textMuted: "#888888",
  
  // UI Colors
  border: "transparent",
  divider: "#E5E5EA",
};

export const COLORS = {
  // Brand Colors (Constant)
  primary: "#FF8A00", 
  primaryGradient: ["#FF8A00", "#FFB156"],
  
  error: "#FF453A",
  success: "#32D74B",
  warning: "#FF9F0A",
  
  // Utils
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",

  // Default Fallback
  ...DARK_THEME
};
