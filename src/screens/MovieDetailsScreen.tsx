import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import ContentDetailsView from '../components/ContentDetailsView';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getMovieDetails, getMovieWatchProviders } from '../api/tmdbService';
import { Movie, MovieDetails, WatchProviderResponse } from '../types/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';
import LoadingIndicator from '../components/LoadingIndicator';

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetails'>;

const MovieDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const styles = createThemedStyles(colors, SIZES, FONTS);
  
  const route = useRoute<MovieDetailsScreenRouteProp>();
  const navigation = useNavigation();
  const { movie: initialMovieData } = route.params;

  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [providers, setProviders] = useState<WatchProviderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { isItemInList, addItemToWatchlist, removeItemFromWatchlist } = useWatchlist();
  const isWatchlisted = details
    ? isItemInList(details.id, 'movie')
    : isItemInList(initialMovieData.id, 'movie');

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
        const fetchError = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(fetchError);
        console.error("Error in fetchDetails effect:", fetchError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [initialMovieData.id]);

  const handleWatchlistToggle = () => {
    const itemData = details ?? initialMovieData;
    if (!itemData) return;

    const itemToAddOrRemove = { 
        ...itemData, 
        media_type: 'movie' as const 
    };

    if (isWatchlisted) {
      removeItemFromWatchlist(itemToAddOrRemove.id, itemToAddOrRemove.media_type);
    } else {
      addItemToWatchlist(itemToAddOrRemove);
    }
  };

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
            color={canToggle ? colors.primary : colors.gray}
          />
        </TouchableOpacity>
      ),
      title: details?.title ?? initialMovieData.title ?? 'Movie Details',
    });
  }, [navigation, isWatchlisted, handleWatchlistToggle, details, initialMovieData, colors]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error && !details) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>Failed to load movie details.</Text>
        <Text style={styles.errorInfo}>{error.message}</Text>
      </SafeAreaView>
    );
  }

  if (details) {
      return (
        <SafeAreaView style={styles.container}>
          <ContentDetailsView details={details} providers={providers} />
        </SafeAreaView>
      );
  }

  return (
    <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>Movie details could not be displayed.</Text>
    </SafeAreaView>
  );
};

const createThemedStyles = (colors: typeof import('../styles/theme').lightColors, SIZES: any, FONTS: any) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    containerCentered: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SIZES.padding,
    },
    headerButton: {
      marginRight: SIZES.padding,
    },
    errorText: {
      ...FONTS.h3,
      color: colors.danger,
      textAlign: 'center',
      marginBottom: SIZES.base,
    },
    errorInfo: {
      ...FONTS.body4,
      color: colors.textSecondary,
      textAlign: 'center',
    }
});

export default MovieDetailsScreen; 