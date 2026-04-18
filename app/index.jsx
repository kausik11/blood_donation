import React, { useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  bloodGroups,
  districtOptions,
  formatPhoneNumber,
  getTownSuggestions,
  searchDonors,
  totalDistricts,
  totalDonors,
} from "../lib/donorSearch";

const MAX_VISIBLE_RESULTS = 40;

function ActionButton({ label, onPress, tone = "primary", disabled = false }) {
  const palette =
    tone === "primary"
      ? {
          container: "bg-rose-600 border-rose-600",
          text: "text-white",
        }
      : {
          container: "bg-white border-zinc-300",
          text: "text-zinc-700",
        };

  return (
    <Pressable
      className={`min-h-12 flex-1 items-center justify-center rounded-lg border px-4 ${
        disabled ? "border-zinc-200 bg-zinc-100" : palette.container
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text className={`text-sm font-semibold ${disabled ? "text-zinc-400" : palette.text}`}>
        {label}
      </Text>
    </Pressable>
  );
}

function BloodGroupChip({ group, selected, onPress }) {
  return (
    <Pressable
      className={`min-w-16 items-center rounded-lg border px-4 py-3 ${
        selected ? "border-rose-600 bg-rose-600" : "border-zinc-300 bg-white"
      }`}
      onPress={onPress}
    >
      <Text className={`text-sm font-semibold ${selected ? "text-white" : "text-zinc-800"}`}>
        {group}
      </Text>
    </Pressable>
  );
}

function DetailRow({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <View className="mt-2">
      <Text className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</Text>
      <Text className="mt-1 text-sm text-zinc-700">{value}</Text>
    </View>
  );
}

function DonorCard({ donor }) {
  const handleCall = async () => {
    const phoneUrl = `tel:${donor.phone}`;

    try {
      const supported = await Linking.canOpenURL(phoneUrl);

      if (!supported) {
        Alert.alert("Calling is not available here", donor.phone);
        return;
      }

      await Linking.openURL(phoneUrl);
    } catch {
      Alert.alert("Could not open the phone app", donor.phone);
    }
  };

  const locationLine = [donor.town, donor.block, donor.district].filter(Boolean).join(" | ");

  return (
    <View className="rounded-lg border border-zinc-200 bg-white p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-zinc-900">{donor.name}</Text>
          {!!locationLine && <Text className="mt-1 text-sm text-zinc-500">{locationLine}</Text>}
        </View>
        <View className="rounded-lg bg-rose-100 px-3 py-2">
          <Text className="text-sm font-bold text-rose-700">{donor.bloodGroup}</Text>
        </View>
      </View>

      <View className="mt-4 rounded-lg bg-zinc-50 px-3 py-3">
        <Text className="text-xs font-medium uppercase tracking-wide text-zinc-400">Phone</Text>
        <Text className="mt-1 text-base font-semibold text-zinc-900">
          {formatPhoneNumber(donor.phone)}
        </Text>
      </View>

      <DetailRow label="Town / Area" value={donor.town} />
      <DetailRow label="Block" value={donor.block} />
      <DetailRow label="Address" value={donor.address} />
      <DetailRow label="State / Region" value={donor.state} />

      <Pressable
        className="mt-4 min-h-12 items-center justify-center rounded-lg bg-emerald-600 px-4"
        onPress={handleCall}
      >
        <Text className="text-sm font-semibold text-white">Call Donor</Text>
      </Pressable>
    </View>
  );
}

export default function Index() {
  const [districtKey, setDistrictKey] = useState("");
  const [townQuery, setTownQuery] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const canSearch = Boolean(districtKey && townQuery.trim() && bloodGroup);

  const townSuggestions = useMemo(
    () => (districtKey ? getTownSuggestions(districtKey, townQuery) : []),
    [districtKey, townQuery],
  );

  const results = useMemo(() => {
    if (!hasSearched) {
      return [];
    }

    return searchDonors({
      districtKey,
      townQuery,
      bloodGroup,
    });
  }, [bloodGroup, districtKey, hasSearched, townQuery]);

  const visibleResults = results.slice(0, MAX_VISIBLE_RESULTS);
  const selectedDistrict = districtOptions.find((option) => option.key === districtKey);

  const handleSearch = () => {
    Keyboard.dismiss();
    setHasSearched(true);
  };

  const handleReset = () => {
    setDistrictKey("");
    setTownQuery("");
    setBloodGroup("");
    setHasSearched(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5 pt-4">
          <Text className="text-3xl font-bold text-zinc-950">Find Blood Donors</Text>
          <Text className="mt-3 text-base leading-6 text-zinc-600">
            Select your current district, enter your town or area, then choose the blood group you
            need.
          </Text>
          <Text className="mt-3 text-sm text-zinc-500">
            {totalDonors.toLocaleString()} donors loaded across {totalDistricts} districts from your
            March 2021 database.
          </Text>
          <Text className="mt-1 text-sm text-zinc-500">Updated from your donor workbook.</Text>
        </View>

        <View className="mx-5 mt-6 rounded-lg border border-zinc-200 bg-white p-4">
          <Text className="text-sm font-semibold text-zinc-800">Current district</Text>
          <View className="mt-2 overflow-hidden rounded-lg border border-zinc-300 bg-white">
            <Picker
              dropdownIconColor="#27272a"
              selectedValue={districtKey}
              style={{ color: "#18181b" }}
              onValueChange={(value) => setDistrictKey(value)}
            >
              <Picker.Item label="Select your district" value="" />
              {districtOptions.map((option) => (
                <Picker.Item
                  key={option.key}
                  label={`${option.label} (${option.count})`}
                  value={option.key}
                />
              ))}
            </Picker>
          </View>

          <Text className="mt-5 text-sm font-semibold text-zinc-800">Current town / area</Text>
          <TextInput
            className="mt-2 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900"
            editable={Boolean(districtKey)}
            placeholder={districtKey ? "Type your town, area, or block" : "Select a district first"}
            placeholderTextColor="#71717a"
            value={townQuery}
            onChangeText={setTownQuery}
          />

          {!!selectedDistrict && townSuggestions.length > 0 && (
            <View className="mt-3">
              <Text className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Popular areas in {selectedDistrict.label}
              </Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                {townSuggestions.map((suggestion) => (
                  <Pressable
                    key={suggestion.key}
                    className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2"
                    onPress={() => setTownQuery(suggestion.label)}
                  >
                    <Text className="text-sm text-zinc-700">{suggestion.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <Text className="mt-5 text-sm font-semibold text-zinc-800">Blood group</Text>
          <View className="mt-3 flex-row flex-wrap gap-2">
            {bloodGroups.map((group) => (
              <BloodGroupChip
                key={group}
                group={group}
                selected={bloodGroup === group}
                onPress={() => setBloodGroup(group)}
              />
            ))}
          </View>

          <View className="mt-6 flex-row gap-3">
            <ActionButton disabled={!canSearch} label="Find Donors" onPress={handleSearch} />
            <ActionButton label="Clear" onPress={handleReset} tone="secondary" />
          </View>
        </View>

        <View className="px-5 pt-6">
          {!hasSearched && (
            <View className="rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-5">
              <Text className="text-base font-semibold text-zinc-900">Start with your location</Text>
              <Text className="mt-2 text-sm leading-6 text-zinc-600">
                After you choose the district, town or area, and blood group, matching donor details
                will appear here.
              </Text>
            </View>
          )}

          {hasSearched && (
            <View>
              <Text className="text-lg font-semibold text-zinc-900">
                {results.length.toLocaleString()} donor{results.length === 1 ? "" : "s"} found
              </Text>
              <Text className="mt-1 text-sm text-zinc-500">
                {selectedDistrict?.label} | {townQuery.trim()} | {bloodGroup}
              </Text>

              {results.length > MAX_VISIBLE_RESULTS && (
                <Text className="mt-2 text-sm text-zinc-500">
                  Showing the first {MAX_VISIBLE_RESULTS} best matches.
                </Text>
              )}

              {results.length === 0 && (
                <View className="mt-4 rounded-lg border border-zinc-200 bg-white px-4 py-5">
                  <Text className="text-base font-semibold text-zinc-900">No donors matched yet</Text>
                  <Text className="mt-2 text-sm leading-6 text-zinc-600">
                    Try another town spelling, pick a nearby area suggestion, or clear the search and
                    choose a different district.
                  </Text>
                </View>
              )}

              <View className="mt-4 gap-3">
                {visibleResults.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} />
                ))}
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
