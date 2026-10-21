import { COLORS } from '@/theme/colors';
import { FONTS } from '@/theme/fonts';
import { StyleSheet, Text } from 'react-native';

type Props = {
  text: string;
};

export default function OnboardingTagline({ text }: Props) {
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.Primary,
    textAlign: 'center',
  },
});