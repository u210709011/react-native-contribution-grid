import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native";
import { ContributionGrid } from "react-native-contribution-grid";
import { demoData } from "../_data";

export default function BigContainer() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ContributionGrid
          data={demoData}
          columnMinWidth={1200} /** minimum width of the container */
          containerStyle={{ padding: 16 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
