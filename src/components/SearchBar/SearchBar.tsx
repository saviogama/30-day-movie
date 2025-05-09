import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchMovies } from '../../services/tmdb';
import { useMovieStore } from '../../store/movieStore';

export function SearchBar() {
  const { setSearchResults } = useMovieStore();
  const { t, i18n } = useTranslation();

  const [query, setQuery] = useState('');

  const debouncedSearch = useMemo(() => {
    return debounce(async (text: string) => {
      if (text.length > 1) {
        const language = i18n.language === 'en' ? 'en-US' : i18n.language;
        const data = await searchMovies(text, language);

        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    }, 1200);
  }, [i18n.language, setSearchResults]);

  useEffect(() => {
    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      <label className="mb-2 text-start">{t('searchBar.label')}</label>
      <input
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('searchBar.placeholder')}
        type="text"
      />
    </div>
  );
}
