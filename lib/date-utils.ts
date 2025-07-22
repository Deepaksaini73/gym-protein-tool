// Helper functions for India timezone dates
export const getIndiaTime = () => {
  return new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
}

export const getIndiaDate = () => {
  return new Date(getIndiaTime()).toISOString().slice(0, 10)
}

export const formatIndiaTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getIndiaWeekDates = () => {
  const today = new Date(getIndiaTime())
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1)
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      .toISOString()
      .slice(0, 10)
  })
}

export const getIndiaMonthDates = () => {
  const today = new Date(getIndiaTime())
  const monthAgo = new Date(today)
  monthAgo.setDate(today.getDate() - 30)
  
  return {
    start: monthAgo.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10)
  }
}