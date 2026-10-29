
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
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

interface ListCardProps {
  title: string;
  subtitle: string;
  initial?: string;

  avatarColor?: string;
  initialColor?: string;
  icon?: ImageSourcePropType;

  containerStyle?: StyleProp<ViewStyle>;
  avatarStyle?: StyleProp<ViewStyle>;
  initialStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;

  onPress?: TouchableOpacityProps["onPress"];
}

export default function ListCard({
  title,
  subtitle,
  initial = title.charAt(0).toUpperCase(),
  avatarColor = COLORS.PrimaryTint,
  initialColor = COLORS.Primary,
  icon = IMAGES.chevron_right,
  containerStyle,
  avatarStyle,
  initialStyle,
  titleStyle,
  subtitleStyle,
  iconStyle,
  onPress,
}: ListCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, containerStyle]}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: avatarColor },
          avatarStyle,
        ]}
      >
        <Text
          style={[
            styles.initial,
            { color: initialColor },
            initialStyle,
          ]}
        >
          {initial}
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>

        <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      {icon && (
        <Image
          source={icon}
          style={[styles.icon, iconStyle]}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.Surface,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 14,
  },
  title: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Ink,
    fontSize: 15,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    color: COLORS.Muted,
    fontSize: 11,
    marginTop: 3,
  },
  icon: {
    height: 16,
    width: 16,
    marginLeft: 8,
  },
});
