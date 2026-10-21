import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { IMAGES } from "@/constants";
import { COLORS } from "@/theme/colors";
import { FONTS } from "@/theme/fonts";
import { useRouter } from "expo-router";

export default function SplashView() {
    const router = useRouter();

  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(18);
  const circleOpacity = useSharedValue(0);
  const loaderWidth = useSharedValue(18);

 useEffect(() => {
    circleOpacity.value = withTiming(1, { duration: 700 });

    contentOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 700 }),
    );

    contentY.value = withDelay(
      500,
      withTiming(0, {
        duration: 700,
        easing: Easing.out(Easing.cubic),
      }),
    );

    loaderWidth.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(40, { duration: 600 }),
          withTiming(18, { duration: 600 }),
        ),
        -1,
        false,
      ),
    );

    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    width: loaderWidth.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, contentStyle]}>
        <Image source={IMAGES.logo} style={{ height: 92, width: 92 }} />
        <Text style={styles.title}>{"daynix"}</Text>
        <Text style={styles.subtitle}>
          {"A little clarity, a lot more calm."}
        </Text>
      </Animated.View>
      <View style={styles.loaderTrack}>
        <Animated.View style={[styles.loader, loaderStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
  },
  title: {
    color: COLORS.Surface,
    fontSize: 40,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.Surface,
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginTop: 8,
  },
  loaderTrack: {
    position: "absolute",
    bottom: "34%",
    width: 40,
    height: 2,
    backgroundColor: COLORS.BorderColor,
    alignItems: "flex-start",
  },
  loader: {
    height: 2,
    backgroundColor: COLORS.Surface,
    borderRadius: 2,
  },
});
