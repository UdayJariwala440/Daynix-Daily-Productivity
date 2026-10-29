import { COLORS, FONTS } from "@/theme";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ColorPicker, { LIST_COLORS } from "./ColorPicker";

const PURPLE = LIST_COLORS[0].value;
const MAX_LENGTH = 30;
const SCREEN_H = Dimensions.get("window").height;

interface NewListSheetProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (list: { name: string; color: string }) => void;
  existingNames?: string[];
}

export default function NewListSheet({
  visible,
  onClose,
  onCreate,
  existingNames = [],
}: NewListSheetProps) {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(PURPLE);
  const [focused, setFocused] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 22,
          stiffness: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_H,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMounted(false);
        setName("");
        setColor(PURPLE);
      });
    }
  }, [visible]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, g) => {
          if (g.dy > 0) translateY.setValue(g.dy);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dy > 100 || g.vy > 0.8) onClose();
          else
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
        },
      }),
    [onClose, translateY],
  );

  const trimmed = name.trim();
  const duplicate = existingNames.some(
    (n) => n.toLowerCase() === trimmed.toLowerCase(),
  );
  const canCreate = trimmed.length > 0 && !duplicate;

  const submit = () => {
    if (!canCreate) return;
    onCreate({ name: trimmed, color });
    onClose();
  };

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
          <Pressable
            style={styles.flex}
            onPress={onClose}
            accessibilityLabel="Close"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 16) + 8,
              transform: [{ translateY }],
            },
          ]}
        >
          <View {...pan.panHandlers} style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.title}>New list</Text>

          <Text style={styles.label}>List name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Reading"
            placeholderTextColor="#9A98AD"
            maxLength={MAX_LENGTH}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={submit}
            style={[
              styles.input,
              focused && styles.inputFocused,
              duplicate && styles.inputError,
            ]}
            accessibilityLabel="List name"
          />
          {duplicate && (
            <Text style={styles.error}>
              A list with this name already exists.
            </Text>
          )}

          <Text style={[styles.label, { marginTop: 20 }]}>Color</Text>
          <ColorPicker value={color} onChange={setColor} />

          <TouchableOpacity
            onPress={submit}
            disabled={!canCreate}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canCreate }}
            style={[
              styles.cta,
              { backgroundColor: color },
              !canCreate && styles.ctaDisabled,
            ]}
          >
            <Text style={styles.ctaText}>Create list</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(20,16,40,0.45)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.Surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
  },

  handleArea: {
    alignItems: "center",
    paddingVertical: 12,
  },

  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.PrimarySoft,
  },

  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.Ink,
    marginBottom: 16,
  },

  label: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.Ink,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.Border,
    paddingHorizontal: 16,
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.Ink,
  },

  inputFocused: {
    borderColor: COLORS.Primary,
  },

  inputError: {
    borderColor: COLORS.Danger,
  },

  error: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.Danger,
    marginTop: 6,
  },

  cta: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  ctaDisabled: {
    opacity: 0.4,
  },

  ctaText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.Surface,
  },
});
