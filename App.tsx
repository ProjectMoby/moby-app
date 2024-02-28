import Keyring from "@polkadot/keyring";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as Haptics from "expo-haptics";

export default function App() {
  function handleReceive() {
    console.log("receive button");
  }
  function handleSend() {
    console.log("send button");
  }

  function handleViewTrandacionButton() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("transaction button pressed");
  }

  function handleViewSettingsButton() {
    console.log("settings button pressed");
  }

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1 items-center bg-black space-y-4 pt-24">
        <View className="w-full flex-row items-center justify-end px-6 space-x-6">
          <Pressable onPress={handleViewTrandacionButton}>
            <Icon name="time-outline" size={24} color="#fff" />
          </Pressable>
          <Pressable onPress={handleViewSettingsButton}>
            <Icon
              name="ellipsis-horizontal-circle-outline"
              size={24}
              color="#fff"
            />
          </Pressable>
        </View>
        <View className="w-full flex items-center justify-center space-y-4 py-12">
          <Text className="text-md text-white">USDT balance</Text>
          <Text className="text-5xl text-white">$125.42</Text>
        </View>
        <View className="flex-row items-center justify-center w-full px-4 space-x-8">
          <Pressable
            className="w-36 py-4 rounded-md bg-gray-800"
            onPress={handleReceive}
          >
            <Text className="text-white text-center">Receive</Text>
          </Pressable>
          <Pressable
            className="w-36 py-4 rounded-md bg-gray-800"
            onPress={handleSend}
          >
            <Text className="text-white text-center">Send</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
