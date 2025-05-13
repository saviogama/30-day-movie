import { LanguageSwitcher } from '../../components/LanguageSwitcher/LanguageSwitcher';
import { useFetchRecommendations } from '../../hooks/useFetchRecommendations';
import { RecommendedMoviesSection } from './components/RecommendedMoviesSection/RecommendedMoviesSection';
import { SelectMoviesSection } from './components/SelectMoviesSection/SelectMoviesSection';

export default function Home() {
  const {
    recommendedMovies,
    isLoadingRecommendations,
    hasErrorOnRecommendationsFetch,
  } = useFetchRecommendations();

  const shouldRenderSelectMoviesSection = recommendedMovies.length === 0;

  const renderSection = () => {
    if (shouldRenderSelectMoviesSection && !isLoadingRecommendations) {
      return (
        <SelectMoviesSection
          isLoadingRecommendations={isLoadingRecommendations}
        />
      );
    }

    return (
      <RecommendedMoviesSection
        recommendedMovies={recommendedMovies}
        isLoadingRecommendations={isLoadingRecommendations}
        hasErrorOnRecommendationsFetch={hasErrorOnRecommendationsFetch}
      />
    );
  };

  return (
    <main className="flex flex-col items-center p-6 max-w-6xl mx-auto">
      <LanguageSwitcher />
      {renderSection()}
    </main>
  );
}
