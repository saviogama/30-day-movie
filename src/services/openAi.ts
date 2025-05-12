import { api } from './api';

export async function getRecommendations(
  movieTitles: string[],
  language: string
): Promise<string[]> {
  const { data } = await api.post('/recommendations', {
    movieTitles,
    language,
  });

  return data.recommendations;
}
