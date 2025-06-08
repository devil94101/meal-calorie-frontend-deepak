# Meal Calorie Tracker

A modern web application to track your daily meals and calories.

[Live Demo](https://meal-calorie-frontend-deepak-8ir4-kltvw5ff3.vercel.app/)

## Tech Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **API Integration**: USDA FoodData Central API
- **Data Persistence**: Local Storage
- **Testing**: Jest + React Testing Library
- **Containerization**: Docker

## Features

- Track daily meals and calories
- Search USDA FoodData Central database
- View meal history and statistics
- Dark mode support
- Responsive design
- Offline support

## Screenshots

### Dashboard
![Dashboard View](public/screenshots/dashboard.png)
![Dashboard Dark Mode](public/screenshots/dashboard-dark.png)

### Meal History
![Meal History](public/screenshots/meal.png)
![Meal History Dark Mode](public/screenshots/meal-dark.png)

### Add Meal
![Add Meal Form](public/screenshots/add-meal.png)
![Add Meal API Response](public/screenshots/add-meal-api.png)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

Run the test suite:
```bash
npm test
```

## Building for Production

```bash
npm run build
npm start
```

