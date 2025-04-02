import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import ContentDetailsView from '../components/ContentDetailsView'; // Use generic view
import { RootStackParamList } from '../navigation/AppNavigator';
import { getTVShowDetails, getTVShowWatchProviders } from '../api/tmdbService';
import { TVShow, TVShowDetails, WatchProviderResponse } from '../types/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, FONTS, COLORS } from '../styles/theme';
import LoadingIndicator from '../components/LoadingIndicator';

type TVShowDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TVShowDetails'>;

const TVShowDetailsScreen: React.FC = () => {
  const route = useRoute<TVShowDetailsScreenRouteProp>();
  const navigation = useNavigation();
  const { tvShow: initialTVData } = route.params; 

  const [details, setDetails] = useState<TVShowDetails | null>(null); 
  const [providers, setProviders] = useState<WatchProviderResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const { isItemInList, addItemToWatchlist, removeItemFromWatchlist } = useWatchlist();
  const isWatchlisted = details
    ? isItemInList(details.id, 'tv')
    : isItemInList(initialTVData.id, 'tv');

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [detailsResult, providersResult] = await Promise.allSettled([
          getTVShowDetails(initialTVData.id),
          getTVShowWatchProviders(initialTVData.id)
        ]);

        if (detailsResult.status === 'fulfilled') {
          setDetails(detailsResult.value);
        } else {
          console.error("Failed to fetch TV show details:", detailsResult.reason);
        }

        if (providersResult.status === 'fulfilled') {
          setProviders(providersResult.value);
        } else {
           console.error("Failed to fetch TV watch providers:", providersResult.reason);
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
  }, [initialTVData.id]);

  const handleWatchlistToggle = () => {
    const itemData = details ?? initialTVData;
    if (!itemData) return;

    const itemToAddOrRemove = { 
        ...itemData, 
        media_type: 'tv' as const 
    };

    if (isWatchlisted) {
      removeItemFromWatchlist(itemToAddOrRemove.id, itemToAddOrRemove.media_type);
    } else {
      addItemToWatchlist(itemToAddOrRemove);
    }
  };

  useLayoutEffect(() => {
    const canToggle = !!(details ?? initialTVData);
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
            color={canToggle ? COLORS.primary : COLORS.gray}
          />
        </TouchableOpacity>
      ),
      title: details?.name ?? initialTVData.name ?? 'TV Show Details',
    });
  }, [navigation, isWatchlisted, handleWatchlistToggle, details, initialTVData]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error && !details) {
    return (
      <SafeAreaView style={styles.containerCentered}>
        <Text style={styles.errorText}>Failed to load TV show details.</Text>
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
        <Text style={styles.errorText}>TV Show details could not be displayed.</Text>
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

export default TVShowDetailsScreen; 