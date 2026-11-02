import { IMAGES } from "@/constants";
import { FONTS } from "@/theme";
import { Image, Text, TouchableOpacity, View } from "react-native";

import TaskCheckbox from "./TaskCheckbox";
import { formatTime } from "../utils";

type Priority = "low" | "medium" | "high";

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low priority", color: "#2E9E6B" },
  medium: { label: "Medium priority", color: "#D9822B" },
  high: { label: "High priority", color: "#C05065" },
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In progress",
  paused: "Paused",
  completed: "Completed",
};

interface TaskCardProps {
  listName: string;
  title: string;
  startTime?: string | null;
  priority: string;
  status: string;
  isCompleted: boolean;
  onPress?: () => void;
  onTogglePress?: () => void;
}

function TaskMeta({ listName, title }: { listName: string; title: string }) {
  return (
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text
        style={{ color: "#817B91", fontFamily: FONTS.regular, fontSize: 10 }}
      >
        {listName}
      </Text>
      <Text
        numberOfLines={1}
        style={{ color: "#272335", fontFamily: FONTS.semiBold, fontSize: 14 }}
      >
        {title}
      </Text>
    </View>
  );
}

function TaskTime({ time }: { time: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={IMAGES.clock} style={{ height: 13, width: 13 }} />
      <Text
        style={{
          color: "#817B91",
          fontFamily: FONTS.regular,
          fontSize: 14,
          marginLeft: 5,
        }}
      >
        {time}
      </Text>
    </View>
  );
}

function PriorityLabel({ priority }: { priority: string }) {
  const config = PRIORITY_CONFIG[priority as Priority] ?? PRIORITY_CONFIG.medium;

  return (
    <Text
      style={{
        flex: 1,
        textAlign: "center",
        color: config.color,
        fontFamily: FONTS.semiBold,
        fontSize: 14,
      }}
    >
      {config.label}
    </Text>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <View
      style={{
        backgroundColor: "#EEE8FF",
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 10,
      }}
    >
      <Text
        style={{ color: "#6938EF", fontFamily: FONTS.semiBold, fontSize: 14 }}
      >
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}

export default function TaskCard({
  listName,
  title,
  startTime,
  priority,
  status,
  isCompleted,
  onPress,
  onTogglePress,
}: TaskCardProps) {
  const time = formatTime(startTime);

  return (
    <TouchableOpacity
    disabled={isCompleted}
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginTop: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TaskCheckbox checked={isCompleted} onPress={onTogglePress} />
        <TaskMeta listName={listName} title={title} />
      </View>

      <View
        style={{ marginTop: 11, flexDirection: "row", alignItems: "center" }}
      >
        {time ? <TaskTime time={time} /> : null}
        <PriorityLabel priority={priority} />
        <StatusBadge status={status} />
      </View>
    </TouchableOpacity>
  );
}