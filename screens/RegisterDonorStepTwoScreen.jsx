import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
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

const GENDER_OPTIONS = ["Male", "Female", "Others"];
const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const BLOOD_GROUP_OPTIONS = [
  { value: "A+", label: "A+(Active)" },
  { value: "A-", label: "A-(Selected)" },
  { value: "B+", label: "B+(Available)" },
  { value: "B-", label: "B-(Rare)" },
  { value: "AB+", label: "AB+(Available)" },
  { value: "AB-", label: "AB-(Urgent)" },
  { value: "O+", label: "O+(Universal)" },
  { value: "O-", label: "O-(Critical Need)" },
];

function BrandBanner() {
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: "#fdf0f0",
        paddingHorizontal: 16,
        paddingVertical: 14,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Image source={logoImage} resizeMode="contain" style={{ width: 30, height: 42 }} />

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
    <View style={{ marginTop: 16 }}>
      <View
        style={{
          height: 7,
          overflow: "hidden",
          borderRadius: 999,
          backgroundColor: "#e5e5e5",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 999,
            backgroundColor: "#d50000",
          }}
        />
      </View>
      <Text
        style={{
          marginTop: 8,
          fontSize: 11,
          fontWeight: "500",
          color: "#d50000",
        }}
      >
        Step - 2 of 2
      </Text>
    </View>
  );
}

function ProfileField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "words",
  icon,
}) {
  return (
    <View style={{ marginTop: 18 }}>
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
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#d7d7d7",
          backgroundColor: "#ffffff",
          paddingHorizontal: 14,
          shadowColor: "#1f2937",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#b4b4b4"
          style={{
            flex: 1,
            minHeight: 48,
            fontSize: 13,
            color: "#111111",
          }}
          value={value}
        />

        {icon}
      </View>
    </View>
  );
}

function GenderOption({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: selected ? "#d50000" : "#d7d7d7",
        backgroundColor: selected ? "#d50000" : "#ffffff",
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: selected ? "#ffffff" : "#707070",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function MiniPicker({ placeholder, value, onValueChange, options }) {
  return (
    <View
      style={{
        flex: 1,
        overflow: "hidden",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#d7d7d7",
        backgroundColor: "#ffffff",
      }}
    >
      <Picker
        selectedValue={value}
        style={{ color: value ? "#111111" : "#8f8f8f", height: 50 }}
        dropdownIconColor="#111111"
        onValueChange={onValueChange}
      >
        <Picker.Item label={placeholder} value="" />
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
}

function BloodGroupOption({ option, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: "48.5%",
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: selected ? "#d50000" : "#ece3e3",
        backgroundColor: selected ? "#d50000" : "#ffffff",
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: selected ? "600" : "500",
          color: selected ? "#ffffff" : "#171717",
        }}
      >
        {option.label}
      </Text>
    </Pressable>
  );
}

function UploadProofCard({ proof, onPress }) {
  return (
    <View
      style={{
        marginTop: 18,
        alignItems: "center",
        borderRadius: 18,
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#ffc7c7",
        backgroundColor: "#fff6f6",
        paddingHorizontal: 22,
        paddingVertical: 24,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffe8e8",
        }}
      >
        <MaterialIcons color="#c90d0d" name="badge" size={34} />
      </View>

      <Text
        style={{
          marginTop: 18,
          textAlign: "center",
          fontSize: 18,
          lineHeight: 26,
          fontWeight: "500",
          color: "#101010",
        }}
      >
        Upload Government{"\n"}Issued ID
      </Text>

      <Text
        style={{
          marginTop: 10,
          textAlign: "center",
          fontSize: 12,
          lineHeight: 18,
          color: "#171717",
        }}
      >
        Must be Pan Card, Voter Card, Aadhar Card
      </Text>

      {!!proof?.name && (
        <Text
          style={{
            marginTop: 12,
            textAlign: "center",
            fontSize: 12,
            lineHeight: 18,
            color: "#8a0b0b",
          }}
        >
          Selected locally: {proof.name}
        </Text>
      )}

      <Pressable
        onPress={onPress}
        style={{
          marginTop: 18,
          minWidth: 138,
          minHeight: 48,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: "#ff3f3f",
          backgroundColor: "#ffffff",
          paddingHorizontal: 18,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "500",
            color: "#d50000",
          }}
        >
          Submit
        </Text>
      </Pressable>
    </View>
  );
}

function buildDayOptions() {
  return Array.from({ length: 31 }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { label: value, value };
  });
}

