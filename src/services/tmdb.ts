import axios from 'axios';
import type { Movie } from '../types/sharedTypes';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const searchMovies = async (query: string, language: string) => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query,
      language,
    },
  });

  return response.data.results;
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
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`
    );

    const data = await res.json();
    const country = data.results[language];

    if (country?.flatrate?.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return country.flatrate.map((p: any) => p.provider_name).join(', ');
    }
  } catch (err) {
    void err;
  }
  return '--';
}
