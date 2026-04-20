import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";

export default function AnimatedBrandHeader() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [pulse]);

  const animatedStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.78, 1],
    }),
    transform: [
      {
        translateY: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [2, -2],
        }),
      },
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.03],
        }),
      },
    ],
  };

  return (
    <View className="mx-5 flex items-center justify-center rounded-lg bg-[#FFECEB]/50 px-5 pb-8 pt-4">
       <Animated.View style={animatedStyle}>
        <Text className="mt-1 text-center text-[20px] font-semibold leading-9 text-zinc-950">
          Save <Text className="text-rose-600">Blood</Text>
        </Text>
      </Animated.View>
      <Text className="pb-2 text-center text-[11px] font-semibold uppercase tracking-[2px] text-zinc-500">
        By Save Medha Foundation
      </Text>

     
    </View>
  );
}
