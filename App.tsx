import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WatchlistProvider } from './src/context/WatchlistContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Inner component to access theme for StatusBar
const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  return (
    <>
      <AppNavigator />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider> 
        <WatchlistProvider>
          <AppContent />
        </WatchlistProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
