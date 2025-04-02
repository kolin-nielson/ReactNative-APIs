import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import {
    loadWatchlist,
    addToWatchlist as addItem,
    removeFromWatchlist as removeItem,
} from '../services/watchlistService';
import { ContentItem } from '../types/tmdb';

interface WatchlistContextType {
  watchlist: ContentItem[];
  isLoading: boolean;
  addItemToWatchlist: (item: ContentItem) => Promise<void>;
  removeItemFromWatchlist: (itemId: number, mediaType: 'movie' | 'tv') => Promise<void>;
  isItemInList: (itemId: number, mediaType: 'movie' | 'tv') => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const loadedList = await loadWatchlist();
      setWatchlist(loadedList);
      setIsLoading(false);
    };
    load();
  }, []);

  const addItemToWatchlist = useCallback(async (item: ContentItem) => {
    const newWatchlist = await addItem(item);
    setWatchlist(newWatchlist);
  }, []);

  const removeItemFromWatchlist = useCallback(async (itemId: number, mediaType: 'movie' | 'tv') => {
    const newWatchlist = await removeItem(itemId, mediaType);
    setWatchlist(newWatchlist);
  }, []);

  const isItemInList = useCallback((itemId: number, mediaType: 'movie' | 'tv') => {
      return watchlist.some(item => item.id === itemId && item.media_type === mediaType);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isLoading,
        addItemToWatchlist,
        removeItemFromWatchlist,
        isItemInList,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}; 