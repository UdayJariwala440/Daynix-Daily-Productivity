import { COLORS } from '@/theme/colors';
import { FONTS } from '@/theme/fonts';
import { StyleSheet, Text } from 'react-native';

type Props = {
  title: string;
};

export default function OnboardingTitle({ title }: Props) {
  return <Text style={styles.text}>{title}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.Ink,
    textAlign: 'center',
  },
});