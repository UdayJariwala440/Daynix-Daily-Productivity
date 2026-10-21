import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  icon?: ImageSourcePropType;
  error?: string;
};

const Input = ({
  label = "Full name",
  icon = IMAGES.user,
  error,
  style,
  onFocus,
  onBlur,
  ...textInputProps
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const activeColor = error
    ? COLORS.Danger
    : isFocused
      ? COLORS.Primary
      : COLORS.Muted;

  return (
    <View>
      <Text
        style={{
          color: COLORS.Muted,
          fontFamily: FONTS.semiBold,
          fontSize: 14,
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 7,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: activeColor,
          backgroundColor: COLORS.Surface,
          borderRadius: 16,
        }}
      >
        {icon && (
          <Image
            source={icon}
            style={{
              height: 18,
              width: 18,
              tintColor: activeColor,
            }}
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
          ]}
        />
      </View>

      {!!error && (
        <Text
          style={{
            color: COLORS.Danger,
            fontFamily: FONTS.regular,
            fontSize: 12,
            marginTop: 5,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
