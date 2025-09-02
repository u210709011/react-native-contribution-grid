const today = new Date()

// Generate last 90 days with 1-8 entries per day
export const demoData = Array.from({ length: 90 }).flatMap((_, i) => {
  const dayDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
  const count = (i % 8) + 1 
  return Array.from({ length: count }).map(() => ({ completedAt: dayDate }))
})

export default demoData;


