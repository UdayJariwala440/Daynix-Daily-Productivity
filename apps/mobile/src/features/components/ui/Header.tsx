import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface HeaderProps {
  title?: string;
  leftIcon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftActionLabel?: string;
  rightActionLabel?: string;

  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  leftIconStyle?: StyleProp<ImageStyle>;
  rightIconStyle?: StyleProp<ImageStyle>;
}

export default function Header({
  title = "My tasks",
  leftIcon,
  rightIcon = IMAGES.calendar,
  onLeftPress,
  onRightPress,
  leftActionLabel = "Left action",
  rightActionLabel = "Open calendar",
  containerStyle,
  titleStyle,
  buttonStyle,
  leftIconStyle,
  rightIconStyle,
}: HeaderProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && (
      <TouchableOpacity
        onPress={onLeftPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={leftActionLabel}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={[styles.button, buttonStyle]}
      >
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[styles.icon, leftIconStyle]}
            resizeMode="contain"
            accessible={false}
          />
        )}
      </TouchableOpacity>
      )}
      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={onRightPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={rightActionLabel}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={[styles.button, buttonStyle]}
      >
        <Image
          source={rightIcon}
          style={[styles.icon, rightIconStyle]}
          resizeMode="contain"
          accessible={false}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.Ink,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
});