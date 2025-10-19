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
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-xl font-semibold text-gray-900">Habit Tracker Pro</h1>
                <nav className="flex space-x-8">
                  <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                  <a href="/stats" className="text-gray-600 hover:text-gray-900">Statistics</a>
                </nav>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}