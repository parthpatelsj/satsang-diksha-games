import { useEffect, useRef, useState } from "react"
import { ConfettiBurst } from "./Fx"

// Bonus arcade round before the shlok challenge — one of three quick games,
// picked at random. Win = 🪔 Second Chance on the challenge. All games work
// with touch AND keyboard, and run ~15-20 seconds.
//
// NOTE: every game effect RESETS its mutable state at the start of the effect
// (not just in cleanup) — React StrictMode runs mount → cleanup → mount in
// dev, and a stale `done: true` from the first cleanup would freeze the game.

// ── Game 1: Diya Catch — move the thali, catch 8 falling diyas ──────────────
function DiyaCatch({ onEnd, setHud }) {
  const arenaRef = useRef(null)
  const thaliRef = useRef(null)
  const s = useRef({}).current

  useEffect(() => {
    const arena = arenaRef.current
    Object.assign(s, {
      thaliX: 50, vel: 0, diyas: [], caught: 0, raf: 0, done: false,
      endAt: performance.now() + 20000,
      nextSpawn: performance.now() + 400,
    })

    const down = (e) => {
      if (e.key === "ArrowLeft") s.vel = -80
      if (e.key === "ArrowRight") s.vel = 80
    }
    const up = (e) => { if (e.key.startsWith("Arrow")) s.vel = 0 }
    const point = (e) => {
      const rect = arena.getBoundingClientRect()
      s.thaliX = Math.max(6, Math.min(94, ((e.clientX - rect.left) / rect.width) * 100))
    }
    // Capture the pointer so the thali keeps tracking a finger that slides
    // past the arena edge mid-drag.
    const grab = (e) => { arena.setPointerCapture?.(e.pointerId); point(e) }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    arena.addEventListener("pointerdown", grab)
    arena.addEventListener("pointermove", point)

    let last = performance.now()
    const loop = (now) => {
      if (s.done || !arenaRef.current) return
      const dt = Math.min(40, now - last) / 1000
      last = now
      s.thaliX = Math.max(6, Math.min(94, s.thaliX + s.vel * dt))
      if (thaliRef.current) thaliRef.current.style.left = s.thaliX + "%"

      if (now >= s.nextSpawn) {
        s.nextSpawn = now + 550 + Math.random() * 350
        const el = document.createElement("div")
        el.className = "diya-fall"
        el.textContent = "🪔"
        arena.appendChild(el)
        s.diyas.push({ el, x: 8 + Math.random() * 84, y: -8, speed: 26 + Math.random() * 14 })
      }
      for (const d of [...s.diyas]) {
        d.y += d.speed * dt
        d.el.style.left = d.x + "%"
        d.el.style.top = d.y + "%"
        if (d.y >= 76 && d.y <= 90 && Math.abs(d.x - s.thaliX) < 9) {
          d.el.classList.add("diya-caught")
          const el = d.el
          setTimeout(() => el.remove(), 450)
          s.diyas.splice(s.diyas.indexOf(d), 1)
          s.caught++
          if (s.caught >= 8) { s.done = true; return onEnd(true) }
        } else if (d.y > 106) {
          d.el.remove()
          s.diyas.splice(s.diyas.indexOf(d), 1)
        }
      }
      setHud({ label: `🪔 ${s.caught} / 8`, timeLeft: Math.max(0, Math.ceil((s.endAt - now) / 1000)) })
      if (now >= s.endAt) { s.done = true; return onEnd(false) }
      s.lastTick = now
      cancelAnimationFrame(s.raf)
      s.raf = requestAnimationFrame(loop)
    }
    s.lastTick = performance.now()
    s.raf = requestAnimationFrame(loop)
    // rAF pauses in hidden/throttled tabs — keep the game clock alive.
    s.fallback = setInterval(() => {
      if (!s.done && performance.now() - s.lastTick > 250) loop(performance.now())
    }, 300)

    return () => {
      s.done = true
      cancelAnimationFrame(s.raf)
      clearInterval(s.fallback)
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
      arena.removeEventListener("pointerdown", grab)
      arena.removeEventListener("pointermove", point)
      s.diyas.forEach((d) => d.el.remove())
      s.diyas = []
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="minigame-arena" ref={arenaRef}>
      <div className="thali" ref={thaliRef}><span className="thali-flame">🔥</span></div>
    </div>
  )
}

// ── Game 2: Lion Leap — jump the rocks, survive 15 seconds ──────────────────
function LionLeap({ onEnd, setHud }) {
  const arenaRef = useRef(null)
  const lionRef = useRef(null)
  const s = useRef({}).current

  useEffect(() => {
    const arena = arenaRef.current
    Object.assign(s, {
      y: 0, vy: 0, rocks: [], raf: 0, done: false,
      endAt: performance.now() + 15000,
      nextSpawn: performance.now() + 1000,
    })

    const jump = () => { if (s.y <= 0) s.vy = 105 }
    const key = (e) => {
      if (e.code === "Space" || e.key === "ArrowUp") { e.preventDefault(); jump() }
    }
    window.addEventListener("keydown", key)
    arena.addEventListener("pointerdown", jump)

    let last = performance.now()
    const loop = (now) => {
      if (s.done || !arenaRef.current) return
      const dt = Math.min(40, now - last) / 1000
      last = now
      // lion physics — y is height above the ground in %
      s.y += s.vy * dt
      s.vy -= 300 * dt
      if (s.y <= 0) { s.y = 0; if (s.vy < 0) s.vy = 0 }
      if (lionRef.current) lionRef.current.style.bottom = 16 + s.y + "%"

      const elapsed = 15 - (s.endAt - now) / 1000
      const speed = 34 + elapsed * 1.5 // rocks speed up slightly
      if (now >= s.nextSpawn) {
        s.nextSpawn = now + 1100 + Math.random() * 800
        const el = document.createElement("div")
        el.className = "leap-rock"
        el.textContent = "🪨"
        arena.appendChild(el)
        s.rocks.push({ el, x: 106 })
      }
      for (const r of [...s.rocks]) {
        r.x -= speed * dt
        r.el.style.left = r.x + "%"
        if (Math.abs(r.x - 16) < 5.5 && s.y < 8) { s.done = true; return onEnd(false) }
        if (r.x < -8) {
          r.el.remove()
          s.rocks.splice(s.rocks.indexOf(r), 1)
        }
      }
      setHud({ label: "🦁 Jump & survive!", timeLeft: Math.max(0, Math.ceil((s.endAt - now) / 1000)) })
      if (now >= s.endAt) { s.done = true; return onEnd(true) }
      s.lastTick = now
      cancelAnimationFrame(s.raf)
      s.raf = requestAnimationFrame(loop)
    }
    s.lastTick = performance.now()
    s.raf = requestAnimationFrame(loop)
    // rAF pauses in hidden/throttled tabs — keep the game clock alive.
    s.fallback = setInterval(() => {
      if (!s.done && performance.now() - s.lastTick > 250) loop(performance.now())
    }, 300)

    return () => {
      s.done = true
      cancelAnimationFrame(s.raf)
      clearInterval(s.fallback)
      window.removeEventListener("keydown", key)
      arena.removeEventListener("pointerdown", jump)
      s.rocks.forEach((r) => r.el.remove())
      s.rocks = []
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="minigame-arena minigame-arena--leap" ref={arenaRef}>
      <div className="leap-ground" />
      <div className="leap-lion" ref={lionRef}>🦁</div>
    </div>
  )
}

// ── Game 3: Mala Tap — tap 12 glowing diyas before time runs out ────────────
function MalaTap({ onEnd, setHud }) {
  const [lit, setLit] = useState({})
  const scoreRef = useRef(0)
  const [, force] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    doneRef.current = false
    scoreRef.current = 0
    setLit({})
    const endAt = performance.now() + 20000
    const spawn = setInterval(() => {
      const spot = Math.floor(Math.random() * 12)
      setLit((l) => ({ ...l, [spot]: true }))
      setTimeout(() => setLit((l) => ({ ...l, [spot]: false })), 1100)
    }, 600)
    const tick = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - performance.now()) / 1000))
      setHud({ label: `📿 ${scoreRef.current} / 12`, timeLeft: left })
      if (left <= 0 && !doneRef.current) { doneRef.current = true; onEnd(false) }
    }, 250)
    setHud({ label: "📿 0 / 12", timeLeft: 20 })
    return () => { clearInterval(spawn); clearInterval(tick); doneRef.current = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (i) => {
    if (!lit[i] || doneRef.current) return
    setLit((l) => ({ ...l, [i]: false }))
    scoreRef.current++
    force((n) => n + 1)
    if (scoreRef.current >= 12) { doneRef.current = true; onEnd(true) }
  }

  return (
    <div className="minigame-arena mala-tap">
      {/* pointerdown, not click — fires on finger-down, so fast taps land in time */}
      {Array.from({ length: 12 }).map((_, i) => (
        <button key={i} className={`tap-spot ${lit[i] ? "tap-spot--lit" : ""}`} onPointerDown={() => tap(i)}>
          {lit[i] ? "🪔" : ""}
        </button>
      ))}
    </div>
  )
}

