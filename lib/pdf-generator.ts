import jsPDF from 'jspdf'

interface PDFColors {
  emerald: { light: string; dark: string }
  blue: { light: string; dark: string }
  cyan: { light: string; dark: string }
  orange: { light: string; dark: string }
  gray: { light: string; dark: string }
}

const colors: PDFColors = {
  emerald: { light: '#10B981', dark: '#059669' },
  blue: { light: '#60A5FA', dark: '#3B82F6' },
  cyan: { light: '#22D3EE', dark: '#06B6D4' },
  orange: { light: '#FB923C', dark: '#F97316' },
  gray: { light: '#9CA3AF', dark: '#4B5563' }
}

const addHeader = (doc: jsPDF, title: string, period: string) => {
  // Add logo or brand element
  doc.setFillColor('#10B981')
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F')
  
  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' })
  
  // Period
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(period, doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' })
}

const addSummarySection = (doc: jsPDF, summary: any, yStart: number) => {
  doc.setFillColor('#F3F4F6')
  doc.roundedRect(20, yStart, doc.internal.pageSize.getWidth() - 40, 60, 3, 3, 'F')
  
  doc.setTextColor(colors.gray.dark)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 30, yStart + 15)
  
  // Create summary grid
  const metrics = [
    { label: 'Avg Calories', value: `${summary.avgCalories}`, color: colors.emerald },
    { label: 'Avg Protein', value: `${summary.avgProtein}g`, color: colors.blue },
    { label: 'Avg Water', value: `${summary.avgWater}ml`, color: colors.cyan }
  ]
  
  metrics.forEach((metric, index) => {
    const x = 30 + (index * ((doc.internal.pageSize.getWidth() - 60) / 3))
    doc.setTextColor(metric.color.dark)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(metric.value, x, yStart + 35)
    
    doc.setTextColor(colors.gray.light)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(metric.label, x, yStart + 45)
  })
}

const addProgressBars = (doc: jsPDF, data: any, yStart: number) => {
  const barWidth = doc.internal.pageSize.getWidth() - 60
  const barHeight = 8
  
  // Background
  doc.setFillColor('#E5E7EB')
  doc.roundedRect(30, yStart, barWidth, barHeight, 2, 2, 'F')
  
  // Progress
  doc.setFillColor(colors.emerald.light)
  const progress = Math.min(data.progress, 100)
  doc.roundedRect(30, yStart, (barWidth * progress) / 100, barHeight, 2, 2, 'F')
}

const addFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setTextColor(colors.gray.light)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  const today = new Date().toLocaleDateString()
  doc.text(
    `Generated on ${today} | Fitness & Nutrition Tracker`,
    doc.internal.pageSize.getWidth() / 2,
    pageHeight - 10,
    { align: 'center' }
  )
}

export const generatePDF = (data: any, profile: any) => {
  const doc = new jsPDF()
  
  // Add header
  addHeader(doc, 'Nutrition Report', data.period)
  
  // Add summary section
  addSummarySection(doc, data.summary, 50)
  
  let yPosition = 120
  
  if (data.dailyBreakdown) {
    // Weekly Report
    doc.setTextColor(colors.gray.dark)
    doc.setFontSize(16)
    doc.text('Daily Progress', 20, yPosition)
    yPosition += 20
    
    data.dailyBreakdown.forEach((day: any) => {
      doc.setFillColor('#F9FAFB')
      doc.roundedRect(20, yPosition, doc.internal.pageSize.getWidth() - 40, 30, 3, 3, 'F')
      
      doc.setTextColor(colors.gray.dark)
      doc.setFontSize(12)
      doc.text(day.day, 30, yPosition + 12)
      
      // Add progress bars for each metric
      addProgressBars(doc, {
        progress: (day.calories / profile.daily_calorie_goal) * 100
      }, yPosition + 20)
      
      yPosition += 40
    })
  } else {
    // Monthly Report
    doc.setTextColor(colors.gray.dark)
    doc.setFontSize(16)
    doc.text('Monthly Overview', 20, yPosition)
    yPosition += 20
    
    // Add monthly highlights
    const highlights = [
      { label: 'Best Week', value: data.summary.bestWeek, color: colors.emerald },
      { label: 'Longest Streak', value: `${data.summary.streakRecord} days`, color: colors.blue },
      { label: 'Days Logged', value: `${data.summary.daysCompleted}/31`, color: colors.orange }
    ]
    
    highlights.forEach((highlight, index) => {
      const x = 20 + (index * ((doc.internal.pageSize.getWidth() - 40) / 3))
      
      doc.setFillColor('#F9FAFB')
      doc.roundedRect(x, yPosition, 50, 40, 3, 3, 'F')
      
      doc.setTextColor(highlight.color.dark)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(highlight.value, x + 25, yPosition + 20, { align: 'center' })
      
      doc.setTextColor(colors.gray.light)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(highlight.label, x + 25, yPosition + 30, { align: 'center' })
    })
  }
  
  // Add footer
  addFooter(doc)
  
  // Save the PDF
  const fileName = `nutrition-report-${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`
  doc.save(fileName)
  return fileName
}