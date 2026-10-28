import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
export default function RootLayout() {
  return <>
    <StatusBar style="light" />
    <Stack screenOptions={{ headerStyle: { backgroundColor: "#101426" }, headerTintColor: "#ffffff", contentStyle: { backgroundColor: "#101426" } }}>
      <Stack.Screen name="index" options={{ title: "Medhas.ai" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  </>;
}
