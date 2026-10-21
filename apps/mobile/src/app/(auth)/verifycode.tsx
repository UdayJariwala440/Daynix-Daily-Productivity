import { OtpInput } from "@/features";
import {
  AppButton,
  AuthFooter,
  AuthHeader,
  BackButton,
  ScreenContainer,
} from "@/features/components";
import { COLORS } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

export default function VerifyCodeScreen() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <ScreenContainer style={{ flex: 1 }}>
          <BackButton onPress={() => router.back()} />

          <AuthHeader
            tagline="VERIFY EMAIL"
            title={"Check your\ninbox."}
            bottomTagline={
              "We sent a 6-digit code to livia@daynix.app. It\nexpires in 10 minutes."
            }
          />

          <OtpInput
            length={6}
            value={otp}
            onChange={(value) => {
              setOtp(value);
              setError("");
            }}
            error={error}
          />
          <View style={{ marginVertical: 20 }}>
            <AuthFooter
              linkText="Resend in 0:42"
              message="Didn’t get a code?"
              onPress={() => {
                router.push("/(auth)/signup");
              }}
            />
          </View>

          <AppButton
            showIcon={false}
            style={{
              backgroundColor:
                otp.length !== 6 ? COLORS.PrimaryLight : COLORS.Primary,
            }}
            title="Verify code"
            onPress={() => {
             router.replace("/home");
            }}
          />
        </ScreenContainer>
      </View>
    </TouchableWithoutFeedback>
  );
}
