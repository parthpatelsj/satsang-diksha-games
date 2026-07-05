import { useState } from "react"
import { sfx } from "../lib/sfx"

const ROWS = ["ABCDEFGHI", "JKLMNOPQR", "STUVWXYZ"]

// Big on-screen keyboard so the TV never needs an OS keyboard.
export default function NameEntry({ team, onSubmit, onBack }) {
  const [name, setName] = useState("")

  const add = (ch) => {
    sfx.key()
    setName((n) => (n.length < 10 ? n + ch : n))
  }

  return (
    <div className="screen center-screen">
      <h2 className="screen-title">Enter your name or initials</h2>
      <div className="name-display">
        {name
          ? name.split("").map((ch, i) => (
              <span key={`${i}${ch}`} className="name-letter">{ch}</span>
            ))
          : <span className="name-hint">TAP LETTERS BELOW</span>}
      </div>
      <div className="keyboard">
        {ROWS.map((row) => (
          <div key={row} className="kb-row">
            {row.split("").map((ch) => (
              <button key={ch} className="kb-key" onClick={() => add(ch)}>{ch}</button>
            ))}
          </div>
        ))}
        <div className="kb-row">
          <button className="kb-key kb-wide" onClick={() => { sfx.back(); setName(name.slice(0, -1)) }}>⌫</button>
          <button
            className="kb-key kb-wide kb-go"
            disabled={name.trim().length < 2}
            onClick={() => { sfx.select(); onSubmit(name.trim()) }}
          >
            GO ▶
          </button>
        </div>
      </div>
      <button className="btn-ghost" onClick={() => { sfx.back(); onBack() }}>← Back</button>
    </div>
  )
}
