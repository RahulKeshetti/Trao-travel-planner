/**
 * services/mockData.js
 * -----------------------------------------------------------------------
 * Stand-in for the backend + LLM agent so the frontend can be demoed,
 * screenshotted, and walked through on its own. Every function mirrors
 * the shape a real Express + LLM-agent response would have. Swap
 * USE_MOCK to "false" in .env once the backend is live — no component
 * needs to change.
 * -----------------------------------------------------------------------
 */

const USERS_KEY = 'trao_mock_users'
const SESSION_KEY = 'trao_mock_session'
const TRIPS_KEY_PREFIX = 'trao_mock_trips_'
const SEEDED_KEY = 'trao_mock_seeded'

export const DEMO_ACCOUNTS = [
  { name: 'rahul', email: 'demo@gmail.com', password: 'demo1234' }
 
]

const ACTIVITY_BANK = {
  Food: ['Street food crawl in the old quarter', 'Tasting menu at a local favorite', 'Morning market & breakfast stalls', 'Rooftop dinner with a skyline view'],
  Culture: ['Walk through the historic district', 'Visit the main temple/cathedral', 'Afternoon at the national museum', 'Traditional performance in the evening'],
  Adventure: ['Sunrise hike on the nearby trail', 'Half-day kayaking or boating', 'Bike tour through the outskirts', 'Zipline or canyon excursion'],
  Shopping: ['Browse the central market', 'Boutique-hopping in the design district', 'Souvenir run through the old arcade', 'Evening night market'],
  Relaxation: ['Spa & onsen / hammam afternoon', 'Slow morning at a café overlooking the water', 'Park picnic and people-watching'],
  Nightlife: ['Rooftop bar at sunset', 'Live music in the entertainment quarter', 'Late-night noodle stop after the bars']
}

const BUDGET_MULTIPLIER = { Low: 0.7, Medium: 1, High: 1.6 }

function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function pick(arr, n) {
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

function buildItinerary(days, interests) {
  const pools = (interests.length ? interests : ['Culture', 'Food']).map((i) => ACTIVITY_BANK[i] || [])
  const flat = pools.flat()
  const itinerary = []
  for (let d = 1; d <= days; d++) {
    const activities = pick(flat.length ? flat : ACTIVITY_BANK.Culture, 3).map((title) => ({
      id: uid('act'),
      title
    }))
    itinerary.push({ day: d, title: `Day ${d}`, activities })
  }
  return itinerary
}

function buildBudget(destination, days, budgetType) {
  const mult = BUDGET_MULTIPLIER[budgetType] || 1
  const flights = Math.round(220 * mult + days * 4)
  const accommodation = Math.round(60 * mult * days)
  const food = Math.round(28 * mult * days)
  const activities = Math.round(22 * mult * days)
  const total = flights + accommodation + food + activities
  return {
    currency: 'USD',
    breakdown: [
      { label: 'Flights', amount: flights },
      { label: 'Accommodation', amount: accommodation },
      { label: 'Food', amount: food },
      { label: 'Activities', amount: activities }
    ],
    total
  }
}

const HOTEL_BANK = [
  { tier: 'Budget Friendly', suffix: 'Inn & Hostel', priceHint: '$' },
  { tier: 'Budget Friendly', suffix: 'Traveler Lodge', priceHint: '$' },
  { tier: 'Mid Range', suffix: 'Grand Hotel', priceHint: '$$' },
  { tier: 'Mid Range', suffix: 'Garden Suites', priceHint: '$$' },
  { tier: 'Luxury', suffix: 'Imperial Hotel', priceHint: '$$$' },
  { tier: 'Luxury', suffix: 'Palace Residences', priceHint: '$$$' }
]

function buildHotels(destination) {
  return HOTEL_BANK.map((h) => ({
    id: uid('hotel'),
    name: `${destination.split(',')[0]} ${h.suffix}`,
    tier: h.tier,
    priceHint: h.priceHint,
    rating: (4 + Math.random()).toFixed(1)
  }))
}

function buildTrip({ destination, days, budgetType, interests }) {
  return {
    id: uid('trip'),
    destination,
    days: Number(days),
    budgetType,
    interests,
    createdAt: new Date().toISOString(),
    itinerary: buildItinerary(Number(days), interests),
    budget: buildBudget(destination, Number(days), budgetType),
    hotels: buildHotels(destination)
  }
}

/* ------------------------------ "DB" helpers ------------------------------ */

function readUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
function tripsKey(userId) {
  return `${TRIPS_KEY_PREFIX}${userId}`
}
function readTrips(userId) {
  return JSON.parse(localStorage.getItem(tripsKey(userId)) || '[]')
}
function writeTrips(userId, trips) {
  localStorage.setItem(tripsKey(userId), JSON.stringify(trips))
}
function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
}
function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function requireSession() {
  const session = getSession()
  if (!session) {
    const err = new Error('Not authenticated')
    err.status = 401
    throw err
  }
  return session
}

/* ------------------------------ demo seed data ------------------------------ */
// Runs once per browser. Creates two accounts with their own trip each, so the
// app is never empty on first load and data isolation is easy to demo: log in
// as demo1, see only Asha's trip; log in as demo2, see only Leo's.

