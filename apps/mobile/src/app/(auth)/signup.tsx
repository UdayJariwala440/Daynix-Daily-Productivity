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
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

export default function SignupScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [textEmail, setTextEmail] = useState<string>("");
  const [textFullname, setTextFullname] = useState<string>("");
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <ScreenContainer style={{ flex: 1 }}>
          <BackButton onPress={() => router.back()} />

          <AuthHeader
            tagline="WELCOME BACK"
            title={"Create your\naccount."}
            bottomTagline="Start planning calmer days in under a minute."
          />
          <Input
            label={"Full name"}
            icon={IMAGES.user}
            placeholder="test"
            value={textFullname}
            onChangeText={(text: string) => {
              setTextFullname(text);
            }}
          />
          <View style={{ height: 16 }} />
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
            title="Create account"
            loading={loading}
            onPress={() => {
              setLoading(true);
              router.push("/(auth)/verifycode");
              setLoading(false);
            }}
          />
          <View style={{ flex: 1 }} />
          <AuthFooter
            linkText="Sign in"
            message="Already have an account?"
            onPress={() => {
              router.push("/(auth)/login");
            }}
          />
        </ScreenContainer>
      </View>
    </TouchableWithoutFeedback>
  );
}
