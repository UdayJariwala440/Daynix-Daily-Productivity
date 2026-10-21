

import { COLORS } from "@/theme";
import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";

type ScreenContainerProps = {
  children: ReactNode;
  style?: ViewStyle;
};

const ScreenContainer = ({ children, style }: ScreenContainerProps) => {
  return (
    <View
      style={[
        {
          padding:10,backgroundColor:COLORS.Background,flex:1
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ScreenContainer;
