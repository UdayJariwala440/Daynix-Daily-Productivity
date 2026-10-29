import {
  clearAuthTokens,
  getSessions,
  revokeOtherSessions,
  revokeSession,
  type Session,
} from "@/features/auth/services";
import { COLORS, FONTS } from "@/theme";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function formatLastActive(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently active"
    : `Active ${date.toLocaleString()}`;
}

function SessionCard({
  session,
  onRemove,
}: {
  session: Session;
  onRemove: (session: Session) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.deviceIcon}>
        <Text style={styles.deviceIconText}>
          {session.platform === "web"
            ? "W"
            : session.platform === "ios"
              ? "i"
              : "A"}
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.deviceName}>
            {session.device_name}
          </Text>
          {session.current && (
            <Text style={styles.currentBadge}>THIS DEVICE</Text>
          )}
        </View>
        <Text style={styles.meta}>
          {[session.device_model, session.os_version, session.ip_address]
            .filter(Boolean)
            .join(" · ") || "Device details unavailable"}
        </Text>
        <Text style={styles.active}>
          {formatLastActive(session.last_active_at)}
        </Text>
      </View>

      <TouchableOpacity hitSlop={10} onPress={() => onRemove(session)}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SessionsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadSessions = useCallback(async () => {
    try {
      setError("");
      setSessions(await getSessions());
    } catch {
      setError("Unable to load your signed-in devices.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getSessions()
      .then((items) => {
        if (active) setSessions(items);
      })
      .catch(() => {
        if (active) setError("Unable to load your signed-in devices.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const remove = (session: Session) => {
    Alert.alert(
      session.current
        ? "Log out this device?"
        : `Log out ${session.device_name}?`,
      session.current
        ? "You will return to the login screen."
        : "That device will need to sign in again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            const result = await revokeSession(session.id);

            if (result.currentSessionRevoked) {
              await clearAuthTokens();
              router.replace("/(auth)/login");
              return;
            }

            await loadSessions();
          },
        },
      ],
    );
  };

  const removeOthers = () => {
    Alert.alert(
      "Log out all other devices?",
      "Your current device will stay signed in.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out others",
          style: "destructive",
          onPress: async () => {
            await revokeOtherSessions();
            await loadSessions();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={10} onPress={() => router.back()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Signed-in devices</Text>
          <Text style={styles.subtitle}>
            Devices with access to your Daynix account
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.Primary} style={styles.loader} />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={COLORS.Primary}
              onRefresh={() => {
                setRefreshing(true);
                void loadSessions();
              }}
            />
          }
          ListHeaderComponent={
            error ? <Text style={styles.error}>{error}</Text> : undefined
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No active sessions found.</Text>
          }
          renderItem={({ item }) => (
            <SessionCard session={item} onRemove={remove} />
          )}
          ListFooterComponent={
            sessions.length > 1 ? (
              <TouchableOpacity
                style={styles.logoutOthers}
                onPress={removeOthers}
              >
                <Text style={styles.logoutOthersText}>
                  Log out all other devices
                </Text>
              </TouchableOpacity>
            ) : undefined
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.Background },
  header: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 18,
  },
  headerCopy: { flex: 1 },
  back: { color: COLORS.Ink, fontSize: 36, lineHeight: 36 },
  title: { color: COLORS.Ink, fontFamily: FONTS.semiBold, fontSize: 24 },
  subtitle: {
    color: COLORS.Muted,
    fontFamily: FONTS.regular,
    fontSize: 13,
    marginTop: 4,
  },
  loader: { marginTop: 60 },
  list: { gap: 12, padding: 20, paddingBottom: 40 },
  card: {
    alignItems: "center",
    backgroundColor: COLORS.Surface,
    borderColor: COLORS.Border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    padding: 16,
  },
  deviceIcon: {
    alignItems: "center",
    backgroundColor: COLORS.PrimaryTint,
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  deviceIconText: {
    color: COLORS.Primary,
    fontFamily: FONTS.semiBold,
    fontSize: 17,
  },
  details: { flex: 1, marginHorizontal: 12 },
  nameRow: { alignItems: "center", flexDirection: "row", gap: 7 },
  deviceName: {
    color: COLORS.Ink,
    flexShrink: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  currentBadge: {
    backgroundColor: COLORS.SuccessTint,
    borderRadius: 6,
    color: COLORS.Success,
    fontFamily: FONTS.semiBold,
    fontSize: 9,
    overflow: "hidden",
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  meta: {
    color: COLORS.Muted,
    fontFamily: FONTS.regular,
    fontSize: 12,
    marginTop: 5,
  },
  active: {
    color: COLORS.Muted,
    fontFamily: FONTS.regular,
    fontSize: 11,
    marginTop: 3,
  },
  logoutText: {
    color: COLORS.Danger,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  logoutOthers: {
    alignItems: "center",
    borderColor: COLORS.Danger,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    padding: 14,
  },
  logoutOthersText: {
    color: COLORS.Danger,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  error: {
    color: COLORS.Danger,
    fontFamily: FONTS.regular,
    marginBottom: 8,
    textAlign: "center",
  },
  empty: {
    color: COLORS.Muted,
    fontFamily: FONTS.regular,
    marginTop: 48,
    textAlign: "center",
  },
});
