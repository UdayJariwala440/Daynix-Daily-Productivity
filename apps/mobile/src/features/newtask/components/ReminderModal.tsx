import { COLORS, FONTS } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const REMINDER_OPTIONS = [
  { label: "None", value: "none", description: "No reminder" },
  {
    label: "At time of task",
    value: "at_time",
    description: "When the task is due",
  },
  {
    label: "5 minutes before",
    value: "5_minutes",
    description: "5 minutes before the due time",
  },
  {
    label: "10 minutes before",
    value: "10_minutes",
    description: "10 minutes before the due time",
  },
  {
    label: "15 minutes before",
    value: "15_minutes",
    description: "15 minutes before the due time",
  },
  {
    label: "30 minutes before",
    value: "30_minutes",
    description: "30 minutes before the due time",
  },
  {
    label: "1 hour before",
    value: "1_hour",
    description: "1 hour before the due time",
  },
  {
    label: "1 day before",
    value: "1_day",
    description: "1 day before the due date",
  },
] as const;

export type ReminderValue =
  (typeof REMINDER_OPTIONS)[number]["value"];

interface ReminderModalProps {
  visible: boolean;
  selectedReminder: string;
  onClose: () => void;
  onSave: (reminder: string) => void;
}

export default function ReminderModal({
  visible,
  selectedReminder,
  onClose,
  onSave,
}: ReminderModalProps) {
  const [reminder, setReminder] =
    useState<string>(selectedReminder);

  useEffect(() => {
    if (visible) {
      setReminder(selectedReminder);
    }
  }, [visible, selectedReminder]);

const handleSave = () => {
  onSave(reminder);
  onClose();
};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close reminder selection"
        />

        <View style={styles.modalContainer}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={COLORS.Primary}
              />
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.title}>{"Set reminder"}</Text>
              <Text style={styles.subtitle}>
                {"Choose when you want to be reminded."}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Ionicons
                name="close"
                size={22}
                color={COLORS.Ink}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          >
            {REMINDER_OPTIONS.map((option) => {
              const isSelected = reminder === option.label;

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.7}
                  onPress={() => setReminder(option.label)}
                  style={[
                    styles.option,
                    isSelected && styles.selectedOption,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View
                    style={[
                      styles.radio,
                      isSelected && styles.selectedRadio,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.selectedOptionTitle,
                      ]}
                    >
                      {option.label}
                    </Text>

                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={21}
                      color={COLORS.Primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>{"Cancel"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.8}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>
                {"Save reminder"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(39, 35, 53, 0.45)",
  },

  modalContainer: {
    backgroundColor: COLORS.Background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: "85%",
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 10,
    backgroundColor: COLORS.Border,
    alignSelf: "center",
    marginBottom: 22,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.PrimaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.Ink,
  },

  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.Muted,
    marginTop: 4,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.Surface,
    alignItems: "center",
    justifyContent: "center",
  },

  optionsList: {
    flexShrink: 1,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: COLORS.Border,
    backgroundColor: COLORS.Surface,
    borderRadius: 14,
    marginBottom: 10,
  },

  selectedOption: {
    borderColor: COLORS.Primary,
    backgroundColor: COLORS.PrimaryTint,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.Muted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  selectedRadio: {
    borderColor: COLORS.Primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.Primary,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.Ink,
  },

  selectedOptionTitle: {
    color: COLORS.Primary,
  },

  optionDescription: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.Muted,
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.Border,
    backgroundColor: COLORS.Surface,
  },

  cancelButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.Ink,
  },

  saveButton: {
    flex: 1.5,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: COLORS.Primary,
  },

  saveButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.Surface,
  },
});