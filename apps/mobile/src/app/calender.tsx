import { IMAGES } from "@/constants";
import { Calender, ScreenContainer } from "@/features";
import Calendar from "@/features/task/components/Calender";
import { FONTS } from "@/theme";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function CalenderScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const taskDates = [
    new Date(2026, 9, 2),
    new Date(2026, 9, 6),
    new Date(2026, 9, 9),
    new Date(2026, 9, 12),
    new Date(2026, 9, 14),
    new Date(2026, 9, 15),
    new Date(2026, 9, 16),
    new Date(2026, 9, 20),
    new Date(2026, 9, 22),
    new Date(2026, 9, 27),
  ];
  return (
    <ScreenContainer>
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        taskDates={taskDates}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#FFFFFF",
          padding: 16,
          borderRadius: 16,
          marginTop: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{
              height: 22,
              borderRadius: 7,
              width: 22,
              borderWidth: 1.5,
              borderColor: "#DFD4FC",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Image source={IMAGES.check} style={{ height: 14, width: 14 }} />
          </TouchableOpacity>
          <View
            style={{
              alignItems: "center",
              flexDirection: "column",
              marginLeft: 12,
            }}
          >
            <Text
              style={{
                color: "#817B91",
                fontFamily: FONTS.regular,
                fontSize: 10,
              }}
            >
              {"Grocery shopping app"}
            </Text>
            <Text
              style={{
                color: "#272335",
                fontFamily: FONTS.semiBold,
                fontSize: 14,
              }}
            >
              {"Market research"}
            </Text>
          </View>
        </View>
        <View
          style={{ marginTop: 11, flexDirection: "row", alignItems: "center", }}
        >
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
            {"12:00 PM"}
          </Text>
        </View>
          <Text
            style={{
              color: "#C05065",
              fontFamily: FONTS.semiBold,
              fontSize: 14,
              textAlign:'center',
              flex:1
            }}
          >
            {"High priority"}
          </Text>
          <View style={{backgroundColor:"#EEE8FF",borderRadius:10,paddingVertical:6,paddingHorizontal:10}}>
            <Text style={{
                  color: "#6938EF",
              fontFamily: FONTS.semiBold,
              fontSize: 14,
            }}>{"In progress"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScreenContainer>
  );
}
