import React from "react";
import { View, Modal, Text, Pressable } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";

export default function Popup({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={toggleModal}
    >
      <View className="flex-1 items-center justify-end">
        <View className="bg-[#1a1a1a] w-full h-2/3 p-4 rounded-t-3xl">
          <View className="flex flex-row justify-center items-center p-1 pb-4">
            <Text className="text-white text-lg font-bold">
              Transaction history
            </Text>
          </View>
          <View className="absolute right-0 p-1 m-4 rounded-full bg-[#d4d4d4]">
            <Pressable>
              <Icon
                name="close-outline"
                size={16}
                color="#000"
                onPress={toggleModal}
              />
            </Pressable>
          </View>
          <Text className="text-white">This is a half-screen modal</Text>
        </View>
      </View>
    </Modal>
  );
}
