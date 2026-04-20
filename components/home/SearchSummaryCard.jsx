import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useRequestSearch } from "../../context/RequestSearchContext";

function InfoRow({ label, value }) {
  return (
    <View className="rounded-lg bg-black/15 px-4 py-4">
      <Text className="text-sm text-white/80">{label}</Text>
      <Text className="mt-1 text-lg font-semibold text-white">{value}</Text>
    </View>
  );
}

export default function SearchSummaryCard() {
  const { summary } = useRequestSearch();

  if (!summary.isReady) {
    return (
      <View className="rounded-lg border border-zinc-200 bg-white px-5 py-5">
        <View className="flex-row items-center gap-3">
          <Feather color="#e11d48" name="shield" size={22} />
          <Text className="text-[20px] font-semibold text-zinc-950">Live Search Preview</Text>
        </View>
        <Text className="mt-4 text-base font-medium text-zinc-900">{summary.incompleteTitle}</Text>
        <Text className="mt-2 text-sm leading-6 text-zinc-600">{summary.description}</Text>
      </View>
    );
  }

  if (summary.resultCount === 0) {
    return (
      <View className="rounded-lg border border-rose-200 bg-white px-5 py-5">
        <View className="flex-row items-center gap-3">
          <Feather color="#e11d48" name="shield" size={22} />
          <Text className="text-[20px] font-semibold text-zinc-950">No nearby donors yet</Text>
        </View>
        <Text className="mt-4 text-sm leading-6 text-zinc-600">{summary.description}</Text>
        <View className="mt-5 gap-3">
          <View className="rounded-lg bg-rose-50 px-4 py-4">
            <Text className="text-sm text-rose-700">Search Area</Text>
            <Text className="mt-1 text-lg font-semibold text-zinc-950">{summary.locationLabel}</Text>
          </View>
          <View className="rounded-lg bg-rose-50 px-4 py-4">
            <Text className="text-sm text-rose-700">Type Required</Text>
            <Text className="mt-1 text-lg font-semibold text-zinc-950">
              {summary.bloodGroupLabel} | {summary.unitsLabel} units
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="rounded-lg bg-rose-700 px-5 py-5">
      <View className="flex-row items-center justify-between gap-4">
        <View className="rounded-lg bg-black/20 px-4 py-3">
          <Text className="text-sm font-medium text-white">{summary.statusLabel}</Text>
        </View>
        <Feather color="#ffffff" name="shield" size={44} />
      </View>

      <Text className="mt-6 text-[22px] font-semibold leading-8 text-white">
        {summary.resultCount} Available Donors Nearby
      </Text>
      <Text className="mt-3 text-base leading-7 text-white/90">{summary.description}</Text>

      <View className="mt-6 gap-3">
        <InfoRow label="Search Area" value={summary.locationLabel} />
        <InfoRow
          label="Type Required"
          value={`${summary.bloodGroupLabel} | ${summary.unitsLabel} units`}
        />
      </View>
    </View>
  );
}
