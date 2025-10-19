# Habit Tracker Pro

A modern habit tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your daily habits, monitor your progress, and build consistency with an intuitive interface.

## Features

- **Habit Management**: Create, edit, and delete habits with categories and colors
- **Daily Tracking**: Mark habits as complete for any date
- **Progress Visualization**: View statistics and charts showing your habit completion rates
- **Streak Tracking**: Monitor consecutive days of habit completion
- **Category Organization**: Group habits by categories (Health, Fitness, Learning, etc.)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: All data is stored locally in your browser

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

1. **Create Habits**: Click "Add New Habit" to create your first habit. Give it a name, description, category, color, and target days.

2. **Track Daily**: Use the date picker to select any day and mark your habits as complete by clicking the circle next to each habit.

3. **View Statistics**: Navigate to the Stats page to see:
   - Daily completion rates over time
   - Performance by category
   - Overall statistics and trends
   - Detailed habit information

4. **Manage Habits**: Edit habit names or delete habits using the action buttons next to each habit.

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Recharts**: Data visualization library
- **Local Storage**: Client-side data persistence

## Project Structure

```
habit-tracker-pro/
├── app/
│   ├── api/ping/          # Health check endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard
│   └── stats/page.tsx     # Statistics page
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── habit-form.tsx     # Habit creation form
│   └── habit-list.tsx     # List of habits
├── lib/
│   ├── storage.ts         # Local storage abstraction
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Data Storage

All habit data is stored locally in your browser's localStorage. This means:
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

This project is open source and available under the [MIT License](LICENSE).