import { useRef } from "react"
import { SHLOKS } from "../data/shloks"
import { exportJSON, defaultState } from "../lib/storage"

export default function AdminPanel({ state, setState, onClose }) {
  const fileRef = useRef(null)

  const maxId = Math.max(...SHLOKS.map((s) => s.id))
  const batches = []
  for (let start = 1; start <= maxId; start += 25) batches.push(start)

  const resetBoard = () => {
    if (!confirm(`Reset the board for shloks ${state.batchStart}–${state.batchStart + 24}?`)) return
    setState((s) => ({
      ...s,
      beadsByBatch: { ...s.beadsByBatch, [String(s.batchStart)]: null },
    }))
  }

  const resetAll = () => {
    if (!confirm("Reset EVERYTHING — board, scores, and history?")) return
    setState(defaultState())
  }

  const undoLastCapture = () => {
    const idx = state.history.findIndex((h) => h.correct)
    if (idx === -1) return alert("No capture to undo.")
    const h = state.history[idx]
    const beadIdx = h.shlokId - state.batchStart
    if (!confirm(`Undo ${h.name}'s capture of bead ${h.shlokId} (Bal ${h.team})?`)) return
    setState((s) => {
      const key = String(s.batchStart)
      const size = SHLOKS.filter((x) => x.id >= s.batchStart && x.id < s.batchStart + 25).length
      const cur = s.beadsByBatch[key]?.length === size ? [...s.beadsByBatch[key]] : new Array(size).fill(null)
      if (beadIdx >= 0 && beadIdx < cur.length) cur[beadIdx] = h.prevOwner || null
      return {
        ...s,
        beadsByBatch: { ...s.beadsByBatch, [key]: cur },
        totals: { ...s.totals, [h.team]: Math.max(0, (s.totals[h.team] || 0) - 1) },
        history: s.history.filter((_, i) => i !== idx),
      }
    })
  }

  const importFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!data.beadsByBatch || !data.totals) throw new Error("bad shape")
        setState({ ...defaultState(), ...data })
        alert("Imported ✔")
      } catch {
        alert("Could not import — not a valid Charkho export file.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  return (
    <div className="screen admin">
      <h2 className="screen-title">🔧 Admin Panel</h2>

      <div className="admin-section">
        <h3>Batch</h3>
        <div className="admin-row">
          {batches.map((start) => {
            const count = SHLOKS.filter((s) => s.id >= start && s.id < start + 25).length
            return (
              <button
                key={start}
                className={`btn-admin ${state.batchStart === start ? "btn-admin--active" : ""}`}
                disabled={count === 0}
                onClick={() => setState((s) => ({ ...s, batchStart: start }))}
              >
                {start}–{start + 24} {count < 25 ? `(${count} loaded)` : ""}
              </button>
            )
          })}
        </div>
        <p className="admin-note">Add more shloks to SHLOKS in src/data/shloks.js to unlock later batches.</p>
      </div>

      <div className="admin-section">
        <h3>Board & Data</h3>
        <div className="admin-row">
          <button className="btn-admin" onClick={undoLastCapture}>↩ Undo last capture</button>
          <button className="btn-admin" onClick={resetBoard}>Reset current board</button>
          <button className="btn-admin btn-admin--danger" onClick={resetAll}>Reset everything</button>
          <button className="btn-admin" onClick={() => exportJSON(state)}>Export JSON</button>
          <button className="btn-admin" onClick={() => fileRef.current.click()}>Import JSON</button>
          <input ref={fileRef} type="file" accept=".json" hidden onChange={importFile} />
        </div>
      </div>

      <div className="admin-section">
        <h3>Settings</h3>
        <div className="admin-row">
          <button
            className={`btn-admin ${state.settings.cooldownEnabled ? "btn-admin--active" : ""}`}
            onClick={() =>
              setState((s) => ({
                ...s,
                settings: { ...s.settings, cooldownEnabled: !s.settings.cooldownEnabled },
              }))
            }
          >
            3-min player cooldown: {state.settings.cooldownEnabled ? "ON" : "OFF"}
          </button>
          <button
            className={`btn-admin ${state.settings.soundEnabled ? "btn-admin--active" : ""}`}
            onClick={() =>
              setState((s) => ({
                ...s,
                settings: { ...s.settings, soundEnabled: !s.settings.soundEnabled },
              }))
            }
          >
            Sound effects: {state.settings.soundEnabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h3>Recent plays ({state.history.length})</h3>
        <div className="admin-history">
          {state.history.slice(0, 8).map((h, i) => (
            <p key={i}>
              {h.name} · Bal {h.team} · shlok {h.shlokId} · {h.type} · {h.correct ? "✔" : "✘"}
            </p>
          ))}
        </div>
      </div>

      <button className="btn-big" onClick={onClose}>Close ✕</button>
    </div>
  )
}
