# PrepperApp

A frontend (React) emergency preparedness tracker that helps households manage their survival supplies inspired by MSB guidelines.

## What It Does

PrepperApp lets users track their household's emergency preparedness across different categories: Water, Food, Medical, Communication, Gear, Energy, and Skills. Based on the number of adults, children, and pets in the household, the app calculates target supply quantities (defaulting to a 3-week supply) and scores the user's current preparedness level from 0–100%.

## Features

- **Dashboard** — Overview of overall score, tier, and per-category breakdown
- **Household** — Configure household members, dietary restrictions, and allergies
- **Inventory** — Add, edit, and delete supply items with optional expiry tracking
- **Shopping List** — Auto-generated list based on supply gaps
- **Suggestions** — Filtered item recommendations based on household profile
- **Achievements** — Milestone badges tied to preparedness progress
- **History** — Score tracking over time

## Tech Stack

- React 19 + TypeScript (Vite)
- React Router v7
- Bootstrap 5 + Bootstrap Icons
- `localStorage` for persistence (no backend)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start by configuring your household.

## Project Structure

```
src/
├── contexts/       # React contexts (Household, Inventory, Score, Achievements, Shopping)
├── pages/          # One component per route
├── utils/          # Scoring logic, shopping list generation, storage helpers, suggestion filtering
├── data/           # Static suggestion items
└── types/          # Shared TypeScript types
```
