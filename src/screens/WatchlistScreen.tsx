import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useWatchlist } from '../context/WatchlistContext';
import ContentList from '../components/ContentList';
import { Movie, TVShow, ContentItem } from '../types/tmdb';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SIZES, FONTS, COLORS } from '../styles/theme';
import LoadingIndicator from '../components/LoadingIndicator';

type WatchlistScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WatchlistScreen: React.FC = () => {
  const { watchlist, isLoading: isWatchlistLoading } = useWatchlist();
  const navigation = useNavigation<WatchlistScreenNavigationProp>();

  const handleItemPress = (item: ContentItem) => {
    if (item.media_type === 'movie') {
      navigation.navigate('MovieDetails', { movie: item as Movie });
    } else if (item.media_type === 'tv') {
      navigation.navigate('TVShowDetails', { tvShow: item as TVShow });
    } else {
      console.warn("Navigation for unknown media type from Watchlist not handled.");
    }
  };

  const sortedWatchlist = useMemo(() => {
    return [...watchlist].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
  }, [watchlist]);

  const renderEmptyList = () => {
    if (isWatchlistLoading) {
      return <LoadingIndicator />;
    }
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.infoText}>
          Your watchlist is empty. Add movies and TV shows using the bookmark icon.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ContentList
          items={sortedWatchlist}
          isLoading={isWatchlistLoading}
          error={null}
          onItemPress={handleItemPress}
          ListEmptyComponent={renderEmptyList()}
          onRefresh={undefined}
          isRefreshing={false}
          onEndReached={undefined}
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
    },
    centeredMessage: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding * 2,
        minHeight: SIZES.height / 2, 
    },
    infoText: {
        ...FONTS.body3,
        color: COLORS.textSecondary,
        textAlign: 'center',
    }
});

export default WatchlistScreen; 