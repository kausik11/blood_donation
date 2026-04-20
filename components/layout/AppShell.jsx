import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBrandHeader from "./AnimatedBrandHeader";
import BottomNav from "../navigation/BottomNav";

export default function AppShell({ children, scrollable = true, showBrandHeader = true }) {
  const content = scrollable ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1">{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={["top", "right", "bottom", "left"]}>
      <StatusBar style="dark" />
      <View className="flex-1">
        {showBrandHeader && <AnimatedBrandHeader />}
        {content}
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
