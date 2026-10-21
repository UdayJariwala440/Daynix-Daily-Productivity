import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '@/theme/colors';

type Props = {
  total: number;
  current: number;
};

export default function OnboardingIndicator({
  total,
  current,
}: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, index) => (
        <IndicatorDot
          key={index}
          active={index === current}
        />
      ))}
    </View>
  );
}

function IndicatorDot({ active }: { active: boolean }) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(active ? 19 : 5, { duration: 250 }),
    backgroundColor: withTiming(
      active ? COLORS.Primary : COLORS.PrimarySoft,
      { duration: 250 },
    ),
  }), [active]);

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginVertical:22
  },
  dot: {
    height: 5,
    borderRadius: 10,
  },
});
