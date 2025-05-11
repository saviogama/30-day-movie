import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMovieStore } from '../../store/movieStore';
import type { Movie } from '../../types/sharedTypes';
import { MovieCard } from './MovieCard';

vi.mock('../../store/movieStore', () => ({
  useMovieStore: vi.fn(),
}));

const mockToggleMovie = vi.fn();

const mockMovie: Movie = {
  id: 1,
  title: 'Inception',
  poster_path: '/img.jpg',
  release_date: '2010-07-16',
  overview: 'Resume',
  vote_average: 8.8,
};

describe('<MovieCard />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders movie data correctly', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
      toggleMovie: mockToggleMovie,
    });

    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('⭐ 8.8')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://image.tmdb.org/t/p/w200/img.jpg'
    );
  });

  it('calls toggleMovie on click if not locked or loading', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
      toggleMovie: mockToggleMovie,
    });

    render(<MovieCard movie={mockMovie} />);

    const card = screen.getByText('Inception').closest('div')!;
    fireEvent.click(card);

    expect(mockToggleMovie).toHaveBeenCalledWith(mockMovie);
  });

  it('does not call toggleMovie if isSelectionLocked is true', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
      toggleMovie: mockToggleMovie,
    });

    render(<MovieCard movie={mockMovie} isSelectionLocked />);

    const card = screen.getByText('Inception').closest('div')!;
    fireEvent.click(card);

    expect(mockToggleMovie).not.toHaveBeenCalled();
  });

  it('does not call toggleMovie if loading is true', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
      toggleMovie: mockToggleMovie,
    });

    render(<MovieCard movie={mockMovie} loading />);

    const card = screen.getByText('Inception').closest('div')!;
    fireEvent.click(card);

    expect(mockToggleMovie).not.toHaveBeenCalled();
  });

  it('shows selected style when movie is in selectedMovies', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [mockMovie],
      toggleMovie: mockToggleMovie,
    });

    render(<MovieCard movie={mockMovie} />);

    const image = screen.getByRole('img');
    const card = image.closest('div');

    expect(card?.className).toContain('ring-2 ring-rose-600');
  });

  it('shows default border style when movie is not selected', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
      toggleMovie: mockToggleMovie,
    });

    render(<MovieCard movie={mockMovie} />);

    const image = screen.getByRole('img');
    const card = image.closest('div');

    expect(card?.className).toContain('border-zinc-700');
  });
});
