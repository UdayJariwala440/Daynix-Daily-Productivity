import { IMAGES } from "@/constants";
import {
  AppButton,
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
import { StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
const listOfPriority = ["Low", "Medium", "High"];

export default function NewTaskScreen() {
  const [list, setList] = useState<string>("");
  const [time, setTime] = useState<Date>(new Date());
  const [priority, setPriority] = useState<string>("");
  const [taskName, setTaskName] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [description, setDescription] = useState<string>("");
  const [reminder, setReminder] = useState<string>("30_minutes");
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [isListModalVisible, setIsListModalVisible] = useState(false);
  const [lists, setLists] = useState<listData[]>([]);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);




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
    } finally {
     
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
          label="List *"
          value={list}
          onPress={() => {
            setIsListModalVisible(true);
          }}
          containerStyle={{ flex: 1 }}
        />
      </View>
       <View style={styles.sectionSpacing} />
      <View style={styles.row}>
        <TaskSelectField
          label="Due date *"
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
          label="Due time"
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
                value={item}
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
      <View style={styles.sectionSpacing} />
      <View style={styles.row}>
        <TaskSelectField
          label="Reminder"
          value={reminder}
          icon={IMAGES.bell}
          iconTintColor={COLORS.Primary}
          onPress={() => setIsReminderModalVisible(true)}
          containerStyle={{ flex: 1 }}
        />
      </View>
      <View style={styles.sectionSpacing} />
      <AppButton title="Add task" showIcon={false} />
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
        selectList={list}
        onClose={() => setIsListModalVisible(false)}
        onSave={(item) => {
          setList(item);
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
              console.log("Selected time:", selectedTime);
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
    height: 22,
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
});
