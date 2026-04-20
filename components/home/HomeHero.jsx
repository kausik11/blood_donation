import { ImageBackground, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const heroReference = require("../../assets/blood-request.jpg");

export default function HomeHero() {
  return (
    <View className="px-5 pt-4">
      <View className="items-center">
        <Text className="text-center text-[28px] font-semibold leading-9 text-zinc-950">
          Request{" "}
          <Text className="font-bold italic text-rose-600">
            Life{"\n"}Saving
          </Text>
          {"\n"}Blood Units
        </Text>
        <Text className="mt-4 max-w-[320px] text-center text-sm leading-6 text-zinc-600">
          Precision blood matching for urgent requests. Select the request details and reach active
          donors quickly.
        </Text>
      </View>

      <View className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <ImageBackground
          blurRadius={12}
          imageStyle={{ opacity: 0.32 }}
          resizeMode="cover"
          source={heroReference}
          style={{ minHeight: 240 }}
        >
          <View className="flex-1 justify-between bg-white/70 px-5 py-5">
            <View className="w-20 rounded-lg bg-rose-600 px-4 py-3" />

            <View className="self-end rounded-lg bg-white px-4 py-3">
              <Feather color="#e11d48" name="heart" size={20} />
            </View>

            <View className="max-w-[250px] rounded-lg bg-white/90 px-4 py-4">
              <Text className="text-base font-semibold text-zinc-900">Live donor matching</Text>
              <Text className="mt-2 text-sm leading-6 text-zinc-600">
                Choose the blood group, district, and town to activate the nearest matches from
                the donor registry.
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
