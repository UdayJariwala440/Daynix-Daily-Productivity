import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS } from "@/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>DAYNIX</Text>
      <Text style={styles.title}>Your day, organized.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Background,
    padding: 24,
    paddingTop: 48,
  },
  eyebrow: {
    color: COLORS.Primary,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    letterSpacing: 1.5,
  },
  title: {
    color: COLORS.Ink,
    fontFamily: FONTS.semiBold,
    fontSize: 30,
    marginBottom: 28,
    marginTop: 8,
  },
  card: {
    alignItems: "center",
    backgroundColor: COLORS.Surface,
    borderColor: COLORS.Border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
  },
  cardTitle: {
    color: COLORS.Ink,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  cardDescription: {
    color: COLORS.Muted,
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 5,
  },
  arrow: {
    color: COLORS.Primary,
    fontSize: 30,
  },
});
