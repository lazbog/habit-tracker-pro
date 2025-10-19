# Habit Tracker Pro

A simple and effective habit tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your daily habits, monitor your progress, and build consistency with visual statistics and calendar views.

## Features

- ✅ Daily habit tracking with simple check/uncheck interface
- 📊 Visual statistics and progress tracking
- 📅 Calendar view to visualize habit completion over time
- 🔥 Streak tracking for each habit
- 📈 Weekly and monthly progress charts
- 🎨 Customizable habit colors
- 📱 Responsive design for all devices
- 💾 Local storage for data persistence

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Create Habits**: Click "Add New Habit" to create habits you want to track
2. **Track Daily**: Check off completed habits each day
3. **View Statistics**: Visit the Statistics page to see your progress, streaks, and completion charts
4. **Calendar View**: Use the calendar to see your habit completion patterns over time

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Chart library for statistics

## Project Structure

```
├── app/
│   ├── api/ping/          # Health check endpoint
│   ├── statistics/        # Statistics page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── Calendar.tsx       # Calendar component
│   ├── HabitForm.tsx      # Form for creating/editing habits
│   └── HabitList.tsx      # List of habits for today
├── lib/
│   ├── habits.ts          # Core habit management logic
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Data Storage

This application uses browser's localStorage to persist data locally. All your habits and completion records are stored on your device and are not sent to any server.

## License

MIT License - feel free to use this project for personal or commercial use.