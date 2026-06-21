/**
 * services/api.js
 * -----------------------------------------------------------------------
 * Thin wrapper around the backend's REST API.
 *
 * This assessment ships the FRONTEND only. Every function below is
 * already shaped to call a real Express API (see the commented routes),
 * so wiring up the backend later is a matter of removing the mock
 * branch — no component code needs to change.
 *
 * Mock mode is controlled by VITE_USE_MOCK in .env. While it's "true"
 * (the default for this submission), every call resolves locally
 * against mockData.js after a short simulated delay, so the app is
 * fully demoable without a server running.
 * -----------------------------------------------------------------------
 */
import * as mock from './mockData.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

const TOKEN_KEY = 'trao_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`
    const error = new Error(message)
    error.status = res.status
    throw error
  }
  return data
}

const delay = (ms = 550) => new Promise((resolve) => setTimeout(resolve, ms))

/* ----------------------------- Auth ----------------------------- */

// POST /api/auth/register  { name, email, password }
export async function registerUser(payload) {
  if (USE_MOCK) {
    await delay()
    return mock.mockRegister(payload)
  }
  return request('/auth/register', { method: 'POST', body: payload, auth: false })
}

// POST /api/auth/login  { email, password }
export async function loginUser(payload) {
  if (USE_MOCK) {
    await delay()
    return mock.mockLogin(payload)
  }
  return request('/auth/login', { method: 'POST', body: payload, auth: false })
}

// GET /api/auth/me
export async function fetchCurrentUser() {
  if (USE_MOCK) {
    await delay(250)
    return mock.mockCurrentUser()
  }
  return request('/auth/me')
}

/* ----------------------------- Trips ----------------------------- */

// GET /api/trips  -> trips belonging to the authenticated user only
export async function fetchTrips() {
  if (USE_MOCK) {
    await delay(400)
    return mock.mockFetchTrips()
  }
  return request('/trips')
}

// GET /api/trips/:id
export async function fetchTrip(tripId) {
  if (USE_MOCK) {
    await delay(300)
    return mock.mockFetchTrip(tripId)
  }
  return request(`/trips/${tripId}`)
}

// DELETE /api/trips/:id
export async function deleteTrip(tripId) {
  if (USE_MOCK) {
    await delay(300)
    return mock.mockDeleteTrip(tripId)
  }
  return request(`/trips/${tripId}`, { method: 'DELETE' })
}

/* ------------------------- AI itinerary agent ------------------------- */

// POST /api/trips/generate
// body: { destination, days, budgetType, interests }
// returns: { trip: { id, destination, days, budgetType, interests, itinerary, budget, hotels } }
export async function generateItinerary(payload) {
  if (USE_MOCK) {
    await delay(1400) // generation feels like it's "thinking"
    return mock.mockGenerateItinerary(payload)
  }
  return request('/trips/generate', { method: 'POST', body: payload })
}

// POST /api/trips/:id/days/:dayNumber/regenerate
// body: { instructions }  e.g. "more outdoor activities"
export async function regenerateDay(tripId, dayNumber, instructions) {
  if (USE_MOCK) {
    await delay(1100)
    return mock.mockRegenerateDay(tripId, dayNumber, instructions)
  }
  return request(`/trips/${tripId}/days/${dayNumber}/regenerate`, {
    method: 'POST',
    body: { instructions }
  })
}

// POST /api/trips/:id/days/:dayNumber/activities  { title }
export async function addActivity(tripId, dayNumber, title) {
  if (USE_MOCK) {
    await delay(200)
    return mock.mockAddActivity(tripId, dayNumber, title)
  }
  return request(`/trips/${tripId}/days/${dayNumber}/activities`, {
    method: 'POST',
    body: { title }
  })
}

// DELETE /api/trips/:id/days/:dayNumber/activities/:activityId
export async function removeActivity(tripId, dayNumber, activityId) {
  if (USE_MOCK) {
    await delay(150)
    return mock.mockRemoveActivity(tripId, dayNumber, activityId)
  }
  return request(`/trips/${tripId}/days/${dayNumber}/activities/${activityId}`, {
    method: 'DELETE'
  })
}

// PUT /api/trips/:id/itinerary/reorder
// body: { days } — full reordered day/activity structure after drag-and-drop
export async function reorderItinerary(tripId, days) {
  if (USE_MOCK) {
    await delay(150)
    return mock.mockReorderItinerary(tripId, days)
  }
  return request(`/trips/${tripId}/itinerary/reorder`, { method: 'PUT', body: { days } })
}

/* ---------------------------- Hotels ---------------------------- */

// GET /api/trips/:id/hotels
export async function fetchHotelSuggestions(tripId) {
  if (USE_MOCK) {
    await delay(500)
    return mock.mockFetchHotels(tripId)
  }
  return request(`/trips/${tripId}/hotels`)
}

export const isMockMode = USE_MOCK
