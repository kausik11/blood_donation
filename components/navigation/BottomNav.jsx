import { Feather } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: "home",
  },
  {
    href: "/request",
    label: "Request",
    icon: "send",
  },
  {
    href: "/history",
    label: "History",
    icon: "clock",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: "user",
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View className="border-t border-zinc-200 bg-white px-4 pb-3 pt-2">
      <View className="flex-row items-end justify-between">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Pressable
              key={item.href}
              className="flex-1 items-center justify-center gap-1 py-2"
              onPress={() => router.replace(item.href)}
            >
              <View
                className={`items-center justify-center rounded-lg px-4 py-3 ${
                  isActive ? "bg-rose-600" : "bg-white"
                }`}
              >
                <Feather
                  color={isActive ? "#ffffff" : "#71717a"}
                  name={item.icon}
                  size={20}
                />
              </View>
              <Text
                className={`text-xs font-medium ${
                  isActive ? "text-rose-600" : "text-zinc-500"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
