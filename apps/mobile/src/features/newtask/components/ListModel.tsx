import { listData } from "@/features/auth";
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

interface ReminderModalProps {
  visible: boolean;
  selectList: string;
  onClose: () => void;
  onSave: (listId: string) => void;
  listOfData:listData[]
}

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

export default function ListModel({
  visible,
  selectList,
  onClose,
  onSave,
  listOfData
}: ReminderModalProps) {
  const [reminder, setReminder] = useState<string>(selectList);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(39, 35, 53, 0.45)",
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ flexShrink: 1 }}>
            {listOfData.map((option) => {
              const isSelected = reminder === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    setReminder(option.id);
                    onSave(option.name);
                    onClose();
                  }}
                  style={[styles.option, isSelected && styles.selectedOption]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                >
                  <View
                    style={[styles.radio, isSelected && styles.selectedRadio]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>

                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionTitle,
                        isSelected && styles.selectedOptionTitle,
                      ]}
                    >
                      {option.name}
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
    padding: 20,
    maxHeight: "80%",
    borderRadius: 20,
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
