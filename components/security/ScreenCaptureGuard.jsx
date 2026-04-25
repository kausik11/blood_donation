import { useEffect, useRef, useState } from "react";
import { AppState, Platform, StyleSheet, Text, View } from "react-native";
import * as ScreenCapture from "expo-screen-capture";

const WEB_SHIELD_DELAY = 1200;

export default function ScreenCaptureGuard({ children }) {
  const [isShielded, setIsShielded] = useState(false);
  const shieldTimer = useRef(null);

  useEffect(() => {
    ScreenCapture.preventScreenCaptureAsync().catch(() => {});

    return () => {
      ScreenCapture.allowScreenCaptureAsync().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      setIsShielded(state !== "active");
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof document === "undefined") {
      return undefined;
    }

    const showShield = () => setIsShielded(true);
    const hideShield = () => setIsShielded(false);
    const temporaryShield = () => {
      showShield();
      window.clearTimeout(shieldTimer.current);
      shieldTimer.current = window.setTimeout(hideShield, WEB_SHIELD_DELAY);
    };

    const blockEvent = (event) => {
      event.preventDefault();
      temporaryShield();
    };

    const handleVisibility = () => {
      setIsShielded(document.hidden);
    };

    const handleKeyDown = (event) => {
      const key = event.key?.toLowerCase();
      const isPrintScreen = key === "printscreen";
      const isPrint = (event.ctrlKey || event.metaKey) && key === "p";
      const isSave = (event.ctrlKey || event.metaKey) && key === "s";

      if (isPrintScreen || isPrint || isSave) {
        blockEvent(event);
        navigator.clipboard?.writeText?.("").catch(() => {});
      }
    };

    const style = document.createElement("style");
    style.textContent = `
      html, body, #root {
        -webkit-user-select: none;
        user-select: none;
      }

      @media print {
        body * {
          visibility: hidden !important;
        }
      }
    `;
    document.head.appendChild(style);

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("contextmenu", blockEvent);
    document.addEventListener("copy", blockEvent);
    document.addEventListener("cut", blockEvent);
    document.addEventListener("dragstart", blockEvent);
    window.addEventListener("blur", showShield);
    window.addEventListener("focus", hideShield);
    window.addEventListener("pagehide", showShield);
    window.addEventListener("pageshow", hideShield);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(shieldTimer.current);
      style.remove();
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("contextmenu", blockEvent);
      document.removeEventListener("copy", blockEvent);
      document.removeEventListener("cut", blockEvent);
      document.removeEventListener("dragstart", blockEvent);
      window.removeEventListener("blur", showShield);
      window.removeEventListener("focus", hideShield);
      window.removeEventListener("pagehide", showShield);
      window.removeEventListener("pageshow", hideShield);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={isShielded ? styles.hiddenContent : styles.visibleContent}>
        {children}
      </View>

      {isShielded ? (
        <View pointerEvents="auto" style={styles.shield}>
          <Text style={styles.shieldTitle}>Screen protected</Text>
          <Text style={styles.shieldText}>Return to the app to view this content.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hiddenContent: {
    flex: 1,
    opacity: 0,
  },
  shield: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 24,
    zIndex: 9999,
  },
  shieldText: {
    color: "#71717a",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  shieldTitle: {
    color: "#18181b",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  visibleContent: {
    flex: 1,
  },
});
