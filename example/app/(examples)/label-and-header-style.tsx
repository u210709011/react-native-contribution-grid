import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { ContributionGrid } from "react-native-contribution-grid";
import { demoData } from "../_data";

export default function LabelHeaderStyles() {
  return (
    /** Style the labels and header */
    /** DO NOT change padding and margin for texts if not absolutely necessary */
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ContributionGrid
          containerStyle={{
            padding: 16,
          }}

          data={demoData}

          monthLabelTextStyle={{
            color: "purple",
            fontWeight: "bold",
          }}

          dayLabelTextStyle={{
            color: "red",
            fontWeight: "light",
          }}

          headerTextStyle={{
            color: "blue",
            fontWeight: "medium",
            fontSize: 25,
          }}

          headerButtonTextStyle={{
            color: "green",
            fontWeight: "heavy",
            fontSize: 30,
          }}
          
          headerButtonStyle={{
            borderColor: "yellow",
            borderWidth: 0,
            width: 100,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
