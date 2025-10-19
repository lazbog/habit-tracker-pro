# Habit Tracker Pro

A modern habit tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your daily habits, monitor your progress, and build better routines with visual statistics and insights.

## Features

- ✅ Create, edit, and delete habits
- 📅 Mark habits as complete for each day
- 📊 Visual statistics and progress charts
- 🎨 Color-coded habits for easy organization
- 📱 Responsive design for all devices
- 💾 Local storage for data persistence
- 📈 30-day completion rate tracking
- 📊 Weekly activity visualization

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization library

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

1. **Add Habits**: Click "Add New Habit" to create a new habit with a name, description, and color
2. **Track Progress**: Mark habits as complete each day using the checkmark button
3. **View Statistics**: Navigate to the Stats page to see your progress charts and completion rates
4. **Manage Habits**: Edit or delete habits using the action buttons

## Data Storage

All data is stored locally in your browser's localStorage. No data is sent to external servers, ensuring your privacy.

## Project Structure

```
├── app/
│   ├── api/ping/          # Health check endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── stats/
│       └── page.tsx       # Statistics page
├── components/
│   ├── HabitForm.tsx      # Habit creation/editing form
│   ├── HabitList.tsx      # List of habits
│   └── StatsChart.tsx     # Statistics visualization
├── lib/
│   ├── HabitContext.tsx   # React context for state management
│   └── types.ts           # TypeScript type definitions
└── public/                # Static assets
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License