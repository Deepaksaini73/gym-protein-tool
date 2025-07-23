import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitNutrition - Smart Nutrition Tracking",
  description: "Track your nutrition, plan meals, and achieve your fitness goals with AI-powered insights",
  generator: 'dev',
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "32x32",
      },
      {
        url: "/icon.png",
        sizes: "192x192",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    title: "FitNutrition - Smart Nutrition Tracking",
    description: "Track your nutrition, plan meals, and achieve your fitness goals with AI-powered insights",
    url: "https://gym-protein-tool.vercel.app/",
    siteName: "FitNutrition",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "FitNutrition App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitNutrition - Smart Nutrition Tracking",
    description: "Track your nutrition, plan meals, and achieve your fitness goals with AI-powered insights",
    images: ["/opengraph-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
           {/* <Toaster /> */}
          <BottomNavigation />
        </AuthProvider>
      </body>
    </html>
  )
}
