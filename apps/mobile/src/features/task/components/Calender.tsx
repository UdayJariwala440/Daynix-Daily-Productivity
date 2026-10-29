
import { COLORS, FONTS } from "@/theme";
import { useEffect, useMemo, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  containerStyle?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  selectedCardStyle?: StyleProp<ViewStyle>;
  taskDates?: Date[];
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const isSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const getCalendarDates = (month: Date): Date[] => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1);
  const startingDay = (firstDay.getDay() + 6) % 7;

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    return new Date(year, monthIndex, index - startingDay + 1);
  });
};

export default function Calendar({
  selectedDate,
  onDateSelect,
  containerStyle,
  cardStyle,
  selectedCardStyle,
  taskDates = [],
}: CalendarProps) {
  const today = useMemo(() => new Date(), []);

  const [internalDate, setInternalDate] = useState(
    () => selectedDate ?? today,
  );

  const activeDate = selectedDate ?? internalDate;

  const [visibleMonth, setVisibleMonth] = useState(
    () =>
      new Date(
        activeDate.getFullYear(),
        activeDate.getMonth(),
        1,
      ),
  );

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1,
        ),
      );
    }
  }, [selectedDate]);

  const dates = useMemo(
    () => getCalendarDates(visibleMonth),
    [visibleMonth],
  );

  const changeMonth = (amount: number) => {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + amount,
          1,
        ),
    );
  };

  const selectDate = (date: Date) => {
    setInternalDate(date);

    setVisibleMonth(
      new Date(date.getFullYear(), date.getMonth(), 1),
    );

    onDateSelect?.(date);
  };

  const hasTasks = (date: Date) =>
    taskDates.some((taskDate) => isSameDay(taskDate, date));

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Month Header */}
      <View style={styles.header}>
        <Text style={styles.monthTitle}>
          {visibleMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>

        <View style={styles.navigation}>
          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Previous month"
            onPress={() => changeMonth(-1)}
            style={styles.navButton}
          >
            <Text style={styles.arrow}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Next month"
            onPress={() => changeMonth(1)}
            style={styles.navButton}
          >
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar Card */}
      <View style={[styles.calendarCard, cardStyle]}>
        {/* Weekday Header */}
        <View style={styles.weekdaysRow}>
          {WEEKDAYS.map((day) => (
            <View key={day} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Dates */}
        <View style={styles.datesGrid}>
          {dates.map((date) => {
            const selected = isSameDay(date, activeDate);

            const isCurrentMonth =
              date.getMonth() === visibleMonth.getMonth() &&
              date.getFullYear() === visibleMonth.getFullYear();

            const hasTask = hasTasks(date);

            return (
              <View
                key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                style={styles.dayCell}
              >
                <TouchableOpacity
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={date.toDateString()}
                  accessibilityState={{ selected }}
                  onPress={() => selectDate(date)}
                  style={[
                    styles.dateCircle,
                    selected && styles.selectedDateCircle,
                    selected && selectedCardStyle,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateText,
                      !isCurrentMonth && styles.outsideMonthText,
                      selected && styles.selectedDateText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>

                <View style={styles.indicatorContainer}>
                  {hasTask && (
                    <View
                      style={[
                        styles.taskDot,
                        selected && styles.selectedTaskDot,
                      ]}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  monthTitle: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.Ink,
  },

  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  navButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.Surface,
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    fontFamily: FONTS.regular,
    fontSize: 26,
    lineHeight: 30,
    color: COLORS.Ink,
    marginTop: -2,
  },

  calendarCard: {
    width: "100%",
    backgroundColor: COLORS.Surface,
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingTop: 24,
    paddingBottom: 16,
    overflow: "hidden",
  },

  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  weekdayCell: {
    width: `${100 / 7}%`,
    alignItems: "center",
  },

  weekdayText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.Muted,
  },

  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  dayCell: {
 width: `${100 / 7}%`,
  height: 68,
  alignItems: "center",
  justifyContent: "flex-start",
  },

  dateCircle: {
  width: 38,
  height: 38,
  borderRadius: 19,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  },

  selectedDateCircle: {
    backgroundColor: COLORS.Primary,
  },

  dateText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.Ink,
    textAlign: "center",
  },

  selectedDateText: {
    color: COLORS.Surface,
  },

  outsideMonthText: {
    color: "#C5C0D0",
  },

  indicatorContainer: {
 height: 8,
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 3,
  },

  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.PrimarySoft,
  },

  selectedTaskDot: {
    backgroundColor: COLORS.Primary,
  },
});
