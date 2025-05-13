import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Movie } from '../../../../types/sharedTypes';
import { exportPDF } from '../../../../utils/exportPDF';
import { RecommendedMoviesSection } from './RecommendedMoviesSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../../../../utils/exportPDF', () => ({
  exportPDF: vi.fn(),
}));

vi.mock('../../../../components/MovieCard/MovieCard', () => ({
  MovieCard: ({ movie }: { movie: Movie }) => (
    <div data-testid="movie-card">{movie.title}</div>
  ),
}));

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    release_date: '2010',
    poster_path: './inception.jpg',
    overview: 'Resume',
    vote_average: 9.1,
  },
  {
    id: 2,
    title: 'Interstellar',
    release_date: '2014',
    poster_path: './interstellar.jpg',
    overview: 'Resume',
    vote_average: 9.1,
  },
];

describe('<RecommendedMoviesSection />', () => {
  it('renders the loading state', () => {
    render(
      <RecommendedMoviesSection
        recommendedMovies={[]}
        isLoadingRecommendations={true}
        hasErrorOnRecommendationsFetch={false}
        hasRecommendations={false}
      />
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('renders the error state', () => {
    render(
      <RecommendedMoviesSection
        recommendedMovies={[]}
        isLoadingRecommendations={false}
        hasErrorOnRecommendationsFetch={true}
        hasRecommendations={false}
      />
    );

    expect(
      screen.getByText('hasErrorOnRecommendationsFetch')
    ).toBeInTheDocument();
  });

  it('renders movie cards when data is available', () => {
    render(
      <RecommendedMoviesSection
        recommendedMovies={mockMovies}
        isLoadingRecommendations={false}
        hasErrorOnRecommendationsFetch={false}
        hasRecommendations={true}
      />
    );

    expect(screen.getByText('result')).toBeInTheDocument();
    expect(screen.getByText('export')).toBeInTheDocument();
    expect(screen.getAllByTestId('movie-card')).toHaveLength(2);
    expect(screen.getByText('day 1')).toBeInTheDocument();
    expect(screen.getByText('day 2')).toBeInTheDocument();
  });

  it('calls exportPDF with correct arguments when export button is clicked', () => {
    render(
      <RecommendedMoviesSection
        recommendedMovies={mockMovies}
        isLoadingRecommendations={false}
        hasErrorOnRecommendationsFetch={false}
        hasRecommendations={true}
      />
    );

    fireEvent.click(screen.getByText('export'));
    expect(exportPDF).toHaveBeenCalledWith(mockMovies, 'en');
  });
});
