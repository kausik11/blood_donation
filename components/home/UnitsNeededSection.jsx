import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useRequestSearch } from "../../context/RequestSearchContext";
import SectionCard from "../ui/SectionCard";

function StepperButton({ disabled, icon, onPress }) {
  return (
    <Pressable
      className={`h-14 w-14 items-center justify-center rounded-lg ${
        disabled ? "bg-zinc-200" : "bg-zinc-100"
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <Feather color="#111827" name={icon} size={26} />
    </Pressable>
  );
}

export default function UnitsNeededSection() {
  const { decrementUnits, incrementUnits, unitsNeeded } = useRequestSearch();
  const formattedUnits = unitsNeeded.toString().padStart(2, "0");

  return (
    <SectionCard>
      <View className="flex-row items-center gap-3">
        <Feather color="#e11d48" name="activity" size={22} />
        <Text className="text-[20px] font-semibold text-zinc-950">Units Needed</Text>
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <StepperButton disabled={unitsNeeded <= 1} icon="minus" onPress={decrementUnits} />
        <Text className="text-[52px] font-semibold tracking-tight text-zinc-950">
          {formattedUnits}
        </Text>
        <StepperButton disabled={unitsNeeded >= 9} icon="plus" onPress={incrementUnits} />
      </View>

      <View className="mt-6 rounded-lg border border-zinc-200 px-4 py-4">
        <Text className="text-center text-lg italic text-rose-600">
          Standard clinical request: {unitsNeeded} unit{unitsNeeded === 1 ? "" : "s"} requested
        </Text>
      </View>
    </SectionCard>
  );
}
