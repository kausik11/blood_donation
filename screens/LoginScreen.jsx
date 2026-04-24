import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useRequestSearch } from "../context/RequestSearchContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { login, showSplash } = useRequestSearch();

  const handleBackToSplash = () => {
    showSplash();
    router.replace("/");
  };

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = () => {
    // Navigate to home or another page
    login();
    router.replace("/");
  };

  const handleGoogleLogin = () => {
    // Navigate to home
    login();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4">
        <TouchableOpacity 
          onPress={handleBackToSplash}
          className="w-12 h-12 items-center justify-center rounded-full bg-red-600 shadow-sm"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 justify-center"
      >
        <View className="mb-10">
          <Text className="text-4xl font-bold text-red-600 mb-2">Welcome Back</Text>
          <Text className="text-gray-500 text-lg">Log in to save lives and help others.</Text>
        </View>

        {!otpSent ? (
          <View className="gap-5">
            <View>
              <Text className="text-gray-700 font-medium mb-2 text-base">Phone Number</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                <Text className="text-gray-500 font-bold mr-2">+91</Text>
                <TextInput
                  className="flex-1 text-base text-gray-800"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                />
              </View>
            </View>

            <TouchableOpacity 
              className="bg-red-600 rounded-xl py-4 items-center"
              onPress={handleSendOTP}
            >
              <Text className="text-white font-bold text-lg">Send OTP</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-[1px] bg-gray-300" />
              <Text className="text-gray-400 font-medium px-4">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <TouchableOpacity 
              className="border border-gray-300 rounded-xl py-4 flex-row justify-center items-center bg-white"
              onPress={handleGoogleLogin}
            >
              <Text className="text-gray-700 font-bold text-lg">Login with Gmail</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-5">
            <View>
              <Text className="text-gray-700 font-medium mb-2 text-base">Enter OTP</Text>
              <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                <TextInput
                  className="flex-1 text-base text-gray-800 tracking-widest text-center"
                  placeholder="• • • • • •"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                />
              </View>
            </View>

            <TouchableOpacity 
              className="bg-red-600 rounded-xl py-4 items-center"
              onPress={handleVerifyOTP}
            >
              <Text className="text-white font-bold text-lg">Verify & Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="py-4 items-center"
              onPress={() => setOtpSent(false)}
            >
              <Text className="text-gray-500 font-medium text-base">Change Phone Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
