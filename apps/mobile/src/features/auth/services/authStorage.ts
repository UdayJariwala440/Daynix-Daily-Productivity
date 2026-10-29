import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "daynix.accessToken";
const REFRESH_TOKEN_KEY = "daynix.refreshToken";

async function setValue(key: string, value: string) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getValue(key: string) {
  if (Platform.OS === "web") {
    return globalThis.localStorage?.getItem(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

async function removeValue(key: string) {
  if (Platform.OS === "web") {
    globalThis.localStorage?.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

export async function saveAuthTokens(
  accessToken: string,
  refreshToken: string,
) {
  await Promise.all([
    setValue(ACCESS_TOKEN_KEY, accessToken),
    setValue(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}

export function getAccessToken() {
  return getValue(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return getValue(REFRESH_TOKEN_KEY);
}

export async function clearAuthTokens() {
  await Promise.all([
    removeValue(ACCESS_TOKEN_KEY),
    removeValue(REFRESH_TOKEN_KEY),
  ]);
}
