import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingDescription from "./OnboardingDescription";
import OnboardingIndicator from "./OnboardingIndicator";
import OnboardingTagline from "./OnboardingTagline";
import OnboardingTitle from "./OnboardingTitle";

const TOTAL_STEPS = 3;
const OnboardingView = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((step) => step + 1);
    } else {
      router.replace("/login");
    }
  };
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Image source={IMAGES.logo_mark} style={{ height: 32, width: 32 }} />
          <Text
            style={{
              color: COLORS.Ink,
              fontFamily: FONTS.regular,
              fontSize: 23,
              marginLeft: 8,
            }}
          >
            {"daynix"}
          </Text>
        </View>
        <Text
          style={{
            color: COLORS.Muted,
            fontFamily: FONTS.semiBold,
            fontSize: 13,
          }}
        >
          {"Skip"}
        </Text>
      </View>
      <View style={{ alignItems: "center", marginVertical: 22 }}>
        <Image
          source={
            currentStep === 0
              ? IMAGES.welcome_illustration
              : currentStep === 1
                ? IMAGES.welcome_illustration_two
                : IMAGES.welcome_illustration_three
          }
          style={{ height: 380, width: 380 }}
          resizeMode="contain"
        />
      </View>
      <OnboardingTagline
        text={
          currentStep === 0
            ? "A LITTLE CLARITY. A LOT MORE CALM."
            : currentStep === 1
              ? "SHARED PROJECTS"
              : "SMART REMINDERS"
        }
      />
      <OnboardingTitle
        title={
          currentStep === 0
            ? "Big plans.\nSmall, happy steps."
            : currentStep === 1
              ? "Plan together.\nWin together."
              : "Never miss\nwhat matters."
        }
      />
      <OnboardingDescription
        description={
          currentStep === 0
            ? "Bring your tasks, projects and people together. Make room for what matters."
            : currentStep === 1
              ? "Invite your team, share progress and keep every project moving in one calm place."
              : "Gentle nudges at the right time, with quiet hours so your evenings stay yours."
        }
      />
      <View style={styles.footer}>
        <OnboardingIndicator total={TOTAL_STEPS} current={currentStep} />

        <Pressable style={styles.button} onPress={handleNext}>
          <Image
            source={IMAGES.arrow_right}
            style={{ width: 20, height: 20 }}
          />
          <Text style={styles.buttonText}>
            {currentStep === 0
              ? "Let's get started"
              : currentStep === 1
                ? "Next"
                : "Get started"}
          </Text>
        </Pressable>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.signIn}>
            {`Already have an account? `}
            <Text
              style={styles.signInLink}
              onPress={() => router.replace("/login")}
            >
              {"Sign in"}
            </Text>
          </Text>
        </View>
      </View>
    </>
  );
};

export default OnboardingView;

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.Primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: COLORS.Surface,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  signIn: {
    color: COLORS.Muted,
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
  signInLink: {
    color: COLORS.Primary,
  },
});
