import { IMAGES } from "@/constants";
import { Header, Input, ScreenContainer } from "@/features/components";
import { FONTS } from "@/theme";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { HorizontalCalendar } from "@/features";

export default function Task() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <ScreenContainer>
    <Header title="Task" onRightPress={() =>{
      router.push("/calender")
    }}/>
      <Input
        placeholder={"Enter the data ...."}
        inputContainerStyle={{ borderColor: "#6938EF" }}
        icon={IMAGES.search}
        label=""
        iconStyle={{ tintColor: "#6938EF" }}
      />
      <HorizontalCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        containerStyle={{ marginTop: 20 }}
      />
    </ScreenContainer>
  );
}
