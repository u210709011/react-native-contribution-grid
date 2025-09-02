import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Text } from "react-native";
import { ContributionGrid } from "react-native-contribution-grid";
import { demoData } from "../_data";

export default function BigSquares() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ContributionGrid
          data={demoData}
          squareSize={40}
          squareSpacing={5}
          containerStyle={{ padding: 16 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
