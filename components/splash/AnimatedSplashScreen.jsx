import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, Image, ImageBackground, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const splashReference = require("../../assets/splash-screen.jpg");
const plusIcon = require("../../assets/vector-plus.png");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function LoadingDot({ index, progress }) {
  const start = index * 0.22 + 0.01;
  const active = start + 0.18;

  const opacity = progress.interpolate({
    inputRange: [0, start, active, 1],
    outputRange: [index === 0 ? 1 : 0.22, 0.22, 1, 0.22],
    extrapolate: "clamp",
  });

  const scale = progress.interpolate({
    inputRange: [0, start, active, 1],
    outputRange: [index === 0 ? 1.08 : 0.9, 0.9, 1.08, 0.9],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      className="h-4 w-4 rounded-full bg-rose-600"
      style={{ opacity, transform: [{ scale }] }}
    />
  );
}

export default function AnimatedSplashScreen({ onContinue }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const ringProgress = useRef(new Animated.Value(0)).current;
  const dotProgress = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const entranceAnimation = Animated.parallel([
      Animated.timing(entrance, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const ringLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringProgress, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ringProgress, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const dotLoop = Animated.loop(
      Animated.timing(dotProgress, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    entranceAnimation.start();
    pulseLoop.start();
    ringLoop.start();
    dotLoop.start();

    return () => {
      pulseLoop.stop();
      ringLoop.stop();
      dotLoop.stop();
    };
  }, [dotProgress, entrance, pulse, ringProgress]);

  const iconScale = useMemo(
    () =>
      Animated.multiply(
        entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [0.82, 1],
        }),
        pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      ),
    [entrance, pulse],
  );

  const iconTranslateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  const textOpacity = entrance.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 0.8, 1],
  });

  const textTranslateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const wordmarkScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const ringOpacity = ringProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.24, 0.46],
  });

  const outerRingScale = ringProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.02],
  });

  const middleRingScale = ringProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.04],
  });

  const buttonShadowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.24],
  });

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      speed: 18,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      speed: 18,
      bounciness: 6,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "right", "bottom", "left"]}>
      <ImageBackground
        blurRadius={14}
        imageStyle={{ opacity: 0.50 }}
        resizeMode="cover"
        source={splashReference}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-between overflow-hidden bg-white/82 px-6 pb-12 pt-10">
          <Animated.View
            className="absolute -bottom-28 left-1/2 h-72 w-72 -translate-x-36 rounded-full bg-rose-200"
            style={{ opacity: buttonShadowOpacity }}
          />

          <View className="flex-1 items-center justify-center">
            <View className="items-center">
              <View className="items-center justify-center">
                <Animated.View
                  className="absolute h-48 w-48 rounded-lg border border-rose-800"
                  style={{ opacity: ringOpacity, transform: [{ scale: outerRingScale }] }}
                />
                <Animated.View
                  className="absolute h-40 w-40 rounded-lg border border-rose-700"
                  style={{ opacity: ringOpacity, transform: [{ scale: middleRingScale }] }}
                />
                <View className="absolute h-32 w-32 rounded-lg border border-rose-600" />

                <Animated.View
                  className="h-28 w-28 items-center justify-center rounded-lg bg-rose-600"
                  style={{
                    shadowColor: "#eb0f3f",
                    shadowOffset: { width: 0, height: 26 },
                    shadowOpacity: 0.12,
                    shadowRadius: 24,
                    transform: [{ translateY: iconTranslateY }, { scale: iconScale }],
                  }}
                >
                  <View className="absolute inset-0 items-center justify-center">
                    <Image
                      source={plusIcon}
                      style={{ width: 28, height: 28 }}
                      resizeMode="contain"
                    />
                  </View>
                </Animated.View>
              </View>

              <Animated.View
                className="mt-24 items-center"
                style={{
                  opacity: textOpacity,
                  transform: [{ translateY: textTranslateY }, { scale: wordmarkScale }],
                }}
              >
                <Text className="text-center text-[46px] font-semibold leading-[54px] text-zinc-950">
                  Save<Text className="text-rose-600">Blood</Text>
                </Text>

                <View className="mt-4 flex-row items-center gap-4">
                  <View className="h-px w-20 bg-rose-200" />
                  <Text className="text-center text-[12px] font-semibold uppercase tracking-[3px] text-zinc-800">
                    By Save Medha Foundation
                  </Text>
                  <View className="h-px w-20 bg-rose-200" />
                </View>

                <Text className="mt-8 text-center text-[18px] font-medium uppercase tracking-[5px] text-rose-600">
                  Excellence In Donation
                </Text>
              </Animated.View>
            </View>
          </View>

          <View className="items-center">
            <AnimatedPressable
              className="min-h-14 w-full max-w-[280px] items-center justify-center rounded-lg bg-rose-600 px-6 py-4"
              style={{
                shadowColor: "#e11d48",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.22,
                shadowRadius: 18,
                transform: [{ scale: buttonScale }],
              }}
              onPress={onContinue}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text className="text-center text-xl font-semibold text-white">
                Start your journey
              </Text>
            </AnimatedPressable>

            <View className="mt-8 flex-row items-center gap-4">
              {[0, 1, 2].map((index) => (
                <LoadingDot key={index} index={index} progress={dotProgress} />
              ))}
            </View>

            <Text className="mt-5 text-center text-base tracking-[4px] text-black">
              Establishing Secure Link
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
