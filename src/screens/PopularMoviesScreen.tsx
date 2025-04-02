import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { discoverMovies, getMovieGenres } from '../api/tmdbService';
import ContentList from '../components/ContentList';
import { Movie, ContentItem, Genre, TVShow } from '../types/tmdb';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONTS, SIZES, COLORS } from '../styles/theme';
import GenrePickerModal from '../components/GenrePickerModal';
import { Ionicons } from '@expo/vector-icons';

// Correct type for navigation within the StackNavigator context
type PopularMoviesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
// Sort options matching UI labels, mapping needed for API
type SortOption = 'popularity' | 'rating' | 'release_date';

const PopularMoviesScreen: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigation = useNavigation<PopularMoviesScreenNavigationProp>();
  const [fetchingPage, setFetchingPage] = useState<number | null>(null);
  
  // State for sorting and filtering
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null); // null means All Genres
  const [isGenreModalVisible, setIsGenreModalVisible] = useState<boolean>(false);

  // Fetch available genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getMovieGenres();
        setAvailableGenres(genreData.genres);
      } catch (err) {
        console.error("Failed to fetch movie genres:", err);
        // Handle error display if needed
      }
    };
    fetchGenres();
  }, []);

  // Map UI sort option to TMDB API sort_by parameter
  const getApiSortBy = (option: SortOption): string => {
      switch (option) {
          case 'rating': return 'vote_average.desc';
          case 'release_date': return 'primary_release_date.desc';
          case 'popularity': 
          default: return 'popularity.desc';
      }
  };

  // Updated Fetching Logic
  const fetchMovies = useCallback(async (currentPage: number, refreshing: boolean = false) => {
    // Use current state values for sort and genre
    const currentSortBy = getApiSortBy(sortOption);
    const currentGenreFilter = selectedGenreId ? String(selectedGenreId) : undefined;
    
    // Prevent fetching if already fetching this specific page OR if loading initial page/refreshing
    if (fetchingPage === currentPage || (isLoading && !refreshing && currentPage > 1 )) return;

    setFetchingPage(currentPage);
    
    // Determine loading/refreshing state
    if (refreshing) {
        setIsRefreshing(true);
        // Ensure isLoading is false during a refresh
        setIsLoading(false); 
    } else if (currentPage === 1) { 
        // Only set loading true for the first page fetch, not during refresh
        setIsLoading(true); 
    } else {
        // Loading subsequent pages (handled by footer indicator, not main isLoading)
        setIsLoading(false);
    }
    setError(null);

    try {
      // Use discoverMovies with current filters/sorting
      const data = await discoverMovies(currentPage, currentSortBy, currentGenreFilter);
      
      const fetchedContentItems: ContentItem[] = data.results.map(movie => ({
          ...movie,
          media_type: 'movie' as const
      }));

      // No client-side deduplication needed if API handles filters/pagination correctly
      setContentItems((prevItems) => {
        // If it was a refresh or the first page fetch, replace items
        if (currentPage === 1) {
          return fetchedContentItems;
        } else {
          // Append new items for subsequent pages
          const existingIds = new Set(prevItems.map(item => `${item.media_type}-${item.id}`));
          const newUniqueItems = fetchedContentItems.filter(item => !existingIds.has(`${item.media_type}-${item.id}`));
          return [...prevItems, ...newUniqueItems];
        }
      });

      setTotalPages(data.total_pages);
      // page state is managed by the trigger effect

    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(fetchError);
      console.error("Failed to fetch discover movies:", fetchError);
    } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setFetchingPage(null);
    }
  // Keep only external state dependencies
  }, [sortOption, selectedGenreId]); 

  // Effect to Trigger Fetching
  useEffect(() => {
      // Fetch page 1 whenever sort or genre changes
      // The fetchMovies function itself now depends on these state variables
      fetchMovies(page, page === 1); // Trigger fetch. Pass true for refreshing if page is 1.
      
  // Trigger fetch when page, sortOption, or selectedGenreId changes
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [page, sortOption, selectedGenreId]); 

  const handleLoadMore = () => {
    if (page < totalPages && !isLoading && !isRefreshing && fetchingPage !== page + 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Reset page to 1 when sort option changes
  const handleSortChange = (newSortOption: SortOption) => {
      if (newSortOption !== sortOption) {
          setSortOption(newSortOption);
          setPage(1); // Reset page
          setContentItems([]); // Clear current items immediately for better UX
          setIsLoading(true); // Show loading indicator
      }
  };

  // Updated handleGenreChange to use modal state
  const handleGenreChange = (newGenreId: number | null) => {
      if (newGenreId !== selectedGenreId) {
          setSelectedGenreId(newGenreId);
          setPage(1);
          setContentItems([]);
          setIsLoading(true);
      }
      // Modal is closed by its internal handleSelect
  };

  const handleRefresh = () => {
      setPage(1); 
  };

  const handleItemPress = (item: ContentItem) => {
    switch ((item as any).media_type) {
      case 'movie':
        navigation.navigate('MovieDetails', { movie: item as Movie });
        break;
      case 'tv': 
        navigation.navigate('TVShowDetails', { tvShow: item as TVShow });
        break;
      default:
        console.warn(`Navigation for media type ${(item as any)?.media_type} not handled.`);
    }
  };

  // Sorting Buttons (pass handler that resets page)
  const SortSelector: React.FC<{ currentSort: SortOption, onSelect: (option: SortOption) => void }> =
    ({ currentSort, onSelect }) => {
      const options: { label: string, value: SortOption }[] = [
        { label: 'Popularity', value: 'popularity' },
        { label: 'Rating', value: 'rating' },
        { label: 'Release Date', value: 'release_date' },
      ];
      return (
        <View style={styles.sortContainer}>
           {options.map(option => (
             <TouchableOpacity
               key={option.value}
               style={[ styles.sortButton, currentSort === option.value && styles.sortButtonActive ]}
               onPress={() => onSelect(option.value)} >
               <Text style={[ styles.sortButtonText, currentSort === option.value && styles.sortButtonTextActive ]}>
                 {option.label}
               </Text>
             </TouchableOpacity>
           ))}
         </View>
      );
    };
    
  // Genre Selector UI - triggers the modal
  const GenreSelector: React.FC = () => {
      const selectedGenre = availableGenres.find(g => g.id === selectedGenreId);
      const displayText = selectedGenre ? selectedGenre.name : 'All Genres';
      return (
          <TouchableOpacity 
              style={styles.genreSelectorContainer} 
              onPress={() => setIsGenreModalVisible(true)} 
              disabled={availableGenres.length === 0}
          >
              <Text style={styles.genreSelectorText}>Genre: {displayText}</Text>
              <Text style={styles.genreSelectorLink}>Change</Text>
          </TouchableOpacity>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
       <SortSelector currentSort={sortOption} onSelect={handleSortChange} />
       <GenreSelector />
       <View style={styles.innerContainer}>
        <ContentList
          items={contentItems}
          isLoading={isLoading && page === 1 && !isRefreshing}
          isRefreshing={isRefreshing}
          error={error}
          onItemPress={handleItemPress}
          onEndReached={handleLoadMore}
          onRefresh={handleRefresh}
        />
      </View>
      <GenrePickerModal
          isVisible={isGenreModalVisible}
          genres={availableGenres}
          selectedGenreId={selectedGenreId}
          onSelectGenre={handleGenreChange}
          onClose={() => setIsGenreModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sortButton: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding / 2,
    borderRadius: SIZES.radius,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  sortButtonActive: {
    borderBottomColor: COLORS.primary,
  },
  sortButtonText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  sortButtonTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  genreSelectorContainer: { 
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SIZES.padding / 2,
      paddingHorizontal: SIZES.padding * 1.5, 
      backgroundColor: COLORS.lightGray2, 
      borderBottomWidth: 1,
      borderBottomColor: COLORS.lightGray, 
  },
  genreSelectorText: {
      ...FONTS.body4,
      color: COLORS.textSecondary,
  },
  genreSelectorLink: {
      ...FONTS.body4,
      color: COLORS.primary,
      fontWeight: '600',
  }
});

export default PopularMoviesScreen; 