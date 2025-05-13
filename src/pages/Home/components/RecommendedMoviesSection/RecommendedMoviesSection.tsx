import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../components/Loading/Loading';
import { MovieCard } from '../../../../components/MovieCard/MovieCard';
import type { Movie } from '../../../../types/sharedTypes';
import { exportPDF } from '../../../../utils/exportPDF';

type props = {
  recommendedMovies: Movie[];
  isLoadingRecommendations: boolean;
  hasErrorOnRecommendationsFetch: boolean;
  hasRecommendations: boolean;
};

export function RecommendedMoviesSection({
  recommendedMovies,
  isLoadingRecommendations,
  hasErrorOnRecommendationsFetch,
  hasRecommendations,
}: props) {
  const { t, i18n } = useTranslation();

  const pdfRef = useRef<HTMLDivElement>(null);

  const renderSection = () => {
    if (isLoadingRecommendations) {
      return <Loading message={t('loading')} />;
    }

    if (hasErrorOnRecommendationsFetch) {
      return (
        <div className="flex flex-col items-center justify-center mt-10 gap-2 animate-fade-in">
          <p className="text-lg text-rose-600">
            {t('hasErrorOnRecommendationsFetch')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 bg-rose-600 text-white rounded hover:bg-rose-500 transition cursor-pointer"
          >
            {t('return')}
          </button>
        </div>
      );
    }

    if (hasRecommendations && recommendedMovies.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center mt-10 gap-2 animate-fade-in">
          <p className="text-lg text-rose-600">
            {t('hasErrorOnRecommendations')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 bg-rose-600 text-white rounded hover:bg-rose-500 transition cursor-pointer"
          >
            {t('return')}
          </button>
        </div>
      );
    }

    return (
      <div>
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
            {recommendedMovies.map((movie: Movie, index: number) => (
              <div key={movie.id} className="flex flex-col items-center">
                <span className="text-sm text-gray-500 mb-1">
                  {t('day')} {index + 1}
                </span>
                <MovieCard
                  key={movie.id}
                  isSelectionLocked={recommendedMovies.length > 0}
                  loading={isLoadingRecommendations}
                  movie={movie}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return <section>{renderSection()}</section>;
}
