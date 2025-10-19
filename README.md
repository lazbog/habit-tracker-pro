# Habit Tracker Pro

A modern habit tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your daily habits, monitor your progress, and build better routines.

## Features

- 📝 Create and manage daily habits
- ✅ Mark habits as complete with a single click
- 📊 Visual progress tracking with streaks and completion rates
- 📈 Statistics dashboard with charts and analytics
- 🎨 Customizable habit icons and colors
- 💾 Local storage for data persistence
- 📱 Responsive design for all devices

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

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Chart library for statistics
- **date-fns** - Date manipulation utilities

## Project Structure

```
habit-tracker-pro/
├── app/
│   ├── api/
│   │   ├── habits/          # API routes for habit management
│   │   └── ping/            # Health check endpoint
│   ├── statistics/          # Statistics page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/
│   │   └── button.tsx       # Reusable button component
│   ├── habit-card.tsx       # Habit display card
│   └── habit-form.tsx       # Habit creation/editing form
├── lib/
│   ├── context.tsx          # React context for state management
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## Usage

1. **Creating Habits**: Click the "Add Habit" button to create a new habit with a name, description, icon, color, and target streak.

2. **Tracking Progress**: Mark habits as complete daily to build streaks. Your progress is automatically saved.

3. **Viewing Statistics**: Navigate to the Statistics page to see your progress over time, completion rates, and top-performing habits.

4. **Managing Habits**: Edit or delete habits using the action buttons on each habit card.

## Data Persistence

The application uses browser's localStorage to persist your habit data. All your habits and progress are saved locally and will be available when you return to the app.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.