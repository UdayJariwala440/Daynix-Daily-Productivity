import { ScreenContainer } from "@/features/components";
import {
  HomeHeader,
  DailyMomentumCard,
  EmptyTasks,
  HomeActions,
} from "@/features";

import { COLORS, FONTS } from "@/theme";
import { IMAGES } from "@/constants";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ScreenContainer
      style={{
        alignItems: "center",
      }}
    >
      <HomeHeader
        avatarText="T"
        subtitle="Personal · Thursday, October 15"
        greeting="Hello, Livia ☀"
        searchIcon={IMAGES.search}
        notificationIcon={IMAGES.bell}
        onSearchPress={() => console.log("Search pressed")}
        onNotificationPress={() => console.log("Notifications pressed")}
        containerStyle={{
          marginBottom: 4,
        }}
        avatarStyle={{
          backgroundColor: COLORS.PrimaryTint,
        }}
        greetingStyle={{
          fontSize: 21,
          fontFamily: FONTS.bold,
        }}
      />

      <DailyMomentumCard
        label="YOUR DAILY MOMENTUM"
        title="A fresh, calm start"
        description="Nothing planned yet. Add your first task to begin building today’s momentum."
        containerStyle={{
          marginVertical: 12,
          borderRadius: 22,
          padding: 22,
        }}
        titleStyle={{
          fontSize: 22,
        }}
      />

      <EmptyTasks
        image={IMAGES.clipboard}
        title="No tasks yet"
        description={
          "Create your first task or start a project, and today’s plan\nwill show up right here."
        }
        outerCircleStyle={{
          height: 176,
          width: 176,
        }}
        imageStyle={{
          height: 30,
          width: 30,
        }}
        titleStyle={{
          color: COLORS.Ink,
          fontSize: 20,
        }}
      />

      <HomeActions
        primaryTitle="Add a task"
        secondaryTitle="New project"
        primaryIcon={IMAGES.plus}
        onPrimaryPress={() => {
           router.push("/newtask")
        }}
        onSecondaryPress={() => console.log("New project pressed")}
        containerStyle={{
          marginTop: 4,
        }}
        primaryButtonStyle={{
          backgroundColor: COLORS.Primary,
        }}
      />
    </ScreenContainer>
  );
}