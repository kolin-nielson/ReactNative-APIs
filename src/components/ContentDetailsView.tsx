import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageSourcePropType,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { TMDB_IMAGE_BASE_URL } from '../constants/api';
import { Movie, TVShow, ContentDetailsUnion, WatchProvider, WatchProviderResponse, Genre, MovieDetails, TVShowDetails } from '../types/tmdb';
import { SIZES, FONTS, COLORS } from '../styles/theme';

interface ContentDetailsViewProps {
  details: ContentDetailsUnion | null | undefined; // Accept MovieDetails or TVShowDetails
  providers: WatchProviderResponse | null | undefined; // Add providers prop
}

const placeholderImageSource: ImageSourcePropType = require('../assets/placeholder.png');

// Helper to render a list of genres
const GenresList: React.FC<{ genres: Genre[] | undefined }> = ({ genres }) => {
    if (!genres || genres.length === 0) return null;
    return (
        <View style={styles.genresContainer}>
            {genres.map((genre) => (
                <View key={genre.id} style={styles.genreBadge}>
                    <Text style={styles.genreText}>{genre.name}</Text>
                </View>
            ))}
        </View>
    );
};

// Helper to render watch providers
const WatchProvidersSection: React.FC<{ providers: WatchProviderResponse | null | undefined, countryCode?: string }> = ({ providers, countryCode = 'US' }) => {
    const countryProviders = providers?.results?.[countryCode];
    if (!countryProviders || (!countryProviders.flatrate && !countryProviders.buy && !countryProviders.rent)) {
        return (
            <View style={styles.providerSection}>
                <Text style={styles.providerInfoText}>Watch providers not available for your region.</Text>
            </View>
        );
    }

    const renderProviderList = (title: string, providerList: WatchProvider[] | undefined) => {
        if (!providerList || providerList.length === 0) return null;
        providerList.sort((a, b) => a.display_priority - b.display_priority);
        return (
            <View style={styles.providerCategory}>
                <Text style={styles.providerCategoryTitle}>{title}</Text>
                <View style={styles.providerListContainer}>
                    {providerList.map((provider) => (
                        <View key={provider.provider_id} style={styles.providerItem}>
                            {provider.logo_path && (
                                <Image 
                                    source={{ uri: `${TMDB_IMAGE_BASE_URL.replace('w500', 'w92')}${provider.logo_path}` }} 
                                    style={styles.providerLogo}
                                    resizeMode="contain"
                                />
                            )}
                            <Text style={styles.providerName}>{provider.provider_name}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.providerSection}>
            {renderProviderList('Stream', countryProviders.flatrate)}
            {renderProviderList('Rent', countryProviders.rent)}
            {renderProviderList('Buy', countryProviders.buy)}
            {countryProviders.link && (
                 <TouchableOpacity onPress={() => Linking.openURL(countryProviders.link!)}>
                     <Text style={styles.providerLink}>See all options on JustWatch</Text>
                 </TouchableOpacity>
            )}
        </View>
    );
};

const ContentDetailsView: React.FC<ContentDetailsViewProps> = ({ details, providers }) => {
  if (!details) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.infoText}>Loading details...</Text>
      </View>
    );
  }

  // Determine properties based on media type
  const isMovie = details.media_type === 'movie';
  const item = details as Movie | TVShow; // Base item for shared props
  const detailedItem = details as MovieDetails | TVShowDetails; // For specific detail props
  
  const title = isMovie ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const formattedDate = releaseDate ? new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const runtime = isMovie ? (detailedItem as MovieDetails).runtime : undefined; // Movie only
  const seasons = !isMovie ? (detailedItem as TVShowDetails).number_of_seasons : undefined; // TV only
  const episodes = !isMovie ? (detailedItem as TVShowDetails).number_of_episodes : undefined;
  const status = !isMovie ? (detailedItem as TVShowDetails).status : undefined;

  const posterImageUrl = item.poster_path
    ? `${TMDB_IMAGE_BASE_URL.replace('w500', 'w780')}${item.poster_path}`
    : null;
  const posterImageSource: ImageSourcePropType = posterImageUrl ? { uri: posterImageUrl } : placeholderImageSource;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
       <Image
        source={posterImageSource}
        style={styles.poster}
        resizeMode="contain"
      />
      <View style={styles.infoSection}>
        <Text style={styles.title}>{title}</Text>
        <GenresList genres={detailedItem.genres} />
        <View style={styles.detailsRow}>
            <View style={styles.detailItemContainer}>
                <Text style={styles.detailLabel}>{isMovie ? 'Release Date' : 'First Aired'}</Text>
                <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
            <View style={styles.detailItemContainer}>
                <Text style={styles.detailLabel}>Rating</Text>
                <Text style={styles.detailValue}>{`★ ${rating}`}</Text> 
            </View>
            {runtime !== undefined && (
                 <View style={styles.detailItemContainer}>
                    <Text style={styles.detailLabel}>Runtime</Text>
                    <Text style={styles.detailValue}>{`${runtime} min`}</Text> 
                </View>
            )}
             {seasons !== undefined && (
                 <View style={styles.detailItemContainer}>
                    <Text style={styles.detailLabel}>Seasons</Text>
                    <Text style={styles.detailValue}>{`${seasons}`}</Text> 
                </View>
            )}
            {episodes !== undefined && (
                 <View style={styles.detailItemContainer}>
                    <Text style={styles.detailLabel}>Episodes</Text>
                    <Text style={styles.detailValue}>{`${episodes}`}</Text> 
                </View>
            )}
            {status && (
                 <View style={styles.detailItemContainer}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={styles.detailValue}>{status}</Text> 
                </View>
            )}
        </View>
        <Text style={styles.sectionTitle}>Synopsis</Text>
        <Text style={styles.overview}>{item.overview || 'Synopsis not available.'}</Text>
        
        <Text style={styles.sectionTitle}>Where to Watch</Text>
        <WatchProvidersSection providers={providers} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SIZES.padding * 3,
    alignItems: 'center',
  },
  poster: {
    width: SIZES.width * 0.8,
    height: SIZES.width * 0.8 * 1.5,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius * 1.5,
    backgroundColor: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  infoSection: {
      width: '100%',
      paddingHorizontal: SIZES.padding * 1.5, 
      marginTop: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SIZES.base,
    color: COLORS.textPrimary,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SIZES.padding2,
  },
  genreBadge: {
    backgroundColor: COLORS.lightGray2,
    borderRadius: SIZES.radius * 2,
    paddingVertical: SIZES.base / 2,
    paddingHorizontal: SIZES.base * 1.5,
    margin: SIZES.base / 2,
  },
  genreText: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: SIZES.padding2,
    paddingVertical: SIZES.padding,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
  },
  detailItemContainer: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: SIZES.base / 2,
  },
  detailLabel: {
      ...FONTS.body5,
      color: COLORS.textSecondary,
      marginBottom: SIZES.base / 2,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      textAlign: 'center',
  },
  detailValue: {
    ...FONTS.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  sectionTitle: {
    ...FONTS.h3,
    marginBottom: SIZES.padding,
    color: COLORS.textPrimary,
  },
  overview: {
    ...FONTS.body3,
    lineHeight: SIZES.body3.fontSize * 1.6,
    color: COLORS.textSecondary,
    textAlign: 'left',
    marginBottom: SIZES.padding2,
  },
  providerSection: {
    marginBottom: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: SIZES.padding,
  },
  providerCategory: {
      marginBottom: SIZES.padding,
  },
  providerCategoryTitle: {
    ...FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  providerListContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  providerItem: {
      alignItems: 'center',
      marginRight: SIZES.padding,
      marginBottom: SIZES.base,
      width: 60,
  },
  providerLogo: {
      width: 50,
      height: 50,
      borderRadius: SIZES.radius,
      marginBottom: SIZES.base / 2,
      backgroundColor: COLORS.lightGray, 
  },
  providerName: {
      ...FONTS.body5,
      color: COLORS.textSecondary,
      textAlign: 'center',
      fontSize: 10,
  },
  providerLink: {
      ...FONTS.body4,
      color: COLORS.primary,
      textAlign: 'center',
      marginTop: SIZES.base,
  },
  providerInfoText: {
      ...FONTS.body4,
      color: COLORS.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  infoText: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
  },
});

export default ContentDetailsView; 