import { Pressable, Text, View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import TransactionHistoryPopup from "@/components/Popup";
import { Link } from "expo-router";
import { formatBalance } from "@polkadot/util";
import { useWeb3 } from "@/components/Web3Provider";
import mock from "@/mock";

export default function Page() {
  const { account, api } = useWeb3()!;
  const [isModalVisible, setModalVisible] = useState(false);
  const [balance, setBalance] = useState<string | undefined>();
  const [data, setData] = useState();
  function handleReceive() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("receive button");
  }
  function handleSend() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("send button");
  }

  function handleViewTransacionButton() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setModalVisible(!isModalVisible);
    console.log("transaction button pressed");
  }

  function handleViewSettingsButton() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log("settings button pressed");
  }

  useEffect(() => {
    const fetchBalance = async () => {
      const query_result = await api.query.assets.account(8, account.address);
      const { balance: account_balance } = query_result.toJSON();
      setBalance(account_balance);
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://westmint-api.statescan.io/accounts/5D4VYJQztwSB23WFDacs84Kj5dDRrrr6dUaVG52tGdusXTmj/transfers?page=0&page_size=25"
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <View className="flex-1 items-center bg-black space-y-4 pt-12">
        <View className="w-full flex-row items-center justify-end px-6 space-x-6">
          <Pressable onPress={handleViewTransacionButton}>
            <Icon name="time-outline" size={24} color="#fff" />
          </Pressable>
          <Link href="/settings" asChild>
            <Pressable onPress={handleViewSettingsButton}>
              <Icon
                name="ellipsis-horizontal-circle-outline"
                size={24}
                color="#fff"
              />
            </Pressable>
          </Link>
        </View>
        <View className="w-full flex items-center justify-center space-y-4 py-12">
          <Text className="text-md text-white">Joe Test Token balance</Text>
          <Text className="text-5xl text-white">
            {"$"}
            {formatBalance(balance, { decimals: 3, withUnit: false })}
          </Text>
        </View>
        <View className="flex-row items-center justify-center w-full px-4 space-x-8">
          <Link href="/receive" asChild>
            <Pressable
              className="flex flex-row items-center justify-center w-36 py-4 rounded-md bg-[#242424] space-x-4"
              onPress={handleReceive}
            >
              <Icon name="qr-code-outline" size={24} color="#fff" />
              <Text className="text-white text-center">Receive</Text>
            </Pressable>
          </Link>
          <Link href="/send" asChild>
            <Pressable
              className="flex flex-row items-center justify-center w-36 py-4 rounded-md bg-[#242424] space-x-4"
              onPress={handleSend}
            >
              <Icon name="send-outline" size={24} color="#fff" />
              <Text className="text-white text-center">Send</Text>
            </Pressable>
          </Link>
        </View>
      </View>
      <TransactionHistoryPopup
        isVisible={isModalVisible}
        toggleModal={handleViewTransacionButton}
        data={data || mock}
        address={account.address}
      />
    </>
  );
}
