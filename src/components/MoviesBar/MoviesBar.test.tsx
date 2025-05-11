import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMovieStore } from '../../store/movieStore';
import type { Movie } from '../../types/sharedTypes';
import { MoviesBar } from './MoviesBar';

vi.mock('../../store/movieStore', () => ({
  useMovieStore: vi.fn(),
}));

vi.mock('../MovieCard/MovieCard', () => ({
  MovieCard: ({ movie }: { movie: Movie }) => (
    <div data-testid="movie-card">{movie.title}</div>
  ),
}));

const sampleMovies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    poster_path: '/1.jpg',
    release_date: '2021-01-10',
    overview: 'Overview description',
    vote_average: 9.1,
  },
  {
    id: 2,
    title: 'Interstellar',
    poster_path: '/2.jpg',
    release_date: '2021-01-10',
    overview: 'Overview description',
    vote_average: 9.2,
  },
];

describe('<MoviesBar />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render selected movie cards', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: sampleMovies,
    });

    render(<MoviesBar />);

    const movieCards = screen.getAllByTestId('movie-card');
    expect(movieCards).toHaveLength(2);
    expect(movieCards[0]).toHaveTextContent('Inception');
    expect(movieCards[1]).toHaveTextContent('Interstellar');
  });

  it('should render the correct number of placeholders (4 - selected)', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: sampleMovies,
    });

    render(<MoviesBar />);

    const placeholders = screen.getAllByRole('presentation');
    expect(placeholders).toHaveLength(2);
  });

  it('should render only placeholders when no movie is selected', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
    });

    render(<MoviesBar />);

    const movieCards = screen.queryAllByTestId('movie-card');
    expect(movieCards).toHaveLength(0);

    const placeholders = screen.getAllByRole('presentation');
    expect(placeholders).toHaveLength(4);
  });
});
