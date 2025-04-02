import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchContent } from '../api/tmdbService';
import ContentList from '../components/ContentList';
import SearchBar from '../components/SearchBar';
import { Movie, TVShow, ContentItem } from '../types/tmdb';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FONTS, SIZES, COLORS } from '../styles/theme';
import useDebounce from '../hooks/useDebounce';

type SearchMoviesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SearchMoviesScreen: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const navigation = useNavigation<SearchMoviesScreenNavigationProp>();
  const [fetchingPage, setFetchingPage] = useState<number | null>(null);

  const fetchResults = useCallback(async (searchQuery: string, currentPage: number, isNewSearch: boolean = false) => {
    if (!searchQuery) {
        setResults([]);
        setTotalPages(1);
        setIsLoading(false);
        setError(null);
        setHasSearched(false);
        return;
    }

    if (fetchingPage === currentPage) return;

    setFetchingPage(currentPage);
    setHasSearched(true);
    
    if (isNewSearch || currentPage === 1) {
        setIsLoading(true);
    }
    setError(null);

    try {
        const data = await searchContent(searchQuery, currentPage);
        const fetchedContentItems: ContentItem[] = data.results.filter(
            (item: any): item is ContentItem => 
                (item.media_type === 'movie' || item.media_type === 'tv') && item.id
        );

        setResults((prevResults) => {
            if (isNewSearch || currentPage === 1) {
                return fetchedContentItems;
            } else {
                const existingIds = new Set(prevResults.map(item => `${item.media_type}-${item.id}`));
                const newUniqueItems = fetchedContentItems.filter(item => !existingIds.has(`${item.media_type}-${item.id}`));
                return [...prevResults, ...newUniqueItems];
            }
        });
        setTotalPages(data.total_pages);
    } catch (err) {
        const fetchError = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(fetchError);
        console.error("Failed to fetch search results:", fetchError);
    } finally {
        setIsLoading(false);
        setFetchingPage(null);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setResults([]);
    fetchResults(debouncedQuery, 1, true);
  }, [debouncedQuery, fetchResults]);

  useEffect(() => {
    if (page > 1) {
        fetchResults(debouncedQuery, page, false);
    }
  }, [page]);

  const handleLoadMore = () => {
    if (page < totalPages && !isLoading && fetchingPage !== page + 1) {
        setPage(prevPage => prevPage + 1);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setPage(1);
    setTotalPages(1);
    setError(null);
    setHasSearched(false);
  };

  const handleItemPress = useCallback((item: ContentItem) => {
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
  }, [navigation]);

  const EmptyComponent = useCallback(() => (
      <View style={styles.centeredMessage}>
          <Text style={styles.infoText}>
              {hasSearched ? 'No results found.' : 'Search for movies and TV shows.'}
          </Text>
      </View>
  ), [hasSearched]);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar 
        value={query} 
        onChangeText={setQuery} 
        onClear={handleClear} 
      />
      <View style={styles.listContainer}>
        <ContentList
          items={results}
          isLoading={isLoading && page === 1}
          error={error}
          onItemPress={handleItemPress}
          onEndReached={handleLoadMore}
          ListEmptyComponent={!isLoading ? <EmptyComponent /> : null}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
      flex: 1,
  },
  centeredMessage: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  infoText: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
      textAlign: 'center',
  },
});

export default SearchMoviesScreen; 