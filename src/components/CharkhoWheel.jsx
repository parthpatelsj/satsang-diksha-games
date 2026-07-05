import { useRef, useState } from "react"
import { ConfettiBurst } from "./Fx"
import { sfx } from "../lib/sfx"
import { CHALLENGE_TYPES, pickWeightedType } from "../lib/challenges"

const SEG = 360 / CHALLENGE_TYPES.length

export default function CharkhoWheel({ playerName, onResult }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [landed, setLanded] = useState(null)
  const resultRef = useRef(null)

  const gradient = `conic-gradient(${CHALLENGE_TYPES.map(
    (t, i) => `${t.color}33 ${i * SEG}deg, ${t.color}33 ${(i + 1) * SEG}deg`
  ).join(", ")})`

  const spin = () => {
    if (spinning || landed) return
    const typeKey = pickWeightedType()
    const i = CHALLENGE_TYPES.findIndex((t) => t.key === typeKey)
    resultRef.current = typeKey
    const jitter = (Math.random() - 0.5) * (SEG * 0.6)
    const target = 360 * 5 + (360 - (i * SEG + SEG / 2)) + jitter
    setSpinning(true)
    setRotation((r) => r + target - (r % 360))
    sfx.spin(4.2)
    // Timer, not transitionend — throttled/background tabs can drop the event.
    setTimeout(() => {
      setSpinning(false)
      setLanded(CHALLENGE_TYPES.find((t) => t.key === typeKey))
      sfx.land()
      setTimeout(() => onResult(typeKey), 1600)
    }, 4200)
  }

  return (
    <div className="screen center-screen">
      {landed && <ConfettiBurst emojis={[landed.icon, "✨"]} count={30} />}
      <h2 className={`screen-title ${landed ? "bounce-in" : ""}`}>
        {landed
          ? <>{landed.icon} {landed.label}!</>
          : <>Jay Swaminarayan, <span className="player-name">{playerName}</span>! Spin the Charkho!</>}
      </h2>
      <div className={`wheel-wrap ${spinning ? "wheel-wrap--spinning" : ""} ${landed ? "wheel-wrap--landed" : ""}`}>
        <div className="wheel-pointer">▼</div>
        <div
          className="wheel"
          style={{ background: gradient, transform: `rotate(${rotation}deg)` }}
        >
          {CHALLENGE_TYPES.map((t, i) => (
            <div
              key={t.key}
              className="wheel-label"
              style={{ transform: `rotate(${i * SEG + SEG / 2}deg)` }}
            >
              <span className="wheel-label-inner">
                <span className="wheel-icon">{t.icon}</span>
                <span className="wheel-text">{t.label}</span>
              </span>
            </div>
          ))}
          <div className="wheel-hub">☸</div>
        </div>
      </div>
      {!landed && (
        <button className="btn-big btn-spin" onClick={spin} disabled={spinning}>
          {spinning ? "Spinning…" : "SPIN! 🎡"}
        </button>
      )}
    </div>
  )
}
