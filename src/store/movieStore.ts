import { create } from 'zustand';
import type { Movie } from '../types/sharedTypes';

interface MovieStore {
  selectedMovies: Movie[];
  searchResults: Movie[];
  setSearchResults: (movies: Movie[]) => void;
  setSelectedMovies: (movies: Movie[]) => void;
  toggleMovie: (movie: Movie) => void;
  reset: () => void;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  selectedMovies: [],
  searchResults: [],
  setSearchResults: (movies) => set({ searchResults: movies }),
  setSelectedMovies: (movies) => set({ selectedMovies: movies.slice(0, 5) }),
  toggleMovie: (movie) => {
    const selected = get().selectedMovies;
    const already = selected.some((m) => m.id === movie.id);

    if (already) {
      set({ selectedMovies: selected.filter((m) => m.id !== movie.id) });
    } else if (selected.length < 5) {
      set({ selectedMovies: [...selected, movie] });
    }
  },
  reset: () => set({ selectedMovies: [], searchResults: [] }),
}));
