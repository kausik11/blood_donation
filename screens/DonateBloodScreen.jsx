import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AppShell from "../components/layout/AppShell";

const logoImage = require("../assets/blood-drop-logo.png");

// Dummy Data
const ACTIVE_REQUESTS = [
  {
    id: "1",
    name: "Marcus Thomson",
    hospital: "General City Hospital, Ward - 8",
    status: "Critical",
    units: 2,
    bloodGroup: "O-",
  },
  {
    id: "2",
    name: "Sarah Jenkies",
    hospital: "General City Hospital, Ward - 8",
    status: "Stable",
    units: 1,
    bloodGroup: "AB+",
  },
  {
    id: "3",
    name: "Elina Gomns",
    hospital: "General City Hospital, Ward - 8",
    status: "Critical",
    units: 3,
    bloodGroup: "O-",
  },
];

const NEAREST_CAMPS = [
  {
    id: "1",
    name: "Central Metro Clinic",
    location: "Downtown, Nadia, Zone A",
    date: "24 oct, 26",
    phone: "9896126125",
  },
  {
    id: "2",
    name: "DumDum Metro Clinic",
    location: "Dumdum, Kol, Zone A",
    date: "24 oct, 26",
    phone: "9896126125",
  },
];

export default function DonateBloodScreen() {
  const [expandedRequests, setExpandedRequests] = useState(false);

  const visibleRequests = expandedRequests ? ACTIVE_REQUESTS : ACTIVE_REQUESTS.slice(0, 3);

  return (
    <AppShell showBrandHeader={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-6 pb-2">
        <View className="flex-row items-center bg-red-50 rounded-2xl px-4 py-2">
          <Image source={logoImage} resizeMode="contain" className="w-5 h-7" />
          <View className="ml-2">
            <Text className="text-sm font-bold text-gray-900 leading-tight tracking-tight">
              My <Text className="text-red-600">Blood</Text>
            </Text>
            <Text className="text-[7px] font-bold tracking-[2px] text-gray-800 uppercase leading-none mt-0.5">
              Bank
            </Text>
          </View>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-100">
          <Feather name="bell" size={18} color="#4b5563" />
        </TouchableOpacity>
      </View>

      {/* Hero Title */}
      <View className="px-5 mt-5">
        <Text className="text-[32px] font-bold text-gray-900 leading-tight tracking-tight">
          The heartbeat{"\n"}of <Text className="text-red-600 italic">Heroism</Text>
        </Text>
        <Text className="mt-2 text-xs text-gray-600 pr-10 leading-relaxed font-medium">
          Every drop matters. Connect with local camps or fulfil urgent hospital request.
        </Text>
      </View>

      {/* Search Button */}
      <View className="items-center mt-8">
        <TouchableOpacity className="flex-row items-center bg-white border border-gray-200 rounded-full px-6 py-3.5 shadow-sm shadow-gray-200 w-56 justify-center">
          <Feather name="search" size={18} color="#374151" />
          <Text className="ml-2 text-[15px] font-semibold text-gray-800">Search Blood</Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Title */}
      <View className="px-5 mt-10">
        <Text className="text-[28px] font-bold text-gray-900 leading-tight">
          Donate <Text className="text-red-600 italic">Blood,</Text>{"\n"}
          Save <Text className="text-red-600 italic">Lives</Text>
        </Text>
        <Text className="mt-2 text-[11px] text-gray-600 pr-10 leading-relaxed font-medium">
          Your single donation can give someone a second chance at life.
        </Text>
      </View>

      {/* Active Blood Request Section */}
      <View className="mt-10 px-5">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900 tracking-tight">Active Blood Request</Text>
          <View className="bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            <Text className="text-xs font-semibold text-red-600 tracking-wide">4 urgent</Text>
          </View>
        </View>

        <View className="gap-4">
          {visibleRequests.map((req) => (
            <View key={req.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-lg font-bold text-gray-900">{req.name}</Text>
                  <Text className="text-xs text-gray-700 mt-1.5 font-medium">{req.hospital}</Text>
                  <View className="flex-row items-center mt-2.5 gap-3">
                    <View className="flex-row items-center">
                      <View className={`w-1 h-1 rounded-full ${req.status === 'Critical' ? 'bg-red-600' : 'bg-green-600'}`} />
                      <Text className={`ml-1.5 text-[10px] font-bold ${req.status === 'Critical' ? 'text-red-600' : 'text-green-600'}`}>{req.status}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-1 h-1 rounded-full bg-red-600" />
                      <Text className="ml-1.5 text-[10px] font-bold text-red-600">{req.units} units needed</Text>
                    </View>
                  </View>
                </View>
                
                <View className="items-end justify-between h-20">
                  <View className="border border-red-200 bg-red-50 rounded-xl px-3.5 py-1">
                    <Text className="text-lg font-bold text-red-600 tracking-tighter">{req.bloodGroup}</Text>
                  </View>
                  <TouchableOpacity className="bg-[#cc0000] rounded-full px-4 py-1.5 shadow-sm shadow-red-200">
                    <Text className="text-[11px] font-bold text-white tracking-wide">Donate Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="items-center mt-6">
          <TouchableOpacity 
            onPress={() => setExpandedRequests(!expandedRequests)}
            className="bg-[#cc0000] shadow-md shadow-red-200 rounded-full px-8 py-2.5"
          >
            <Text className="text-[13px] font-bold text-white tracking-wide">{expandedRequests ? "View Less" : "View All"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nearest Blood Camp Section */}
      <View className="mt-12 px-5">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-lg font-bold text-gray-900 tracking-tight">Nearest Blood Camp</Text>
          <TouchableOpacity>
            <Text className="text-xs font-semibold text-red-600">View all {">"}</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-600 mb-5 font-medium">Scheduled drives near your location</Text>

        <View className="gap-6">
          {NEAREST_CAMPS.map((camp) => (
            <View key={camp.id} className="bg-gray-50 rounded-[20px] overflow-hidden border border-gray-200 pb-4">
              {/* Card Image Placeholder */}
              <View className="h-44 bg-gray-200 relative">
                {/* Simulated Image */}
                <View className="absolute inset-0 bg-slate-300 items-center justify-center">
                  <Feather name="image" size={32} color="#9ca3af" />
                  <Text className="text-gray-500 mt-2 text-xs font-medium">Camp Image Placeholder</Text>
                </View>
                
                <View className="absolute top-3 left-3 bg-white/95 rounded-full px-3 py-1 flex-row items-center shadow-sm">
                  <Ionicons name="calendar" size={12} color="#dc2626" />
                  <Text className="ml-1 text-[10px] font-bold text-red-700">{camp.date}</Text>
                </View>
              </View>

              <View className="px-4 pt-4">
                <Text className="text-lg font-bold text-gray-900 tracking-tight">{camp.name}</Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="location-outline" size={14} color="#6b7280" />
                  <Text className="ml-1 text-xs text-gray-600 font-medium">{camp.location}</Text>
                </View>

                <View className="flex-row items-center gap-3 mt-5">
                  <TouchableOpacity className="flex-1 border border-gray-300 rounded-xl py-2.5 items-center bg-white shadow-sm shadow-gray-100">
                    <Text className="text-[13px] font-bold text-red-600">Call - {camp.phone}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 border border-gray-300 rounded-xl py-2.5 items-center bg-white shadow-sm shadow-gray-100">
                    <Text className="text-[13px] font-bold text-red-600">View On Map</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      {/* Spacer for bottom tab bar padding */}
      <View className="h-6" />
    </AppShell>
  );
}
