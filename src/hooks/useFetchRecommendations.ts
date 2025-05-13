import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRecommendations } from '../services/openAi';
import { searchMovieByTitle } from '../services/tmdb';
import { useMovieStore } from '../store/movieStore';
import type { Movie } from '../types/sharedTypes';

export const useFetchRecommendations = () => {
  const { i18n } = useTranslation();
  const { selectedMovies } = useMovieStore();

  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [hasErrorOnRecommendationsFetch, setHasErrorOnRecommendationsFetch] =
    useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoadingRecommendations(true);

      try {
        const titles = selectedMovies.map((m) => m.title);
        const language = i18n.language === 'en' ? 'en-US' : i18n.language;

        const recommendedTitles: string[] = await getRecommendations(
          titles,
          language
        );

        const fetchedMovies = (
          await Promise.all(
            recommendedTitles.map((title) =>
              searchMovieByTitle(title, language)
            )
          )
        ).filter(Boolean) as Movie[];

        setRecommendedMovies(fetchedMovies);
        setHasRecommendations(true);
      } catch (err) {
        setHasErrorOnRecommendationsFetch(true);
        void err;
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    if (selectedMovies.length === 4) {
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMovies]);

  return {
    recommendedMovies,
    isLoadingRecommendations,
    hasErrorOnRecommendationsFetch,
    hasRecommendations,
  };
};
