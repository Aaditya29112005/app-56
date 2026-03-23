import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { DARK_THEME, LIGHT_THEME, COLORS } from '../theme/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // App will open in dark theme by default as per request
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  // Merge brand colors with current theme colors
  const activeColors = {
    ...COLORS,
    ...theme,
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: activeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
