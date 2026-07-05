import { useEffect, useRef, useState } from "react"
import MalaBoard from "./MalaBoard"
import Standings from "./Standings"
import { FloatingBits } from "./Fx"
import { TEAMS, GOAL_TEXT, shlokLines } from "../data/shloks"

const PANELS = ["standings", "ticker", "shlok", "goal"]

export default function AttractMode({ beads, batchStart, totals, history, shloks, onPlay, onAdminTap }) {
  const [panel, setPanel] = useState(0)
  const tapCount = useRef({ n: 0, t: 0 })

  useEffect(() => {
    const id = setInterval(() => setPanel((p) => (p + 1) % PANELS.length), 7000)
    return () => clearInterval(id)
  }, [])

  const handleTitleTap = (e) => {
    e.stopPropagation()
    const now = Date.now()
    if (now - tapCount.current.t > 2500) tapCount.current.n = 0
    tapCount.current.t = now
    tapCount.current.n++
    if (tapCount.current.n >= 5) {
      tapCount.current.n = 0
      onAdminTap()
    }
  }

  const teamById = Object.fromEntries(TEAMS.map((t) => [t.id, t]))
  const captures = history.filter((h) => h.correct).slice(0, 6)
  const shlokOfDay = shloks[
    Math.floor(Date.now() / 86400000) % shloks.length
  ]

  return (
    <div className="screen attract" onClick={onPlay}>
      <FloatingBits />
      <h1 className="attract-title" onClick={handleTitleTap}>
        <span className="title-om">🪷</span> Sinh Santano Charkho <span className="title-om">🪷</span>
      </h1>
      <p className="attract-subtitle">Mission Sinh Santano · Satsang Diksha Challenge</p>

      <div className="attract-body">
        <MalaBoard beads={beads} batchStart={batchStart} />

        <div className="attract-panel" key={panel}>
          {PANELS[panel] === "standings" && <Standings beads={beads} totals={totals} />}

          {PANELS[panel] === "ticker" && (
            <div className="ticker-panel">
              <h3 className="panel-title">🔥 Recent Captures</h3>
              {captures.length === 0 && <p className="ticker-empty">No captures yet — be the first sinh!</p>}
              {captures.map((h, i) => (
                <p key={i} className="ticker-line">
                  <b style={{ color: teamById[h.team]?.color }}>{h.name}</b>
                  {" "}({teamById[h.team]?.name}) {h.prevOwner ? "stole" : "captured"} bead {h.shlokId}
                  {h.prevOwner ? " 🦁" : " ✨"}
                </p>
              ))}
            </div>
          )}

          {PANELS[panel] === "shlok" && (
            <div className="shlok-panel">
              <h3 className="panel-title">🪔 Shlok of the Day — #{shlokOfDay.id}</h3>
              {shlokLines(shlokOfDay).map((line, i) => (
                <p key={i} className="shlok-text">{line}</p>
              ))}
              <p className="shlok-meaning">{shlokOfDay.meaning}</p>
            </div>
          )}

          {PANELS[panel] === "goal" && (
            <div className="goal-panel">
              <h3 className="panel-title">🎯 Our Goal</h3>
              <p className="goal-text">{GOAL_TEXT}</p>
              <p className="goal-sub">Capture beads for your group — every shlok counts!</p>
            </div>
          )}
        </div>
      </div>

      <div className="tap-to-play">👆 TAP TO PLAY 👆</div>

      <button
        className="corner-admin"
        title="Admin"
        onClick={(e) => { e.stopPropagation(); onAdminTap() }}
      >
        ⚙
      </button>
    </div>
  )
}
