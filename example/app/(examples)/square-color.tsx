import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text, View } from "react-native";
import { ContributionGrid } from "react-native-contribution-grid";
import { demoData } from "../_data";

export default function ColorsExample() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ContributionGrid
          data={demoData}
          containerStyle={{
            padding: 16,
          }}
          levelColors={{
            padding: "transparent",
            empty: "grey",
            level1: "green",
            level2: "yellow",
            level3: "orange",
            level4: "red",
            selectedBorder: "#f59e0b",
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
