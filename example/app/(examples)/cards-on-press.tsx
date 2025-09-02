import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text, View } from "react-native";
import { ContributionGrid } from "react-native-contribution-grid";
import { demoData } from "../_data";

export default function CardsOnPress() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  // Derive items from demoData counts for the selected date (deterministic)
  const itemsForDate = useMemo(() => {
    if (!selectedDate) return [] as { id: string; title: string }[];
    const count = demoData.filter((e) => {
      const d =
        e.completedAt instanceof Date ? e.completedAt : new Date(e.completedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
      return key === selectedDate;
    }).length;
    return Array.from({ length: count }).map((_, i) => ({
      id: `${selectedDate}-${i}`,
      title: `Item for ${selectedDate} #${i + 1}`,
    }));
  }, [selectedDate]);


  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <FlatList
        data={itemsForDate}
        keyExtractor={(it) => it.id}
        ListHeaderComponent={
          <ContributionGrid
            data={demoData}
            selectedDate={selectedDate}
            onDatePress={(d) => setSelectedDate(d)} /** when a valid day is tapped, the selected date is set */
            containerStyle={{ padding: 16 }}
          />
        }
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Tap a date to view its items.</Text>}
      />
    </SafeAreaView>
  );
}
