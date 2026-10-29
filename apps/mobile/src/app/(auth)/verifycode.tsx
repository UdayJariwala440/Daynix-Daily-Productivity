import { OtpInput } from "@/features";
import { useAuth } from "@/context/AuthContext";
import {
  getDeviceInfo,
  resend,
  verifyOtp,
} from "@/features/auth/services";
import {
  AppButton,
  AuthFooter,
  AuthHeader,
  BackButton,
  ScreenContainer,
} from "@/features/components";
import { COLORS } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

export default function VerifyCodeScreen() {
  const { signIn } = useAuth();
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { email = "" } = useLocalSearchParams<{ email: string }>();
  const OTP_EXPIRY_SECONDS = 5 * 60;

  const [timeLeft, setTimeLeft] = useState<number>(OTP_EXPIRY_SECONDS);
  const [resendTime, setResendTime] = useState<number>(30);

  useEffect(() => {
    if (resendTime <= 0) return;
    const timer = setInterval(() => {
      setResendTime((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTime]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  const onCodeSend = async () => {
    if (otp.length !== 6 || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await verifyOtp({
        email,
        otp,
        device: getDeviceInfo(),
      });

      if (response.success) {
        setOtp("");
        await signIn(response.accessToken, response.refreshToken);
        router.replace("/(tabs)/home");
      }
    } catch {
      setError("That code is invalid or has expired. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendTime > 0) return;

    try {
      const response = await resend({ email });

      if (response.success) {
        setResendTime(30);
        setTimeLeft(OTP_EXPIRY_SECONDS);
      }
    } catch {
      setError("Unable to resend the code. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <ScreenContainer style={{ flex: 1 }}>
          <BackButton onPress={() => router.back()} />

          <AuthHeader
            tagline="VERIFY EMAIL"
            title={"Check your\ninbox."}
            bottomTagline={`We sent a 6-digit code to ${email}. It\nexpires in 5 minutes.`}
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
              linkText={
                resendTime > 0
                  ? `Resend in ${formatTime(resendTime)}`
                  : "Resend code"
              }
              message="Didn’t get a code?"
              onPress={resendOTP}
            />
          </View>

          <AppButton
            showIcon={false}
            style={{
              backgroundColor:
                otp.length !== 6 ? COLORS.PrimaryLight : COLORS.Primary,
            }}
            title="Verify code"
            loading={loading}
            disabled={otp.length !== 6 || timeLeft === 0}
            onPress={onCodeSend}
          />
        </ScreenContainer>
      </View>
    </TouchableWithoutFeedback>
  );
}
