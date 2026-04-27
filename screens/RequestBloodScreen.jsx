import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppShell from "../components/layout/AppShell";

const logoImage = require("../assets/blood-drop-logo.png");

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const URGENCY_LEVELS = [
  { label: "Normal", color: "#22c55e" },
  { label: "Urgent", color: "#dc2626" },
  { label: "Critical", color: "#dc2626" },
];

function BrandHeader() {
  return (
    <View className="mx-4 mt-3 flex-row items-center justify-between rounded-[20px] bg-red-50 px-6 py-4">
      <View className="flex-1 flex-row items-center justify-center">
        <Image source={logoImage} resizeMode="contain" className="h-14 w-11" />
        <View className="ml-2">
          <Text className="text-[24px] font-bold leading-7 text-zinc-950">
            My <Text className="text-red-600">Blood</Text>
          </Text>
          <Text className="text-center text-[10px] font-bold uppercase tracking-[5px] text-zinc-900">
            Bank
          </Text>
        </View>
      </View>
    </View>
  );
}

function PageTitle() {
  return (
    <View className="px-8 pt-9">
      <View className="flex-row items-center justify-between">
        <Text className="text-[34px] font-extrabold leading-10 tracking-tight text-zinc-950">
          Request <Text className="italic text-red-700">Blood</Text>
        </Text>
        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
          <Feather name="bell" size={20} color="#555555" />
        </TouchableOpacity>
      </View>
      <Text className="mt-5 pr-5 text-[15px] font-medium leading-5 text-zinc-800">
        Broadcast your requirement across our secure network of certified blood banks and emergency
        donors real time.
      </Text>
    </View>
  );
}

function SectionTitle({ children }) {
  return (
    <Text className="text-[22px] font-extrabold leading-7 tracking-tight text-zinc-950">
      {children}
    </Text>
  );
}

function FormInput({ placeholder, required, keyboardType = "default" }) {
  return (
    <TextInput
      className="h-16 rounded-xl bg-white px-6 text-[14px] font-medium text-zinc-900 shadow-sm shadow-zinc-200"
      keyboardType={keyboardType}
      placeholder={`${placeholder}${required ? " *" : ""}`}
      placeholderTextColor={required ? "#9ca3af" : "#9ca3af"}
    />
  );
}

function InfoFields() {
  return (
    <View>
      <SectionTitle>Patient and Hospital{"\n"}Information</SectionTitle>
      <View className="mt-8 gap-4">
        <FormInput placeholder="Patient's Full Name" required />
        <FormInput placeholder="Patient's Hospital ID/MN" />
        <FormInput placeholder="Contact Number" required keyboardType="phone-pad" />
        <FormInput placeholder="Hospital's Contact Number" keyboardType="phone-pad" />
      </View>
    </View>
  );
}

