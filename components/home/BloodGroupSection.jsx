import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useRequestSearch } from "../../context/RequestSearchContext";
import SectionCard from "../ui/SectionCard";

export default function BloodGroupSection() {
  const { bloodGroups, selectedBloodGroup, setSelectedBloodGroup } = useRequestSearch();

  return (
    <SectionCard>
      <View className="flex-row items-center gap-3">
        <Feather color="#e11d48" name="droplet" size={22} />
        <Text className="text-[20px] font-semibold text-zinc-950">Select Blood Group</Text>
      </View>

      <View className="mt-5 flex-row flex-wrap justify-between gap-y-3">
        {bloodGroups.map((group) => {
          const isSelected = selectedBloodGroup === group;

          return (
            <Pressable
              key={group}
              className={`min-h-14 w-[48%] items-center justify-center rounded-lg border px-3 py-3 ${
                isSelected ? "border-rose-600 bg-rose-600" : "border-zinc-200 bg-white"
              }`}
              onPress={() => setSelectedBloodGroup(isSelected ? "" : group)}
            >
              <Text
                className={`text-base font-semibold ${
                  isSelected ? "text-white" : "text-zinc-900"
                }`}
              >
                {group}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SectionCard>
  );
}
