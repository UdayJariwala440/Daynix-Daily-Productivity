import { COLORS, FONTS } from "@/theme";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TaskCard, { TaskCardProps } from "./TaskCard";

interface TodayTasksSectionProps {
  tasks: (TaskCardProps & { id: string })[];
  onSeeAllPress?: () => void;
}

export default function TodayTasksSection({
  tasks,
  onSeeAllPress,
}: TodayTasksSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          Today · {tasks.length}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard {...item} />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
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