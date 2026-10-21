import { COLORS } from '@/theme/colors';
import { FONTS } from '@/theme/fonts';
import { StyleSheet, Text } from 'react-native';

type Props = {
  description: string;
};

export default function OnboardingDescription({
  description,
}: Props) {
  return <Text style={styles.text}>{description}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.Muted,
    textAlign: 'center',
    lineHeight: 21,
  },
});