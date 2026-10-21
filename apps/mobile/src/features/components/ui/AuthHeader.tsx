
import { COLORS, FONTS } from "@/theme";
import { StyleSheet, Text, View } from "react-native";

type AuthHeaderProps = {
  tagline: string;
  title: string;
  bottomTagline?: string;
};

const AuthHeader = ({
  tagline,
  title,
  bottomTagline,
}: AuthHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.tagline}>{tagline}</Text>

      <Text style={styles.title}>{title}</Text>

      {bottomTagline ? (
        <Text style={styles.bottomTagline}>
          {bottomTagline}
        </Text>
      ) : null}
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  tagline: {
    fontFamily: FONTS.bold,
    fontSize: 11,
    color: COLORS.Primary,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.Ink,
  },
  bottomTagline: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.Muted,
    marginTop: 8,
  },
});
