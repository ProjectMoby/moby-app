import { Alert, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import QRCode from "react-native-qrcode-svg";
import Icon from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Link } from "expo-router";
import { useWeb3 } from "@/components/Web3Provider";

export default function Page() {
  const { account } = useWeb3()!;
  function handleCopyAddress() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    //TODO copy address to clipboard
    console.log(account.address);
    Alert.alert("Address copied");
  }

  return (
    <View className="bg-[#1a1a1a] h-full flex items-center ">
      <Link href="/" asChild>
        <Pressable className="absolute right-0 p-1 m-4 rounded-full bg-[#d4d4d4]">
          <Icon name="close-outline" size={16} color="#000" />
        </Pressable>
      </Link>
      <Text className="text-white text-lg p-4">Receive JOE</Text>
      <View className="flex items-center justify-center mt-12 space-y-8">
        <Text className="text-white text-lg  "> 🟢 Polkadot Asset Hub</Text>
        <View className="bg-white p-4 rounded-md">
          <QRCode value={account.address} size={200} />
        </View>
        <View className="bg-[#272727] p-2 rounded-lg">
          <Text className="text-white text-xs">{account.address}</Text>
        </View>
        <Pressable
          className="flex flex-row items-center justify-center space-x-2 bg-[#242424] px-4 py-2 rounded-lg"
          onPress={handleCopyAddress}
        >
          <Icon name="copy-outline" size={24} color="#fff" />
          <Text className="text-white">Copy address</Text>
        </Pressable>
      </View>
    </View>
  );
}
