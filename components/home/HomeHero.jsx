import { Image, Text, View } from "react-native";

const heroReference = require("../../assets/blood-request.jpg");

export default function HomeHero() {
  return (
    <View className="px-5 pt-10">
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

      <View className="relative mt-6 min-h-[240px]">
        <View className="absolute left-0 top-5 z-10 h-9 w-20 rounded-lg bg-rose-600" />

        <View className="ml-8 overflow-hidden rounded-[22px] border border-zinc-200 bg-white">
          <Image
            resizeMode="cover"
            source={heroReference}
            style={{ height: 240, width: "100%" }}
          />
        </View>
      </View>
    </View>
  );
}
