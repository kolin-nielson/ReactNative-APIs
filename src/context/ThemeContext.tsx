import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightColors, darkColors } from '../styles/theme';

// Define the shape of the context value
interface ThemeContextType {
  isDarkMode: boolean;
  colors: typeof lightColors; // Use one of the palettes as the type template
  toggleTheme?: () => void; // Optional: Add manual toggle later if needed
}

// Create the context with a default value (can be light theme initially)
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  colors: lightColors,
});

// Create the provider component
export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light', 'dark', or null
  // Use state to manage the current theme mode, defaulting to system preference
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  // Update state if system preference changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });
    // Initial sync in case the hook's initial value was different
    setIsDarkMode(Appearance.getColorScheme() === 'dark');
    return () => subscription.remove();
  }, []);

  // Select the appropriate color palette
  const colors = isDarkMode ? darkColors : lightColors;

  const value = {
    isDarkMode,
    colors,
    // Add toggleTheme function here if manual switching is desired later
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook for easy access to the theme context
export const useTheme = () => useContext(ThemeContext); 