import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Habit Tracker Pro',
  description: 'Track your daily habits and build consistency',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}