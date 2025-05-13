import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Loading } from './Loading';

describe('<Loading />', () => {
  it('renders the spinner', () => {
    render(<Loading message="Loading..." />);

    const spinner = screen.getByRole('status');

    expect(spinner).toBeInTheDocument();
  });

  it('displays the provided message', () => {
    const message = 'Fetching data...';

    render(<Loading message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
