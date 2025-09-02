import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Text } from 'react-native'
import { ContributionGrid } from 'react-native-contribution-grid'
import { demoData } from '../_data'

export default function Thresholds() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ContributionGrid data={demoData} levelThresholds={[1, 3, 5, 7]} containerStyle={{ padding: 16 }} />
      </ScrollView>
    </SafeAreaView>
  )
}


