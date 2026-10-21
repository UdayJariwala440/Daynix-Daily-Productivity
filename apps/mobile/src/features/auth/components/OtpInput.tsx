import { COLORS, FONTS } from "@/theme";
import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export default function OtpInput({
  length = 6,
  value,
  onChange,
  error,
}: OtpInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleChange = (text: string, index: number) => {
    const digits = text.replace(/\D/g, "").slice(0, length);

    if (digits.length > 1) {
      onChange(digits);

      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const otpArray = value.slice(0, length).split("");
    otpArray[index] = digits;

    const nextValue = otpArray.join("").slice(0, length);
    onChange(nextValue);

    if (digits && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key !== "Backspace") return;

    if (value[index]) {
      return;
    }

    if (index > 0) {
      const previousIndex = index - 1;
      const otpArray = value.split("");

      otpArray[previousIndex] = "";
      onChange(otpArray.join(""));

      inputRefs.current[previousIndex]?.focus();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {Array.from({ length }, (_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={value[index] ?? ""}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event.nativeEvent.key, index)}
            onFocus={() => setFocusedIndex(index)}
            keyboardType="number-pad"
            maxLength={index === 0 ? length : 1}
            selectionColor={COLORS.Primary}
            style={[
              styles.input,
              focusedIndex === index && !error && styles.focused,
              error && styles.errorInput,
            ]}
          />
        ))}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>ⓘ</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.Border,
    borderRadius: 14,
    backgroundColor: COLORS.Surface,
    textAlign: "center",
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.Ink,
    padding: 0,
  },
  focused: {
    borderColor: COLORS.Primary,
    borderWidth: 1.5,
  },
  errorInput: {
    borderColor: COLORS.Danger,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  errorIcon: {
    color: COLORS.Danger,
    fontSize: 12,
  },
  errorText: {
    color: COLORS.Danger,
    fontSize: 11,
  },
});
