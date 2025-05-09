import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

import PopularMoviesScreen from '../screens/PopularMoviesScreen';
import PopularTVShowsScreen from '../screens/PopularTVShowsScreen';
import SearchMoviesScreen from '../screens/SearchMoviesScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import TVShowDetailsScreen from '../screens/TVShowDetailsScreen';

import { Movie, TVShow } from '../types/tmdb';

export type TabParamList = {
  Movies: undefined;
  TVShows: undefined;
  Search: undefined;
  Watchlist: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  MovieDetails: { movie: Movie };
  TVShowDetails: { tvShow: TVShow };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  BottomTabScreenProps<TabParamList, T>;

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.lightGray,
            paddingTop: 4,
            paddingBottom: 4,
        },
        tabBarLabelStyle: {
            ...FONTS.body5,
            fontWeight: '600',
            marginTop: -2,
        },
        headerStyle: { 
            backgroundColor: colors.white,
            shadowOpacity: 0.1,
            elevation: 2,
            borderBottomWidth: 0,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { ...FONTS.h3, color: colors.textPrimary },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap | undefined;
          const iconSize = focused ? size * 1.0 : size * 0.9;

          if (route.name === 'Movies') {
            iconName = focused ? 'film' : 'film-outline';
          } else if (route.name === 'TVShows') {
            iconName = focused ? 'tv' : 'tv-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Watchlist') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
          }

          if (!iconName) {
              iconName = 'alert-circle-outline';
          }
          return <Ionicons name={iconName} size={iconSize} color={color} style={{ marginBottom: -5 }} />;
        },
      })}
    >
      <Tab.Screen name="Movies" component={PopularMoviesScreen} />
      <Tab.Screen name="TVShows" component={PopularTVShowsScreen} options={{ title: 'TV Shows' }}/>
      <Tab.Screen name="Search" component={SearchMoviesScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
            headerStyle: { 
                backgroundColor: colors.white,
                shadowOpacity: 0.1,
                elevation: 2,
                borderBottomWidth: 0,
            },
            headerTintColor: colors.primary,
            headerTitleStyle: { ...FONTS.h3, color: colors.textPrimary },
            headerBackTitleVisible: false,
            contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailsScreen}
        />
        <Stack.Screen
          name="TVShowDetails"
          component={TVShowDetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 