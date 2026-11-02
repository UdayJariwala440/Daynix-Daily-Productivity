import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TaskStatus = "pending" | "in_progress" | "paused" | "completed";

export interface TaskCardProps {
  title: string;
  listName: string;
  status: TaskStatus;
  dueDate?: string;
  startTime?: string;
  reminder?: string;
  startedAt?: string;
  onStartPress?: () => void;
  onDonePress?: () => void;
  onPushPress?: () => void;
  handleDelete?: () => void
}

const useNow = (intervalMs = 10000) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
};

const toMinute = (ms: number) => Math.floor(ms / 60000);

const getScheduledToday = (startTime?: string): Date | null => {
  if (!startTime) return null;
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(
    startTime.trim(),
  );
  if (!match) return null;
  let h = Number(match[1]);
  const m = Number(match[2]);
  const s = Number(match[3] ?? 0);
  const meridiem = match[4]?.toUpperCase();
  if (meridiem === "PM" && h < 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, m, s, 0);
  return d;
};

const isTaskLate = (
  startTime?: string,
  status?: TaskStatus,
  now: number = Date.now(),
): boolean => {
  if (status !== "pending") return false;
  const scheduled = getScheduledToday(startTime);
  return !!scheduled && toMinute(now) >= toMinute(scheduled.getTime());
};

const getLateDuration = (
  startTime?: string,
  now: number = Date.now(),
): string => {
  const scheduled = getScheduledToday(startTime);
  if (!scheduled) return "";
  const minutes = Math.max(0, toMinute(now) - toMinute(scheduled.getTime()));
  if (minutes < 60) return `${minutes} m`;
  return `${Math.floor(minutes / 60)} h`;
};

export const formatDueLabel = (startTime?: string): string => {
  const d = getScheduledToday(startTime);
  if (!d) return "";
  const h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  return `Today, ${h % 12 === 0 ? 12 : h % 12}:${min} ${h >= 12 ? "PM" : "AM"}`;
};

