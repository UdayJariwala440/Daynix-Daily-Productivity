import { IMAGES } from "@/constants";
import {
  AppButton,
  createUpdateTask,
  getListAll,
  Header,
  Input,
  listData,
  ListModel,
  ReminderModal,
  ScreenContainer,
} from "@/features";
import { TaskSelectField } from "@/features";
import { COLORS, FONTS } from "@/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  REMINDER_OPTIONS,
  ReminderValue,
} from "@/features/newtask/components/ReminderModal";

const listOfPriority = ["low", "medium", "high"];
const taskStatus = ["pending", "in_progress", "paused"];
const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};
const formatTime = (time: Date): string => {
  return new Date(time).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function NewTaskScreen() {
  const today = new Date();
  const maxDate = new Date();
  const [id, setId] = useState<string>("");
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const [lists, setLists] = useState<listData[]>([]);
  const [time, setTime] = useState<Date>(new Date());
  const [taskName, setTaskName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectList, setSelectList] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("medium");
  const [reminder, setReminder] = useState<ReminderValue>("none");
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);

  const getListName = (listId: string) => {
    return (
      lists.find((item) => String(item.id) === String(listId))?.name ??
      "Select list"
    );
  };
  const getReminderName = (reminder: ReminderValue): string => {
    return (
      REMINDER_OPTIONS.find((option) => option.value === reminder)?.label ??
      "Select reminder"
    );
  };

  const dataSendToApi = async () => {
    if (loading) return;

    const payload = {
      name: taskName,
      description,
      list_id: selectList,
      start_date: formatDate(dueDate),
      start_time: formatTime(time),
      priority,
      reminder,
      status: "pending",
      ...(id ? { id } : {}),
    };

    try {
      setLoading(true);

      const response = await createUpdateTask(payload);

      if (response.success) {
        Alert.alert("", response.message, [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to create task:", error);

      Alert.alert("Error", "Unable to create the task. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchlist();
  }, []);

  const fetchlist = async () => {
    try {
      const response = await getListAll();
      if (response?.success === true && response?.data?.length !== 0) {
        setLists(response.data);
      }
    } catch (error) {
      console.log("Error ===>", JSON.stringify(error));
    }
  };

  return (
    <ScreenContainer>
      <Header
        title="New task"
        rightIcon={IMAGES.close}
        onRightPress={() => {
          router.back();
        }}
        titleStyle={{
          flex: 0,
          fontFamily: FONTS.semiBold,
          fontSize: 18,
        }}
        buttonStyle={styles.headerButton}
      />
      <View style={styles.intro}>
        <Text style={styles.introText}>
          {"A clear next step makes all the difference. * Required"}
        </Text>
      </View>
      <Input
        label="Task name *"
        placeholder="Grocery shopping"
        icon={null}
        value={taskName}
        onChangeText={setTaskName}
        labelStyle={styles.inputLabel}
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputContainer}
      />
      <View style={styles.sectionSpacing} />
      <Input
        label="Description"
        placeholder="Add a description"
        icon={null}
        value={description}
        onChangeText={setDescription}
        labelStyle={styles.inputLabel}
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputContainer}
      />
      <View style={styles.sectionSpacing} />
      <View style={styles.row}>
        <TaskSelectField
          label="Start date *"
          value={
            dueDate
              ? dueDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Select date"
          }
          icon={IMAGES.calendar}
          containerStyle={styles.flexField}
          onPress={() => {
            setShowDatePicker(true);
          }}
        />
        <View style={{ width: 8 }} />
        <TaskSelectField
          label="Start time"
          value={time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
          icon={IMAGES.clock}
          containerStyle={styles.flexField}
          onPress={() => {
            setShowTimePicker(true);
          }}
          iconTintColor="#6938EF"
        />
      </View>
      <View style={styles.sectionSpacing} />
      <View style={styles.row}>
        <TaskSelectField
          label="Reminder"
          value={getReminderName(reminder)}
          icon={IMAGES.bell}
          iconTintColor={COLORS.Primary}
          onPress={() => setIsReminderModalVisible(true)}
          containerStyle={{ flex: 1 }}
        />
      </View>
      <View style={styles.sectionSpacing} />
      <View style={styles.row}>
        <TaskSelectField
          label="List *"
          value={getListName(selectList)}
          onPress={() => {
            setIsListModalVisible(true);
          }}
          containerStyle={{ flex: 1 }}
        />
      </View>
      <View style={styles.sectionSpacing} />
      <View style={[styles.row, { flexDirection: "column" }]}>
        <Text style={styles.priorityLabel}>{"Priority"}</Text>
        <View style={{ flexDirection: "row" }}>
          {listOfPriority.map((item, index) => {
            const isSelected = item === priority;
            const isLastItem = index === listOfPriority.length - 1;
            return (
              <TaskSelectField
                key={item}
                containerStyle={styles.flexField}
                label=""
                value={capitalizeFirstLetter(item)}
                icon={IMAGES.flag}
                height={42}
                borderRadius={10}
                showChevron={false}
                onPress={() => setPriority(item)}
                buttonStyle={[
                  {
                    borderColor: isSelected ? COLORS.Danger : COLORS.Border,
                    backgroundColor: isSelected
                      ? COLORS.DangerTint
                      : COLORS.Surface,
                    marginRight: isLastItem ? 0 : 8,
                  },
                ]}
                iconTintColor={isSelected ? COLORS.Danger : undefined}
                valueStyle={[
                  styles.priorityValue,
                  {
                    color: isSelected ? COLORS.Danger : COLORS.Muted,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
      <View style={[styles.sectionSpacing, { flex: 1 }]} />
      <AppButton
        title="Add task"
        showIcon={false}
        onPress={() => {
          dataSendToApi();
        }}
        loading={loading}
        disabled={loading}
      />
      <ReminderModal
        visible={isReminderModalVisible}
        selectedReminder={reminder}
        onClose={() => setIsReminderModalVisible(false)}
        onSave={(selectedReminder) => {
          setReminder(selectedReminder);
        }}
      />
      <ListModel
        visible={isListModalVisible}
        selectList={selectList}
        onClose={() => setIsListModalVisible(false)}
        onSave={(item) => {
          setSelectList(item);
        }}
        listOfData={lists}
      />
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (event.type === "set" && selectedTime) {
              setTime(selectedTime);
            }
          }}
        />
      )}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate ?? today}
          mode="date"
          display="default"
          minimumDate={today}
          maximumDate={maxDate}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (event.type === "set" && selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={COLORS.Primary} />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    backgroundColor: COLORS.Surface,
    borderRadius: 10,
  },
  intro: {
    marginVertical: 22,
  },
  introText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.Ink,
  },
  inputLabel: {
    color: COLORS.Muted,
    fontSize: 12,
  },
  inputText: {
    color: COLORS.Ink,
    fontSize: 13,
  },
  inputContainer: {
    borderColor: COLORS.Border,
  },
  sectionSpacing: {
    height: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexField: {
    flex: 1,
  },
  priorityLabel: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Muted,
    fontSize: 12,
    marginBottom: 7,
  },
  priorityValue: {
    fontFamily: FONTS.semiBold,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    zIndex: 999,
  },
});