// ── Dispatcher ───────────────────────────────────────────────────────────────
const GAMES = [
  {
    key: "diya", title: "🪔 Diya Catch!", Component: DiyaCatch,
    howTo: <>Catch <b>8 diyas</b> with the golden thali!</>,
    controls: "Slide your finger to move the thali · or ← → keys",
  },
  {
    key: "lion", title: "🦁 Lion Leap!", Component: LionLeap,
    howTo: <>Jump over the rocks and <b>survive 15 seconds</b>!</>,
    controls: "Tap anywhere to jump · or SPACE key",
  },
  {
    key: "mala", title: "📿 Mala Tap!", Component: MalaTap,
    howTo: <>Tap <b>12 glowing diyas</b> before time runs out!</>,
    controls: "Tap the beads as they light up",
  },
]

const AUTO_START_SECONDS = 5

export default function MiniGame({ playerName, onDone }) {
  // window.__forceGame = 'diya' | 'lion' | 'mala' — testing hook
  const [game] = useState(
    () => GAMES.find((g) => g.key === window.__forceGame) || GAMES[Math.floor(Math.random() * GAMES.length)]
  )
  const [phase, setPhase] = useState("intro") // intro | play | won | lost
  const [countdown, setCountdown] = useState(AUTO_START_SECONDS)
  const [hud, setHud] = useState({ label: "", timeLeft: 0 })

  // Auto-start so nobody gets stuck on the intro — tap anywhere starts sooner.
  useEffect(() => {
    if (phase !== "intro") return
    if (countdown <= 0) { setPhase("play"); return }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, countdown])

  const end = (won) => {
    setPhase(won ? "won" : "lost")
    setTimeout(() => onDone(won), 2000)
  }

  const Game = game.Component
  return (
    <div className="screen minigame-screen">
      <div className="challenge-head">
        <span className="challenge-type" style={{ color: "var(--gold)" }}>{game.title} — Bonus Round</span>
        <span className="minigame-score">{hud.label}</span>
        <span className={`challenge-timer ${hud.timeLeft <= 5 && phase === "play" ? "timer-low" : ""}`}>
          ⏱ {phase === "intro" ? "—" : hud.timeLeft}
        </span>
      </div>

      <div className="minigame-wrap">
        {phase === "play" ? <Game onEnd={end} setHud={setHud} /> : <div className="minigame-arena" />}

        {phase === "play" && <div className="play-hint">{game.controls}</div>}

        {phase === "intro" && (
          <div className="minigame-overlay minigame-overlay--tappable" onClick={() => setPhase("play")}>
            <h2 className="screen-title">{game.title}</h2>
            <p className="minigame-text">
              {game.howTo}<br />
              Win a <b className="gold-text">🪔 SECOND CHANCE</b> on your challenge!
            </p>
            <p className="minigame-controls">{game.controls}</p>
            <div className="tap-to-play minigame-start">👆 TAP TO START 👆</div>
            <p className="minigame-countdown">Starting in {countdown}…</p>
            <button
              className="btn-ghost"
              onClick={(e) => { e.stopPropagation(); onDone(false) }}
            >
              Skip to challenge ▶
            </button>
          </div>
        )}

        {phase === "won" && (
          <div className="minigame-overlay">
            <ConfettiBurst emojis={["🎉", "🪔", "✨"]} />
            <div className="result-emoji bounce-in">🎉</div>
            <h2 className="screen-title bounce-in">BONUS WON, {playerName}!</h2>
            <p className="minigame-text">One wrong answer will be forgiven. Jay ho!</p>
          </div>
        )}

        {phase === "lost" && (
          <div className="minigame-overlay">
            <div className="result-emoji wiggle">💨</div>
            <h2 className="screen-title">So close!</h2>
            <p className="minigame-text">No bonus this time — but you&rsquo;ve got this! 💪</p>
          </div>
        )}
      </div>
    </div>
  )
}
