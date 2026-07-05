import { TEAMS } from "../data/shloks"
import { sfx } from "../lib/sfx"

export default function TeamSelect({ beads, onSelect, onBack }) {
  const counts = { "2A": 0, "2B": 0, "3": 0 }
  beads.forEach((b) => { if (b) counts[b]++ })

  return (
    <div className="screen center-screen">
      <h2 className="screen-title">Which group are you in?</h2>
      <div className="team-cards">
        {TEAMS.map((t, i) => (
          <button
            key={t.id}
            className="team-card"
            style={{ "--team-color": t.color, "--team-dark": t.dark, "--bob-delay": `${i * 0.3}s` }}
            onClick={() => { sfx.select(); onSelect(t.id) }}
          >
            <span className="team-card-emoji">🦁</span>
            <span className="team-card-name">{t.name}</span>
            <span className="team-card-beads">{counts[t.id]} beads</span>
          </button>
        ))}
      </div>
      <button className="btn-ghost" onClick={() => { sfx.back(); onBack() }}>← Back</button>
    </div>
  )
}
