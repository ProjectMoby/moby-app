import { Web3Provider } from "@/components/Web3Provider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
export default function AppLayout() {
  return (
    <Web3Provider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="receive"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="send"
          options={{
            presentation: "containedModal",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="settings"
          options={{
            presentation: "containedModal",
            animation: "fade",
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </Web3Provider>
  );
}
