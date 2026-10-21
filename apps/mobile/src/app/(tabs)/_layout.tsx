import { Stack } from "expo-router";

export default function BottomLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="home" />
    </Stack>
  );
}
