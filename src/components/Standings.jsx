import { TEAMS } from "../data/shloks"

export default function Standings({ beads, totals }) {
  const counts = { "2A": 0, "2B": 0, "3": 0 }
  beads.forEach((b) => { if (b) counts[b]++ })
  const ranked = [...TEAMS].sort((a, b) => counts[b.id] - counts[a.id])
  const max = Math.max(1, ...ranked.map((t) => counts[t.id]))

  return (
    <div className="standings">
      <h3 className="panel-title">🏆 Standings</h3>
      {ranked.map((t, rank) => (
        <div key={t.id} className="standing-row">
          <span className="standing-rank">{["🥇", "🥈", "🥉"][rank]}</span>
          <span className="standing-name" style={{ color: t.color }}>{t.name}</span>
          <div className="standing-bar-track">
            <div
              className="standing-bar"
              style={{ width: `${(counts[t.id] / max) * 100}%`, background: t.color }}
            />
          </div>
          <span className="standing-count">{counts[t.id]}</span>
          <span className="standing-total">({totals[t.id]} total)</span>
        </div>
      ))}
    </div>
  )
}
