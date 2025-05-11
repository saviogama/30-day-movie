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

  const onClick = () => {
    if (isSelectionLocked || loading) return;
    toggleMovie(movie);
  };

  return (
    <div
      onClick={onClick}
      className={`w-40 md:w-44 rounded-lg overflow-hidden cursor-pointer transition duration-300 shadow-md bg-zinc-900
        transform hover:scale-[1.03] hover:shadow-lg
        ${
          isSelected
            ? 'ring-2 ring-rose-600 border border-transparent'
            : 'border border-zinc-700'
        }
        ${isSelectionLocked ? 'pointer-events-none' : ''}`}
    >
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-52 md:h-60 object-cover"
      />
      <div className="p-2 text-zinc-100">
        <h3 className="text-sm font-semibold truncate" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-xs text-zinc-400 truncate">
          {movie.release_date?.split('-')[0] ?? '----'}
        </p>
        <div className="mt-1 text-xs text-amber-400 font-medium flex items-center gap-1">
          ⭐ {movie.vote_average?.toFixed(1) ?? '--'}
        </div>
      </div>
    </div>
  );
}
