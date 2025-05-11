import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const isPortuguese = i18n.language === 'pt-BR';
  const nextLang = isPortuguese ? 'en' : 'pt-BR';

  const flag = isPortuguese ? '🇧🇷' : '🇺🇸';
  const label = isPortuguese ? 'Português' : 'English';

  const handleSwitch = () => {
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      aria-label="Language switcher"
      className="w-auto h-10 px-3 flex items-center gap-2 justify-center text-sm font-medium border border-gray-300 hover:bg-rose-600 transition-colors cursor-pointer rounded"
      onClick={handleSwitch}
    >
      <span>{flag}</span>
      <span>{label}</span>
    </button>
  );
}
