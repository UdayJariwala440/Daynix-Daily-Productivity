import { AppButton } from "@/features/components";
import { IMAGES } from "@/constants";
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface HomeActionsProps {
  primaryTitle?: string;
  secondaryTitle?: string;

  primaryIcon?: ImageSourcePropType;
  showPrimaryIcon?: boolean;

  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;

  containerStyle?: StyleProp<ViewStyle>;
  primaryButtonStyle?: StyleProp<ViewStyle>;
  secondaryButtonStyle?: StyleProp<ViewStyle>;

  primaryTitleStyle?: StyleProp<TextStyle>;
  secondaryTitleStyle?: StyleProp<TextStyle>;

  primaryIconStyle?: StyleProp<ImageStyle>;
}

export default function HomeActions({
  primaryTitle = "Add a task",
  secondaryTitle = "New project",
  primaryIcon = IMAGES.plus,
  showPrimaryIcon = true,
  onPrimaryPress,
  onSecondaryPress,
  containerStyle,
  primaryButtonStyle,
  secondaryButtonStyle,
  primaryTitleStyle,
  secondaryTitleStyle,
  primaryIconStyle,
}: HomeActionsProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <AppButton
        title={primaryTitle}
        onPress={onPrimaryPress}
        showIcon={showPrimaryIcon}
        icon={primaryIcon}
        style={[primaryButtonStyle]}
        titleStyle={primaryTitleStyle}
        iconStyle={primaryIconStyle}
      />

      <AppButton
        title={secondaryTitle}
        onPress={onSecondaryPress}
        showIcon={false}
        style={[ secondaryButtonStyle]}
        titleStyle={secondaryTitleStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flexDirection:'row'
  },
});