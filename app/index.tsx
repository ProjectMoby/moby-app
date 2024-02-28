import { Modal, Button, Pressable, Text, View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import TransactionHistoryPopup from "@/components/Popup";

export default function Page() {
  const [isModalVisible, setModalVisible] = useState(false);
  function handleReceive() {
    console.log("receive button");
  }
  function handleSend() {
    console.log("send button");
  }

  function handleViewTransacionButton() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setModalVisible(!isModalVisible);
    console.log("transaction button pressed");
  }

  function handleViewSettingsButton() {
    console.log("settings button pressed");
  }

  return (
    <>
      <View className="flex-1 items-center bg-black space-y-4 pt-12">
        <View className="w-full flex-row items-center justify-end px-6 space-x-6">
          <Pressable onPress={handleViewTransacionButton}>
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
            className="flex flex-row items-center justify-center w-36 py-4 rounded-md bg-[#242424] space-x-4"
            onPress={handleReceive}
          >
            <Icon name="qr-code-outline" size={24} color="#fff" />
            <Text className="text-white text-center">Receive</Text>
          </Pressable>
          <Pressable
            className="flex flex-row items-center justify-center w-36 py-4 rounded-md bg-[#242424] space-x-4"
            onPress={handleSend}
          >
            <Icon name="send-outline" size={24} color="#fff" />
            <Text className="text-white text-center">Send</Text>
          </Pressable>
        </View>
      </View>
      <TransactionHistoryPopup
        isVisible={isModalVisible}
        toggleModal={handleViewTransacionButton}
      />
    </>
  );
}
