import { Pressable, Text, TextInput, View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Link } from "expo-router";
import { useWeb3 } from "@/components/Web3Provider";
import QRCodeScanner from "@/components/QRCodeScanner";
import { useAuth } from "@/components/AuthProvider";

export default function Page() {
  const { api } = useWeb3()!;
  const { account } = useAuth()!;
  const [recipient, setRecipient] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);
  const [steps, setSteps] = useState({
    enterRecipientAddress: true,
    scanQRCode: false,
    enterAmountToSend: false,
    confirmTransaction: false,
    postTransaction: false,
  });

  function handleScanButton() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("Scan button");
    setSteps({
      enterRecipientAddress: false,
      scanQRCode: true,
      enterAmountToSend: false,
      confirmTransaction: false,
      postTransaction: false,
    });
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
  }

  function handleAmountSubmit() {
    console.log("Amount submit: ", parseFloat(amount) * 1000);
  }

  async function handleTransact() {
    const amountToSend = parseFloat(amount) * 1000;
    console.log(
      "Sending",
      amountToSend,
      "JOE from",
      account.address,
      "TO",
      recipient
    );

    const transferExtrinsic = api.tx.assets.transferKeepAlive(
      8,
      recipient,
      BigInt(amountToSend)
    );

    transferExtrinsic
      .signAndSend(
        account,
        {
          assetId: {
            parents: 0,
            interior: {
              X2: [{ PalletInstance: 50 }, { GeneralIndex: 8 }],
            },
          },
        },
        ({ status }) => {
          if (status.isInBlock) {
            console.log(
              `Completed at block hash #${status.asInBlock.toString()}`
            );
          } else {
            console.log(`Current status: ${status.type}`);
          }
        }
      )
      .catch((error: any) => {
        console.log(":( transaction failed", error);
      });

    // Show post transaction status screen
    setSteps({
      enterRecipientAddress: false,
      scanQRCode: false,
      enterAmountToSend: false,
      confirmTransaction: false,
      postTransaction: true,
    });
  }

  return (
    <View className="bg-[#1a1a1a] h-full flex items-center pt-8">
      {!steps.postTransaction && (
        <Link href="/" asChild>
          <Pressable className="absolute right-0 p-1 m-4 mt-12 rounded-full bg-[#d4d4d4]">
            <Icon name="close-outline" size={16} color="#000" />
          </Pressable>
        </Link>
      )}
      {steps.scanQRCode && (
        <Pressable
          className="absolute left-0 p-1 m-4 mt-12"
          onPress={() =>
            setSteps({
              enterRecipientAddress: true,
              scanQRCode: false,
              enterAmountToSend: false,
              confirmTransaction: false,
              postTransaction: false,
            })
          }
        >
          <Icon name="chevron-back-outline" size={24} color="#d4d4d4" />
        </Pressable>
      )}
      {steps.enterAmountToSend && (
        <Pressable
          className="absolute left-0 p-1 m-4 mt-12"
          onPress={() =>
            setSteps({
              enterRecipientAddress: true,
              scanQRCode: false,
              enterAmountToSend: false,
              confirmTransaction: false,
              postTransaction: false,
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
              scanQRCode: false,
              enterAmountToSend: true,
              confirmTransaction: false,
              postTransaction: false,
            })
          }
        >
          <Icon name="chevron-back-outline" size={24} color="#d4d4d4" />
        </Pressable>
      )}
      <Text className="text-white text-lg p-4">
        {steps.enterRecipientAddress && "Enter recipient address"}
        {steps.enterAmountToSend && "Enter amount"}
        {steps.confirmTransaction && "Comfirm transaction"}
        {steps.scanQRCode && "Scan QR Code"}
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

          {steps.scanQRCode && (
            <QRCodeScanner setRecipient={setRecipient} setSteps={setSteps} />
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
                    className="text-4xl text-white w-full"
                    onChangeText={handleAmountChange}
                    onSubmitEditing={handleAmountSubmit}
                    value={amount as string}
                  />
                </View>
                <Text className="absolute bottom-0 right-0 text-4xl text-white pr-4 pb-4">
                  JOE
                </Text>
              </View>
            </>
          )}

          {steps.confirmTransaction && (
            <>
              <View className="border-b-2 border-[#515151] mx-4 py-12 space-y-12">
                <View className="mx-4 space-y-4">
                  <Text className="text-[#515151] text-xl">From</Text>
                  <Text className="text-white text-xs">{account.address}</Text>
                </View>
                <View className="mx-4 space-y-4">
                  <Text className="text-[#515151] text-xl">To</Text>
                  <Text className="text-white text-xs">{recipient}</Text>
                </View>
              </View>

              <View className="mx-4 px-4 py-12 space-y-4 border-b-2 border-[#515151]">
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-[#515151] text-xl">Amount</Text>
                  <Text className="text-white text-xl">{amount} JOE</Text>
                </View>
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-[#515151] text-xl">Network Fee</Text>
                  <Text className="text-white text-xl">0.653 JOE</Text>
                </View>
              </View>
              <View className="flex flex-row items-center justify-between mx-4 p-4">
                <Text className="text-[#515151] text-xl">Total</Text>
                <Text className="text-white text-xl">
                  {parseFloat(amount) + 0.653} JOE
                </Text>
              </View>
            </>
          )}
          {steps.postTransaction && (
            <View className="flex items-center justify-center h-full space-y-8">
              <View className="flex items-center justify-center space-y-4">
                <Icon
                  name="checkmark-circle-outline"
                  size={100}
                  color="#279d54"
                />
                <Text className="text-white text-xl">Transaction sent</Text>
                <View className="w-2/3">
                  <Text className="text-[#515151] text-center">
                    Your account will update once the blockchain has confirmed
                    the transaction.
                  </Text>
                </View>
              </View>
              <View className="flex items-center justify-center space-y-4">
                <Link href="https://westmint.statescan.io" asChild>
                  <Pressable className="bg-[#242424] p-4 rounded-lg">
                    <Text className="text-white">View Detail</Text>
                  </Pressable>
                </Link>

                <Link href="/" asChild>
                  <Text className="text-white">Close</Text>
                </Link>
              </View>
            </View>
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
                    scanQRCode: false,
                    enterAmountToSend: true,
                    confirmTransaction: false,
                    postTransaction: false,
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
                    scanQRCode: false,
                    enterAmountToSend: false,
                    confirmTransaction: true,
                    postTransaction: false,
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
