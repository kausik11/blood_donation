import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function PickerField({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  disabled = false,
  showCounts = false,
}) {
  return (
    <View>
      <Text className="text-sm font-semibold text-zinc-900">{label}</Text>
      <View
        className={`mt-3 overflow-hidden rounded-lg border ${
          disabled ? "border-zinc-200 bg-zinc-100" : "border-zinc-200 bg-white"
        }`}
      >
        <Picker
          dropdownIconColor={disabled ? "#a1a1aa" : "#111827"}
          enabled={!disabled}
          selectedValue={value}
          style={{ color: disabled ? "#a1a1aa" : "#111827" }}
          onValueChange={onValueChange}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map((option) => (
            <Picker.Item
              key={option.key}
              label={showCounts ? `${option.label} (${option.count})` : option.label}
              value={option.key}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}
