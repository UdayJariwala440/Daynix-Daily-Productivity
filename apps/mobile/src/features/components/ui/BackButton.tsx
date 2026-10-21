import { IMAGES } from "@/constants";
import { COLORS } from "@/theme";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

type BackButtonProps = {
  onPress: () => void;
};

const BackButton = ({ onPress }: BackButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Image source={IMAGES.arrow_left} style={styles.icon} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.Surface,
    borderRadius: 10,
  height:38,width:38,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
});