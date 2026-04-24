import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRequestSearch } from "../context/RequestSearchContext";

const logoImage = require("../assets/blood-drop-logo.png");

function BrandBanner() {
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: "#fdf0f0",
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Image source={logoImage} resizeMode="contain" style={{ width: 28, height: 38 }} />

        <View style={{ marginLeft: 8 }}>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 22,
              fontWeight: "600",
              color: "#121212",
              letterSpacing: -0.3,
            }}
          >
            My <Text style={{ color: "#d50000" }}>Blood</Text>
          </Text>
          <Text
            style={{
              marginTop: -1,
              textAlign: "center",
              fontSize: 8,
              fontWeight: "600",
              letterSpacing: 4.1,
              color: "#2b2b2b",
              textTransform: "uppercase",
            }}
          >
            Bank
          </Text>
        </View>
      </View>
    </View>
  );
}

function ProgressBar() {
  return (
    <View style={{ marginTop: 14 }}>
      <View
        style={{
          height: 5,
          overflow: "hidden",
          borderRadius: 999,
          backgroundColor: "#e5e5e5",
        }}
      >
        <View
          style={{
            width: "48%",
            height: "100%",
            borderRadius: 999,
            backgroundColor: "#d50000",
          }}
        />
      </View>
      <Text
        style={{
          marginTop: 7,
          fontSize: 11,
          fontWeight: "500",
          color: "#d34b4b",
        }}
      >
        Step - 1 of 2
      </Text>
    </View>
  );
}

function QuickLocateCard({ onPress, isActive, helperText }) {
  return (
    <View
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: "#fff1f1",
        paddingHorizontal: 16,
        paddingVertical: 18,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          right: -10,
          top: -4,
          opacity: 0.16,
        }}
      >
        <MaterialIcons color="#f0a0a0" name="location-on" size={112} />
      </View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "500",
          color: "#101010",
        }}
      >
        Quick Locate
      </Text>
      <Text
        style={{
          marginTop: 8,
          maxWidth: 180,
          fontSize: 12,
          lineHeight: 18,
          color: "#303030",
        }}
      >
        Allow us to find your nearest donation center automatically.
      </Text>

      <Pressable
        onPress={onPress}
        style={{
          marginTop: 16,
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 999,
          backgroundColor: "#d50000",
          paddingHorizontal: 14,
          paddingVertical: 10,
          shadowColor: "#d50000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 14,
          elevation: 6,
        }}
      >
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Ionicons color="#d50000" name="add" size={14} />
        </View>
        <Text
          style={{
            marginLeft: 6,
            fontSize: 15,
            fontWeight: "600",
            color: "#ffffff",
          }}
        >
          Current Location
        </Text>
      </Pressable>

      <Text
        style={{
          marginTop: 10,
          fontSize: 11,
          lineHeight: 16,
          color: isActive ? "#b40000" : "#7a6161",
        }}
      >
        {helperText}
      </Text>
    </View>
  );
}

function AddressField({
  label,
  placeholder,
  value,
  onChangeText,
  iconName,
  iconFamily = "Ionicons",
  keyboardType = "default",
  autoCapitalize = "words",
}) {
  const IconComponent =
    iconFamily === "Feather"
      ? Feather
      : iconFamily === "MaterialIcons"
        ? MaterialIcons
        : Ionicons;

  return (
    <View style={{ marginTop: 16 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: "#141414",
        }}
      >
        {label}
      </Text>
      <View
        style={{
          marginTop: 9,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#d9d9d9",
          backgroundColor: "#ffffff",
          paddingHorizontal: 12,
        }}
      >
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b3b3b3"
          style={{
            flex: 1,
            minHeight: 44,
            fontSize: 13,
            color: "#111111",
          }}
          value={value}
        />

        <IconComponent color="#b1b1b1" name={iconName} size={16} />
      </View>
    </View>
  );
}

function AccuracyCard() {
  return (
    <View
      style={{
        marginTop: 18,
        flexDirection: "row",
        alignItems: "flex-start",
        borderRadius: 14,
        backgroundColor: "#fff4f3",
        paddingHorizontal: 14,
        paddingVertical: 14,
      }}
    >
      <View
        style={{
          marginTop: 1,
          width: 18,
          height: 18,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ff5a5a",
        }}
      >
        <Ionicons color="#ffffff" name="alert" size={11} />
      </View>

      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#d50000",
          }}
        >
          Accuracy Matters
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontSize: 10,
            lineHeight: 14,
            color: "#4a3f3f",
          }}
        >
          Giving a precise address helps us notify you when local blood drive centres are available.
        </Text>
      </View>
    </View>
  );
}

