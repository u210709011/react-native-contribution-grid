import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="cards-on-press" options={{ title: "Cards on Press" }} />
      <Stack.Screen name="container-width" options={{ title: "Container Width" }} />
      <Stack.Screen name="custom-square" options={{ title: "Custom Square" }} />
      <Stack.Screen name="label-and-header-style" options={{ title: "Label and Header Styles" }} />
      <Stack.Screen name="square-color" options={{ title: "Square Colors" }} />
      <Stack.Screen name="square-size" options={{ title: "Square Size" }} />
      <Stack.Screen name="thresholds" options={{ title: "Thresholds" }} />
    </Stack>
  );
}
