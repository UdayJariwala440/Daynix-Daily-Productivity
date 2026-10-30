import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const LIST_COLORS = [
  { subColor: "#5B2EE6", color: "#EFEAFD" },
  { subColor: "#B8662B", color: "#F7EDE6" },
  { subColor: "#0E9A6E", color: "#E2F3EE" },
  { subColor: "#C94B5E", color: "#F8E9EC" },
  { subColor: "#2B7BC4", color: "#E6EFF8" },
  { subColor: "#1E1E2E", color: "#E8E8EA" },
] as const;

interface ColorPickerProps {
  subColor: string;
  onChange: (color: string, subColor: string) => void;
}

export default function ColorPicker({ subColor, onChange }: ColorPickerProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {LIST_COLORS.map((c) => {
        const selected = c.subColor === subColor;
        return (
          <TouchableOpacity
            key={c.subColor}
            onPress={() => onChange(c.color, c.subColor)}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityLabel={c.subColor}
            accessibilityState={{ selected }}
            style={styles.target}
          >
            <View style={[styles.swatch, { backgroundColor: c.subColor }]}>
              {selected && <Ionicons name="checkmark" size={18} color="#fff" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginLeft: -6 },
  target: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});