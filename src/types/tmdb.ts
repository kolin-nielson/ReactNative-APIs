export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids?: number[];
  media_type?: 'movie';
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids?: number[];
  media_type?: 'tv';
}

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


export interface MovieDetails extends Movie {
  genres: Genre[]; 
  homepage?: string;
  status?: string;
  runtime?: number; 
}

export interface TVShowDetails extends TVShow {
  genres: Genre[]; 
  homepage?: string;
  status?: string;
  number_of_seasons?: number; 
  number_of_episodes?: number; 
}

export type ContentDetailsUnion = MovieDetails | TVShowDetails;


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

export interface GenreListResponse {
  genres: Genre[];
} 