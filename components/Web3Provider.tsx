import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Keyring, WsProvider, ApiPromise } from "@polkadot/api";
const { mnemonicGenerate } = require("@polkadot/util-crypto");
import { MNEMONICS } from "@env";
import { KeyringPair } from "@polkadot/keyring/types";
import { Image, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { StatusBar } from "expo-status-bar";

type IWeb3Provider = {
  account: KeyringPair;
  api: ApiPromise;
  readMnemonics: () => Promise<string | undefined>;
};

const Web3Context = createContext<IWeb3Provider | null>(null);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<KeyringPair | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);

  const saveMnemonics = async (key: string) => {
    try {
      await SecureStore.setItemAsync("moby-mnemonics", key);
      console.log("Mnemonics saved securely");
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

      // Retrieve the private key
      const key = await SecureStore.getItemAsync("moby-mnemonics");
      if (key) {
        return key;
      } else {
        console.log("No private key found");
      }
    } catch (error) {
      console.error("Error reading private key:", error);
    }
  };

  useEffect(() => {
    // const MNEMONICS = mnemonicGenerate();

    (async () => {
      await saveMnemonics(MNEMONICS);
      const mnemonics = await readMnemonics();
      const keyring = new Keyring({ type: "sr25519" });
      const newPair = keyring.addFromUri(mnemonics!);
      // const newPair = keyring.addFromUri(MNEMONICS!);
      setAccount(newPair);

      const wsProvider = new WsProvider("wss://westmint-rpc-tn.dwellir.com");
      const api = await ApiPromise.create({ provider: wsProvider });
      setApi(api);

      setLoading(false);
    })();

    return () => {
      if (api) {
        console.log("api disconnect");
        api.disconnect();
      }
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Image source={require("../assets/logo.png")} className="w-48 h-48" />
        <Text className="text-white text-3xl font-bold -top-8">Moby Pay</Text>
      </View>
    );
  }

  return (
    <Web3Context.Provider
      value={{ account: account!, api: api!, readMnemonics: readMnemonics! }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
