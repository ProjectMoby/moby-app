import React from "react";
import { View, Modal, Text, Pressable, FlatList } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import Identicon from "@polkadot/reactnative-identicon";
import { Link } from "expo-router";

export default function Popup({
  isVisible,
  toggleModal,
  data,
  address,
}: {
  isVisible: boolean;
  toggleModal: () => void;
  data: any; //Todo define data type
  address: string;
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
            <Text className="text-white text-lg">Transaction history</Text>
          </View>
          <Pressable
            className="absolute right-0 p-1 m-4 rounded-full bg-[#d4d4d4]"
            onPress={toggleModal}
          >
            <Icon name="close-outline" size={16} color="#000" />
          </Pressable>
          <View className="h-full">
            {data.items.length ? (
              <FlatList
                data={data.items}
                renderItem={({ item }) => (
                  <Pressable className="w-full border-b-2 border-[#515151] pt-4 pb-2 flex flex-row items-center justify-between">
                    <View className="flex-1 flex-row space-x-4">
                      <Identicon
                        value={item.to !== address ? item.to : item.from}
                        size={36}
                      />
                      <View className="flex items-start justify-center space-y-2">
                        <Text className="text-white">
                          {item.to !== address ? item.to : item.from}
                        </Text>
                        <Text className="text-[#515151]">
                          {new Date(item.indexer.blockTime).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <View className="flex flex-row items-center justify-center space-x-4">
                      <Text
                        key={`${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
                        className="text-white"
                      >
                        {`${item.from === address ? "-" : "+"} ${
                          item.balance / 1000
                        } ${item.symbol}`}
                      </Text>
                      <Link
                        href={`https://westmint.statescan.io/#/events/${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
                        asChild
                      >
                        <Icon
                          name="chevron-forward-outline"
                          size={24}
                          color="#515151"
                        />
                      </Link>
                    </View>
                  </Pressable>
                )}
              />
            ) : (
              <View className="flex-1 items-center justify-start pt-12">
                <Text className="text-[#515151] text-lg">
                  No transaction yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
