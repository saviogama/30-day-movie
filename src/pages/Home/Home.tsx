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
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [hasQuery, setHasQuery] = useState(false);

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

      {!loading && showInitialSection ? (
        <section className="w-full text-center mt-8">
          <h1 className="text-4xl font-extrabold mb-4 text-rose-600">
            {t('title')}
          </h1>
          <p className="md:text-lg text-base max-w-xl mx-auto">
            {t('description.p1')}
          </p>
          <p className="md:text-base text-sm text-gray-500 max-w-xl mx-auto mt-1">
            {t('description.p2')}
          </p>

          <div className="mt-10">
            <MoviesBar />
            <SearchBar
              query={query}
              setQuery={setQuery}
              setHasQuery={setHasQuery}
              setSearchLoading={setSearchLoading}
            />
          </div>

          {searchLoading ? (
            <div className="flex flex-col items-center justify-center mt-10 gap-2 animate-fade-in">
              <div className="w-6 h-6 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-lg text-rose-600">{t('searchLoading')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-10 justify-items-center">
                {searchResults.map((movie) => (
                  <MovieCard key={movie.id} loading={loading} movie={movie} />
                ))}
              </div>
              {hasQuery && searchResults.length === 0 && (
                <p className="text-gray-500 text-sm mt-4">{t('noResults')}</p>
              )}
            </>
          )}
        </section>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center mt-10 gap-2 animate-fade-in">
          <div className="w-6 h-6 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg text-rose-600">{t('loading')}</p>
        </div>
      ) : (
        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">
            {t('result')}
          </h2>
          <button
            onClick={() => exportPDF(recommendedMovies, i18n.language)}
            className="px-4 py-2 mt-2 mb-6 bg-rose-600 text-white rounded hover:bg-rose-500 transition cursor-pointer"
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
                    isSelectionLocked={recommendedMovies.length > 0}
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
