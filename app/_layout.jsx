import "../global.css";
import { Slot } from "expo-router";
import { RequestSearchProvider } from "../context/RequestSearchContext";

export default function RootLayout() {
  return (
    <RequestSearchProvider>
      <Slot />
    </RequestSearchProvider>
  );
}
