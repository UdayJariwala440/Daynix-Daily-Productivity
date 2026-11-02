import { IMAGES } from "@/constants";
import { COLORS, FONTS } from "@/theme";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface TaskCardProps {
  title: string;
  listName: string;
  status: string;
  dueDate?: string;
  reminder?: string;
  startedAt?: string;
  onStartPress?: () => void;
}

export default function TaskCard({
  title,
  listName,
  status,
  dueDate,
  reminder,
  startedAt,
  onStartPress,
}: TaskCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.listName}>{listName}</Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>

      {dueDate ? (
        <View style={styles.infoRow}>
          <Image source={IMAGES.clock} style={styles.icon} />
          <Text style={styles.infoText}>{dueDate}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onStartPress}
        style={styles.startButton}
      >
        <Image source={IMAGES.play} style={styles.startIcon} />
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>

      {reminder ? (
        <View style={styles.infoRow}>
          <Image source={IMAGES.bell} style={styles.icon} />
          <Text style={styles.infoText}>{reminder}</Text>
        </View>
      ) : null}

      {startedAt ? (
        <View style={styles.infoRow}>
          <View style={styles.startedIndicator} />
          <Text style={styles.startedText}>
            Started at {startedAt}
          </Text>
        </View>
      ) : null}
    </View>
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
  listName: {
    fontFamily: FONTS.regular,
    color: COLORS.Muted,
    fontSize: 12,
  },
  statusBadge: {
    backgroundColor: COLORS.WarningTint,
    borderRadius: 9,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  statusText: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Warning,
    fontSize: 11,
  },
  title: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Ink,
    fontSize: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    height: 13,
    width: 13,
    resizeMode: "contain",
  },
  infoText: {
    marginLeft: 6,
    fontFamily: FONTS.semiBold,
    color: COLORS.Muted,
    fontSize: 11,
  },
  startButton: {
    backgroundColor: COLORS.Primary,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startIcon: {
    height: 14,
    width: 14,
    resizeMode: "contain",
  },
  startButtonText: {
    fontFamily: FONTS.semiBold,
    color: COLORS.Surface,
    fontSize: 12,
    marginLeft: 8,
  },
  startedIndicator: {
    height: 13,
    width: 13,
    backgroundColor: COLORS.Success,
    borderRadius: 100,
  },
  startedText: {
    marginLeft: 6,
    fontFamily: FONTS.semiBold,
    color: COLORS.Success,
    fontSize: 11,
  },
});