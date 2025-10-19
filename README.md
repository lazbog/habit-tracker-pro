# Habit Tracker Pro

A modern habit tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your daily habits, monitor your progress, and build consistency with an intuitive interface.

## Features

- 📅 **Calendar View**: Visual calendar showing habit completion history
- ✅ **Daily Tracking**: Check off habits as you complete them each day
- 📊 **Statistics Dashboard**: Track streaks, completion rates, and weekly averages
- 🎨 **Customizable Habits**: Create habits with custom colors, descriptions, and target goals
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💾 **Local Storage**: All data is stored locally in your browser

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

1. **Create a Habit**: Click the "New Habit" button to add a new habit with a name, description, target days, and color
2. **Track Daily**: Use the checkboxes to mark habits as complete for the selected day
3. **View Calendar**: Navigate through the calendar to see your completion history
4. **Monitor Progress**: Check the statistics dashboard for streaks and completion percentages
5. **Edit/Delete**: Use the edit and delete buttons to manage your habits

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **date-fns**: Date manipulation utilities

## Project Structure

```
habit-tracker-pro/
├── app/
│   ├── api/ping/
│   │   └── route.ts          # Health check endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── HabitCalendar.tsx     # Calendar component
│   ├── HabitForm.tsx         # Habit creation/editing form
│   ├── HabitList.tsx         # List of habits for selected day
│   └── HabitStats.tsx        # Statistics dashboard
├── lib/
│   ├── habits.ts             # Habit management logic
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Data Storage

All habit data is stored locally in the browser's localStorage. This means:
- Your data stays private and on your device
- No internet connection required after initial load
- Data persists between sessions
- Clearing browser data will remove all habits

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.