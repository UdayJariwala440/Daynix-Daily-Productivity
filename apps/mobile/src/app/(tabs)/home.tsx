import { ScreenContainer } from "@/features/components";
import {
  HomeHeader,
  DailyMomentumCard,
  EmptyTasks,
  HomeActions,
  listAllTask,
  TaskData,
  TodayTasksSection,
} from "@/features";
import { COLORS, FONTS } from "@/theme";
import { IMAGES } from "@/constants";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";


const getCurrentDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function HomeScreen() {
  const currentDate = new Date();
  const [loading, setLoading] = useState<boolean>(false);
  const [listOfTask, setListOfTask] = useState<TaskData[]>([]);
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
useFocusEffect(
  useCallback(() => {
    fetchTaskList();
  }, [])
);

  const fetchTaskList = async () => {
    try {
      const currentDate = getCurrentDate();
      const response = await listAllTask(currentDate);
      if (response.success === true) {
        setListOfTask(response?.data);
      }
    } catch (error) {
      console.log("Error ===>", JSON.stringify(error));
    }
  };

  const formatTime = (time?: string | null): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
  const todayTasks = useMemo(() => {
    return listOfTask.map((task) => ({
      id: String(task.id),
      title: task.name,
      listName: task.list_name ?? "Personal",
      status: task.status ?? "To do",
      dueDate: `Today, ${formatTime(task?.start_time)}`,
      reminder: task.reminder_name,
      startedAt: "WWE",
    }));
  }, [listOfTask]);

  return (
    <ScreenContainer style={styles.container}>
      <HomeHeader
        avatarText="T"
        subtitle={formattedDate}
        greeting="Hello, Livia ☀"
        searchIcon={IMAGES.search}
        notificationIcon={IMAGES.bell}
        onSearchPress={() => console.log("Search pressed")}
        onNotificationPress={() => console.log("Notifications pressed")}
        containerStyle={styles.header}
        avatarStyle={{
          backgroundColor: COLORS.PrimaryTint,
        }}
        greetingStyle={{
          fontSize: 21,
          fontFamily: FONTS.bold,
        }}
      />

      <DailyMomentumCard
        label="YOUR DAILY MOMENTUM"
        title="A fresh, calm start"
        description="Nothing planned yet. Add your first task to begin building today’s momentum."
        containerStyle={styles.momentumCard}
        titleStyle={{
          fontSize: 22,
        }}
      />
      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={COLORS.Primary} />
          <Text style={styles.stateText}>{"Loading your tasks..."}</Text>
        </View>
      ) : null}
      {listOfTask.length === 0 ? (
        <>
          <EmptyTasks
            image={IMAGES.clipboard}
            title="No tasks yet"
            description={
              "Create your first task or start a project, and today’s plan\nwill show up right here."
            }
            outerCircleStyle={{
              height: 176,
              width: 176,
            }}
            imageStyle={{
              height: 30,
              width: 30,
            }}
            titleStyle={{
              color: COLORS.Ink,
              fontSize: 20,
            }}
          />
          <HomeActions
            primaryTitle="Add a task"
            secondaryTitle="New project"
            primaryIcon={IMAGES.plus}
            onPrimaryPress={() => router.push("/newtask")}
            onSecondaryPress={() => console.log("New project pressed")}
            containerStyle={{
              marginTop: 4,
            }}
            primaryButtonStyle={{
              backgroundColor: COLORS.Primary,
            }}
          />
        </>
      ) : (
        <>
          <TodayTasksSection
            tasks={todayTasks}
            onSeeAllPress={() => router.push("/newtask")}
          />
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 4,
  },
  momentumCard: {
    marginVertical: 12,
    borderRadius: 22,
    padding: 22,
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 12,
  },
  stateText: {
    fontFamily: FONTS.regular,
    color: COLORS.Muted,
    fontSize: 14,
  },
  errorText: {
    fontFamily: FONTS.regular,
    color: COLORS.Danger,
    fontSize: 14,
    textAlign: "center",
  },
  retryText: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Primary,
    fontSize: 14,
  },
});
