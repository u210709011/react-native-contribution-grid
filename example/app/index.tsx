import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StatusBar, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

const examples = [
  { path: "/(examples)/square-color", title: "Square Color" },
  { path: "/(examples)/square-size", title: "Square Size" },
  { path: "/(examples)/container-width", title: "Container Width" },
  { path: "/(examples)/custom-square", title: "Custom square renderer" },
  { path: "/(examples)/cards-on-press", title: "Cards on date press" },
  { path: "/(examples)/label-and-header-style", title: "Label and header styles" },
  { path: "/(examples)/thresholds", title: "Custom thresholds" },
] as const;

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {examples.map((e) => (
          <TouchableOpacity
            key={e.path}
            style={{
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#00000020",
            }}
            onPress={() => router.push(e.path)}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{e.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
