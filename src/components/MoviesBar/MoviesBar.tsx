import { useMovieStore } from '../../store/movieStore';
import { MovieCard } from '../MovieCard/MovieCard';

export function MoviesBar() {
  const { selectedMovies } = useMovieStore();

  const placeholders = Array.from({ length: 4 - selectedMovies.length });

  return (
    <div className="flex flex-wrap gap-4 justify-center my-6">
      {selectedMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      {placeholders.map((_, idx) => (
        <div
          role="presentation"
          className="w-36 h-[13.5rem] border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-sm"
          key={idx}
        />
      ))}
    </div>
  );
}
