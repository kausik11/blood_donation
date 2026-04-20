import { useEffect, useRef } from "react";
import { Entypo } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Animated, Easing, Image, Pressable, Text, View } from "react-native";

const requestIcon = require("../../assets/nav/request.png");
const historyIcon = require("../../assets/nav/history.png");
const profileIcon = require("../../assets/nav/profile.png");
const middleIcon = require("../../assets/vector-plus.png");

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    iconType: "home",
  },
  {
    href: "/request",
    label: "Request",
    iconType: "request",
  },
  {
    href: "/history",
    label: "History",
    iconType: "history",
  },
  {
    href: "/profile",
    label: "Profile",
    iconType: "profile",
  },
];
const LEFT_NAV_ITEMS = NAV_ITEMS.slice(0, 2);
const RIGHT_NAV_ITEMS = NAV_ITEMS.slice(2);

function HomeBadgeIcon() {
  return (
    <View className="h-7 w-7 items-center justify-center rounded-lg bg-rose-600">
      <View className="items-center justify-center">
        <Entypo color="#ffffff" name="home" size={15} />
        {/* <View className="absolute inset-0 items-center justify-center">
          <Feather color="#e11d48" name="plus" size={7} />
        </View> */}
      </View>
    </View>
  );
}

function NavIcon({ item, isActive }) {
  if (item.iconType === "home") {
    return <HomeBadgeIcon />;
  }

  const source =
    item.iconType === "request"
      ? requestIcon
      : item.iconType === "history"
        ? historyIcon
        : profileIcon;

  return (
    <Image
      resizeMode="contain"
      source={source}
      style={{
        width: item.iconType === "profile" ? 22 : 20,
        height: item.iconType === "profile" ? 22 : 20,
        opacity: isActive ? 1 : 0.9,
        tintColor: isActive ? "#e11d48" : "#111111",
      }}
    />
  );
}

function NavTab({ item, pathname, router }) {
  const isActive = pathname === item.href;

  return (
    <Pressable
      className="flex-1 items-center justify-center gap-1 py-1"
      onPress={() => router.replace(item.href)}
    >
      <View className="min-h-8 items-center justify-center">
        <NavIcon isActive={isActive} item={item} />
      </View>
      <Text
        className={`mt-1 text-[12px] font-medium ${
          isActive ? "text-rose-600" : "text-zinc-600"
        }`}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1100,
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

  const buttonScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <View className="bg-zinc-50 px-0 pb-0 pt-0">
      <View
        className="rounded-t-[28px] bg-white px-6 pb-0 pt-2"
        style={{
          shadowColor: "#0f172a",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.06,
          shadowRadius: 18,
          elevation: 16,
        }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 flex-row items-start justify-between pr-3">
            {LEFT_NAV_ITEMS.map((item) => (
              <NavTab key={item.href} item={item} pathname={pathname} router={router} />
            ))}
          </View>

          <Pressable
            className="mx-1  items-center justify-center"
            onPress={() => router.replace("/request")}
          >
            <View className="relative h-[70px] w-[70px] items-center justify-center">
              <Animated.View
                className="h-[46px] w-[46px] -mt-6 items-center justify-center rounded-lg bg-rose-600"
                style={{
                  transform: [{ scale: buttonScale }],
                }}
              >
                <Image resizeMode="contain" source={middleIcon} style={{ width: 25, height: 32 }} />
              </Animated.View>
            </View>
          </Pressable>

          <View className="flex-1 flex-row items-start justify-between pl-3">
            {RIGHT_NAV_ITEMS.map((item) => (
              <NavTab key={item.href} item={item} pathname={pathname} router={router} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
