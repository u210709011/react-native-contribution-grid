# react-native-contribution-grid

Customizable GitHub-like contribution grid for React Native.

## Install

```bash
npm install react-native-contribution-grid
```

## Features

- Adjustable square size and spacing
- Customizable level colors (legend follows automatically)
- Optional header with year navigation
- Month/day label styling hooks
- Render props for header, legend, squares, and labels

## Props (overview)

- data: array of { completedAt: Date | string }
- squareSize, squareSpacing, columnMinWidth
- levelThresholds, levelColors
- showHeader, showLegend
- onDatePress, selectedDate
- headerTextStyle, headerButtonStyle, headerButtonTextStyle
- labelTextStyle, monthLabelTextStyle, dayLabelTextStyle
- renderHeader, renderLegend, renderSquare, renderMonthLabel, renderDayLabel

## Example app

See the `example/` directory for minimal, focused screens demonstrating each feature.

## License

MIT
