import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const LIST_COLORS = [
  { name: "Purple", value: "#5B2EE6" },
  { name: "Brown", value: "#B8662B" },
  { name: "Green", value: "#0E9A6E" },
  { name: "Red", value: "#C94B5E" },
  { name: "Blue", value: "#2B7BC4" },
  { name: "Ink", value: "#1E1E2E" },
] as const;

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {LIST_COLORS.map((c) => {
        const selected = c.value === value;
        return (
          <TouchableOpacity
            key={c.value}
            onPress={() => onChange(c.value)}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityLabel={c.name}
            accessibilityState={{ selected }}
            style={styles.target}
          >
            <View style={[styles.swatch, { backgroundColor: c.value }]}>
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