export default function RegisterDonorScreen() {
  const router = useRouter();
  const {
    donorRegistrationDraft,
    requestDonorCurrentLocation,
    saveDonorRegistrationStepOne,
    updateDonorRegistrationField,
    showSplash,
  } = useRequestSearch();
  const [formNotice, setFormNotice] = useState("");

  const handleBack = () => {
    showSplash();
    router.replace("/");
  };

  const hasRequiredFields = [
    donorRegistrationDraft.country,
    donorRegistrationDraft.state,
    donorRegistrationDraft.district,
    donorRegistrationDraft.subdivision,
    donorRegistrationDraft.blockPostalCode,
  ].every((value) => value.trim().length > 0);

  const handleQuickLocate = () => {
    requestDonorCurrentLocation();
    setFormNotice("Current location preference saved locally. Live location lookup can plug in next.");
  };

  const handleNext = () => {
    if (!hasRequiredFields) {
      setFormNotice("Complete the address details before moving to step 2.");
      return;
    }

    saveDonorRegistrationStepOne();
    setFormNotice("");
    router.push("/register-donor-step-2");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} edges={["top", "right", "bottom", "left"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 34 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Pressable 
              onPress={handleBack}
              style={{
                width: 48,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                backgroundColor: "#d50000",
                marginRight: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <BrandBanner />
            </View>
          </View>

          <View style={{ marginTop: 18 }}>
            <Text
              style={{
                fontSize: 21,
                lineHeight: 30,
                fontWeight: "700",
                color: "#111111",
                letterSpacing: -0.4,
              }}
            >
              Register as a{"\n"}
              <Text style={{ color: "#d50000", fontStyle: "italic" }}>Donor</Text>
            </Text>

            <Text
              style={{
                marginTop: 10,
                fontSize: 11,
                color: "#525252",
              }}
            >
              Quick & Easy Donor Registration
            </Text>

            <ProgressBar />
          </View>

          <View style={{ marginTop: 18 }}>
            <QuickLocateCard
              helperText={
                donorRegistrationDraft.useCurrentLocation
                  ? "Location preference is marked in the local draft."
                  : "You can use this now and connect live geolocation later."
              }
              isActive={donorRegistrationDraft.useCurrentLocation}
              onPress={handleQuickLocate}
            />
          </View>

          <View style={{ marginTop: 20, position: "relative" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#131313",
              }}
            >
              Manual Address Details
            </Text>

            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                right: -14,
                top: 24,
                opacity: 0.05,
              }}
            >
              <Image source={logoImage} resizeMode="contain" style={{ width: 220, height: 360 }} />
            </View>

            <AddressField
              iconFamily="Ionicons"
              iconName="globe-outline"
              label="Country"
              onChangeText={(value) => updateDonorRegistrationField("country", value)}
              placeholder="E.g - India"
              value={donorRegistrationDraft.country}
            />

            <AddressField
              iconFamily="Ionicons"
              iconName="map-outline"
              label="State"
              onChangeText={(value) => updateDonorRegistrationField("state", value)}
              placeholder="E.g - West Bengal"
              value={donorRegistrationDraft.state}
            />

            <AddressField
              iconFamily="Ionicons"
              iconName="business-outline"
              label="District"
              onChangeText={(value) => updateDonorRegistrationField("district", value)}
              placeholder="E.g - Nadia"
              value={donorRegistrationDraft.district}
            />

            <AddressField
              iconFamily="Ionicons"
              iconName="git-network-outline"
              label="Sub-division"
              onChangeText={(value) => updateDonorRegistrationField("subdivision", value)}
              placeholder="E.g - Kalyani"
              value={donorRegistrationDraft.subdivision}
            />

            <AddressField
              autoCapitalize="characters"
              iconFamily="Ionicons"
              iconName="pin-outline"
              keyboardType="default"
              label="Block/Postal Code"
              onChangeText={(value) => updateDonorRegistrationField("blockPostalCode", value)}
              placeholder="E.g - Haringhata"
              value={donorRegistrationDraft.blockPostalCode}
            />

            <AccuracyCard />
          </View>

          {!!formNotice && (
            <Text
              style={{
                marginTop: 16,
                textAlign: "center",
                fontSize: 12,
                lineHeight: 18,
                color: formNotice.startsWith("Step 1") ? "#a30000" : "#6c5a5a",
              }}
            >
              {formNotice}
            </Text>
          )}

          <Pressable
            onPress={handleNext}
            style={{
              alignSelf: "center",
              marginTop: 20,
              minWidth: 124,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              backgroundColor: "#d50000",
              paddingHorizontal: 28,
              shadowColor: "#d50000",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.2,
              shadowRadius: 14,
              elevation: 7,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Next
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
