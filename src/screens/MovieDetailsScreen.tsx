import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import ContentDetailsView from '../components/ContentDetailsView';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getMovieDetails, getMovieWatchProviders } from '../api/tmdbService';
import { Movie, MovieDetails, WatchProviderResponse } from '../types/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS, COLORS } from '../styles/theme';
import LoadingIndicator from '../components/LoadingIndicator';

// Define the type for the route params for this screen
type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;

const MovieDetailsScreen: React.FC = () => {
  const route = useRoute<MovieDetailsScreenRouteProp>();
  const navigation = useNavigation(); // Use plain navigation for header options
  const { movie: initialMovieData } = route.params; // Initial data passed from list

  const [details, setDetails] = useState<MovieDetails | null>(null); // Initialize as null
  const [providers, setProviders] = useState<WatchProviderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading true
  const [error, setError] = useState<Error | null>(null);

  const { isItemInList, addItemToWatchlist, removeItemFromWatchlist } = useWatchlist();
  // Check against details first, fallback to initial data if details haven't loaded
  const isWatchlisted = details
    ? isItemInList(details.id, 'movie')
    : isItemInList(initialMovieData.id, 'movie');

  // Fetch full details and providers on mount
  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [detailsResult, providersResult] = await Promise.allSettled([
          getMovieDetails(initialMovieData.id),
          getMovieWatchProviders(initialMovieData.id)
        ]);

        if (detailsResult.status === 'fulfilled') {
          setDetails(detailsResult.value);
        } else {
          console.error("Failed to fetch movie details:", detailsResult.reason);
        }

        if (providersResult.status === 'fulfilled') {
          setProviders(providersResult.value);
        } else {
           console.error("Failed to fetch watch providers:", providersResult.reason);
        }
        
        if (detailsResult.status === 'rejected') {
             setError(detailsResult.reason instanceof Error ? detailsResult.reason : new Error('Failed to load details.'));
        }

      } catch (err) {
        // Catch any other unexpected errors during Promise.allSettled or setup
        const fetchError = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(fetchError);
        console.error("Error in fetchDetails effect:", fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [initialMovieData.id]); // Re-run if the movie ID changes

  // Watchlist toggle handler
  const handleWatchlistToggle = () => {
    // Use initial data as fallback if full details haven't loaded yet
    const itemData = details ?? initialMovieData;
    if (!itemData) return;

    // Ensure media_type is present
    const itemToAddOrRemove = { 
        ...itemData, 
        media_type: 'movie' as const 
    };

    if (isWatchlisted) {
      removeItemFromWatchlist(itemToAddOrRemove.id, itemToAddOrRemove.media_type);
    } else {
      // Ensure we pass a valid ContentItem (Movie with media_type)
      addItemToWatchlist(itemToAddOrRemove);
    }
  };

  // Set header button dynamically based on watchlist state
  useLayoutEffect(() => {
    const canToggle = !!(details ?? initialMovieData);
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
            onPress={handleWatchlistToggle} 
            style={styles.headerButton}
            disabled={!canToggle}
        >
          <Ionicons 
            name={isWatchlisted ? 'bookmark' : 'bookmark-outline'} 
            size={28} 
            color={canToggle ? COLORS.primary : COLORS.gray} // Use static COLORS
          />
        </TouchableOpacity>
      ),
      title: details?.title ?? initialMovieData.title ?? 'Movie Details',
    });
  }, [navigation, isWatchlisted, handleWatchlistToggle, details, initialMovieData]); // Remove colors dependency

  // Render Loading state
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // Render Error state - show error if fetch failed AND details are still null
  if (error && !details) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>Failed to load movie details.</Text>
        <Text style={styles.errorInfo}>{error.message}</Text>
      </SafeAreaView>
    );
  }

  // Render Content - Only render ContentDetailsView if details are available
  if (details) {
      return (
        <SafeAreaView style={styles.container}>
          <ContentDetailsView details={details} providers={providers} />
        </SafeAreaView>
      );
  }

  // Fallback if loading finished but details are somehow still null (shouldn't happen if fetch is successful)
  return (
    <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>Movie details could not be displayed.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  containerCentered: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  headerButton: {
    marginRight: SIZES.padding,
  },
  errorText: {
    ...FONTS.h3,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  errorInfo: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
  }
});

export default MovieDetailsScreen; 