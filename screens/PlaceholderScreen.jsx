import { Text, View } from "react-native";
import AppShell from "../components/layout/AppShell";

export default function PlaceholderScreen({ title, description }) {
  return (
    <AppShell scrollable={false}>
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full rounded-lg border border-zinc-200 bg-white px-6 py-8">
          <Text className="text-[28px] font-semibold text-zinc-950">{title}</Text>
          <Text className="mt-3 text-base leading-7 text-zinc-600">{description}</Text>
        </View>
      </View>
    </AppShell>
  );
}
