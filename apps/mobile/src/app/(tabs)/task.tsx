import { IMAGES } from "@/constants";
import { Header, Input, ScreenContainer } from "@/features/components";
import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { HorizontalCalendar, listAllTask, TaskData } from "@/features";
import TaskCard from "@/features/task/components/TaskCard";
import { ScrollView } from "react-native";

function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Task() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [listOfTask, setListOfTask] = useState<TaskData[]>([]);

  const fetchTasks = useCallback(async (date: Date) => {
    try {
      const response = await listAllTask(toYMD(date));

      if (response.success === true) {
        // Always set, even when empty, so old tasks are cleared
        setListOfTask(response.data ?? []);
      }
    } catch (error) {
      console.log("Error ====>", error);
      setListOfTask([]);
    }
  }, []);

  // Runs on mount and every time selectedDate actually changes
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await listAllTask(toYMD(selectedDate));
        if (!cancelled && response.success === true) {
          setListOfTask(response.data ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          console.log("Error ====>", error);
          setListOfTask([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  return (
    <ScreenContainer>
      <Header title="Task" rightIcon={null} />

      <Input
        placeholder="Enter the data ...."
        inputContainerStyle={{ borderColor: "#6938EF" }}
        icon={IMAGES.search}
        label=""
        iconStyle={{ tintColor: "#6938EF" }}
      />

      <HorizontalCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        containerStyle={{ marginTop: 20 }}
      />
      <ScrollView>
        {listOfTask.map((item) => (
          <TaskCard
            key={item.id}
            listName={item.list_name}
            title={item.name}
            startTime={item.start_time}
            priority={item.priority}
            status={item.status}
            isCompleted={item.is_completed}
            onPress={() => {}}
            onTogglePress={() => {}}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}
