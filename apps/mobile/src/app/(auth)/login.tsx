import { IMAGES } from "@/constants";
import {
  AppButton,
  AuthFooter,
  AuthHeader,
  BackButton,
  Input,
  ScreenContainer,
} from "@/features/components";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Keyboard, TouchableWithoutFeedback, View } from "react-native";

export default function LoginScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [textEmail, setTextEmail] = useState<string>("");
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <ScreenContainer style={{ flex: 1 }}>
          <BackButton onPress={() => router.back()} />
          <Image
            source={IMAGES.logo_mark}
            style={{ height: 48, width: 48, marginTop: 20 }}
          />
          <AuthHeader
            tagline="WELCOME BACK"
            title={"Good to see\nyou again."}
            bottomTagline="Sign in to pick up where you left off."
          />
          <Input
           label={"Email"}
            icon={IMAGES.mail}
            placeholder="xyz@eample.com"
            value={textEmail}
            onChangeText={(text: string) => {
              setTextEmail(text);
            }}
          />
          <View style={{ flex: 0.2 }} />
          <AppButton
            title="Sign in"
            loading={loading}
            onPress={() => {
              setLoading(true);
              router.push("/(auth)/signup");
              setLoading(false);
            }}
          />
          <View style={{ flex: 1 }} />
          <AuthFooter
            linkText="Create an account"
            message="New to Daynix?"
            onPress={() => {
                 router.push("/(auth)/signup");
            }}
          />
        </ScreenContainer>
      </View>
    </TouchableWithoutFeedback>
  );
}
