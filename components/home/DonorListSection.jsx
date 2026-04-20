import { Text, View } from "react-native";
import { useRequestSearch } from "../../context/RequestSearchContext";
import SectionCard from "../ui/SectionCard";
import DonorCard from "./DonorCard";

export default function DonorListSection() {
  const {
    hasMoreResults,
    hasRequiredFilters,
    resultCount,
    summary,
    visibleDonors,
    visibleResultCount,
  } = useRequestSearch();

  if (!hasRequiredFilters) {
    return (
      <SectionCard>
        <Text className="text-lg font-semibold text-zinc-950">Waiting for request details</Text>
        <Text className="mt-2 text-sm leading-6 text-zinc-600">{summary.description}</Text>
      </SectionCard>
    );
  }

  if (resultCount === 0) {
    return (
      <SectionCard>
        <Text className="text-lg font-semibold text-zinc-950">No donors matched this search</Text>
        <Text className="mt-2 text-sm leading-6 text-zinc-600">
          Try another town or area nearby, or switch the blood group to broaden the donor match.
        </Text>
      </SectionCard>
    );
  }

  return (
    <View>
      <View className="flex-row items-center justify-between gap-4">
        <Text className="text-[20px] font-semibold text-zinc-950">Matched Donors</Text>
        <Text className="text-sm text-zinc-500">
          {resultCount} result{resultCount === 1 ? "" : "s"}
        </Text>
      </View>

      {hasMoreResults && (
        <Text className="mt-2 text-sm leading-6 text-zinc-500">
          Showing the first {visibleResultCount} matches to keep the list fast on mobile.
        </Text>
      )}

      <View className="mt-4 gap-4">
        {visibleDonors.map((donor) => (
          <DonorCard key={donor.id} donor={donor} />
        ))}
      </View>
    </View>
  );
}
