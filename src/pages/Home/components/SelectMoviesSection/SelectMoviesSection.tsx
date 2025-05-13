import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../../../components/Loading/Loading';
import { MovieCard } from '../../../../components/MovieCard/MovieCard';
import { MoviesBar } from '../../../../components/MoviesBar/MoviesBar';
import { SearchBar } from '../../../../components/SearchBar/SearchBar';
import { useMovieStore } from '../../../../store/movieStore';

export function SelectMoviesSection({
  isLoadingRecommendations,
}: {
  isLoadingRecommendations: boolean;
}) {
  const { t } = useTranslation();
  const { searchResults } = useMovieStore();

  const [query, setQuery] = useState('');
  const [hasQuery, setHasQuery] = useState(false);
  const [isLoadingSearchedMovies, setIsLoadingSearchedMovies] = useState(false);
  const [hasErrorOnSearchedMoviesFetch, setHasErrorOnSearchedMoviesFetch] =
    useState(false);

  const hasNoMoviesFoundInSearch = hasQuery && searchResults.length === 0;

  const renderSection = () => {
    if (isLoadingSearchedMovies) {
      return <Loading message={t('searchLoading')} />;
    }

    if (hasErrorOnSearchedMoviesFetch) {
      return (
        <div className="flex flex-col items-center justify-center mt-10 gap-2 animate-fade-in">
          <p className="text-lg text-rose-600">
            {t('hasErrorOnSearchedMoviesFetch')}
          </p>
        </div>
      );
    }

    if (hasNoMoviesFoundInSearch) {
      return <p className="text-gray-500 text-sm mt-10">{t('noResults')}</p>;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-10 justify-items-center">
        {searchResults.map((movie) => (
          <MovieCard
            key={movie.id}
            loading={isLoadingRecommendations}
            movie={movie}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full text-center mt-8">
      <div>
        <h1 className="text-4xl font-extrabold mb-4 text-rose-600">
          {t('title')}
        </h1>
        <p className="md:text-lg text-base max-w-xl mx-auto">
          {t('description.p1')}
        </p>
        <p className="md:text-base text-sm text-gray-500 max-w-xl mx-auto mt-1">
          {t('description.p2')}
        </p>
      </div>

      <div className="mt-10">
        <MoviesBar />
        <SearchBar
          query={query}
          setHasErrorOnFetch={setHasErrorOnSearchedMoviesFetch}
          setHasQuery={setHasQuery}
          setIsLoadingSearchedMovies={setIsLoadingSearchedMovies}
          setQuery={setQuery}
        />
      </div>

      {renderSection()}
    </section>
  );
}
