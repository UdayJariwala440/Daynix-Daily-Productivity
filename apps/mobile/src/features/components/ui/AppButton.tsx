
import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type AppButtonProps = TouchableOpacityProps & {
  title: string;
  loading?: boolean;
  showIcon?: boolean;
};

const AppButton = ({
  title,
  loading = false,
  showIcon = true,
  disabled,
  style,
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
            source={IMAGES.arrow_right}
            style={styles.icon}
            resizeMode="contain"
          />
        )
      )}

      <Text style={styles.title}>{title}</Text>
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
