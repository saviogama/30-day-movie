import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMovieStore } from '../../store/movieStore';
import type { Movie } from '../../types/sharedTypes';
import { MovieCard } from './MovieCard';

vi.mock('../../store/movieStore', () => ({
  useMovieStore: vi.fn(),
}));

const sampleMovie: Movie = {
  id: 1,
  title: 'Inception',
  poster_path: '/poster.jpg',
  release_date: '2021-01-10',
  overview: 'Overview description',
};

describe('<MovieCard />', () => {
  const toggleMovie = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the movie image and alt text', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
      toggleMovie,
    });

    render(<MovieCard movie={sampleMovie} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining(sampleMovie.poster_path)
    );
    expect(image).toHaveAttribute('alt', sampleMovie.title);
  });

  it('has selected styling if the movie is selected', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [sampleMovie],
      toggleMovie,
    });

    render(<MovieCard movie={sampleMovie} />);
    const card = screen.getByRole('img').parentElement;

    expect(card?.className).toMatch(/border-red-900/);
    expect(card?.className).toMatch(/ring-2/);
  });

  it('has default styling if the movie is not selected', () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
      toggleMovie,
    });

    render(<MovieCard movie={sampleMovie} />);
    const card = screen.getByRole('img').parentElement;

    expect(card?.className).toMatch(/border-gray-300/);
    expect(card?.className).not.toMatch(/border-red-900/);
  });

  it('calls toggleMovie when clicked', async () => {
    (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedMovies: [],
      toggleMovie,
    });

    render(<MovieCard movie={sampleMovie} />);
    const card = screen.getByRole('img').parentElement!;
    await userEvent.click(card);

    expect(toggleMovie).toHaveBeenCalledWith(sampleMovie);
  });
});
