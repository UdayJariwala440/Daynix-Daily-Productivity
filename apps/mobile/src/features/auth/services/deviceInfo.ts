import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

export function getDeviceInfo() {
  const platform: "android" | "ios" | "web" | "unknown" =
    Platform.OS === "android" || Platform.OS === "ios" || Platform.OS === "web"
      ? Platform.OS
      : "unknown";

  return {
    name: Device.deviceName ?? Device.modelName ?? `${platform} device`,
    ...(Device.modelName ? { model: Device.modelName } : {}),
    platform,
    ...(Device.osVersion ? { osVersion: Device.osVersion } : {}),
    ...(Constants.expoConfig?.version
      ? { appVersion: Constants.expoConfig.version }
      : {}),
  };
}
