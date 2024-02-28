import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            // Hide the header for all other routes.
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
      </Stack>
    </>
  );
}
