import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ContributionGrid } from 'react-native-contribution-grid'
import { demoData } from '../_data'


export default function CustomSquare() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <ContributionGrid
          data={demoData}
          containerStyle={{ padding: 16 }}
          levelColors={{  /** Needed for color indicator colors */
            padding: 'transparent',
            empty: 'grey',
            level1: '#0000FF36',
            level2: '#0000FF72',
            level3: '#0000FFAA',
            level4: '#0000FFFF',
            selectedBorder: '#0000FFFF',
          }}
          renderSquare={({ level, isSelected, onPress, size }) => ( /** Create a custom square for the grid */
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
              <View
                style={{
                  width: size,
                  height: size,
                  borderRadius: 4,
                  backgroundColor: level === -1 ? 'transparent' : ['grey', '#0000FF36', '#0000FF72', '#0000FFAA', '#0000FFFF'][level],
                  borderWidth: isSelected ? 2 : 0,
                  borderColor: isSelected ? 'black': 'transparent',
                }}
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  )
}


