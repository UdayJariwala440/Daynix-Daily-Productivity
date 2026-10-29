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
  icon?: ImageSourcePropType;
  onActionPress: () => void;
  actionLabel?: string;

  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
}

export default function Header({
  title = "My tasks",
  icon = IMAGES.calendar,
  onActionPress,
  actionLabel = "Open calendar",
  containerStyle,
  titleStyle,
  buttonStyle,
  iconStyle,
}: HeaderProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        onPress={onActionPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={[styles.button, buttonStyle]}
      >
        <Image
          source={icon}
          style={[styles.icon, iconStyle]}
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