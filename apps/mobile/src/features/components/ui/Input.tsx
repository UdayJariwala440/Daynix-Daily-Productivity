import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  icon?: ImageSourcePropType;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
};

const Input = ({
  label = "Full name",
  icon = IMAGES.user,
  error,
  style,
  onFocus,
  onBlur,

  containerStyle,
  inputContainerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  iconStyle,

  ...textInputProps
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const activeColor = error
    ? COLORS.Danger
    : isFocused
      ? COLORS.Primary
      : COLORS.Muted;

  return (
    <View style={containerStyle}>
      {!!label?.trim() && (
        <Text
          style={[
            {
              color: COLORS.Muted,
              fontFamily: FONTS.semiBold,
              fontSize: 14,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 7,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: activeColor,
            backgroundColor: COLORS.Surface,
            borderRadius: 16,
          },
          inputContainerStyle,
        ]}
      >
        {icon && (
          <Image
            source={icon}
            style={[
              {
                height: 18,
                width: 18,
                tintColor: activeColor,
              },
              iconStyle,
            ]}
            resizeMode="contain"
          />
        )}

        <TextInput
          {...textInputProps}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={COLORS.Muted}
          style={[
            {
              flex: 1,
              fontFamily: FONTS.regular,
              color: COLORS.Ink,
              fontSize: 14,
              paddingVertical: 12,
              marginLeft: icon ? 10 : 0,
            },
            style,
            inputStyle,
          ]}
        />
      </View>

      {!!error && (
        <Text
          style={[
            {
              color: COLORS.Danger,
              fontFamily: FONTS.regular,
              fontSize: 12,
              marginTop: 5,
            },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
