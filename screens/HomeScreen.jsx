import { View } from "react-native";
import BloodGroupSection from "../components/home/BloodGroupSection";
import DonorListSection from "../components/home/DonorListSection";
import HomeHero from "../components/home/HomeHero";
import LocationSection from "../components/home/LocationSection";
import SearchSummaryCard from "../components/home/SearchSummaryCard";
import UnitsNeededSection from "../components/home/UnitsNeededSection";
import AppShell from "../components/layout/AppShell";
import AnimatedSplashScreen from "../components/splash/AnimatedSplashScreen";
import { useRequestSearch } from "../context/RequestSearchContext";

export default function HomeScreen() {
  const { dismissSplash, hasSeenSplash } = useRequestSearch();

  if (!hasSeenSplash) {
    return <AnimatedSplashScreen onContinue={dismissSplash} />;
  }

  return (
    <AppShell>
      <HomeHero />

      <View className="gap-5 px-5 py-6">
        <BloodGroupSection />
        <UnitsNeededSection />
        <LocationSection />
        <SearchSummaryCard />
        <DonorListSection />
      </View>
    </AppShell>
  );
}