function BloodGroupSelector({ selected, onSelect }) {
  return (
    <View className="mt-9">
      <SectionTitle>Request Blood Group</SectionTitle>
      <View className="mt-6 flex-row flex-wrap justify-between gap-y-5">
        {BLOOD_GROUPS.map((group) => {
          const isSelected = selected === group;

          return (
            <TouchableOpacity
              key={group}
              className={`h-[54px] w-[70px] items-center justify-center rounded-xl shadow-sm shadow-zinc-200 ${
                isSelected ? "bg-red-700" : "bg-white"
              }`}
              onPress={() => onSelect(group)}
            >
              <Text
                className={`text-[21px] font-extrabold tracking-tight ${
                  isSelected ? "text-white" : "text-zinc-950"
                }`}
              >
                {group}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ReasonSelect() {
  return (
    <View className="mt-9">
      <SectionTitle>Patient and Hospital{"\n"}Information</SectionTitle>
      <TouchableOpacity className="mt-7 h-16 flex-row items-center justify-between rounded-xl bg-white px-6 shadow-sm shadow-zinc-200">
        <Text className="text-[14px] font-semibold text-zinc-950">Specific Medical Reason</Text>
        <Feather name="chevron-down" size={22} color="#111111" />
      </TouchableOpacity>
    </View>
  );
}

function DeliveryLocation() {
  return (
    <View className="mt-9">
      <SectionTitle>Delivery Location</SectionTitle>
      <TouchableOpacity className="mt-6 h-16 flex-row items-center rounded-xl bg-white px-5 shadow-sm shadow-zinc-200">
        <Ionicons name="location-outline" size={20} color="#444444" />
        <Text className="ml-3 text-[14px] font-semibold text-zinc-950">Enter Your Location...</Text>
      </TouchableOpacity>
    </View>
  );
}

function UrgencySelector({ selected, onSelect }) {
  return (
    <View className="mt-9">
      <SectionTitle>Urgency Level</SectionTitle>
      <View className="mt-6 flex-row gap-4">
        {URGENCY_LEVELS.map((level) => {
          const isSelected = selected === level.label;

          return (
            <TouchableOpacity
              key={level.label}
              className={`h-16 flex-1 items-center justify-center rounded-xl shadow-sm shadow-zinc-200 ${
                isSelected ? "bg-red-700" : "bg-white"
              }`}
              onPress={() => onSelect(level.label)}
            >
              <View
                className="mb-2 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: isSelected ? "#ffffff" : level.color }}
              />
              <Text className={`text-[13px] font-semibold ${isSelected ? "text-white" : "text-zinc-950"}`}>
                {level.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function UnitsStepper({ units, setUnits }) {
  const decreaseUnits = () => setUnits((value) => Math.max(1, value - 1));
  const increaseUnits = () => setUnits((value) => Math.min(12, value + 1));

  return (
    <View className="mt-9">
      <SectionTitle>Units Needed</SectionTitle>
      <View className="mt-6 h-[72px] flex-row items-center justify-center rounded-xl border border-zinc-200 bg-white">
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-zinc-200"
          onPress={decreaseUnits}
        >
          <Feather name="minus" size={24} color="#111111" />
        </TouchableOpacity>
        <Text className="mx-8 min-w-[74px] text-center text-[50px] font-extrabold leading-[58px] text-zinc-950">
          {String(units).padStart(2, "0")}
        </Text>
        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-zinc-200"
          onPress={increaseUnits}
        >
          <Feather name="plus" size={24} color="#111111" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DateTimeField() {
  return (
    <View className="mt-9">
      <SectionTitle>Required By Date / Time</SectionTitle>
      <View className="mt-6 h-[72px] flex-row items-center rounded-xl border border-zinc-200 bg-white px-4">
        <View className="flex-1 flex-row items-center">
          <MaterialCommunityIcons name="calendar-clock-outline" size={24} color="#111111" />
          <TextInput
            className="ml-2 flex-1 text-[14px] font-medium text-zinc-950"
            placeholder="mm/dd/yyyy"
            placeholderTextColor="#333333"
          />
        </View>
        <View className="mx-4 h-10 w-px bg-zinc-700" />
        <TextInput
          className="flex-1 text-[18px] font-medium text-zinc-950"
          placeholder="--:--"
          placeholderTextColor="#333333"
        />
      </View>
    </View>
  );
}

function SubmitButton() {
  return (
    <View className="items-center pt-9">
      <TouchableOpacity className="rounded-full bg-red-700 px-9 py-3.5 shadow-lg shadow-red-300">
        <Text className="text-[22px] font-bold tracking-tight text-white">Submit Request</Text>
      </TouchableOpacity>
    </View>
  );
}

function RequestFormCard() {
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [urgency, setUrgency] = useState("Critical");
  const [units, setUnits] = useState(2);

  return (
    <View className="mx-8 mt-10 rounded-[14px] border border-zinc-200 bg-zinc-100 px-6 pb-10 pt-8">
      <InfoFields />
      <BloodGroupSelector selected={bloodGroup} onSelect={setBloodGroup} />
      <ReasonSelect />
      <DeliveryLocation />
      <UrgencySelector selected={urgency} onSelect={setUrgency} />
      <UnitsStepper units={units} setUnits={setUnits} />
      <DateTimeField />
      <SubmitButton />
    </View>
  );
}

export default function RequestBloodScreen() {
  return (
    <AppShell showBrandHeader={false}>
      <BrandHeader />
      <PageTitle />
      <RequestFormCard />
      <View className="h-6" />
    </AppShell>
  );
}
