import { ScreenContainer } from "@/features/components";
import {
  HomeHeader,
  DailyMomentumCard,
  EmptyTasks,
  HomeActions,
  listAllTask,
  TaskData,
  TodayTasksSection,
  updateTaskStatus,
} from "@/features";
import { COLORS, FONTS } from "@/theme";
import { IMAGES } from "@/constants";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { deleteTask, TaskListResponse } from "@/features/newtask/services/taskService";

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
  const total = listOfTask.length;
  const done = listOfTask.filter((t) => t.is_completed).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  useFocusEffect(
    useCallback(() => {
      fetchTaskList();
    }, []),
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

  const taskDelete = async(item:TaskData) =>{
    try {
      const response = await deleteTask(item.id);
      if(response.success === true){
       setListOfTask((prev) => prev.filter((task) => task.id !== item.id));
      }
      
    } catch (error) {
      console.log("Error ====>",JSON.stringify(error));
      
    }
  }

  const onPress = async (item: TaskData) => {
    try {
      const response = await updateTaskStatus(item.id, "completed");
      if (response.success === true && response.data) {
        const updated = response.data;
        setListOfTask((prev) =>
          prev.map((task) =>
            task.id === updated.id ? { ...task, ...updated } : task,
          ),
        );
      }
    } catch (error) {
      console.log("Error ====>", JSON.stringify(error));
    }
  };

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {total === 0 ? (
          <DailyMomentumCard
            label="Your daily momentum"
            title="A fresh, calm start"
            description="Nothing planned yet. Add your first task to begin building today's momentum."
          />
        ) : (
          <DailyMomentumCard
            label="Your daily momentum"
            title={
              done === 0
                ? "Ready when you are. Start your first task."
                : done === total
                  ? "All done. Great work today!"
                  : "You're making great progress!"
            }
            progress={progress}
            completedCount={done}
            totalCount={total}
            onActionPress={() => router.push("/(tabs)/task")}
          />
        )}
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
              tasks={listOfTask}
              onSeeAllPress={() => router.push("/newtask")}

              onStartPress={(item) => {
                onPress(item);
              }}
              handleDelete={(item) =>{
                taskDelete(item)
              }}
            />
          </>
        )}
      </ScrollView>
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
