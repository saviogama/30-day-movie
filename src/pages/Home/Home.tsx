import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import { MoviesBar } from '../../components/MoviesBar/MoviesBar';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { getRecommendations } from '../../services/openAi';
import { searchMovieByTitle } from '../../services/tmdb';
import { useMovieStore } from '../../store/movieStore';
import type { Movie } from '../../types/sharedTypes';
import { exportPDF } from '../../utils/exportPDF';

export default function Home() {
  const { searchResults, selectedMovies } = useMovieStore();
  const { t, i18n } = useTranslation();

  const pdfRef = useRef<HTMLDivElement>(null);

  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const showInitialSection = recommendedMovies.length === 0;

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);

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
      } catch (err) {
        void err;
      } finally {
        setLoading(false);
      }
    };

    if (selectedMovies.length === 4) {
      fetchRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMovies]);

  return (
    <main className="flex flex-col items-center p-6 max-w-6xl mx-auto">
      <LanguageSwitcher />

      {showInitialSection ? (
        <section>
          <h1 className="text-3xl font-bold text-center mt-4 mb-6">
            {t('title')}
          </h1>
          <p className="md:text-lg text-sm text-center">
            {t('description.p1')}
          </p>
          <p className="md:text-lg text-sm text-center">
            {t('description.p2')}
          </p>

          <MoviesBar />
          <SearchBar />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8 justify-items-center">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} loading={loading} movie={movie} />
            ))}
          </div>
        </section>
      ) : loading ? (
        <p className="text-lg mt-10">{t('loading')}</p>
      ) : (
        <section>
          <h2 className="text-2xl font-semibold my-4 text-center">
            {t('result')}
          </h2>
          <button
            onClick={() => exportPDF(recommendedMovies, i18n.language)}
            className="px-4 py-2 mt-2 mb-6 bg-red-600 text-white rounded hover:bg-red-900 transition cursor-pointer"
          >
            {t('export')}
          </button>
          <div ref={pdfRef}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
              {recommendedMovies.map((movie, index) => (
                <div key={movie.id} className="flex flex-col items-center">
                  <span className="text-sm text-gray-500 mb-1">
                    {t('day')} {index + 1}
                  </span>
                  <MovieCard
                    key={movie.id}
                    isSelectionLocked={recommendedMovies.length === 30}
                    loading={loading}
                    movie={movie}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
