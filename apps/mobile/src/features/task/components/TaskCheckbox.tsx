import { IMAGES } from "@/constants";
import { Image, TouchableOpacity } from "react-native";

interface TaskCheckboxProps {
  checked: boolean;
  onPress?: () => void;
}

export default function TaskCheckbox({ checked, onPress }: TaskCheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={10}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={{
        height: 22,
        width: 22,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: "#DFD4FC",
        backgroundColor: checked ? "#6938EF" : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked && (
        <Image source={IMAGES.check} style={{ height: 14, width: 14 }} />
      )}
    </TouchableOpacity>
  );
}