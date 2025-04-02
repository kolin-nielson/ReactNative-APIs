import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WatchlistProvider } from './src/context/WatchlistContext';

export default function App() {
  return (
    <SafeAreaProvider> 
        <WatchlistProvider>
      <AppNavigator />
      <StatusBar style="auto" />
        </WatchlistProvider>
    </SafeAreaProvider>
  );
}
