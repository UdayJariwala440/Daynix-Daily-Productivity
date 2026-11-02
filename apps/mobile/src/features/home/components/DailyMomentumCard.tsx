import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

import { COLORS, FONTS } from "@/theme";

interface DailyMomentumCardProps {
  label: string;
  title: string;
  description?: string;

  /** 0-100. When provided, the progress ring is shown. */
  progress?: number;

  /** When `totalCount` is provided, the footer row is shown. */
  completedCount?: number;
  totalCount?: number;
  actionLabel?: string;
  onActionPress?: () => void;

  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

const RING_SIZE = 56;
const RING_STROKE = 5;

function ProgressRing({ progress }: { progress: number }) {
  const percent = Math.min(100, Math.max(0, Math.round(progress)));
  const radius = (RING_SIZE - RING_STROKE) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const center = RING_SIZE / 2;

  return (
    <View
      style={{
        width: RING_SIZE,
        height: RING_SIZE,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={RING_SIZE} height={RING_SIZE}>
        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={RING_STROKE}
          fill="none"
        />
        {/* Progress (starts at 12 o'clock) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={COLORS.Surface}
          strokeWidth={RING_STROKE}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>

      <Text
        style={{
          position: "absolute",
          color: COLORS.Surface,
          fontFamily: FONTS.bold,
          fontSize: 13,
        }}
      >
        {percent}%
      </Text>
    </View>
  );
}

export default function DailyMomentumCard({
  label,
  title,
  description,
  progress,
  completedCount,
  totalCount,
  actionLabel = "View tasks →",
  onActionPress,
  containerStyle,
  labelStyle,
  titleStyle,
  descriptionStyle,
}: DailyMomentumCardProps) {
  const showRing = progress !== undefined;
  const showFooter = totalCount !== undefined;

  return (
    <View
      style={[
        {
          width: "100%",
          backgroundColor: COLORS.Primary,
          borderRadius: 22,
          padding: 22,
          marginVertical: 12,
        },
        containerStyle,
      ]}
    >
      <Text
        style={[
          {
            color: COLORS.Surface,
            opacity: 0.75,
            fontFamily: FONTS.semiBold,
            fontSize: 10,
            lineHeight: 13,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>

      {/* Title + ring */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 8,
        }}
      >
        <Text
          style={[
            {
              flex: 1,
              color: COLORS.Surface,
              fontFamily: FONTS.bold,
              fontSize: 22,
              lineHeight: 29,
              paddingRight: showRing ? 12 : 0,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>

        {showRing && <ProgressRing progress={progress} />}
      </View>

      {!!description && (
        <Text
          style={[
            {
              color: COLORS.Surface,
              opacity: 0.85,
              fontFamily: FONTS.regular,
              fontSize: 14,
              lineHeight: 21,
            },
            descriptionStyle,
          ]}
        >
          {description}
        </Text>
      )}

      {/* Footer */}
      {showFooter && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: COLORS.Surface,
              opacity: 0.75,
              fontFamily: FONTS.regular,
              fontSize: 11,
            }}
          >
            {completedCount ?? 0} of {totalCount} tasks done
          </Text>

          {onActionPress && (
            <Pressable
              onPress={onActionPress}
              hitSlop={10}
              accessibilityRole="button"
            >
              <Text
                style={{
                  color: COLORS.Surface,
                  fontFamily: FONTS.semiBold,
                  fontSize: 11,
                }}
              >
                {actionLabel}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}