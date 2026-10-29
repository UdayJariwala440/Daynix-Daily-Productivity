import { IMAGES } from "@/constants";
import { signup } from "@/features/auth";
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

  const onSighUp = async () => {
    try {
      setLoading(true);
      const response = await signup({ email: textEmail, name: textFullname });
      if (response.success === true) {
        setTextEmail("");
        setTextFullname("");
    router.push({
  pathname: "/(auth)/verifycode",
  params: {
    email: textEmail,
  },
});
      }
    } catch (error) {
      console.log("Error ===>", JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };
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
              onSighUp();
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
