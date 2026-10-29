import { COLORS } from "@/theme";
import { IMAGES } from "@/constants";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface EmptyTasksProps {
  image?: ImageSourcePropType;
  title?: string;
  description?: string;

  containerStyle?: StyleProp<ViewStyle>;
  outerCircleStyle?: StyleProp<ViewStyle>;
  innerCircleStyle?: StyleProp<ViewStyle>;
  imageContainerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

export default function EmptyTasks({
  image = IMAGES.clipboard,
  title = "Nothing on your plate yet.",
  description = "Add a task or create a project to get started.",
  containerStyle,
  outerCircleStyle,
  innerCircleStyle,
  imageContainerStyle,
  imageStyle,
  textContainerStyle,
  titleStyle,
  descriptionStyle,
}: EmptyTasksProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.outerCircle, outerCircleStyle]}>
        <View style={[styles.innerCircle, innerCircleStyle]}>
          <View style={[styles.imageContainer, imageContainerStyle]}>
            <Image
              source={image}
              style={[styles.image, imageStyle]}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <View style={[styles.textContainer, textContainerStyle]}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>

        <Text style={[styles.description, descriptionStyle]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.PrimaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.PrimarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 90,
    height: 90,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.Ink,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.Muted,
    textAlign: "center",
    marginTop: 8,
  },
});