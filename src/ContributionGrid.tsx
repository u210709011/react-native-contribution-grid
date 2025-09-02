import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native'

export type ContributionEntry = {
  completedAt: Date | string
}

export type ContributionGridProps = {
  data: ContributionEntry[]
  onDatePress?: (date: string) => void
  selectedDate?: string
  containerStyle?: ViewStyle
  headerTextStyle?: TextStyle
  labelTextStyle?: TextStyle
  monthLabelTextStyle?: TextStyle
  dayLabelTextStyle?: TextStyle
  headerButtonStyle?: ViewStyle
  headerButtonTextStyle?: TextStyle
  squareSize?: number
  squareSpacing?: number
  columnMinWidth?: number
  showHeader?: boolean
  showLegend?: boolean
  levelThresholds?: [number, number, number, number]
  levelColors?: {
    padding: string
    empty: string
    level1: string
    level2: string
    level3: string
    level4: string
    selectedBorder?: string
  }
  renderHeader?: (params: { year: number; goPrev: () => void; goNext: () => void; isNextDisabled: boolean }) => React.ReactNode
  renderLegend?: (getColorForLevel: (level: number) => string) => React.ReactNode
  renderSquare?: (params: { date: string; level: number; count: number; isSelected: boolean; size: number; spacing: number; onPress?: () => void }) => React.ReactNode
  renderMonthLabel?: (label: string, index: number) => React.ReactNode
  renderDayLabel?: (label: string, index: number) => React.ReactNode
}

const DEFAULT_LEVEL_COLORS = {
  padding: 'transparent',
  empty: '#e5e7eb',
  level1: '#E6F4EA',
  level2: '#CDEAD6',
  level3: '#A5D6B2',
  level4: '#7DC28E',
  selectedBorder: '#7C3AED',
}

const DEFAULT_LEVEL_THRESHOLDS: [number, number, number, number] = [1, 2, 4, 6]