export default function TaskCard({
  title,
  listName,
  status,
  dueDate,
  startTime,
  reminder,
  startedAt,
  onStartPress,
  onDonePress,
  onPushPress,
  handleDelete
}: TaskCardProps) {
  const now = useNow();
  const late = isTaskLate(startTime, status, now);
  const lateDuration = getLateDuration(startTime, now);
  const isInProgress = status === "in_progress";
  const isCompleted = status === "completed";
  const isPaused = status === "paused";

  const badgeLabel = late
    ? lateDuration === "0 m"
      ? "Late"
      : `Late · ${lateDuration}`
    : {
      pending: "Pending",
      in_progress: "In progress",
      paused: "Paused",
      completed: "Completed",
    }[status];

  const badgeStyle = late
    ? styles.lateBadge
    : isInProgress
      ? styles.progressBadge
      : isCompleted
        ? styles.completedBadge
        : isPaused
          ? styles.pausedBadge
          : styles.pendingBadge;

  const badgeTextStyle = late
    ? styles.lateBadgeText
    : isInProgress
      ? styles.progressBadgeText
      : isCompleted
        ? styles.completedBadgeText
        : isPaused
          ? styles.pausedBadgeText
          : styles.pendingBadgeText;

  return (
    <TouchableOpacity style={styles.card} disabled={isCompleted}>
      <View style={styles.topRow}>
        <Text style={styles.listName}>{listName}</Text>
        <View style={[styles.statusBadge, badgeStyle]}>
          <Text style={[styles.statusText, badgeTextStyle]}>{badgeLabel}</Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      {dueDate ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.infoRow}>
            <Image
              source={IMAGES.clock}
              style={[styles.icon, late && styles.lateIcon]}
            />
            <Text style={[styles.infoText, late && styles.lateInfoText]}>
              {dueDate}
            </Text>
          </View>
          {status === "pending" ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDelete}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Text style={styles.actionButtonText}>{"Delete"}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
      <View style={styles.bottomRow}>
        <View style={{ flex: 1 }}>
          {status === "pending" && !late && reminder ? (
            <View style={styles.infoRow}>
              <Image source={IMAGES.bell} style={styles.icon} />
              <Text style={styles.infoText}>{reminder}</Text>
            </View>
          ) : null}
          {isInProgress && startedAt ? (
            <View style={styles.infoRow}>
              <View style={styles.startedIndicator} />
              <Text style={styles.startedText}>
                {`Started at ${startedAt}`}
              </Text>
            </View>
          ) : null}
          {late ? (
            <View style={styles.infoRow}>
              <Text style={styles.pushIndicator}>{"↱"}</Text>
              <Text style={styles.infoText}>{"Not started"}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.actionsContainer}>
          {late && !isCompleted ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPushPress}
              style={[styles.actionButton, styles.pushButton]}
            >
              <Text style={[styles.actionIcon, styles.pushIcon]}>{"↱"}</Text>
              <Text style={[styles.actionButtonText, styles.pushButtonText]}>
                {"Push"}
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            activeOpacity={isCompleted ? 1 : 0.8}
            disabled={isCompleted}
            onPress={isInProgress ? onDonePress : onStartPress}
            style={[
              styles.actionButton,
              isCompleted || isInProgress
                ? styles.doneButton
                : styles.startButton,
            ]}
          >
            <Text style={styles.actionIcon}>
              {isCompleted || isInProgress ? "✓" : "▶"}
            </Text>
            <Text style={styles.actionButtonText}>
              {isCompleted
                ? "Done"
                : isInProgress
                  ? "Done"
                  : isPaused
                    ? "Resume"
                    : "Pending"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.Surface,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listName: {
    fontFamily: FONTS.regular,
    color: COLORS.Muted,
    fontSize: 14,
  },
  statusBadge: {
    borderRadius: 9,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  statusText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  pendingBadge: {
    backgroundColor: COLORS.WarningTint,
  },
  pendingBadgeText: {
    color: COLORS.Warning,
  },
  progressBadge: {
    backgroundColor: COLORS.PrimaryTint,
  },
  progressBadgeText: {
    color: COLORS.Primary,
  },
  pausedBadge: {
    backgroundColor: COLORS.WarningTint,
  },
  pausedBadgeText: {
    color: COLORS.Warning,
  },
  completedBadge: {
    backgroundColor: COLORS.SuccessTint,
  },
  completedBadgeText: {
    color: COLORS.Success,
  },
  lateBadge: {
    backgroundColor: COLORS.DangerTint,
  },
  lateBadgeText: {
    color: COLORS.Danger,
  },
  title: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Ink,
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    height: 12,
    width: 12,
    resizeMode: "contain",
  },
  lateIcon: {
    tintColor: COLORS.Danger,
  },
  infoText: {
    marginLeft: 6,
    fontFamily: FONTS.regular,
    color: COLORS.Muted,
    fontSize: 14,
  },
  lateInfoText: {
    color: COLORS.Danger,
  },
  startedIndicator: {
    height: 6,
    width: 6,
    backgroundColor: COLORS.Success,
    borderRadius: 100,
  },
  startedText: {
    marginLeft: 6,
    fontFamily: FONTS.semiBold,
    color: COLORS.Success,
    fontSize: 14,
  },
  pushIndicator: {
    color: COLORS.Warning,
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionButton: {
    minWidth: 92,
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: COLORS.Primary,
  },
  doneButton: {
    backgroundColor: COLORS.Success,
  },
  pushButton: {
    backgroundColor: COLORS.WarningTint,
  },
  actionIcon: {
    color: COLORS.Surface,
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  pushIcon: {
    color: COLORS.Warning,
  },
  actionButtonText: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Surface,
    fontSize: 14,
    marginLeft: 7,
  },
  pushButtonText: {
    color: COLORS.Warning,
  },
  deleteButton: {
    backgroundColor: COLORS.Danger,
  },
});
