import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Link } from "expo-router";

export default function Page() {
  const [address] = useState(
    "5D7DY1pkNdiL8Yn9uyc2AMjggdGtEjePJbKwun1udkYbxJsZ"
  );
  const [continueVisible, setContinueVisible] = useState<boolean>(false);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [steps, setSteps] = useState({
    enterRecipientAddress: true,
    enterAmountToSend: false,
    confirmTransaction: false,
  });

  function handleScanButton() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("Scan button");
  }

  function handleRecipientChange(text: string) {
    //TODO fix input single char problem
    const trimmedText = text.trim();
    setRecipient(trimmedText);
    console.log(trimmedText);
  }

  function handleRecipientSubmit() {
    //TODO validate recipient address to be Polkadot Asset Hub address type, else throw error warning.
    if (!recipient) return;
    console.log("Recipient submit: ", recipient);
  }

  function handleAmountChange(text: string) {
    setAmount(text);
    console.log(text);
  }

  function handleAmountSubmit() {
    console.log("Amount submit: ", amount);
  }

  function handleTransact() {
    console.log("Sending", amount, "USDT from", address, "TO", recipient);
  }

  return (
    <View className="bg-[#1a1a1a] h-full flex items-center pt-8 ">
      <Link href="/" asChild>
        <Pressable className="absolute right-0 p-1 m-4 mt-12 rounded-full bg-[#d4d4d4]">
          <Icon name="close-outline" size={16} color="#000" />
        </Pressable>
      </Link>
      {steps.enterAmountToSend && (
        <Pressable
          className="absolute left-0 p-1 m-4 mt-12"
          onPress={() =>
            setSteps({
              enterRecipientAddress: true,
              enterAmountToSend: false,
              confirmTransaction: false,
            })
          }
        >
          <Icon name="chevron-back-outline" size={24} color="#d4d4d4" />
        </Pressable>
      )}

      {steps.confirmTransaction && (
        <Pressable
          className="absolute left-0 p-1 m-4 mt-12"
          onPress={() =>
            setSteps({
              enterRecipientAddress: false,
              enterAmountToSend: true,
              confirmTransaction: false,
            })
          }
        >
          <Icon name="chevron-back-outline" size={24} color="#d4d4d4" />
        </Pressable>
      )}
      <Text className="text-white text-lg p-4">
        {steps.enterRecipientAddress && "Enter Recipient Address"}
        {steps.enterAmountToSend && "Enter amount"}
        {steps.confirmTransaction && "Comfirm Transaction"}
      </Text>
      <View className="w-full h-full">
        <View className="h-4/5 ">
          {steps.enterRecipientAddress && (
            <>
              <View className="flex items-center justify-center py-24 border-b-2 border-white mx-4">
                <Pressable
                  className="flex flex-row items-center justify-center w-48 space-x-2 bg-[#242424] py-2 rounded-lg"
                  onPress={handleScanButton}
                >
                  <Icon name="scan-outline" size={24} color="#fff" />
                  <Text className="text-white">Scan QR Code</Text>
                </Pressable>
                <Text className="absolute bottom-0 left-0 text-4xl text-white pb-4">
                  Or
                </Text>
              </View>
              <View className="flex mx-4 pt-4">
                <TextInput
                  returnKeyType="done"
                  placeholder="Manually enter reipient address"
                  placeholderTextColor="#515151"
                  className="text-lg text-white"
                  onChangeText={handleRecipientChange}
                  onSubmitEditing={handleRecipientSubmit}
                  value={recipient as string}
                />
              </View>
            </>
          )}

          {steps.enterAmountToSend && (
            <>
              <View>
                <View className="mx-4 px-4 pt-12 space-y-4">
                  <Text className="text-[#515151] text-2xl">To</Text>
                  <Text className="text-white text-xs">{recipient}</Text>
                </View>
                <View className="flex items-start justify-end pt-24 pl-4 pb-4 border-b-2 border-white mx-4">
                  <TextInput
                    returnKeyType="done"
                    keyboardType="numeric"
                    placeholder="0.0"
                    placeholderTextColor="#515151"
                    className="text-4xl text-white"
                    onChangeText={handleAmountChange}
                    onSubmitEditing={handleAmountSubmit}
                    value={amount as string}
                  />
                </View>
                <Text className="absolute bottom-0 right-0 text-4xl text-white pr-4 pb-4">
                  USDT
                </Text>
              </View>
            </>
          )}

          {steps.confirmTransaction && (
            <>
              <View className="border-b-2 border-[#515151] mx-4 py-12 space-y-12">
                <View className="mx-4 space-y-4">
                  <Text className="text-[#515151] text-xl">From</Text>
                  <Text className="text-white text-xs">{address}</Text>
                </View>
                <View className="mx-4 space-y-4">
                  <Text className="text-[#515151] text-xl">To</Text>
                  <Text className="text-white text-xs">{recipient}</Text>
                </View>
              </View>

              <View className="mx-4 px-4 py-12 space-y-4 border-b-2 border-[#515151]">
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-[#515151] text-xl">Amount</Text>
                  <Text className="text-white text-xl">{amount} USDT</Text>
                </View>
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-[#515151] text-xl">Network Fee</Text>
                  <Text className="text-white text-xl">0.01 USDT</Text>
                </View>
              </View>
              <View className="flex flex-row items-center justify-between mx-4 p-4">
                <Text className="text-[#515151] text-xl">Total</Text>
                <Text className="text-white text-xl">
                  {parseFloat(amount) + 0.01} USDT
                </Text>
              </View>
            </>
          )}
        </View>
        <View className="w-full h-1/6 flex items-center">
          <>
            {recipient && steps.enterRecipientAddress && (
              <Pressable
                className="flex flex-row items-center justify-center w-36 space-x-2 bg-[#242424] py-4 rounded-lg"
                onPress={() =>
                  setSteps({
                    enterRecipientAddress: false,
                    enterAmountToSend: true,
                    confirmTransaction: false,
                  })
                }
              >
                <Text className="text-white">Continue</Text>
              </Pressable>
            )}

            {amount && steps.enterAmountToSend && (
              <Pressable
                className="flex flex-row items-center justify-center w-36 space-x-2 bg-[#242424] py-4 rounded-lg"
                onPress={() =>
                  setSteps({
                    enterRecipientAddress: false,
                    enterAmountToSend: false,
                    confirmTransaction: true,
                  })
                }
              >
                <Text className="text-white">Continue</Text>
              </Pressable>
            )}

            {recipient && amount && steps.confirmTransaction && (
              <Pressable
                className="flex flex-row items-center justify-center w-36 space-x-2 bg-[#242424] py-4 rounded-lg"
                onPress={handleTransact}
              >
                <Text className="text-white">Send</Text>
              </Pressable>
            )}
          </>
        </View>
      </View>
    </View>
  );
}