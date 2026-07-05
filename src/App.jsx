import { useEffect, useRef, useState } from "react"
import { SHLOKS } from "./data/shloks"
import { buildChallenge, chooseBead } from "./lib/challenges"
import { loadState, saveState, getBeads, cooldownRemaining } from "./lib/storage"
import { sfx } from "./lib/sfx"
import AttractMode from "./components/AttractMode"
import TeamSelect from "./components/TeamSelect"
import NameEntry from "./components/NameEntry"
import CharkhoWheel from "./components/CharkhoWheel"
import MiniGame from "./components/MiniGame"
import ChallengeScreen from "./components/ChallengeScreen"
import ResultScreen from "./components/ResultScreen"
import AdminPanel from "./components/AdminPanel"

const IDLE_MS = 75 * 1000 // abandoned mid-game → back to attract

export default function App() {
  const [state, setState] = useState(loadState)
  const [mode, setMode] = useState("attract")
  const [turn, setTurn] = useState({}) // { team, name, challenge, beadIndex, prevOwner, correct }
  const overrideTaps = useRef(0)

  useEffect(() => saveState(state), [state])
  useEffect(() => { sfx.setMuted(state.settings.soundEnabled === false) }, [state.settings.soundEnabled])

  const batchShloks = SHLOKS
    .filter((s) => s.id >= state.batchStart && s.id < state.batchStart + 25)
    .sort((a, b) => a.id - b.id)
  const beads = getBeads(state, batchShloks.length)

  // Idle watchdog: any screen except attract returns home after inactivity.
  useEffect(() => {
    if (mode === "attract" || mode === "admin") return
    const id = setTimeout(() => { setTurn({}); setMode("attract") }, IDLE_MS)
    return () => clearTimeout(id)
  }, [mode, turn])

  const goAttract = () => { setTurn({}); setMode("attract") }

  const submitName = (name) => {
    const remaining = cooldownRemaining(state, name)
    if (remaining > 0) {
      setTurn((t) => ({ ...t, name, cooldownMs: remaining }))
      overrideTaps.current = 0
      setMode("blocked")
    } else {
      setTurn((t) => ({ ...t, name }))
      setMode("wheel")
    }
  }

  const onWheelResult = (typeKey) => {
    const pick = chooseBead(beads, turn.team, typeKey === "lion")
    const shlok = batchShloks[pick.index]
    const challenge = buildChallenge(typeKey, shlok, batchShloks)
    setTurn((t) => ({ ...t, challenge, beadIndex: pick.index, prevOwner: pick.prevOwner }))
    setMode("minigame")
  }

  const onMiniGameDone = (bonusWon) => {
    setTurn((t) => ({ ...t, bonus: bonusWon }))
    setMode("challenge")
  }

  const onChallengeComplete = (correct) => {
    const shlok = batchShloks[turn.beadIndex]
    setState((s) => {
      const key = String(s.batchStart)
      const cur = getBeads(s, batchShloks.length)
      const nextBeads = correct ? cur.map((b, i) => (i === turn.beadIndex ? turn.team : b)) : cur
      return {
        ...s,
        beadsByBatch: { ...s.beadsByBatch, [key]: nextBeads },
        totals: correct
          ? { ...s.totals, [turn.team]: (s.totals[turn.team] || 0) + 1 }
          : s.totals,
        history: [
          {
            name: turn.name,
            team: turn.team,
            ts: Date.now(),
            shlokId: shlok.id,
            type: turn.challenge.type,
            correct,
            prevOwner: correct && turn.prevOwner !== turn.team ? turn.prevOwner : null,
          },
          ...s.history,
        ].slice(0, 200),
      }
    })
    setTurn((t) => ({ ...t, correct }))
    setMode("result")
  }

  // Hidden admin override on the blocked screen: tap the lion 5 times.
  const overrideTap = (e) => {
    e.stopPropagation()
    if (++overrideTaps.current >= 5) setMode("wheel")
  }

  return (
    <div className="app">
      {mode === "attract" && (
        <AttractMode
          beads={beads}
          batchStart={state.batchStart}
          totals={state.totals}
          history={state.history}
          shloks={batchShloks}
          onPlay={() => setMode("team")}
          onAdminTap={() => setMode("admin")}
        />
      )}

      {mode === "team" && (
        <TeamSelect
          beads={beads}
          onSelect={(team) => { setTurn({ team }); setMode("name") }}
          onBack={goAttract}
        />
      )}

      {mode === "name" && (
        <NameEntry team={turn.team} onSubmit={submitName} onBack={() => setMode("team")} />
      )}

      {mode === "blocked" && (
        <div className="screen center-screen" onClick={goAttract}>
          <div className="result-emoji wiggle" onClick={overrideTap}>🦁</div>
          <h2 className="screen-title">Let another sinh santan play first!</h2>
          <p className="result-line">
            Come back in {Math.ceil(turn.cooldownMs / 60000)} minute{turn.cooldownMs > 60000 ? "s" : ""} — practice your next shlok! 💪
          </p>
          <p className="result-hint">Tap anywhere to go back</p>
        </div>
      )}

      {mode === "wheel" && (
        <CharkhoWheel playerName={turn.name} onResult={onWheelResult} />
      )}

      {mode === "minigame" && (
        <MiniGame playerName={turn.name} onDone={onMiniGameDone} />
      )}

      {mode === "challenge" && (
        <ChallengeScreen
          challenge={turn.challenge}
          beadNumber={batchShloks[turn.beadIndex].id}
          bonus={turn.bonus}
          onComplete={onChallengeComplete}
        />
      )}

      {mode === "result" && (
        <ResultScreen
          correct={turn.correct}
          team={turn.team}
          name={turn.name}
          beadNumber={batchShloks[turn.beadIndex].id}
          prevOwner={turn.correct ? turn.prevOwner : null}
          shlok={batchShloks[turn.beadIndex]}
          onDone={goAttract}
        />
      )}

      {mode === "admin" && (
        <AdminPanel state={state} setState={setState} onClose={goAttract} />
      )}
    </div>
  )
}
