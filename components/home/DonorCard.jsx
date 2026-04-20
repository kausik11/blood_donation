import { Feather } from "@expo/vector-icons";
import { Alert, Pressable, Text, View } from "react-native";
import { useRequestSearch } from "../../context/RequestSearchContext";
import { openPhoneDialer, openWhatsAppOrSms } from "../../lib/contactIntents";
import { formatPhoneNumber } from "../../lib/donorSearch";

export default function DonorCard({ donor }) {
  const { buildNotifyMessageForDonor } = useRequestSearch();
  const locationLine = [donor.district, donor.town || donor.block].filter(Boolean).join(" | ");
  const supportingLine = [donor.block && donor.town ? donor.block : "", donor.state]
    .filter(Boolean)
    .join(" | ");

  const handleCall = async () => {
    try {
      await openPhoneDialer(donor.phone);
    } catch {
      Alert.alert("Could not open the phone app", donor.phone);
    }
  };

  const handleNotify = async () => {
    try {
      await openWhatsAppOrSms({
        phone: donor.phone,
        message: buildNotifyMessageForDonor(donor),
      });
    } catch {
      Alert.alert("Could not open a messaging app", donor.phone);
    }
  };

  return (
    <View className="rounded-lg border border-zinc-200 bg-white p-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text className="text-[26px] font-semibold leading-8 text-zinc-950" numberOfLines={2}>
            {donor.name}
          </Text>

          <View className="mt-4 self-start rounded-lg bg-rose-50 px-3 py-2">
            <Text className="text-sm font-semibold text-rose-700">Blood Type - {donor.bloodGroup}</Text>
          </View>
        </View>

        <View className="max-w-[42%] items-end">
          {!!locationLine && (
            <View className="flex-row items-center gap-2">
              <View className="h-2.5 w-2.5 rounded-full bg-lime-500" />
              <Text className="text-right text-sm leading-5 text-zinc-600">{locationLine}</Text>
            </View>
          )}

          {!!supportingLine && (
            <Text className="mt-4 text-right text-sm leading-6 text-zinc-500">{supportingLine}</Text>
          )}
        </View>
      </View>

      <View className="mt-5 flex-row gap-3">
        <Pressable
          className="min-h-14 flex-1 items-center justify-center rounded-lg bg-rose-600 px-4 py-3"
          onPress={handleCall}
        >
          <View className="flex-row items-center gap-2">
            <Feather color="#ffffff" name="phone" size={16} />
            <Text className="text-base font-semibold text-white">Call Donor</Text>
          </View>
          <Text className="mt-1 text-sm text-white/90">{formatPhoneNumber(donor.phone)}</Text>
        </Pressable>

        <Pressable
          className="min-h-14 flex-1 items-center justify-center rounded-lg border border-rose-600 bg-white px-4 py-3"
          onPress={handleNotify}
        >
          <View className="flex-row items-center gap-2">
            <Feather color="#e11d48" name="message-circle" size={16} />
            <Text className="text-base font-semibold text-rose-700">Notify Donor</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
