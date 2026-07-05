import { useEffect } from "react"
import { ConfettiBurst } from "./Fx"
import { TEAMS, shlokLines } from "../data/shloks"

const PARTICLES = 24

export default function ResultScreen({ correct, team, name, beadNumber, prevOwner, shlok, onDone }) {
  const teamObj = TEAMS.find((t) => t.id === team)
  const prevObj = prevOwner ? TEAMS.find((t) => t.id === prevOwner) : null
  const stole = correct && prevOwner && prevOwner !== team

  useEffect(() => {
    const id = setTimeout(onDone, 7000)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <div className="screen center-screen result" onClick={onDone}>
      {correct && <ConfettiBurst emojis={stole ? ["🦁", "✨", "🎉"] : ["🪔", "✨", "🎉"]} count={54} />}
      {correct && (
        <div className="burst">
          {Array.from({ length: PARTICLES }).map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                "--angle": `${(360 / PARTICLES) * i}deg`,
                "--delay": `${(i % 6) * 0.05}s`,
              }}
            >
              {stole ? "🦁" : ["🪔", "✨", "🌟"][i % 3]}
            </span>
          ))}
        </div>
      )}

      <div className={`result-emoji ${correct ? "result-emoji--pop" : ""}`}>
        {correct ? (stole ? "🦁" : "🪔") : "💪"}
      </div>

      {correct ? (
        <>
          <h2 className="result-title bounce-in" style={{ color: teamObj.color }}>
            {stole ? "ROARRR! BEAD STOLEN!" : "BEAD CAPTURED!"}
          </h2>
          <p className="result-line">
            <b>{name}</b> won <b>bead {beadNumber}</b> for{" "}
            <b style={{ color: teamObj.color }}>{teamObj.name}</b>
            {stole && <> — taken from <b style={{ color: prevObj.color }}>{prevObj.name}</b>!</>}
          </p>
        </>
      ) : (
        <>
          <h2 className="result-title result-title--miss">Good try, {name}!</h2>
          <p className="result-line">Practice this shlok and come roar again 🦁</p>
        </>
      )}

      <div className="result-shlok">
        {shlokLines(shlok).map((line, i) => (
          <p key={i} className="shlok-text">{line}</p>
        ))}
        <p className="shlok-meaning">Shlok {shlok.id} — {shlok.meaning}</p>
        {shlok.anchors && (
          <p className="shlok-anchors">
            Anchor words:{" "}
            {shlok.anchors.map((a, i) => (
              <span key={i} className="anchor-chip">{a}</span>
            ))}
          </p>
        )}
      </div>

      <p className="result-hint">Tap anywhere to finish</p>
    </div>
  )
}
