export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string; // YYYY-MM-DD
  vote_average: number;
  overview: string;
  genre_ids?: number[]; // Often in list responses
  media_type?: 'movie'; // Useful for mixed lists/search
}

export interface TVShow {
  id: number;
  name: string; // Note: TV shows use 'name' instead of 'title'
  poster_path: string | null;
  first_air_date: string; // YYYY-MM-DD
  vote_average: number;
  overview: string;
  genre_ids?: number[];
  media_type?: 'tv';
}

// Unified type for easier handling in lists/components
export type ContentItem = (Movie & { media_type: 'movie' }) | (TVShow & { media_type: 'tv' });

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MovieListResponse = PaginatedResponse<Movie>;
export type TVShowListResponse = PaginatedResponse<TVShow>;
export type SearchListResponse = PaginatedResponse<ContentItem>;

// --- Detail Types --- 

export interface MovieDetails extends Movie {
  genres: Genre[]; 
  homepage?: string;
  status?: string;
  runtime?: number; 
  // Add other movie-specific detail fields if needed
}

export interface TVShowDetails extends TVShow {
  genres: Genre[]; 
  homepage?: string;
  status?: string;
  number_of_seasons?: number; 
  number_of_episodes?: number; 
  // Add other TV-specific detail fields if needed
}

// This union can represent the result of a details fetch before adding providers
export type ContentDetailsUnion = MovieDetails | TVShowDetails;

// --- Watch Provider Types --- 

export interface WatchProvider {
  logo_path: string | null;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface CountryWatchProviders {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProviderResult {
  [countryCode: string]: CountryWatchProviders;
}

export interface WatchProviderResponse {
  id: number;
  results: WatchProviderResult;
}

// Add Genre List Response Type
export interface GenreListResponse {
  genres: Genre[];
} 