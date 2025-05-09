import { useMovieStore } from '../../store/movieStore';
import type { Movie } from '../../types/sharedTypes';

export function MovieCard({
  movie,
  isSelectionLocked = false,
  loading = false,
}: {
  movie: Movie;
  isSelectionLocked?: boolean;
  loading?: boolean;
}) {
  const { selectedMovies, toggleMovie } = useMovieStore();
  const isSelected = selectedMovies.some((m) => m.id === movie.id);
  console.log('isSelectionLocked: ', isSelectionLocked);

  const onClick = () => {
    if (isSelectionLocked || loading) {
      return null;
    }

    return toggleMovie(movie);
  };

  return (
    <div
      onClick={() => onClick()}
      className={`w-36 border rounded overflow-hidden cursor-pointer transition hover:border-red-600 hover:ring-2 hover:ring-red-900
        ${isSelected ? 'border-red-900 ring-2 ring-red-600' : 'border-gray-300'}
        ${isSelectionLocked ? 'pointer-events-none hover:border-none' : ''}
      `}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-52 object-cover"
      />
    </div>
  );
}
