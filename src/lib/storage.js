// localStorage persistence for the kiosk.

const KEY = "charkho-v1"

export const COOLDOWN_MS = 3 * 60 * 1000

export function defaultState() {
  return {
    batchStart: 1,                 // 1, 26, 51, ...
    beadsByBatch: {},              // { "1": [null | teamId x 25], ... }
    totals: { "2A": 0, "2B": 0, "3": 0 }, // lifetime captures per group
    history: [],                   // [{ name, team, ts, shlokId, type, correct, prevOwner }]
    settings: { cooldownEnabled: true, soundEnabled: true },
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return { ...defaultState(), ...parsed, settings: { ...defaultState().settings, ...parsed.settings } }
  } catch {
    return defaultState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // storage full / unavailable — kiosk keeps running in memory
  }
}

export function getBeads(state, batchSize) {
  const key = String(state.batchStart)
  const existing = state.beadsByBatch[key]
  if (existing && existing.length === batchSize) return existing
  return new Array(batchSize).fill(null)
}

const normName = (n) => n.trim().toLowerCase().replace(/[^a-z0-9]/g, "")

// Returns ms remaining on cooldown for this name, or 0 if clear.
export function cooldownRemaining(state, name, now = Date.now()) {
  if (!state.settings.cooldownEnabled) return 0
  const n = normName(name)
  if (!n) return 0
  for (const h of state.history) {
    if (normName(h.name) === n && now - h.ts < COOLDOWN_MS) {
      return COOLDOWN_MS - (now - h.ts)
    }
  }
  return 0
}

export function exportJSON(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `charkho-results-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