function buildMonthOptions() {
  return MONTH_OPTIONS.map((month, index) => ({
    label: month,
    value: String(index + 1).padStart(2, "0"),
  }));
}

function buildYearOptions() {
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 18;
  const minYear = 1940;

  return Array.from({ length: maxYear - minYear + 1 }, (_, index) => {
    const value = String(maxYear - index);
    return { label: value, value };
  });
}

export default function RegisterDonorStepTwoScreen() {
  const {
    donorRegistrationDraft,
    saveDonorRegistrationStepTwo,
    updateDonorRegistrationField,
  } = useRequestSearch();
  const router = useRouter();
  const [formNotice, setFormNotice] = useState("");
  const dayOptions = useMemo(buildDayOptions, []);

  const handleBack = () => {
    router.back();
  };
  const monthOptions = useMemo(buildMonthOptions, []);
  const yearOptions = useMemo(buildYearOptions, []);

  const isEmailValid = /\S+@\S+\.\S+/.test(donorRegistrationDraft.email.trim());
  const phoneDigits = donorRegistrationDraft.phoneNumber.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length >= 10;
  const hasBirthDate = Boolean(
    donorRegistrationDraft.birthDay &&
      donorRegistrationDraft.birthMonth &&
      donorRegistrationDraft.birthYear,
  );

  const handleUploadProof = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: ["image/*", "application/pdf"],
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset) {
        setFormNotice("No ID proof was selected.");
        return;
      }

      updateDonorRegistrationField("idProof", {
        name: asset.name ?? "Government ID",
        uri: asset.uri ?? "",
        mimeType: asset.mimeType ?? "",
        size: asset.size ?? null,
        selectedAt: new Date().toISOString(),
      });
      setFormNotice("ID proof selected and saved locally on this device.");
    } catch {
      setFormNotice("Could not open the document picker. Please try again.");
    }
  };

  const handleSaveContinue = () => {
    if (!donorRegistrationDraft.fullName.trim()) {
      setFormNotice("Enter the donor's full name before continuing.");
      return;
    }

    if (!donorRegistrationDraft.gender) {
      setFormNotice("Choose a gender before continuing.");
      return;
    }

    if (!isEmailValid) {
      setFormNotice("Enter a valid email address before continuing.");
      return;
    }

    if (!isPhoneValid) {
      setFormNotice("Enter a valid phone number before continuing.");
      return;
    }

    if (!hasBirthDate) {
      setFormNotice("Complete the date of birth before continuing.");
      return;
    }

    if (!donorRegistrationDraft.bloodGroup) {
      setFormNotice("Select a blood group before continuing.");
      return;
    }

    if (!donorRegistrationDraft.idProof?.name) {
      setFormNotice("Upload a government-issued ID before continuing.");
      return;
    }

    saveDonorRegistrationStepTwo();
    router.replace("/donate-blood");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top", "right", "bottom", "left"]}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 34 }}
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

          <View style={{ marginTop: 22, paddingHorizontal: 10 }}>
            <Text
              style={{
                fontSize: 26,
                lineHeight: 40,
                fontWeight: "700",
                color: "#111111",
                letterSpacing: -0.8,
              }}
            >
              Be a Lifesaver,{"\n"}Register to{"\n"}
              <Text style={{ color: "#d50000", fontStyle: "italic" }}>Donate Blood</Text>
            </Text>

            <Text
              style={{
                marginTop: 12,
                maxWidth: 340,
                fontSize: 12,
                lineHeight: 18,
                color: "#2f2f2f",
              }}
            >
              Every registration is a potential heartbeat. Let&apos;s get your clinical profile
              ready.
            </Text>

            <ProgressBar />
          </View>

          <View
            style={{
              marginTop: 24,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "#cfcfcf",
              backgroundColor: "#ffffff",
              paddingHorizontal: 18,
              paddingVertical: 22,
              overflow: "hidden",
            }}
          >
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 92,
                top: 228,
                opacity: 0.05,
              }}
            >
              <Image source={logoImage} resizeMode="contain" style={{ width: 220, height: 420 }} />
            </View>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "500",
                color: "#111111",
              }}
            >
              Join Vitality
            </Text>

            <ProfileField
              icon={<Feather color="#767676" name="user" size={18} />}
              label="Full Name"
              onChangeText={(value) => updateDonorRegistrationField("fullName", value)}
              placeholder="e.g - Jublin Tendulkar"
              value={donorRegistrationDraft.fullName}
            />

            <View style={{ marginTop: 18 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: "#141414",
                }}
              >
                Gender
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                {GENDER_OPTIONS.map((gender) => (
                  <GenderOption
                    key={gender}
                    label={gender}
                    selected={donorRegistrationDraft.gender === gender}
                    onPress={() => updateDonorRegistrationField("gender", gender)}
                  />
                ))}
              </View>
            </View>

            <ProfileField
              icon={<Feather color="#767676" name="mail" size={18} />}
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email Address"
              onChangeText={(value) => updateDonorRegistrationField("email", value)}
              placeholder="e.g - Jublin01@gmail.com"
              value={donorRegistrationDraft.email}
            />

            <ProfileField
              icon={<Feather color="#767676" name="phone" size={18} />}
              autoCapitalize="none"
              keyboardType="phone-pad"
              label="Phone Number"
              onChangeText={(value) => updateDonorRegistrationField("phoneNumber", value)}
              placeholder="e.g - +91 653265986"
              value={donorRegistrationDraft.phoneNumber}
            />

            <View style={{ marginTop: 18 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: "#141414",
                }}
              >
                Date of Birth
              </Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <MiniPicker
                  options={dayOptions}
                  placeholder="Day"
                  value={donorRegistrationDraft.birthDay}
                  onValueChange={(value) => updateDonorRegistrationField("birthDay", value)}
                />
                <MiniPicker
                  options={monthOptions}
                  placeholder="Month"
                  value={donorRegistrationDraft.birthMonth}
                  onValueChange={(value) => updateDonorRegistrationField("birthMonth", value)}
                />
                <MiniPicker
                  options={yearOptions}
                  placeholder="Year"
                  value={donorRegistrationDraft.birthYear}
                  onValueChange={(value) => updateDonorRegistrationField("birthYear", value)}
                />
              </View>
            </View>

            <View style={{ marginTop: 18 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: "#141414",
                }}
              >
                Select Blood Group
              </Text>

              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {BLOOD_GROUP_OPTIONS.map((option) => (
                  <BloodGroupOption
                    key={option.value}
                    option={option}
                    selected={donorRegistrationDraft.bloodGroup === option.value}
                    onPress={() => updateDonorRegistrationField("bloodGroup", option.value)}
                  />
                ))}
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: "#141414",
                }}
              >
                Submit your I&apos;D proof
              </Text>

              <UploadProofCard proof={donorRegistrationDraft.idProof} onPress={handleUploadProof} />

              <Text
                style={{
                  marginTop: 16,
                  textAlign: "center",
                  fontSize: 12,
                  lineHeight: 18,
                  color: "#1c1c1c",
                }}
              >
                This is used exclusively for secure identity verification and to prevent
                fraudulent clinical profiles.
              </Text>
            </View>

            <Pressable
              onPress={handleSaveContinue}
              style={{
                alignSelf: "center",
                marginTop: 22,
                minWidth: 214,
                minHeight: 54,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                backgroundColor: "#d50000",
                paddingHorizontal: 30,
                shadowColor: "#d50000",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.22,
                shadowRadius: 16,
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
                Save & Continue
              </Text>
            </Pressable>
          </View>

          {!!formNotice && (
            <Text
              style={{
                marginTop: 14,
                textAlign: "center",
                fontSize: 12,
                lineHeight: 18,
                color: formNotice.startsWith("Step 2") ? "#a00000" : "#5f4e4e",
                paddingHorizontal: 18,
              }}
            >
              {formNotice}
            </Text>
          )}

          <View
            style={{
              marginTop: 20,
              borderRadius: 18,
              backgroundColor: "#fbf7f7",
              paddingHorizontal: 20,
              paddingVertical: 14,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 11,
                lineHeight: 18,
                color: "#222222",
              }}
            >
              By continuing, you agree to MyBloodBank&apos;s{" "}
              <Text style={{ color: "#d50000" }}>Terms of Service</Text> &{" "}
              <Text style={{ color: "#d50000" }}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
