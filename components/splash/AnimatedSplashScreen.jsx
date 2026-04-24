import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const splashReference = require("../../assets/splash-screen.jpg");
const logoImage = require("../../assets/blood-drop-logo.png");
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function LoadingDot({ index, progress }) {
  const start = index * 0.23 + 0.01;
  const active = start + 0.2;

  const opacity = progress.interpolate({
    inputRange: [0, start, active, 1],
    outputRange: [index === 0 ? 1 : 0.3, 0.3, 1, 0.3],
    extrapolate: "clamp",
  });

  const scale = progress.interpolate({
    inputRange: [0, start, active, 1],
    outputRange: [index === 0 ? 1.1 : 0.9, 0.9, 1.1, 0.9],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        width: 10,
        height: 10,
        borderRadius: 999,
        backgroundColor: index === 2 ? "#f1b8be" : "#d70808",
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

export default function AnimatedSplashScreen({ onContinue }) {
  const { width, height } = useWindowDimensions();
  const entrance = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const dotProgress = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const entranceAnimation = Animated.timing(entrance, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    const haloLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 0,
          duration: 1700,
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
    haloLoop.start();
    dotLoop.start();

    return () => {
      haloLoop.stop();
      dotLoop.stop();
    };
  }, [dotProgress, entrance, halo]);

  const compact = height < 760;
  const contentWidth = Math.min(width - 40, 320);
  const buttonWidth = Math.min(width - 86, 276);
  const heroBoxSize = compact ? 194 : 214;
  const outerFrameSize = compact ? 166 : 186;
  const middleFrameSize = compact ? 148 : 166;
  const innerFrameSize = compact ? 128 : 144;
  const logoCardSize = compact ? 86 : 96;
  const logoSize = compact ? 58 : 64;
  const titleSize = compact ? 30 : 34;
  const serviceSize = compact ? 17 : 18;

  const heroOpacity = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const heroTranslateY = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 0],
  });

  const heroScale = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const outerFrameScale = halo.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.05],
  });

  const middleFrameScale = halo.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.03],
  });

  const innerGlowOpacity = halo.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.2],
  });

  const logoCardScale = halo.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.02, 1],
  });

  const registerGlowOpacity = halo.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 0.36],
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
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffafa" }} edges={["top", "right", "bottom", "left"]}>
      <ImageBackground
        blurRadius={18}
        imageStyle={{
          opacity: 0.38,
          transform: [{ scale: 1.06 }],
        }}
        resizeMode="cover"
        source={splashReference}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 251, 251, 0.82)",
            overflow: "hidden",
          }}
        >
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 108,
              left: -44,
              width: 170,
              height: 170,
              borderRadius: 999,
              backgroundColor: "rgba(195, 226, 255, 0.22)",
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              bottom: -48,
              left: width / 2 - 170,
              width: 340,
              height: 170,
              borderTopLeftRadius: 170,
              borderTopRightRadius: 170,
              backgroundColor: "rgba(241, 172, 178, 0.22)",
            }}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: compact ? 18 : 28,
              paddingBottom: compact ? 18 : 26,
            }}
          >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Animated.View
                style={{
                  alignItems: "center",
                  width: contentWidth,
                  opacity: heroOpacity,
                  transform: [{ translateY: heroTranslateY }, { scale: heroScale }],
                }}
              >
                <View
                  style={{
                    width: heroBoxSize,
                    height: heroBoxSize,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: outerFrameSize,
                      height: outerFrameSize,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "rgba(214, 40, 40, 0.48)",
                      opacity: 0.95,
                      transform: [{ scale: outerFrameScale }],
                    }}
                  />
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: middleFrameSize,
                      height: middleFrameSize,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(222, 72, 72, 0.42)",
                      transform: [{ scale: middleFrameScale }],
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      width: innerFrameSize,
                      height: innerFrameSize,
                      borderRadius: 11,
                      borderWidth: 1,
                      borderColor: "rgba(233, 129, 129, 0.42)",
                    }}
                  />
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: logoCardSize + 34,
                      height: logoCardSize + 34,
                      borderRadius: 24,
                      backgroundColor: "rgba(255, 118, 118, 0.16)",
                      opacity: innerGlowOpacity,
                    }}
                  />

                  <Animated.View
                    style={{
                      width: logoCardSize,
                      height: logoCardSize,
                      borderRadius: 18,
                      backgroundColor: "#ffffff",
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#d91818",
                      shadowOffset: { width: 0, height: 16 },
                      shadowOpacity: 0.14,
                      shadowRadius: 20,
                      elevation: 7,
                      transform: [{ scale: logoCardScale }],
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: logoCardSize * 0.45,
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18,
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                      }}
                    />
                    <Image
                      source={logoImage}
                      resizeMode="contain"
                      style={{ width: logoSize, height: logoSize + 8 }}
                    />
                  </Animated.View>
                </View>

                <View style={{ alignItems: "center", marginTop: compact ? 12 : 18 }}>
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    minimumFontScale={0.85}
                    style={{
                      width: contentWidth + 10,
                      textAlign: "center",
                      fontSize: titleSize,
                      lineHeight: titleSize + 8,
                      fontWeight: "600",
                      letterSpacing: -0.8,
                      color: "#09090b",
                    }}
                  >
                    My <Text style={{ color: "#c50909" }}>Blood</Text> Bank
                  </Text>

                  <View
                    style={{
                      width: Math.min(width - 72, 310),
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: compact ? 14 : 16,
                    }}
                  >
                    <View style={{ flex: 1, height: 1, backgroundColor: "#efb8b8" }} />
                    <Text
                      style={{
                        marginHorizontal: 10,
                        textAlign: "center",
                        fontSize: 11,
                        fontWeight: "700",
                        letterSpacing: 2.1,
                        color: "#171717",
                      }}
                    >
                      BY SAVE MEDHA FOUNDATION
                    </Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: "#efb8b8" }} />
                  </View>

                  <Text
                    style={{
                      marginTop: compact ? 18 : 22,
                      textAlign: "center",
                      fontSize: serviceSize,
                      lineHeight: serviceSize + 10,
                      fontWeight: "500",
                      letterSpacing: 3.8,
                      color: "#111111",
                    }}
                  >
                    ONLINE BLOOD DONATION{"\n"}SERVICE
                  </Text>
                </View>
              </Animated.View>
            </View>

            <View style={{ alignItems: "center", paddingBottom: compact ? 4 : 10 }}>
              <Animated.View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: -10,
                  width: buttonWidth - 8,
                  height: 56,
                  borderRadius: 999,
                  backgroundColor: "#ffb4b4",
                  opacity: registerGlowOpacity,
                }}
              />

              <AnimatedPressable
                accessibilityRole="button"
                onPress={onContinue}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{
                  width: buttonWidth,
                  minHeight: 56,
                  borderRadius: 999,
                  backgroundColor: "#d50000",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 24,
                  shadowColor: "#d50000",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.24,
                  shadowRadius: 16,
                  elevation: 8,
                  transform: [{ scale: buttonScale }],
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#ffffff",
                    letterSpacing: 0.2,
                  }}
                >
                  Register
                </Text>
              </AnimatedPressable>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: true }}
                disabled
                style={{
                  width: buttonWidth,
                  minHeight: 50,
                  marginTop: 18,
                  borderRadius: 999,
                  backgroundColor: "#d9d9dc",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 24,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "500",
                    color: "#747474",
                    letterSpacing: 0.2,
                  }}
                >
                  Login
                </Text>
              </Pressable>

              <View style={{ alignItems: "center", marginTop: compact ? 34 : 44 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  {[0, 1, 2].map((index) => (
                    <LoadingDot key={index} index={index} progress={dotProgress} />
                  ))}
                </View>

                <Text
                  style={{
                    marginTop: 14,
                    textAlign: "center",
                    fontSize: 12,
                    letterSpacing: 1.9,
                    color: "#8c7f82",
                  }}
                >
                  Establishing Secure Link
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
