import { TMDB_API_KEY, TMDB_BASE_URL } from '../constants/api';
import {
    MovieListResponse,
    TVShowListResponse,
    SearchListResponse,
    MovieDetails,
    TVShowDetails,
    WatchProviderResponse,
    GenreListResponse
} from '../types/tmdb';

interface QueryParams {
  [key: string]: string | number;
}

const apiFetch = async <T extends unknown>(endpoint: string, queryParams: QueryParams = {}): Promise<T> => {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
  });

  Object.keys(queryParams).forEach(key => {
      params.set(key, String(queryParams[key]));
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        const errorBody = await response.text();
        console.error('API Error Response:', errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};


export const getPopularMovies = (page: number = 1): Promise<MovieListResponse> => {
  return apiFetch<MovieListResponse>('/movie/popular', { page });
};

export const getTopRatedMovies = (page: number = 1): Promise<MovieListResponse> => {
  return apiFetch<MovieListResponse>('/movie/top_rated', { page });
};

export const discoverMovies = (page: number = 1, sortBy?: string, withGenres?: string): Promise<MovieListResponse> => {
  const params: QueryParams = { page };
  if (sortBy) {
      params.sort_by = sortBy;
  }
  if (withGenres) {
      params.with_genres = withGenres;
  }
  return apiFetch<MovieListResponse>('/discover/movie', params);
};

export const getMovieDetails = (movieId: number): Promise<MovieDetails> => {
    return apiFetch<MovieDetails>(`/movie/${movieId}`);
};

export const getMovieWatchProviders = (movieId: number): Promise<WatchProviderResponse> => {
    return apiFetch<WatchProviderResponse>(`/movie/${movieId}/watch/providers`);
};


export const getPopularTVShows = (page: number = 1): Promise<TVShowListResponse> => {
  return apiFetch<TVShowListResponse>('/tv/popular', { page });
};

export const getTopRatedTVShows = (page: number = 1): Promise<TVShowListResponse> => {
  return apiFetch<TVShowListResponse>('/tv/top_rated', { page });
};

export const discoverTVShows = (page: number = 1, sortBy?: string, withGenres?: string): Promise<TVShowListResponse> => {
  const params: QueryParams = { page };
  if (sortBy) {
      params.sort_by = sortBy;
  }
  if (withGenres) {
      params.with_genres = withGenres;
  }
  return apiFetch<TVShowListResponse>('/discover/tv', params);
};

export const getTVShowDetails = (tvShowId: number): Promise<TVShowDetails> => {
    return apiFetch<TVShowDetails>(`/tv/${tvShowId}`);
};

export const getTVShowWatchProviders = (tvShowId: number): Promise<WatchProviderResponse> => {
    return apiFetch<WatchProviderResponse>(`/tv/${tvShowId}/watch/providers`);
};


export const searchContent = (query: string, page: number = 1): Promise<SearchListResponse> => {
  if (!query) {
      return Promise.resolve({ page: 1, results: [], total_pages: 0, total_results: 0 });
  }
  return apiFetch<SearchListResponse>('/search/multi', { query, page });
};


export const getMovieGenres = (): Promise<GenreListResponse> => {
  return apiFetch<GenreListResponse>('/genre/movie/list');
};

export const getTVGenres = (): Promise<GenreListResponse> => {
  return apiFetch<GenreListResponse>('/genre/tv/list');
}; 