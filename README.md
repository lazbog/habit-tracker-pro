# Habit Tracker Pro

A modern habit tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your daily habits, monitor your progress, and build better routines with comprehensive statistics and visualizations.

## Features

- 📝 Create and manage daily habits with custom icons and colors
- ✅ Mark habits as complete for any date
- 📊 View detailed statistics and completion trends
- 🔥 Track streaks and overall progress
- 📈 Visual charts showing habit performance over time
- 📱 Responsive design that works on all devices
- 💾 Local storage for data persistence

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add Habits**: Click "Add Habit" to create new habits with custom names, descriptions, icons, and colors.
2. **Track Progress**: Mark habits as complete for the current day or any past date.
3. **View Statistics**: Switch to the Statistics tab to see your progress, streaks, and completion trends.
4. **Monitor Trends**: Use the time range selector to view your progress over different periods.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation utilities

## Project Structure

```
habit-tracker-pro/
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
│   ├── HabitForm.tsx
│   ├── HabitList.tsx
│   └── StatsView.tsx
├── lib/             # Utilities and types
│   ├── habits.ts    # Habit management logic
│   └── types.ts     # TypeScript definitions
└── public/          # Static assets
```

## Data Storage

This application uses localStorage to store habit data locally in your browser. No server or database is required.

## Contributing

Feel free to submit issues and enhancement requests!