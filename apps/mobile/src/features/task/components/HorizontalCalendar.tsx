
import { COLORS, FONTS } from "@/theme";
import {
  ScrollView,
  ScrollViewInstance,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";

interface HorizontalCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  containerStyle?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  selectedCardStyle?: StyleProp<ViewStyle>;
  dateCount?: number;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const isSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export default function HorizontalCalendar({
  selectedDate,
  onDateSelect,
  containerStyle,
  cardStyle,
  selectedCardStyle,
  dateCount,
}: HorizontalCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const hasInitiallyScrolled = useRef(false);
  const [internalDate, setInternalDate] = useState(() => selectedDate ?? today);

  const activeDate = selectedDate ?? internalDate;

  const dates = useMemo(() => {
    const year = activeDate.getFullYear();
    const month = activeDate.getMonth();

    // Show every day in the selected month by default.
    const totalDays = new Date(year, month + 1, 0).getDate();
    const count = Math.min(dateCount ?? totalDays, totalDays);

    return Array.from({ length: count }, (_, index) => {
      return new Date(year, month, index + 1);
    });
  }, [activeDate, dateCount]);

  const selectDate = (date: Date) => {
    setInternalDate(date);
    onDateSelect?.(date);
  };

  useEffect(() => {
    if (hasInitiallyScrolled.current) return;

    const selectedIndex = dates.findIndex((date) =>
      isSameDay(date, activeDate),
    );

    if (selectedIndex === -1) return;

    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: selectedIndex * (65 + 10),
        animated: true,
      });

      hasInitiallyScrolled.current = true;
    }, 300);

    return () => clearTimeout(timer);
  }, [dates, activeDate]);

  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((date) => {
          const selected = isSameDay(date, activeDate);
          const isToday = isSameDay(date, today);

          return (
            <TouchableOpacity
              key={date.toISOString()}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={date.toDateString()}
              accessibilityState={{ selected }}
              onPress={() => selectDate(date)}
              style={[
                styles.dateCard,
                cardStyle,
                selected && styles.selectedCard,
                selected && selectedCardStyle,
              ]}
            >
              <Text
                style={[styles.weekday, selected && styles.selectedWeekday]}
              >
                {WEEKDAYS[date.getDay()]}
              </Text>

              <Text
                style={[
                  styles.dateNumber,
                  selected && styles.selectedDateNumber,
                ]}
              >
                {date.getDate()}
              </Text>

              {isToday && !selected && <View style={styles.todayIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollContent: {
    paddingHorizontal: 2,
    gap: 10,
  },
  dateCard: {
    width: 65,
    height: 70,
    borderRadius: 16,
    backgroundColor: COLORS.Surface,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCard: {
    backgroundColor: COLORS.Primary,
  },
  weekday: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.Muted,
    marginBottom: 6,
  },
  selectedWeekday: {
    color: COLORS.Surface,
  },
  dateNumber: {
    fontFamily: FONTS.regular,
    fontSize: 20,
    color: COLORS.Ink,
  },
  selectedDateNumber: {
    color: COLORS.Surface,
  },
  todayIndicator: {
    position: "absolute",
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.Primary,
  },
});