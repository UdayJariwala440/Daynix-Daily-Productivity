import {
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { COLORS, FONTS } from "@/theme";

interface DailyMomentumCardProps {
  label: string;
  title: string;
  description: string;

  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

export default function DailyMomentumCard({
  label,
  title,
  description,
  containerStyle,
  labelStyle,
  titleStyle,
  descriptionStyle,
}: DailyMomentumCardProps) {
  return (
    <View
      style={[
        {
          width: "100%",
          backgroundColor: COLORS.Primary,
          borderRadius: 22,
          padding: 22,
          marginVertical: 12,
        },
        containerStyle,
      ]}
    >
      <Text
        style={[
          {
            color: COLORS.Surface,
            fontFamily: FONTS.semiBold,
            fontSize: 10,
            lineHeight: 13,
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          {
            color: COLORS.Surface,
            fontFamily: FONTS.bold,
            fontSize: 22,
            lineHeight: 29,
            marginVertical: 8,
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          {
            color: COLORS.Surface,
            fontFamily: FONTS.regular,
            fontSize: 13,
            lineHeight: 17,
          },
          descriptionStyle,
        ]}
      >
        {description}
      </Text>
    </View>
  );
}