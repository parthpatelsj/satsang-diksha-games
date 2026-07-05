import { TEAMS } from "../data/shloks"

// 25-bead mala arranged in a loop with a diya pendant at the bottom gap.
export default function MalaBoard({ beads, batchStart, highlight = null, compact = false }) {
  const n = beads.length
  const gapDeg = 42 // bottom gap for the pendant
  const startDeg = 90 + gapDeg / 2
  const span = 360 - gapDeg
  const teamById = Object.fromEntries(TEAMS.map((t) => [t.id, t]))

  const counts = { "2A": 0, "2B": 0, "3": 0 }
  beads.forEach((b) => { if (b) counts[b]++ })

  return (
    <div className={`mala ${compact ? "mala--compact" : ""}`}>
      {beads.map((owner, i) => {
        const a = ((startDeg + (span / (n - 1)) * i) * Math.PI) / 180
        const x = 50 + 45 * Math.cos(a)
        const y = 50 + 44 * Math.sin(a)
        const team = owner ? teamById[owner] : null
        return (
          <div
            key={i}
            className={`bead ${team ? "bead--owned" : ""} ${highlight === i ? "bead--highlight" : ""}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              "--bead-color": team ? team.color : "#2a2f5e",
              "--bead-dark": team ? team.dark : "#161a3d",
              "--pop-delay": `${i * 35}ms`,
            }}
            title={team ? `Shlok ${batchStart + i} — ${team.name}` : `Shlok ${batchStart + i}`}
          >
            {batchStart + i}
          </div>
        )
      })}
      <div className="mala-pendant">🪔</div>
      <div className="mala-center">
        <div className="mala-center-title">Satsang Diksha</div>
        <div className="mala-center-range">Shloks {batchStart}–{batchStart + n - 1}</div>
        <div className="mala-center-counts">
          {TEAMS.map((t) => (
            <span key={t.id} className="mala-count" style={{ "--team-color": t.color }}>
              <i /> {counts[t.id]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
