import { COLORS, FONTS } from "@/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AuthFooterProps = {
  message: string;
  linkText: string;
  onPress: () => void;
};

const AuthFooter = ({ message, linkText, onPress }: AuthFooterProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message} </Text>
      <TouchableOpacity onPress={onPress} hitSlop={8}>
        <Text style={styles.link}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontFamily: FONTS.regular,
    color: COLORS.Muted,
    fontSize: 13,
  },
  link: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Primary,
    fontSize: 14,
  },
});
