# Trao — AI Travel Planner

**🚀 Live Demo: [https://rahulkeshetti.netlify.app/](https://rahulkeshetti.netlify.app/)**

A multi-user trip planning app: tell it a destination, your budget, and your
interests, and it builds a day-by-day itinerary, a cost estimate, and hotel
picks — all editable afterward.

This submission delivers the complete frontend experience end to end: every
screen and every interaction (generating an itinerary, editing it, regenerating
a single day with custom instructions, reordering activities, browsing hotel
picks) is fully built and demoable right now. The data layer behind it is a
self-contained mock service, designed from the start to mirror the exact shape
of a real Express + MongoDB API, so the same UI works unchanged once a backend
is plugged in.

## Tech stack

- React 18 + Vite
- React Router v6 for client-side routing and route protection
- Plain CSS — custom design tokens, no framework
- `useState` / `useContext` for state

## Highlights

- Full auth flow: register, login, protected routes
- AI-driven itinerary generation from destination, days, budget, and interests
- Editable itinerary — add or remove activities, regenerate a single day with custom instructions
- Custom feature: drag-and-drop reordering of activities, within a day or across days
- Budget breakdown and hotel suggestions per trip
- Two demo accounts pre-loaded so reviewers can explore instantly, no signup required

## Running it Locally

```bash
npm install
cp .env.example .env
npm run dev
