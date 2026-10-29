import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type AppButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
  showIcon?: boolean;
  icon?: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

const AppButton = ({
  title,
  loading = false,
  showIcon = true,
  disabled,
  style,
  icon = IMAGES.arrow_right,
  iconStyle,
  titleStyle,
  ...props
}: AppButtonProps) => {
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.Surface} />
      ) : (
        showIcon && (
          <Image
            source={icon}
            style={[styles.icon, iconStyle]}
            resizeMode="contain"
          />
        )
      )}

      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.Primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  title: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Surface,
    fontSize: 15,
  },
  icon: {
    height: 20,
    width: 20,
  },
});