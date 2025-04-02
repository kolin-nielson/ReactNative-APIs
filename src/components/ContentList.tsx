import React from 'react';
import { FlatList, StyleSheet, View, Text, ListRenderItemInfo, RefreshControl } from 'react-native';
import ContentItemCard from './ContentItemCard';
import LoadingIndicator from './LoadingIndicator';
import { ContentItem } from '../types/tmdb';
import { SIZES, FONTS, COLORS } from '../styles/theme';
import { useWatchlist } from '../context/WatchlistContext';

interface ContentListProps {
  items: ContentItem[];
  isLoading: boolean;
  error: Error | null;
  onItemPress: (item: ContentItem) => void;
  onEndReached?: () => void;
  ListEmptyComponent?: React.ReactElement | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const ContentList: React.FC<ContentListProps> = ({
  items,
  isLoading,
  error,
  onItemPress,
  onEndReached,
  ListEmptyComponent,
  onRefresh,
  isRefreshing = false,
}) => {
  const { isItemInList, addItemToWatchlist, removeItemFromWatchlist } = useWatchlist();

  const styles = staticStyles(SIZES, FONTS);
  
  if (isLoading && items.length === 0 && !isRefreshing) {
    return <LoadingIndicator />;
  }

  if (error && !isRefreshing) {
    return (
      <View style={styles.centeredMessage}>
        <Text style={styles.errorText}>Error loading content: {error.message}</Text>
        {onRefresh && <Text style={styles.infoText}>(Pull down to retry)</Text>} 
      </View>
    );
  }

  const handleWatchlistToggle = (item: ContentItem) => {
    if (isItemInList(item.id, item.media_type)) {
        removeItemFromWatchlist(item.id, item.media_type);
    } else {
        addItemToWatchlist(item);
    }
  }

  const renderContentItem = ({ item }: ListRenderItemInfo<ContentItem>) => (
    <ContentItemCard 
        item={item} 
        onPress={onItemPress}
        isWatchlisted={isItemInList(item.id, item.media_type)}
        onWatchlistPress={handleWatchlistToggle}
    />
  );

  const renderListFooter = () => {
    if (isLoading && items.length > 0 && !isRefreshing) {
        return <LoadingIndicator size="small" style={styles.footerLoading}/>;
    }
    return null;
  };

  const resolvedEmptyComponent = ListEmptyComponent !== undefined ? ListEmptyComponent : (
      <View style={styles.centeredMessage}>
          {!error && <Text style={styles.infoText}>No content found.</Text>}
      </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderContentItem}
      keyExtractor={(item) => `${item.media_type}-${item.id}` }
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      style={styles.listBackground}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderListFooter}
      ListEmptyComponent={!isLoading && !isRefreshing ? resolvedEmptyComponent : null}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        ) : undefined
      }
    />
  );
};

const staticStyles = (SIZES: any, FONTS: any) => StyleSheet.create({
  listContainer: {
    paddingHorizontal: SIZES.padding / 2,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  listBackground: {
      backgroundColor: COLORS.background,
  },
  centeredMessage: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    minHeight: SIZES.height / 2,
    backgroundColor: COLORS.background,
  },
  errorText: {
      ...FONTS.h4,
      color: COLORS.danger,
      textAlign: 'center',
      marginBottom: SIZES.base,
  },
  infoText: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
      textAlign: 'center',
  },
  footerLoading: {
      paddingVertical: SIZES.padding,
      backgroundColor: COLORS.background,
  }
});

export default ContentList; 