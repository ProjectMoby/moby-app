import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Keyring } from "@polkadot/api";
const { mnemonicGenerate } = require("@polkadot/util-crypto");
import { MNEMONICS } from "@env";
import { KeyringPair } from "@polkadot/keyring/types";
import { Alert, Image, Pressable, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import * as LocalAuthentication from "expo-local-authentication";
import Icon from "@expo/vector-icons/Ionicons";

type IAuthProvider = {
  account: KeyringPair;
  readMnemonics: () => Promise<string | undefined>;
};

const AuthContext = createContext<IAuthProvider | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [hasAccount, setHasAccount] = useState(true);
  const [account, setAccount] = useState<KeyringPair | null>(null);
  const [newMnemonics, setNewMnemonics] = useState<string | null>(null);

  const saveMnemonics = async () => {
    try {
      await SecureStore.setItemAsync("moby-mnemonics", newMnemonics!);
      console.log("Mnemonics saved securely");
      const keyring = new Keyring({ type: "sr25519" });
      const newPair = keyring.addFromUri(newMnemonics!);
      setAccount(newPair);
      setHasAccount(true);
    } catch (error) {
      console.error("Error saving mnemonics:", error);
    }
  };

  const readMnemonics = async () => {
    try {
      const isBiometricSupported =
        (await LocalAuthentication.hasHardwareAsync()) &&
        (await LocalAuthentication.isEnrolledAsync());
      if (isBiometricSupported) {
        const isAuthenticated = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to read your private key",
          cancelLabel: "Cancel",
        });
        if (!isAuthenticated.success) {
          throw new Error("Biometric authentication failed");
        }
      }

      const key = await SecureStore.getItemAsync("moby-mnemonics");
      if (key) {
        return key;
      } else {
        console.log("No private key found");
        return undefined;
      }
    } catch (error) {
      console.error("Error reading private key:", error);
    }
  };

  function handleGenerateNewMnemonics() {
    const MNEMONICS = mnemonicGenerate();
    setNewMnemonics(MNEMONICS);
  }

  async function handleCopy() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await Clipboard.setStringAsync(newMnemonics!);
      Alert.alert("Mnemonics copied to clipboard.");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const mnemonics = await SecureStore.getItemAsync("moby-mnemonics");
        if (!mnemonics) {
          setHasAccount(false);
        } else {
          const keyring = new Keyring({ type: "sr25519" });
          const newPair = keyring.addFromUri(mnemonics!);
          setAccount(newPair);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  if (!hasAccount) {
    return (
      <>
        {newMnemonics ? (
          <View className="bg-[#1a1a1a] h-full flex items-center pt-8">
            <Text className="text-white text-lg p-4">
              Write down your mnemonics
            </Text>
            <View className="flex-1 items-center justify-center mx-4">
              <Text className="text-white text-center pb-4">
                Click to copy mnemonics
              </Text>
              <Pressable
                className="bg-[#272727] w-full rounded-md p-8"
                onPress={handleCopy}
              >
                <Text className="text-white">{newMnemonics}</Text>
              </Pressable>
            </View>
            <View className="flex-1 items-center justify-center space-y-8 mx-4">
              <View className="bg-[#261415] w-full rounded-md p-8">
                <Text className="text-white">
                  By pressing Confirm, you confirm that you have written down
                  the mnemonics.
                </Text>
              </View>
              <Pressable
                className="bg-[#eb422f] flex flex-row items-center justify-center space-x-4 p-4 rounded-md"
                onPress={saveMnemonics}
              >
                <Text className="text-white">Comfirm</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="flex-1 bg-black items-center justify-center">
            <View className="flex-1 h-1/4 items-center justify-center">
              <Image
                source={require("../assets/logo.png")}
                className="w-48 h-48"
              />
              <Text className="text-white text-3xl font-bold -top-8">
                Moby Pay
              </Text>
            </View>
            <View className="h-1/4 items-center justify-center">
              <Pressable
                className="bg-[#242424] flex flex-row items-center justify-center space-x-4 p-4 rounded-md"
                onPress={handleGenerateNewMnemonics}
              >
                <Icon name="person-outline" color="#fff" size={24} />
                <Text className="text-white">Create new account</Text>
              </Pressable>
            </View>
          </View>
        )}
      </>
    );
  }

  return (
    <AuthContext.Provider
      value={{ account: account!, readMnemonics: readMnemonics! }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
