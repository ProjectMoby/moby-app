import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Icon from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useWeb3 } from "@/components/Web3Provider";

export default function Page() {
  const { readMnemonics } = useWeb3()!;
  const [mnemonics, setMnemonics] = useState<string>();

  async function handleViewMnemonics() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    const storeVal = await readMnemonics();
    setMnemonics(storeVal);
  }

  return (
    <View className="bg-[#1a1a1a] h-full flex items-center pt-8 ">
      <Link href="/" asChild>
        <Pressable className="absolute right-0 p-1 m-4 mt-12 rounded-full bg-[#d4d4d4]">
          <Icon name="close-outline" size={16} color="#000" />
        </Pressable>
      </Link>
      <Text className="text-white text-lg p-4">Settings</Text>
      <View className="w-full h-full items-center pt-12 space-y-24">
        <Pressable
          className="bg-[#eb422f] flex flex-row items-center justify-center w-48 rounded-lg p-4 space-x-2"
          onPress={handleViewMnemonics}
        >
          <Icon name="warning-outline" size={24} color="#fff" />
          <Text className="text-white">View mnemonics</Text>
        </Pressable>
        {mnemonics && (
          <View className="bg-[#272727] w-2/3 rounded-sm p-4">
            <Text className="text-white text-md">{mnemonics}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
