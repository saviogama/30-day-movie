import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { searchMovies } from '../../services/tmdb';
import { useMovieStore } from '../../store/movieStore';

type props = {
  query: string;
  setHasErrorOnFetch: React.Dispatch<React.SetStateAction<boolean>>;
  setHasQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoadingSearchedMovies: React.Dispatch<React.SetStateAction<boolean>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchBar({
  query,
  setHasErrorOnFetch,
  setHasQuery,
  setIsLoadingSearchedMovies,
  setQuery,
}: props) {
  const { setSearchResults } = useMovieStore();
  const { t, i18n } = useTranslation();

  const debouncedSearch = useMemo(() => {
    return debounce(async (text: string) => {
      if (text.length > 1) {
        setHasErrorOnFetch(false);
        setIsLoadingSearchedMovies(true);

        const language = i18n.language === 'en' ? 'en-US' : i18n.language;

        try {
          const data = await searchMovies(text, language);
          setSearchResults(data);
        } catch (error) {
          setHasErrorOnFetch(true);
          void error;
        } finally {
          setHasQuery(true);
          setIsLoadingSearchedMovies(false);
        }
      } else {
        setSearchResults([]);
        setHasQuery(false);
      }
    }, 1200);
  }, [
    i18n.language,
    setHasErrorOnFetch,
    setHasQuery,
    setIsLoadingSearchedMovies,
    setSearchResults,
  ]);

  useEffect(() => {
    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      <label className="mb-2 text-start text-lg">{t('searchBar.label')}</label>
      <input
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchBar.placeholder')}
        type="text"
      />
    </div>
  );
}
