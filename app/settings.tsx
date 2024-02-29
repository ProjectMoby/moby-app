import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import Icon from "@expo/vector-icons/Ionicons";
import { useState } from "react";

export default function Page() {
  const [mnemonics] = useState("banana banana banana");
  function handleViewMnemonics() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    console.log("my mnemonics is:", mnemonics);
  }

  return (
    <View className="bg-[#1a1a1a] h-full flex items-center pt-8 ">
      <Link href="/" asChild>
        <Pressable className="absolute right-0 p-1 m-4 mt-12 rounded-full bg-[#d4d4d4]">
          <Icon name="close-outline" size={16} color="#000" />
        </Pressable>
      </Link>
      <Text className="text-white text-lg p-4">Settings</Text>
      <View className="w-full h-full items-center pt-12">
        <Pressable
          className="bg-[#eb422f] flex flex-row items-center justify-center w-48 rounded-lg p-4 space-x-2"
          onPress={handleViewMnemonics}
        >
          <Icon name="warning-outline" size={24} color="#fff" />
          <Text className="text-white">View mnemonics</Text>
        </Pressable>
      </View>
    </View>
  );
}
