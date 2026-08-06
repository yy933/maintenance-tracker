# Maintenance Tracker

Maintenance Tracker is a React + Vite web app for managing repair and maintenance requests. It gives users a simple way to submit, view, and manage tickets, while admins can oversee the full system from a central dashboard.

## Live Demo
For live demo, click [here](https://maintenance-tracker-pearl.vercel.app/).

Log in with the test account below or create your own account:
 - email: user@example.com
 - password: user123

## What this app does

- Let users sign in or create an account
- Provides a personal dashboard for managing repair tickets
- Supports creating, editing, and deleting tickets
- Gives admins a system-wide overview of all tickets
- Uses Supabase Realtime so ticket updates appear quickly
- Includes a responsive UI with a modern dashboard layout

## Tech stack

- React 19 with Vite
- React Router for navigation
- Supabase Auth, Postgres, and Realtime
- Tailwind CSS and shadcn-style UI components
- Playwright for end-to-end testing

## Project structure

- src/components: page and UI components
- src/context: authentication context
- src/hooks: reusable custom hooks
- src/supabase: Supabase client and database setup SQL
- e2e: Playwright end-to-end tests

## Getting started

### 1. Prerequisites

Make sure you have:

- Node.js 18 or newer
- npm
- A Supabase project

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env file in the project root and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-publishable-key
```

### 4. Set up the database

In your Supabase SQL editor, run the SQL from src/supabase/setup.sql. This creates:

- user_profiles
- repair_tickets
- row-level security policies
- basic triggers for updated timestamps

### 5. Run the app locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Available scripts

```bash
npm run dev      # start the development server
npm run build    # create a production build
npm run lint     # run ESLint
npm run preview  # preview the production build
npx playwright test  # run end-to-end tests
```

## Notes on authentication and access

The app uses role-based access for tickets:

- Regular users can view and manage their own tickets
- Admins can view all tickets and manage them across the system

The database schema and access rules are defined in src/supabase/setup.sql.

## Testing

End-to-end tests live in the e2e folder and cover key workflows such as authentication and security rules. Run them with:

```bash
npx playwright test
```
