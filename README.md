# Movie & TV Show Explorer App

This is a React Native application built with Expo and TypeScript that allows users to discover popular and top-rated movies and TV shows, search for content, view details including watch providers, and manage a personal watchlist. It utilizes the The Movie Database (TMDB) API.

## Features

*   **Discover Content:** Browse separate sections for popular Movies and TV Shows.
*   **Search:** Find movies and TV shows by title.
*   **Detailed Views:** Get comprehensive details for movies and TV shows, including synopsis, ratings, release dates, genres, runtime/seasons, and status.
*   **Watch Providers:** See where to stream, rent, or buy content (powered by JustWatch via TMDB).
*   **Watchlist:** Add/remove movies and TV shows to a persistent watchlist stored locally on the device.
*   **Loading States:** Provides visual feedback while fetching data.
*   **Pull-to-Refresh:** Refresh content lists easily.

## Technology Stack

*   React Native
*   Expo
*   TypeScript
*   React Navigation (for Tab and Stack navigation)
*   The Movie Database (TMDB) API
*   AsyncStorage (for Watchlist persistence)


## Project Structure

*   `src/api/`: Contains the TMDB API service logic (`tmdbService.ts`).
*   `src/assets/`: Static assets like placeholder images.
*   `src/components/`: Reusable UI components (`ContentItemCard`, `ContentList`, `ContentDetailsView`, etc.).
*   `src/constants/`: Application constants (API keys, base URLs).
*   `src/context/`: React Context for global state management (e.g., `WatchlistContext`).
*   `src/hooks/`: Custom hooks (e.g., `useWatchlist`).
*   `src/navigation/`: Navigation setup (`AppNavigator.tsx`).
*   `src/screens/`: Top-level screen components for each tab/view.
*   `src/styles/`: Global theme and styling (`theme.ts`).
*   `src/types/`: TypeScript type definitions, especially for API responses (`tmdb.ts`).
*   `App.tsx`: The main application entry point.
