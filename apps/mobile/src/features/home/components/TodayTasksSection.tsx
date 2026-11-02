import { COLORS, FONTS } from "@/theme";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TaskCard, { formatDueLabel, TaskStatus } from "./TaskCard";
import { TaskData } from "@/features/newtask";

interface TodayTasksSectionProps {
  tasks: TaskData[];
  onSeeAllPress?: () => void;
  onStartPress?: (task: TaskData) => void;
  onDonePress?: (task: TaskData) => void;
  onPushPress?: (task: TaskData) => void;
  handleDelete?:(task:TaskData) => void
}

export default function TodayTasksSection({
  tasks,
  onSeeAllPress,
  onStartPress,
  onDonePress,
  onPushPress,
  handleDelete
}: TodayTasksSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{`Today · ${tasks.length}`}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAllPress}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskCard
            title={item.name}
            listName={item.list_name ?? "Personal"}
            status={(item.status ?? "pending") as TaskStatus}
            startTime={item.start_time ?? undefined}
            dueDate={formatDueLabel(item.start_time ?? undefined)}
            reminder={item.reminder_name}
            onStartPress={() => onStartPress?.(item)}
            onDonePress={() => onDonePress?.(item)}
            onPushPress={() => onPushPress?.(item)}
            handleDelete={() =>handleDelete?.(item)}
          />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heading: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.Ink,
  },
  seeAll: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.Primary,
  },
  separator: {
    height: 12,
  },
});