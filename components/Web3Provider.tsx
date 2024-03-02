import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { Image, Text, View } from "react-native";

type IWeb3Provider = {
  api: ApiPromise;
};

const Web3Context = createContext<IWeb3Provider | null>(null);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    (async () => {
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
        <View className="flex-1 h-1/4 items-center justify-center">
          <Image source={require("../assets/logo.png")} className="w-48 h-48" />
          <Text className="text-white text-3xl font-bold -top-8">Moby Pay</Text>
        </View>
        <View className="h-1/4"></View>
      </View>
    );
  }

  return (
    <Web3Context.Provider value={{ api: api! }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
