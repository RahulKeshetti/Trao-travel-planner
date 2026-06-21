# Trao — AI Travel Planner

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

## Running it

```bash
npm install
cp .env.example .env
npm run dev
```
**🚀 Live Demo: [https://rahulkeshetti.netlify.app/](https://rahulkeshetti.netlify.app/)**

### Demo login credentials

| Name | Email | Password |
|---|---|---|
| rahul | `rahul@gmail.com` | `demo1234` |


Each comes with its own pre-generated trip, making it easy to see that one
account's data stays separate from another's.

## Design direction

The brief is a travel itinerary tool, so the UI leans into a travelogue /
boarding-pass motif rather than a generic dashboard: itinerary days render as
ticket stubs with a stamped day number and a perforated divider, the budget
renders like a paper receipt with dotted leaders, and hotel picks get a
luggage-tag treatment. Type pairs a serif display face (Fraunces) with a
plain sans body (Work Sans) and a monospace face (IBM Plex Mono) reserved for
anything that reads like printed data — prices, day stamps, ratings.

## Custom feature: drag-and-drop itinerary reordering

Beyond add / remove / regenerate-a-day, users can drag any activity by its
handle to reorder it within a day or move it to a different day entirely,
built with native HTML5 drag-and-drop — no extra library needed.

The reasoning: regenerating a whole day to fix activity order is a heavy
hammer for a problem that's usually "I just want this before that." Letting
people drag activities directly solves it without spending an AI call, keeps
the itinerary feeling like the user's to arrange, and applies optimistically
in the UI so it never feels laggy.
