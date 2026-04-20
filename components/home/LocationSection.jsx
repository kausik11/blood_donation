import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useRequestSearch } from "../../context/RequestSearchContext";
import PickerField from "../ui/PickerField";
import SectionCard from "../ui/SectionCard";

export default function LocationSection() {
  const {
    districtOptions,
    resetRequest,
    selectedDistrictKey,
    selectedTownKey,
    setSelectedDistrictKey,
    setSelectedTownKey,
    townOptions,
  } = useRequestSearch();

  return (
    <SectionCard>
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <View className="flex-row items-center gap-3">
            <Feather color="#e11d48" name="map-pin" size={22} />
            <Text className="text-[20px] font-semibold text-zinc-950">Current Location</Text>
          </View>
          <Text className="mt-2 text-sm leading-6 text-zinc-500">
            Choose the district first, then narrow the live search to a town or nearby area.
          </Text>
        </View>

        <Pressable className="rounded-lg border border-zinc-200 px-3 py-2" onPress={resetRequest}>
          <Text className="text-sm font-medium text-zinc-500">Reset</Text>
        </Pressable>
      </View>

      <View className="mt-5 gap-5">
        <PickerField
          label="Current District"
          options={districtOptions}
          placeholder="Select your district"
          showCounts
          value={selectedDistrictKey}
          onValueChange={setSelectedDistrictKey}
        />

        <PickerField
          disabled={!selectedDistrictKey}
          label="Current Town / Area"
          options={townOptions}
          placeholder={selectedDistrictKey ? "Select your town or area" : "Choose district first"}
          value={selectedTownKey}
          onValueChange={setSelectedTownKey}
        />

        {!!selectedDistrictKey && townOptions.length === 0 && (
          <Text className="text-sm text-zinc-500">
            This district does not have a structured town list in the current donor workbook yet.
          </Text>
        )}
      </View>
    </SectionCard>
  );
}
