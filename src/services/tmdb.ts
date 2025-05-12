import type { Movie } from '../types/sharedTypes';
import { api } from './api';

export const searchMovies = async (query: string, language: string) => {
  const { data } = await api.get('/search', {
    params: {
      query,
      language,
    },
  });

  return data;
};

export const searchMovieByTitle = async (
  title: string,
  language: string
): Promise<Movie | null> => {
  const results = await searchMovies(title, language);

  return results.length > 0 ? results[0] : null;
};

export async function getWatchProvider(
  movieId: number,
  language: string
): Promise<string> {
  try {
    const { data } = await api.get(`/watch-provider/${movieId}`, {
      params: {
        language,
      },
    });

    return data.providers;
  } catch (err) {
    void err;
  }

  return '--';
}
