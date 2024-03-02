import { Alert, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import Icon from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useAuth } from "@/components/AuthProvider";

export default function Page() {
  const { account } = useAuth()!;

  async function handleCopyAddress() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Clipboard.setStringAsync(account.address);
      Alert.alert("Address copied to clipboard.");
    } catch (error) {
      console.log(error);
    }
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
        <Text className="text-white text-lg  "> Westend Asset Hub</Text>
        <View className="bg-white p-4 rounded-lg">
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
