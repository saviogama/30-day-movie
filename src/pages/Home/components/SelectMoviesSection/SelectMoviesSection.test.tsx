import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, type MockInstance } from 'vitest';
import { useMovieStore } from '../../../../store/movieStore';
import type { Movie } from '../../../../types/sharedTypes';
import { SelectMoviesSection } from './SelectMoviesSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../../../components/MoviesBar/MoviesBar', () => ({
  MoviesBar: () => <div data-testid="movies-bar" />,
}));

vi.mock('../../../../components/SearchBar/SearchBar', () => ({
  SearchBar: ({ query }: { query: string }) => (
    <div data-testid="search-bar">Search: {query}</div>
  ),
}));

vi.mock('../../../../components/MovieCard/MovieCard', () => ({
  MovieCard: ({ movie }: { movie: Movie }) => (
    <div data-testid="movie-card">{movie.title}</div>
  ),
}));

vi.mock('../../../../store/movieStore', () => ({
  useMovieStore: vi.fn(),
}));

const mockSearchResults = (results: Movie[]) => {
  (useMovieStore as unknown as MockInstance).mockReturnValue({
    searchResults: results,
  });
};

describe('<SelectMoviesSection />', () => {
  it('renders the default layout with title and description', () => {
    mockSearchResults([]);

    render(<SelectMoviesSection isLoadingRecommendations={false} />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('description.p1')).toBeInTheDocument();
    expect(screen.getByText('description.p2')).toBeInTheDocument();
    expect(screen.getByTestId('movies-bar')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('shows loading message when isLoadingSearchedMovies is true', () => {
    mockSearchResults([]);

    render(<SelectMoviesSection isLoadingRecommendations={false} />);

    expect(screen.queryByText('searchLoading')).not.toBeInTheDocument();
  });

  it('shows error message when hasErrorOnSearchedMoviesFetch is true', () => {
    mockSearchResults([]);

    render(<SelectMoviesSection isLoadingRecommendations={false} />);

    expect(
      screen.queryByText('hasErrorOnSearchedMoviesFetch')
    ).not.toBeInTheDocument();
  });

  it('shows "no results" message when hasQuery is true and no results', () => {
    mockSearchResults([]);

    render(<SelectMoviesSection isLoadingRecommendations={false} />);

    expect(screen.queryByText('noResults')).not.toBeInTheDocument();
  });

  it('renders MovieCard components when search results are available', () => {
    const movies: Movie[] = [
      {
        id: 1,
        title: 'Inception',
        release_date: '2010',
        poster_path: '',
        overview: '',
        vote_average: 9.1,
      },
      {
        id: 2,
        title: 'Dune',
        release_date: '2021',
        poster_path: '',
        overview: '',
        vote_average: 9.1,
      },
    ];

    mockSearchResults(movies);

    render(<SelectMoviesSection isLoadingRecommendations={false} />);

    expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Dune')).toBeInTheDocument();
  });
});
