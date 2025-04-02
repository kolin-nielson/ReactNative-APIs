import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContentItem } from '../types/tmdb';

const WATCHLIST_KEY = '@MovieExplorerApp:watchlist';

// Load the watchlist from AsyncStorage
export const loadWatchlist = async (): Promise<ContentItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(WATCHLIST_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load watchlist.', e);
    return []; // Return empty list on error
  }
};

// Save the entire watchlist to AsyncStorage
const saveWatchlist = async (watchlist: ContentItem[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(watchlist);
    await AsyncStorage.setItem(WATCHLIST_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save watchlist.', e);
  }
};

// Add an item to the watchlist
export const addToWatchlist = async (item: ContentItem): Promise<ContentItem[]> => {
  const currentWatchlist = await loadWatchlist();
  // Avoid adding duplicates
  if (!currentWatchlist.some(watchlistItem => watchlistItem.id === item.id && watchlistItem.media_type === item.media_type)) {
    const newWatchlist = [...currentWatchlist, item];
    await saveWatchlist(newWatchlist);
    return newWatchlist;
  }
  return currentWatchlist; // Return unchanged list if already exists
};

// Remove an item from the watchlist
export const removeFromWatchlist = async (itemId: number, mediaType: 'movie' | 'tv'): Promise<ContentItem[]> => {
  const currentWatchlist = await loadWatchlist();
  const newWatchlist = currentWatchlist.filter(
    watchlistItem => !(watchlistItem.id === itemId && watchlistItem.media_type === mediaType)
  );
  // Save only if the list has changed
  if (newWatchlist.length !== currentWatchlist.length) {
    await saveWatchlist(newWatchlist);
  }
  return newWatchlist;
};

// Check if an item is in the watchlist
export const isItemInWatchlist = async (itemId: number, mediaType: 'movie' | 'tv'): Promise<boolean> => {
    const currentWatchlist = await loadWatchlist();
    return currentWatchlist.some(item => item.id === itemId && item.media_type === mediaType);
} 