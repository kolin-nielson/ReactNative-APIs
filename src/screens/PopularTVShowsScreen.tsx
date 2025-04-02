import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { discoverTVShows, getTVGenres } from '../api/tmdbService';
import ContentList from '../components/ContentList';
import { TVShow, ContentItem, Genre } from '../types/tmdb';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONTS, SIZES, COLORS } from '../styles/theme';
import GenrePickerModal from '../components/GenrePickerModal';

// Use the RootStackParamList as TVShows tab is inside the stack
type PopularTVShowsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type SortOption = 'popularity' | 'rating' | 'first_air_date'; // Use first_air_date for TV

const PopularTVShowsScreen: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigation = useNavigation<PopularTVShowsScreenNavigationProp>();
  const [fetchingPage, setFetchingPage] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('popularity'); // Default to popularity
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [isGenreModalVisible, setIsGenreModalVisible] = useState<boolean>(false);

  // Fetch available genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getTVGenres(); // Fetch TV genres
        setAvailableGenres(genreData.genres);
      } catch (err) {
        console.error("Failed to fetch TV genres:", err);
      }
    };
    fetchGenres();
  }, []);

  // Map UI sort option to TMDB API sort_by parameter
  const getApiSortBy = (option: SortOption): string => {
      switch (option) {
          case 'rating': return 'vote_average.desc';
          case 'first_air_date': return 'first_air_date.desc'; // TV sort key
          case 'popularity': 
          default: return 'popularity.desc';
      }
  };

  const fetchTVShows = useCallback(async (currentPage: number, refreshing: boolean = false) => {
    const currentSortBy = getApiSortBy(sortOption);
    const currentGenreFilter = selectedGenreId ? String(selectedGenreId) : undefined;
    if (fetchingPage === currentPage || (isLoading && !refreshing && currentPage > 1 )) return;
    setFetchingPage(currentPage);
    
    if (refreshing) {
        setIsRefreshing(true);
        setIsLoading(false); 
    } else if (currentPage === 1) {
        setIsLoading(true); 
    } else {
        setIsLoading(false);
    }
    setError(null);

    try {
      const data = await discoverTVShows(currentPage, currentSortBy, currentGenreFilter);
      const fetchedContentItems: ContentItem[] = data.results.map(tvShow => ({
          ...tvShow,
          media_type: 'tv' as const
      }));
      setContentItems((prevItems) => {
        if (currentPage === 1) {
          return fetchedContentItems;
        } else {
          const existingIds = new Set(prevItems.map(item => `${item.media_type}-${item.id}`));
          const newUniqueItems = fetchedContentItems.filter(item => !existingIds.has(`${item.media_type}-${item.id}`));
          return [...prevItems, ...newUniqueItems];
        }
      });
      setTotalPages(data.total_pages);
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(fetchError);
      console.error("Failed to fetch discover TV shows:", fetchError);
    } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setFetchingPage(null);
    }
  }, [sortOption, selectedGenreId]);

  useEffect(() => {
    fetchTVShows(page, page === 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortOption, selectedGenreId]);

  const handleLoadMore = () => {
    if (page < totalPages && !isLoading && !isRefreshing && fetchingPage !== page + 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSortChange = (newSortOption: SortOption) => {
      if (newSortOption !== sortOption) {
          setSortOption(newSortOption);
          setPage(1);
          setContentItems([]); 
          setIsLoading(true);
      }
  };

  const handleGenreChange = (newGenreId: number | null) => {
      if (newGenreId !== selectedGenreId) {
          setSelectedGenreId(newGenreId);
          setPage(1);
          setContentItems([]); 
          setIsLoading(true);
      }
  };

  const handleRefresh = () => {
      setPage(1);
  };

  const handleItemPress = (item: ContentItem) => {
    if (item.media_type === 'tv') {
        navigation.navigate('TVShowDetails', { tvShow: item as TVShow });
    } else {
        console.warn("Navigation for movie details from TV screen not expected.");
    }
  };

  const SortSelector: React.FC<{ currentSort: SortOption, onSelect: (option: SortOption) => void }> =
    ({ currentSort, onSelect }) => {
      const options: { label: string, value: SortOption }[] = [
        { label: 'Popularity', value: 'popularity' },
        { label: 'Rating', value: 'rating' },
        { label: 'First Aired', value: 'first_air_date' },
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

export default PopularTVShowsScreen; 