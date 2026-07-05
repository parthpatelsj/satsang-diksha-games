import { useMemo } from "react"

// Shared eye-candy layers. Both are pure CSS animations over pointer-events:none
// containers, so they never steal taps from the buttons underneath.

// Soft emojis drifting up the background — ambience for attract/idle screens.
export function FloatingBits({ emojis = ["🪔", "✨", "🌟", "📿"], count = 14 }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        emoji: emojis[i % emojis.length],
        left: Math.random() * 96,
        size: 2 + Math.random() * 2.5,
        duration: 9 + Math.random() * 10,
        delay: -Math.random() * 18, // negative → field is already full on mount
        sway: (Math.random() - 0.5) * 12,
      })),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className="fx-layer" aria-hidden="true">
      {bits.map((b, i) => (
        <span
          key={i}
          className="fx-float"
          style={{
            left: `${b.left}%`,
            fontSize: `${b.size}vmin`,
            "--dur": `${b.duration}s`,
            "--delay": `${b.delay}s`,
            "--sway": `${b.sway}vmin`,
          }}
        >
          {b.emoji}
        </span>
      ))}
    </div>
  )
}

const CONFETTI_COLORS = ["#ffd166", "#f5a623", "#1fbfb0", "#e85d5d", "#a78bfa", "#4ade80"]

// Celebration rain — colored ribbons plus a few emojis falling from the top.
export function ConfettiBurst({ emojis = ["🎉", "✨", "🪔"], count = 44 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        emoji: i % 4 === 0 ? emojis[i % emojis.length] : null,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left: Math.random() * 100,
        duration: 1.8 + Math.random() * 1.6,
        delay: Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 18,
        spin: 360 + Math.random() * 540,
      })),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <div className="fx-layer" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={`fx-confetti ${p.emoji ? "fx-confetti--emoji" : ""}`}
          style={{
            left: `${p.left}%`,
            background: p.emoji ? "none" : p.color,
            "--dur": `${p.duration}s`,
            "--delay": `${p.delay}s`,
            "--drift": `${p.drift}vmin`,
            "--spin": `${p.spin}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
