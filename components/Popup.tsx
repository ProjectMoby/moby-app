import React from "react";
import { View, Modal, Text, Pressable, FlatList } from "react-native";
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
        <View className="bg-[#1a1a1a] w-full h-3/4 p-4 rounded-t-3xl">
          <View className="flex flex-row justify-center items-center p-1 pb-4">
            <Text className="text-white text-lg font-bold">
              Transaction history
            </Text>
          </View>
          <Pressable
            className="absolute right-0 p-1 m-4 rounded-full bg-[#d4d4d4]"
            onPress={toggleModal}
          >
            <Icon name="close-outline" size={16} color="#000" />
          </Pressable>
          <View className="h-full">
            {/* transaction list */}
            <FlatList
              data={[
                { key: "1", amount: "-$12.11" },
                { key: "2", amount: "+$1.81" },
              ]}
              renderItem={({ item }) => (
                <Pressable className="w-full border-b-2 border-[#515151] pt-4 pb-2 flex flex-row items-center justify-between">
                  <View className="flex-1 flex-row space-x-4">
                    <View className="w-12 h-12 bg-white rounded-full" />
                    <View className="flex items-center justify-center space-y-2">
                      <Text className="text-white">15AW...wZud</Text>
                      <Text className="text-[#515151]">2024/02/23</Text>
                    </View>
                  </View>
                  <View className="flex flex-row items-center justify-center space-x-4">
                    <Text key={item.key} className="text-white">
                      {item.amount}
                    </Text>
                    <Icon
                      name="chevron-forward-outline"
                      size={24}
                      color="#515151"
                    />
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
