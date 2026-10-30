import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface TaskSelectFieldProps {
  label: string;
  value: string;
  icon?: ImageSourcePropType;
  onPress?: () => void;
  showChevron?: boolean;
  iconTintColor?: string;
  height?: number;
  borderRadius?: number;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>
}

export default function TaskSelectField({
  label,
  value,
  icon,
  onPress,
  showChevron = true,
  iconTintColor,
  height = 48,
  borderRadius = 16,
  containerStyle,
  buttonStyle,
  valueStyle
}: TaskSelectFieldProps) {
  return (
    <View style={containerStyle}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}


      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        style={[
          styles.button,
          {
            height,
            borderRadius,

          },
          buttonStyle
        ]}
      >
        {icon && (
          <Image
            source={icon}
            style={[
              styles.icon,
              iconTintColor ? { tintColor: iconTintColor } : undefined,
            ]}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.value, valueStyle]} numberOfLines={1}>
          {value}
        </Text>

        {showChevron && (
          <Image
            source={IMAGES.chevron}
            style={styles.chevron}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Muted,
    fontSize: 12,
    marginBottom: 7,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: COLORS.Surface,
    borderWidth: 1,
    borderColor: COLORS.Border,
  },
  icon: {
    width: 18,
    height: 18,
  },
  value: {
    flexGrow: 1,
    marginHorizontal: 10,
    fontFamily: FONTS.regular,
    color: COLORS.Ink,
    fontSize: 13,
  },
  chevron: {
    width: 14,
    height: 14,
  },
});