export const ContributionGrid: React.FC<ContributionGridProps> = ({
  data,
  onDatePress,
  selectedDate,
  containerStyle,
  headerTextStyle,
  labelTextStyle,
  monthLabelTextStyle,
  dayLabelTextStyle,
  headerButtonStyle,
  headerButtonTextStyle,
  squareSize = 11,
  squareSpacing = 3,
  columnMinWidth,
  showHeader = true,
  showLegend = true,
  levelThresholds = DEFAULT_LEVEL_THRESHOLDS,
  levelColors = DEFAULT_LEVEL_COLORS,
  renderHeader,
  renderLegend,
  renderSquare,
  renderMonthLabel,
  renderDayLabel,
}) => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const scrollViewRef = useRef<ScrollView>(null)

  const completionMap = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((item) => {
      if (!item || !item.completedAt) return
      const date = item.completedAt instanceof Date ? item.completedAt : new Date(item.completedAt)
      const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')}`
      map.set(localDateStr, (map.get(localDateStr) || 0) + 1)
    })
    return map
  }, [data])

  const gridData = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const isCurrentYear = currentYear === today.getFullYear()

    const todayLocalStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate(),
    ).padStart(2, '0')}`

    const startOfYear = new Date(currentYear, 0, 1)
    const startDate = new Date(startOfYear)
    const dayOfWeek = startDate.getDay() // 0 Sun - 6 Sat
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Monday-first
    startDate.setDate(startDate.getDate() - daysToSubtract)

    let endDate: Date
    if (isCurrentYear) {
      endDate = new Date(today)
      const todayDayOfWeek = endDate.getDay()
      const daysToSunday = todayDayOfWeek === 0 ? 0 : 7 - todayDayOfWeek
      endDate.setDate(endDate.getDate() + daysToSunday)
    } else {
      const endOfYear = new Date(currentYear, 11, 31)
      endDate = new Date(endOfYear)
      const endDayOfWeek = endDate.getDay()
      const daysToSunday = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek
      endDate.setDate(endDate.getDate() + daysToSunday)
    }

    type DayInfo = { date: Date; dateString: string; level: number; count: number }
    const out: DayInfo[] = []

    const current = new Date(startDate)
    while (current <= endDate) {
      const currentLocalStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(
        current.getDate(),
      ).padStart(2, '0')}`
      const count = completionMap.get(currentLocalStr) || 0
      const isFutureDate = isCurrentYear && currentLocalStr > todayLocalStr
      const isOutsideYear = current.getFullYear() !== currentYear

      let level = 0
      const [t1, t2, t3, t4] = levelThresholds
      if (count >= t1) level = 1
      if (count >= t2) level = 2
      if (count >= t3) level = 3
      if (count >= t4) level = 4

      if (isFutureDate) {
        current.setDate(current.getDate() + 1)
        continue
      }
      if (isOutsideYear) {
        level = -1
      }

      out.push({ date: new Date(current), dateString: currentLocalStr, level, count })
      current.setDate(current.getDate() + 1)
    }

    return out
  }, [completionMap, currentYear, levelThresholds])

  const weeks = useMemo(() => {
    const numberOfWeeks = Math.ceil(gridData.length / 7)
    const list: typeof gridData[] = []
    for (let i = 0; i < numberOfWeeks; i++) list.push(gridData.slice(i * 7, (i + 1) * 7))
    return list
  }, [gridData])

  const getColorForLevel = (level: number): string => {
    switch (level) {
      case -1:
        return levelColors.padding
      case 0:
        return levelColors.empty
      case 1:
        return levelColors.level1
      case 2:
        return levelColors.level2
      case 3:
        return levelColors.level3
      case 4:
        return levelColors.level4
      default:
        return levelColors.empty
    }
  }

  const navigateYear = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1
    const currentRealYear = new Date().getFullYear()
    if (newYear <= currentRealYear) setCurrentYear(newYear)
  }

  const monthLabels = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    [],
  )

  // removed streak and stats by request

  useEffect(() => {
    const timer = setTimeout(() => {
      const isCurrent = currentYear === new Date().getFullYear()
      if (isCurrent) {
        const today = new Date()
        const startOfYear = new Date(currentYear, 0, 1)
        const dayOfWeek = startOfYear.getDay()
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        const gridStartDate = new Date(startOfYear)
        gridStartDate.setDate(gridStartDate.getDate() - daysToSubtract)
        const daysSinceStart = Math.floor((today.getTime() - gridStartDate.getTime()) / (1000 * 60 * 60 * 24))
        const weeksSinceStart = Math.floor(daysSinceStart / 7)
        const weekWidth = squareSize + squareSpacing
        const scrollPosition = Math.max(0, (weeksSinceStart - 10) * weekWidth)
        scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true })
      } else {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    }, 120)
    return () => clearTimeout(timer)
  }, [currentYear, squareSize, squareSpacing])

  const totalWeeks = weeks.length
  const columnWidth = squareSize
  const columnGap = squareSpacing
  const gridWidth = Math.max(0, totalWeeks * columnWidth + Math.max(0, totalWeeks - 1) * columnGap)
  const leftLabelColumnWidth = 16

  // Compute month start indices (week index where a new month begins)
  const monthStarts = useMemo(() => {
    const starts: Array<{ label: string; weekIndex: number }> = []
    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w]
      if (!week || week.length === 0) continue
      const firstRealDay = week.find((d) => d.level !== -1) || week[0]
      const month = new Date(firstRealDay.date).getMonth()
      // Only push when it's the first week for that month or if previous week had a different month
      if (w === 0) {
        starts.push({ label: monthLabels[month], weekIndex: w })
      } else {
        const prevWeek = weeks[w - 1]
        const prevFirstDay = prevWeek.find((d) => d.level !== -1) || prevWeek[0]
        const prevMonth = new Date(prevFirstDay.date).getMonth()
        if (prevMonth !== month) starts.push({ label: monthLabels[month], weekIndex: w })
      }
    }
    return starts
  }, [weeks, monthLabels])

  return (
    <View style={[styles.container, containerStyle]}>
      {showHeader && (
        <View style={{ marginBottom: 16 }}>
          {renderHeader ? (
            renderHeader({
              year: currentYear,
              goPrev: () => navigateYear('prev'),
              goNext: () => navigateYear('next'),
              isNextDisabled: currentYear >= new Date().getFullYear(),
            })
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => navigateYear('prev')} activeOpacity={0.7} style={[styles.yearButtonBase, headerButtonStyle]}>
                <Text style={[styles.yearChevron, headerButtonTextStyle]}>‹</Text>
              </TouchableOpacity>
              <Text style={[styles.yearText, headerTextStyle]}>{currentYear}</Text>
              <TouchableOpacity
                onPress={() => navigateYear('next')}
                activeOpacity={0.7}
                disabled={currentYear >= new Date().getFullYear()}
                style={[styles.yearButtonBase, headerButtonStyle]}
              >
                <Text style={[styles.yearChevron, headerButtonTextStyle, currentYear >= new Date().getFullYear() && { opacity: 0.5 }]}>›</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
        contentContainerStyle={undefined}
      >
        <View style={{ width: columnMinWidth ? Math.max(columnMinWidth, gridWidth + leftLabelColumnWidth + 8) : gridWidth + leftLabelColumnWidth + 8 }}>
          <View style={{ position: 'relative', height: 16, marginBottom: 8, marginLeft: leftLabelColumnWidth }}>
            {/* Month labels aligned to week columns */}
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 16 }}>
              {monthStarts.map((m, idx) => {
                const x = m.weekIndex * (columnWidth + columnGap)
                return renderMonthLabel ? (
                  <View key={`m-${idx}`} style={{ position: 'absolute', left: x }}>
                    {renderMonthLabel(m.label, idx)}
                  </View>
                ) : (
                  <Text key={`m-${idx}`} style={[styles.monthLabel, labelTextStyle, monthLabelTextStyle, { position: 'absolute', left: x }]}>
                    {m.label}
                  </Text>
                )
              })}
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: leftLabelColumnWidth, justifyContent: 'space-between', paddingTop: 2, height: squareSize * 7 + squareSpacing * 6 }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                renderDayLabel ? (
                  <React.Fragment key={`${d}-${i}`}>{renderDayLabel(d, i)}</React.Fragment>
                ) : (
                  <Text key={`day-${d}-${i}`} style={[styles.dayLabel, labelTextStyle, dayLabelTextStyle]}>
                    {d}
                  </Text>
                )
              ))}
            </View>

            <View style={{ flexDirection: 'row', marginLeft: 4 }}>
              {weeks.map((week, weekIndex) => (
                <View key={`w-${weekIndex}`} style={{ width: squareSize, marginRight: weekIndex < weeks.length - 1 ? squareSpacing : 0 }}>
                  {week.map((day, dayIndex) => {
                    const isSelected = selectedDate === day.dateString
                    const isPaddingDay = day.level === -1
                    const defaultSquare = (
                      <TouchableOpacity
                        key={`${day.dateString}-${dayIndex}`}
                        onPress={() => !isPaddingDay && onDatePress?.(day.dateString)}
                        activeOpacity={isPaddingDay ? 1 : 0.7}
                        disabled={isPaddingDay}
                        style={{ width: squareSize, height: squareSize, marginBottom: dayIndex < 6 ? squareSpacing : 0 }}
                      >
                        <View
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 2,
                            backgroundColor: getColorForLevel(day.level),
                            borderWidth: isSelected ? 1 : 0,
                            borderColor: isSelected ? levelColors.selectedBorder || DEFAULT_LEVEL_COLORS.selectedBorder : 'transparent',
                          }}
                        />
                      </TouchableOpacity>
                    )
                    if (renderSquare) {
                      return (
                        <View key={`${day.dateString}-${dayIndex}`} style={{ width: squareSize, height: squareSize, marginBottom: dayIndex < 6 ? squareSpacing : 0 }}>
                          {renderSquare({
                            date: day.dateString,
                            level: day.level,
                            count: day.count,
                            isSelected,
                            size: squareSize,
                            spacing: squareSpacing,
                            onPress: !isPaddingDay ? () => onDatePress?.(day.dateString) : undefined,
                          })}
                        </View>
                      )
                    }
                    return defaultSquare
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {showLegend && (
        renderLegend ? (
          <>{renderLegend(getColorForLevel)}</>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 12 }}>
            <Text style={[styles.legendText, labelTextStyle]}>Less</Text>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <View key={`legend-${lvl}`} style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: getColorForLevel(lvl) }} />
            ))}
            <Text style={[styles.legendText, labelTextStyle]}>More</Text>
          </View>
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
  },
  yearButtonBase: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  yearText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  yearChevron: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statText: {
    fontSize: 11,
    color: '#6b7280',
  },
  monthLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  dayLabel: {
    fontSize: 9,
    height: 12,
    lineHeight: 12,
    textAlign: 'center',
    color: '#6b7280',
  },
  legendText: {
    fontSize: 9,
    color: '#6b7280',
  },
})

export default ContributionGrid