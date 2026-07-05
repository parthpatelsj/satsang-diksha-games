import { useEffect, useState } from "react"
import { ConfettiBurst } from "./Fx"

const TIME_LIMIT = 45 // seconds — keeps walk-up turns quick

export default function ChallengeScreen({ challenge, beadNumber, bonus = false, onComplete }) {
  const [picked, setPicked] = useState(null)      // mcq: option index
  const [ruledOut, setRuledOut] = useState([])    // mcq: wrong picks forgiven by bonus
  const [filled, setFilled] = useState([])        // sequence: chip ids in tap order
  const [bonusLeft, setBonusLeft] = useState(bonus)
  const [bonusFlash, setBonusFlash] = useState(false)
  const [outcome, setOutcome] = useState(null)    // 'correct' | 'wrong'
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)

  const finish = (correct) => {
    if (outcome) return
    setOutcome(correct ? "correct" : "wrong")
    setTimeout(() => onComplete(correct), 1400)
  }

  // A wrong move burns the Second Chance instead of ending the turn.
  const secondChance = () => {
    setBonusLeft(false)
    setBonusFlash(true)
    setTimeout(() => setBonusFlash(false), 1300)
  }

  useEffect(() => {
    if (outcome) return
    if (timeLeft <= 0) { finish(false); return }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, outcome]) // eslint-disable-line react-hooks/exhaustive-deps

  const pickOption = (i) => {
    if (outcome || ruledOut.includes(i)) return
    if (challenge.options[i].correct) {
      setPicked(i)
      finish(true)
    } else if (bonusLeft) {
      setRuledOut([...ruledOut, i])
      secondChance()
    } else {
      setPicked(i)
      finish(false)
    }
  }

  const tapChip = (chip) => {
    if (outcome || bonusFlash || filled.includes(chip.id)) return
    const next = [...filled, chip.id]
    if (next.length === challenge.answer.length) {
      const texts = next.map((id) => challenge.chips.find((c) => c.id === id).text)
      if (texts.join(" ") === challenge.answer.join(" ")) {
        setFilled(next)
        finish(true)
      } else if (bonusLeft) {
        setFilled([])
        secondChance()
      } else {
        setFilled(next)
        finish(false)
      }
    } else {
      setFilled(next)
    }
  }

  const chipText = (i) =>
    filled[i] != null ? challenge.chips.find((c) => c.id === filled[i]).text : null

  const isLion = challenge.type === "lion"
  let blankCounter = -1

  return (
    <div className={`screen challenge ${isLion ? "challenge--lion" : ""} ${outcome === "wrong" ? "challenge--shake" : ""}`}>
      <div className="challenge-head">
        <span className="challenge-type" style={{ color: challenge.typeMeta.color }}>
          {challenge.typeMeta.icon} {challenge.typeMeta.label}
        </span>
        <span className="challenge-bead">Playing for bead {beadNumber}</span>
        {bonusLeft && <span className="bonus-pill">🪔 Second Chance ready</span>}
        <span className={`challenge-timer ${timeLeft <= 10 ? "timer-low" : ""}`}>⏱ {timeLeft}</span>
      </div>

      <p className="challenge-instruction">{challenge.instruction}</p>

      {challenge.kind === "mcq" && (
        <>
          <div className="challenge-prompt">{challenge.prompt}</div>
          <div className="mcq-options">
            {challenge.options.map((opt, i) => (
              <button
                key={i}
                className={`mcq-option ${
                  ruledOut.includes(i) ? "opt-wrong opt-ruled-out" : ""
                } ${outcome && picked === i ? (opt.correct ? "opt-correct" : "opt-wrong") : ""} ${
                  outcome && opt.correct ? "opt-reveal" : ""
                }`}
                onClick={() => pickOption(i)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </>
      )}

      {challenge.kind === "sequence" && (
        <>
          <div className="sequence-line">
            {challenge.parts
              ? challenge.parts.map((p, i) => {
                  if (!p.blank) return <span key={i} className="seq-word">{p.text}</span>
                  blankCounter++
                  const t = chipText(blankCounter)
                  return (
                    <span key={i} className={`seq-blank ${t ? "seq-blank--filled" : ""}`}>
                      {t || "____"}
                    </span>
                  )
                })
              : challenge.answer.map((_, i) => {
                  const t = chipText(i)
                  return (
                    <span key={i} className={`seq-blank ${t ? "seq-blank--filled" : ""}`}>
                      {t || `${i + 1}.`}
                    </span>
                  )
                })}
          </div>
          <div className="chips">
            {challenge.chips.map((chip) => (
              <button
                key={chip.id}
                className={`chip ${filled.includes(chip.id) ? "chip--used" : ""}`}
                onClick={() => tapChip(chip)}
              >
                {chip.text}
              </button>
            ))}
          </div>
          <button
            className="btn-ghost"
            disabled={filled.length === 0 || !!outcome}
            onClick={() => setFilled(filled.slice(0, -1))}
          >
            ↩ Undo
          </button>
        </>
      )}

      {bonusFlash && (
        <div className="outcome-flash flash-bonus">🪔 SECOND CHANCE!</div>
      )}

      {outcome === "correct" && <ConfettiBurst />}
      {outcome && (
        <div className={`outcome-flash ${outcome === "correct" ? "flash-correct" : "flash-wrong"}`}>
          {outcome === "correct" ? "✅ SACHU!" : "❌ Not quite…"}
        </div>
      )}
    </div>
  )
}
