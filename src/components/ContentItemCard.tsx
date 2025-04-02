import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import { TMDB_IMAGE_BASE_URL } from '../constants/api';
import { ContentItem, Movie, TVShow } from '../types/tmdb';
import { SIZES, FONTS, COLORS } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const numColumns = 2;
const cardMarginHorizontal = SIZES.padding / 2;
const cardMarginVertical = SIZES.padding / 2;
const totalHorizontalMargin = SIZES.padding * (numColumns + 1);
const cardWidth = (SIZES.width - totalHorizontalMargin) / numColumns;

interface ContentItemCardProps {
  item: ContentItem;
  onPress: (item: ContentItem) => void;
  isWatchlisted: boolean;
  onWatchlistPress: (item: ContentItem) => void;
}

const placeholderImageSource: ImageSourcePropType = require('../assets/placeholder.png');

const ContentItemCard: React.FC<ContentItemCardProps> = React.memo(({ 
    item, 
    onPress, 
    isWatchlisted, 
    onWatchlistPress 
}) => {
  const imageUrl = item.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
    : null;

  const title = item.media_type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const date = item.media_type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  const imageSource: ImageSourcePropType = imageUrl ? { uri: imageUrl } : placeholderImageSource;

  const handleWatchlistPress = (e: any) => {
    e.stopPropagation();
    onWatchlistPress(item);
  }

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.container}>
      <Image
        source={imageSource}
        style={styles.poster}
        resizeMode="cover"
      />
      <TouchableOpacity onPress={handleWatchlistPress} style={styles.watchlistButton}>
          <Ionicons 
            name={isWatchlisted ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isWatchlisted ? COLORS.primary : COLORS.white}
          />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.details}>
          {`★ ${item.vote_average.toFixed(1)} | ${year}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginHorizontal: cardMarginHorizontal,
    marginBottom: SIZES.padding * 1.5,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'visible',
    ...Platform.select({
        ios: {
            shadowColor: COLORS.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        },
        android: {
            elevation: 6,
        },
    }),
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.5,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
  },
  watchlistButton: {
      position: 'absolute',
      top: SIZES.base,
      right: SIZES.base,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
  },
  infoContainer: {
    padding: SIZES.padding * 0.75,
    minHeight: 70,
    justifyContent: 'space-between',
  },
  title: {
    ...FONTS.body4,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  details: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
  },
});

export default ContentItemCard; 