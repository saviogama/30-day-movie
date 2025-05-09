import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTranslation } from 'react-i18next';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(),
}));

describe('<LanguageSwitcher />', () => {
  const changeLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render 🇧🇷 and "Português" when current language is pt-BR', () => {
    (useTranslation as unknown as MockInstance).mockReturnValue({
      i18n: {
        language: 'pt-BR',
        changeLanguage,
      },
    });

    render(<LanguageSwitcher />);

    expect(screen.getByRole('button')).toHaveTextContent('🇧🇷');
    expect(screen.getByRole('button')).toHaveTextContent('Português');
  });

  it('should render 🇺🇸 and "English" when current language is en', () => {
    (useTranslation as unknown as MockInstance).mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage,
      },
    });

    render(<LanguageSwitcher />);

    expect(screen.getByRole('button')).toHaveTextContent('🇺🇸');
    expect(screen.getByRole('button')).toHaveTextContent('English');
  });

  it('switches language from pt-BR to en when clicked', async () => {
    (useTranslation as unknown as MockInstance).mockReturnValue({
      i18n: {
        language: 'pt-BR',
        changeLanguage,
      },
    });

    render(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /language switcher/i });

    await userEvent.click(button);

    expect(changeLanguage).toHaveBeenCalledWith('en');
  });

  it('switches language from en to pt-BR when clicked', async () => {
    (useTranslation as unknown as MockInstance).mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage,
      },
    });

    render(<LanguageSwitcher />);
    const button = screen.getByRole('button', { name: /language switcher/i });

    await userEvent.click(button);

    expect(changeLanguage).toHaveBeenCalledWith('pt-BR');
  });
});
