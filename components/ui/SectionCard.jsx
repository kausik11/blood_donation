import { View } from "react-native";

export default function SectionCard({ children, className = "" }) {
  return (
    <View className={`rounded-lg border border-zinc-200 bg-white p-5 ${className}`.trim()}>
      {children}
    </View>
  );
}
