import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function IndexRoute() {
  const { status } = useAuth();

  return (
    <Redirect
      href={status === "authenticated" ? "/(tabs)/home" : "/(auth)/welcome"}
    />
  );
}
