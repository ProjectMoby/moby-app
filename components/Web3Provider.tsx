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
import { Text } from "react-native";

type IWeb3Provider = {
  account: KeyringPair;
  api: ApiPromise;
};

const Web3Context = createContext<IWeb3Provider | null>(null);

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<KeyringPair | null>(null);
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    // const MNEMONICS = mnemonicGenerate();
    const keyring = new Keyring({ type: "sr25519" });
    const newPair = keyring.addFromUri(MNEMONICS);
    setAccount(newPair);
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
    return <Text>Loading...</Text>;
  }

  return (
    <Web3Context.Provider value={{ account: account!, api: api! }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
