# Trao — AI Travel Planner

This is the **frontend only**, built per your request, for the AI Travel
Planner assessment. It's a React + Vite app styled with CSS.

 and is fully demoable on its own using a mock data
layer — open it and click through registration, trip generation, editing,
and hotel suggestions without any backend running.

## Tech stack

- React 18 + Vite
- React Router v6 for client-side routing and route protection
- No state library — `useState`/`useContext` are enough at this scope

## Running it

```bash
npm install
cp .env.example .env
npm run dev
```

Opens at `http://localhost:5173`. By default `VITE_USE_MOCK=true`, so the
whole flow (register → log in → generate itinerary → edit → regenerate a
day → reorder by drag-and-drop → hotel suggestions) runs against
`localStorage`, with no backend required.

### Demo login credentials

Two accounts are seeded automatically on first load — click either one's
name on the login screen to autofill the form, or type them manually:

| Name | Email | Password |
|---|---|---|
| Asha Kapoor | `demo1@trao.app` | `demo1234` |
| Leo Tanaka | `demo2@trao.app` | `demo1234` |

Each comes with its own pre-generated trip, so you can log in as one,
confirm you only see that account's trip, log out, log in as the other,
and show the same thing — a quick way to demonstrate data isolation in
the walkthrough video without recording yourself filling out forms twice.

## Wiring up a real backend

Every function in `src/services/api.js` already calls the REST shape this
assessment describes (e.g. `POST /api/trips/generate`,
`POST /api/trips/:id/days/:dayNumber/regenerate`). To connect a real
Express + LLM backend:

1. Set `VITE_API_BASE_URL` to your API's base URL in `.env`.
2. Set `VITE_USE_MOCK=false`.
3. Done — no component code changes needed. `api.js` is the only file that
   knows whether it's talking to `mockData.js` or a real server.

The expected backend contract (routes, payloads, response shapes) is
documented as comments above each function in `api.js`.

## How it's organized

```
src/
  context/AuthContext.jsx     auth state (user, login/register/logout)
  services/api.js             API layer — real fetches + mock fallback
  services/mockData.js        localStorage-backed mock backend + "agent"
  components/                 reusable UI: TripForm, ItineraryDay,
                               ActivityItem, BudgetSummary, HotelSuggestions,
                               RegenerateDayModal, Navbar, ProtectedRoute, Loader
  pages/                      Landing, Login, Register, Dashboard,
                               TripPlanner, Itinerary
```

`ProtectedRoute` redirects to `/login` if there's no authenticated session,
which is the frontend half of enforcing that users only see their own trips
— the other half (rejecting requests for another user's trip ID) has to be
enforced server-side, which is documented as a known limitation below.

## Design direction

The brief is a travel itinerary tool, so the UI leans into a travelogue /
boarding-pass motif rather than a generic dashboard: itinerary days render
as ticket stubs with a stamped day number and a perforated divider, the
budget renders like a paper receipt with dotted leaders, and hotel picks
get a luggage-tag treatment. Type pairs a serif display face (Fraunces)
with a plain sans body (Work Sans) and a monospace face (IBM Plex Mono)
reserved for anything that reads like printed data — prices, day stamps,
ratings.

## Custom feature: drag-and-drop itinerary reordering

Beyond add / remove / regenerate-a-day (which the brief asks for), users
can **drag any activity by its handle to reorder it within a day or move
it to a different day entirely**, built with native HTML5 drag-and-drop —
no extra library.

Why: regenerating a whole day to fix activity order is a heavy hammer for
a problem that's usually "I just want Skytree before Akihabara, not
after." Letting people drag activities directly solves that without
spending an AI call, keeps the itinerary feeling like *theirs* to arrange,
and reorders are applied optimistically in the UI and then synced to the
backend (`PUT /api/trips/:id/itinerary/reorder`) so it never feels laggy.

## Known limitations (frontend-only scope)

- There is no real backend in this submission — `mockData.js` simulates
  one in `localStorage` per browser, purely so the UI can be demoed and
  reviewed standalone. It is not a substitute for real auth or data
  isolation, which must be enforced server-side once the Express API is
  built (hashed passwords, signed JWTs, ownership checks on every
  trip/day/activity route).
- The mock "AI agent" in `mockData.js` is a deterministic activity-bank
  picker, not an LLM call — it's there to make every screen demoable, not
  to represent the real itinerary-generation logic.
- No automated tests are included at this stage given the scope of the ask.
