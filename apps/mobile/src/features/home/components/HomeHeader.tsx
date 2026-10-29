import { COLORS } from "@/theme";
import { IMAGES } from "@/constants";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface HomeHeaderProps {
  avatarText?: string;
  subtitle?: string;
  greeting?: string;

  searchIcon?: ImageSourcePropType;
  notificationIcon?: ImageSourcePropType;

  onSearchPress?: () => void;
  onNotificationPress?: () => void;

  containerStyle?: StyleProp<ViewStyle>;
  avatarStyle?: StyleProp<ViewStyle>;
  greetingContainerStyle?: StyleProp<ViewStyle>;
  searchButtonStyle?: StyleProp<ViewStyle>;
  notificationButtonStyle?: StyleProp<ViewStyle>;

  avatarTextStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  greetingStyle?: StyleProp<TextStyle>;

  searchIconStyle?: StyleProp<ImageStyle>;
  notificationIconStyle?: StyleProp<ImageStyle>;
}

export default function HomeHeader({
  avatarText = "T",
  subtitle = "Personal",
  greeting = "Hello, Livia ☀",
  searchIcon = IMAGES.search,
  notificationIcon = IMAGES.bell,
  onSearchPress,
  onNotificationPress,
  containerStyle,
  avatarStyle,
  greetingContainerStyle,
  searchButtonStyle,
  notificationButtonStyle,
  avatarTextStyle,
  subtitleStyle,
  greetingStyle,
  searchIconStyle,
  notificationIconStyle,
}: HomeHeaderProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftSection}>
        <View style={[styles.avatar, avatarStyle]}>
          <Text style={[styles.avatarText, avatarTextStyle]}>
            {avatarText}
          </Text>
        </View>

        <View style={[styles.greetingContainer, greetingContainerStyle]}>
          <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>

          <Text style={[styles.greeting, greetingStyle]}>{greeting}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          onPress={onSearchPress}
          style={[styles.iconButton, searchButtonStyle]}
        >
          <Image
            source={searchIcon}
            style={[styles.icon, searchIconStyle]}
            resizeMode="contain"
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationPress}
          style={[styles.iconButton, notificationButtonStyle]}
        >
          <Image
            source={notificationIcon}
            style={[styles.icon, notificationIconStyle]}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.PrimaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.Primary,
  },
  greetingContainer: {
    marginLeft: 12,
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.Muted,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.Ink,
    marginTop: 3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.Surface,
    borderWidth: 1,
    borderColor: COLORS.Border,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 20,
    height: 20,
  },
});