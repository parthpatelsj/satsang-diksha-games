// Tiny Web Audio synth for the kiosk's sound effects — no audio files needed.
// Every sound is a short generated blip routed through one quiet master gain,
// so the whole layer stays subtle and can be muted from the admin panel.

let ctx = null
let master = null
let muted = false

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.16 // deliberately quiet — fx, not music
    master.connect(ctx.destination)
  }
  if (ctx.state === "suspended") ctx.resume()
  return ctx
}

// Browsers only allow audio after a user gesture — warm the context on the
// first touch so the very first tap sound isn't swallowed.
if (typeof window !== "undefined") {
  const unlock = () => {
    ensureCtx()
    window.removeEventListener("pointerdown", unlock)
  }
  window.addEventListener("pointerdown", unlock)
}

// One enveloped oscillator note. `time` is seconds from now (for sequencing).
function tone({ freq, freqEnd, time = 0, dur = 0.1, type = "sine", vol = 1 }) {
  if (muted) return
  const c = ensureCtx()
  if (!c) return
  const t = c.currentTime + time
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + dur)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain)
  gain.connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

export const sfx = {
  setMuted(m) {
    muted = m
  },

  // ── UI ──────────────────────────────────────────────────────────────────
  tap() {
    tone({ freq: 520, freqEnd: 380, dur: 0.07, type: "triangle", vol: 0.5 })
  },
  key() {
    tone({ freq: 740, freqEnd: 620, dur: 0.045, type: "triangle", vol: 0.35 })
  },
  select() {
    tone({ freq: 523, dur: 0.08, type: "triangle", vol: 0.5 })
    tone({ freq: 784, time: 0.07, dur: 0.1, type: "triangle", vol: 0.5 })
  },
  back() {
    tone({ freq: 440, freqEnd: 300, dur: 0.09, type: "triangle", vol: 0.4 })
  },
  tick() {
    tone({ freq: 950, dur: 0.035, type: "sine", vol: 0.3 })
  },

  // ── Wheel ───────────────────────────────────────────────────────────────
  // Decelerating clicks that ride along with the wheel's ease-out spin.
  spin(duration = 4.2) {
    let t = 0
    let gap = 0.03
    while (t < duration - 0.15) {
      tone({ freq: 620, time: t, dur: 0.03, type: "triangle", vol: 0.28 })
      t += gap
      gap = Math.min(0.4, gap * 1.09)
    }
  },
  land() {
    tone({ freq: 587, dur: 0.12, type: "triangle", vol: 0.55 })
    tone({ freq: 880, time: 0.1, dur: 0.2, type: "triangle", vol: 0.55 })
  },

  // ── Mini-games ──────────────────────────────────────────────────────────
  pop() {
    tone({ freq: 420, freqEnd: 900, dur: 0.08, type: "sine", vol: 0.5 })
  },
  jump() {
    tone({ freq: 260, freqEnd: 620, dur: 0.16, type: "sine", vol: 0.45 })
  },

  // ── Outcomes ────────────────────────────────────────────────────────────
  correct() {
    tone({ freq: 660, dur: 0.1, type: "sine", vol: 0.55 })
    tone({ freq: 880, time: 0.09, dur: 0.16, type: "sine", vol: 0.55 })
  },
  wrong() {
    tone({ freq: 200, freqEnd: 140, dur: 0.25, type: "sawtooth", vol: 0.3 })
  },
  bonus() {
    tone({ freq: 880, dur: 0.07, type: "sine", vol: 0.45 })
    tone({ freq: 1175, time: 0.06, dur: 0.07, type: "sine", vol: 0.45 })
    tone({ freq: 1568, time: 0.12, dur: 0.14, type: "sine", vol: 0.45 })
  },
  win() {
    tone({ freq: 523, dur: 0.12, type: "triangle", vol: 0.55 })
    tone({ freq: 659, time: 0.1, dur: 0.12, type: "triangle", vol: 0.55 })
    tone({ freq: 784, time: 0.2, dur: 0.12, type: "triangle", vol: 0.55 })
    tone({ freq: 1047, time: 0.3, dur: 0.3, type: "triangle", vol: 0.6 })
  },
  lose() {
    tone({ freq: 392, dur: 0.14, type: "triangle", vol: 0.4 })
    tone({ freq: 311, time: 0.13, dur: 0.24, type: "triangle", vol: 0.4 })
  },
}