function seedDemoAccounts() {
  if (localStorage.getItem(SEEDED_KEY)) return

  const users = DEMO_ACCOUNTS.map((account) => ({ id: uid('user'), ...account }))
  writeUsers(users)

  writeTrips(users[0].id, [
    buildTrip({ destination: 'Tokyo, Japan', days: 4, budgetType: 'Medium', interests: ['Culture', 'Food'] })
  ])
  writeTrips(users[1].id, [
    buildTrip({ destination: 'Lisbon, Portugal', days: 3, budgetType: 'Low', interests: ['Adventure', 'Nightlife'] })
  ])

  localStorage.setItem(SEEDED_KEY, 'true')
}

seedDemoAccounts()

/* -------------------------------- Auth -------------------------------- */

export function mockRegister({ name, email, password }) {
  const users = readUsers()
  if (users.some((u) => u.email === email)) {
    const err = new Error('An account with that email already exists')
    err.status = 409
    throw err
  }
  const user = { id: uid('user'), name, email, password } // demo only — never store plain passwords in a real backend
  users.push(user)
  writeUsers(users)
  const token = `mock.${user.id}`
  setSession({ token, userId: user.id })
  return { token, user: { id: user.id, name: user.name, email: user.email } }
}

export function mockLogin({ email, password }) {
  const users = readUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) {
    const err = new Error('Invalid email or password')
    err.status = 401
    throw err
  }
  const token = `mock.${user.id}`
  setSession({ token, userId: user.id })
  return { token, user: { id: user.id, name: user.name, email: user.email } }
}

export function mockCurrentUser() {
  const session = requireSession()
  const users = readUsers()
  const user = users.find((u) => u.id === session.userId)
  if (!user) {
    const err = new Error('Session expired')
    err.status = 401
    throw err
  }
  return { user: { id: user.id, name: user.name, email: user.email } }
}

/* -------------------------------- Trips -------------------------------- */

export function mockFetchTrips() {
  const session = requireSession()
  return { trips: readTrips(session.userId) }
}

export function mockFetchTrip(tripId) {
  const session = requireSession()
  const trip = readTrips(session.userId).find((t) => t.id === tripId)
  if (!trip) {
    const err = new Error('Trip not found')
    err.status = 404
    throw err
  }
  return { trip }
}

export function mockDeleteTrip(tripId) {
  const session = requireSession()
  const trips = readTrips(session.userId).filter((t) => t.id !== tripId)
  writeTrips(session.userId, trips)
  return { success: true }
}

export function mockGenerateItinerary({ destination, days, budgetType, interests }) {
  const session = requireSession()
  const trip = buildTrip({ destination, days, budgetType, interests })
  const trips = readTrips(session.userId)
  trips.unshift(trip)
  writeTrips(session.userId, trips)
  return { trip }
}

export function mockRegenerateDay(tripId, dayNumber, instructions) {
  const session = requireSession()
  const trips = readTrips(session.userId)
  const trip = trips.find((t) => t.id === tripId)
  if (!trip) {
    const err = new Error('Trip not found')
    err.status = 404
    throw err
  }

  // crude "instruction awareness" so the regenerate demo feels intentional
  const lower = (instructions || '').toLowerCase()
  let pool = (trip.interests.length ? trip.interests : ['Culture']).flatMap((i) => ACTIVITY_BANK[i] || [])
  if (lower.includes('outdoor') || lower.includes('adventure')) pool = [...pool, ...ACTIVITY_BANK.Adventure]
  if (lower.includes('food') || lower.includes('eat')) pool = [...pool, ...ACTIVITY_BANK.Food]
  if (lower.includes('relax')) pool = [...pool, ...ACTIVITY_BANK.Relaxation]
  if (lower.includes('night')) pool = [...pool, ...ACTIVITY_BANK.Nightlife]

  const newActivities = pick(pool, 3).map((title) => ({ id: uid('act'), title }))
  const day = trip.itinerary.find((d) => d.day === Number(dayNumber))
  day.activities = newActivities

  writeTrips(session.userId, trips)
  return { trip }
}

export function mockAddActivity(tripId, dayNumber, title) {
  const session = requireSession()
  const trips = readTrips(session.userId)
  const trip = trips.find((t) => t.id === tripId)
  const day = trip.itinerary.find((d) => d.day === Number(dayNumber))
  day.activities.push({ id: uid('act'), title })
  writeTrips(session.userId, trips)
  return { trip }
}

export function mockRemoveActivity(tripId, dayNumber, activityId) {
  const session = requireSession()
  const trips = readTrips(session.userId)
  const trip = trips.find((t) => t.id === tripId)
  const day = trip.itinerary.find((d) => d.day === Number(dayNumber))
  day.activities = day.activities.filter((a) => a.id !== activityId)
  writeTrips(session.userId, trips)
  return { trip }
}

export function mockReorderItinerary(tripId, days) {
  const session = requireSession()
  const trips = readTrips(session.userId)
  const trip = trips.find((t) => t.id === tripId)
  trip.itinerary = days
  writeTrips(session.userId, trips)
  return { trip }
}

export function mockFetchHotels(tripId) {
  const session = requireSession()
  const trip = readTrips(session.userId).find((t) => t.id === tripId)
  return { hotels: trip ? trip.hotels : [] }
}
