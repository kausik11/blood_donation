import "../global.css";
import { Slot } from "expo-router";
import { RequestSearchProvider } from "../context/RequestSearchContext";
import ScreenCaptureGuard from "../components/security/ScreenCaptureGuard";

export default function RootLayout() {
  return (
    <ScreenCaptureGuard>
      <RequestSearchProvider>
        <Slot />
      </RequestSearchProvider>
    </ScreenCaptureGuard>
  );
}
