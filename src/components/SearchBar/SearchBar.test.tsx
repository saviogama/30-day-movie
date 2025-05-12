import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';
import { searchMovies } from '../../services/tmdb';
import { useMovieStore } from '../../store/movieStore';
import { SearchBar } from './SearchBar';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

vi.mock('../../services/tmdb', () => ({
  searchMovies: vi.fn(),
}));

vi.mock('lodash.debounce', () => ({
  default: vi.fn((fn) => {
    fn.cancel = vi.fn();
    return fn;
  }),
}));

vi.mock('../../store/movieStore', async () => {
  const actual = await vi.importActual<typeof import('../../store/movieStore')>(
    '../../store/movieStore'
  );
  return {
    ...actual,
    useMovieStore: vi.fn(),
  };
});

const mockSetSelectedMovies = vi.fn();
const mockSetQuery = vi.fn();
const mockSetHasQuery = vi.fn();
const mockSetSearchLoading = vi.fn();
const mockMovies = [{ id: 1, title: 'Inception', poster_path: '/img1.jpg' }];
let query = '';

describe('<SearchBar />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    query = '';

    (useTranslation as unknown as MockInstance).mockReturnValue({
      t: (key: string) => key,
      i18n: { language: 'pt-BR' },
    });

    (useMovieStore as unknown as MockInstance).mockReturnValue({
      selectedMovies: [],
      setSelectedMovies: vi.fn(),
      setSearchResults: mockSetSelectedMovies,
    });
  });

  const renderSearchBar = () =>
    render(
      <SearchBar
        query={query}
        setQuery={mockSetQuery}
        setHasQuery={mockSetHasQuery}
        setSearchLoading={mockSetSearchLoading}
      />
    );

  it('should render label and input with translated text', () => {
    renderSearchBar();

    expect(screen.getByText('searchBar.label')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('searchBar.placeholder')
    ).toBeInTheDocument();
  });

  it('calls setSelectedMovies with search results after debounce when query length > 1', async () => {
    (searchMovies as unknown as MockInstance).mockResolvedValue(mockMovies);

    const TestWrapper = () => {
      const [query, setQuery] = useState('');
      return (
        <SearchBar
          query={query}
          setQuery={(q) => {
            setQuery(q);
          }}
          setHasQuery={mockSetHasQuery}
          setSearchLoading={mockSetSearchLoading}
        />
      );
    };

    render(<TestWrapper />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'inception');

    await waitFor(() => {
      expect(searchMovies).toHaveBeenCalledWith('inception', 'pt-BR');
      expect(mockSetSelectedMovies).toHaveBeenCalledWith(mockMovies);
    });
  });

  it('clears results if query length <= 1', async () => {
    renderSearchBar();
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'a');

    await waitFor(() => {
      expect(mockSetSelectedMovies).toHaveBeenCalledWith([]);
    });
  });

  it('calls debounced function on input and cancels on unmount', () => {
    const cancelMock = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockDebounce = vi.fn((fn: any) => {
      fn.cancel = cancelMock;
      return fn;
    });

    (debounce as unknown as MockInstance).mockImplementation(mockDebounce);

    const { unmount } = renderSearchBar();
    const input = screen.getByRole('textbox');
    userEvent.type(input, 'test');

    unmount();

    expect(cancelMock).toHaveBeenCalled();
  });
});
