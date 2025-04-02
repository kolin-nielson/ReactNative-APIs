import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getTopRatedMovies } from '../api/tmdbService';
import ContentList from '../components/ContentList';
import { Movie, ContentItem, TVShow } from '../types/tmdb';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SIZES, COLORS } from '../styles/theme';

type TopRatedMoviesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TopRatedMoviesScreen: React.FC = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigation = useNavigation<TopRatedMoviesScreenNavigationProp>();
  const [fetchingPage, setFetchingPage] = useState<number | null>(null);

  const fetchMovies = useCallback(async (currentPage: number, refreshing: boolean = false) => {
    if (fetchingPage === currentPage || (isLoading && !refreshing)) return;

    setFetchingPage(currentPage);
    if (refreshing) {
        setIsRefreshing(true);
    } else if (currentPage === 1) {
        setIsLoading(true);
    }
    setError(null);

    try {
      const data = await getTopRatedMovies(currentPage);
      const fetchedContentItems: ContentItem[] = data.results.map(movie => ({
          ...movie,
          media_type: 'movie' as const
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
      if (currentPage === 1) {
          setPage(1);
      }
    } catch (err) {
      const fetchError = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(fetchError);
      console.error("Failed to fetch top rated movies:", fetchError);
    } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setFetchingPage(null);
    }
  }, [fetchingPage, isLoading]);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const handleLoadMore = () => {
    if (page < totalPages && !isLoading && !isRefreshing && fetchingPage !== page + 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
      setPage(1);
      fetchMovies(1, true);
  };

  const handleItemPress = (item: ContentItem) => {
    switch (item.media_type) {
      case 'movie':
        navigation.navigate('MovieDetails', { movie: item as Movie });
        break;
      case 'tv':
        navigation.navigate('TVShowDetails', { tvShow: item as TVShow });
        break;
      default:
        console.warn(`Navigation for media type ${item.media_type} not handled.`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
  }
});

export default TopRatedMoviesScreen; 