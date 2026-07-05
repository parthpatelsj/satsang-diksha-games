// Challenge generation. Every challenge is built from a target shlok plus
// distractor material from the rest of the batch.
//
// The builders follow the kids' memorization method:
//   - Finish the Line cuts at the chunk boundary (line 1 → line 2)
//   - Missing Words blanks the shlok's ANCHOR words first
//   - Word Scramble rebuilds the 4 rhythm chunks in order
//   - Lion Round is a harder word-level version, and steals a bead

export const CHALLENGE_TYPES = [
  { key: "finish",   label: "Finish the Line", icon: "📜", color: "#F5A623", weight: 1 },
  { key: "missing",  label: "Missing Words",   icon: "🧩", color: "#1FBFB0", weight: 1 },
  { key: "scramble", label: "Word Scramble",   icon: "🔀", color: "#8A7CFF", weight: 1 },
  { key: "arth",     label: "Arth Match",      icon: "💡", color: "#E85D5D", weight: 1 },
  { key: "lion",     label: "Lion Round",      icon: "🦁", color: "#FFD166", weight: 0.6 },
]

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickWeightedType() {
  const total = CHALLENGE_TYPES.reduce((s, t) => s + t.weight, 0)
  let r = Math.random() * total
  for (const t of CHALLENGE_TYPES) {
    r -= t.weight
    if (r <= 0) return t.key
  }
  return CHALLENGE_TYPES[0].key
}

const words = (s) => s.trim().split(/\s+/)

// Diacritic-insensitive comparison so anchors match tokens exactly.
const norm = (w) =>
  w.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "")

function otherShloks(all, shlok, n) {
  return shuffle(all.filter((s) => s.id !== shlok.id)).slice(0, n)
}

const line1 = (s) => s.chunks.slice(0, 2).join(" ")
const line2 = (s) => s.chunks.slice(2).join(" ")

// --- Builders. Two interaction kinds:
//   mcq:      { prompt, options: [{ text, correct }] }
//   sequence: { chips: [{ id, text }], answer: [text...], parts? }  (tap in order)

function buildFinish(shlok, all) {
  const distractors = otherShloks(all, shlok, 2)
  return {
    kind: "mcq",
    instruction: "Finish the shlok! Pick the correct second line.",
    prompt: `“${line1(shlok)} …”`,
    options: shuffle([
      { text: line2(shlok), correct: true },
      ...distractors.map((s) => ({ text: line2(s), correct: false })),
    ]),
  }
}

function buildMissing(shlok, all, blanksCount = 2) {
  const w = words(shlok.transliteration)
  const anchorSet = new Set((shlok.anchors || []).map(norm))
  // Blank anchor words first — they are the memory hooks. Fall back to longer words.
  const anchorIdx = w.map((word, i) => ({ word, i })).filter(({ word }) => anchorSet.has(norm(word)))
  const otherIdx = w.map((word, i) => ({ word, i })).filter(({ word }) => !anchorSet.has(norm(word)) && norm(word).length > 2)
  const blanks = [...shuffle(anchorIdx), ...shuffle(otherIdx)]
    .slice(0, blanksCount)
    .map((c) => c.i)
    .sort((a, b) => a - b)
  const answer = blanks.map((i) => w[i])
  // Distractors: anchor words from other shloks — thematic but wrong.
  const inShlok = new Set(w.map(norm))
  const distractorPool = shuffle(all.filter((s) => s.id !== shlok.id))
    .flatMap((s) => s.anchors || [])
    .filter((word) => !inShlok.has(norm(word)))
  const chips = shuffle([...answer, ...[...new Set(distractorPool)].slice(0, 2)])
  return {
    kind: "sequence",
    instruction: "Fill in the missing words, in order.",
    parts: w.map((word, i) => (blanks.includes(i) ? { blank: true } : { text: word })),
    chips: chips.map((text, id) => ({ id, text })),
    answer,
  }
}

function buildScramble(shlok) {
  // Rebuild the 4 rhythm chunks in order — exactly how the shlok is memorized.
  const answer = [...shlok.chunks]
  let chips = shuffle(answer)
  if (chips.join(" ") === answer.join(" ")) chips = [...answer].reverse()
  return {
    kind: "sequence",
    instruction: "Tap the 4 chunks in the correct order.",
    parts: null,
    chips: chips.map((text, id) => ({ id, text })),
    answer,
  }
}

function buildLionScramble(shlok) {
  // Harder: rebuild one full line word by word.
  const useFirst = Math.random() < 0.5
  const answer = words(useFirst ? line1(shlok) : line2(shlok))
  let chips = shuffle(answer)
  if (chips.join(" ") === answer.join(" ")) chips = [...answer].reverse()
  return {
    kind: "sequence",
    instruction: `Rebuild ${useFirst ? "the FIRST" : "the SECOND"} line, word by word.`,
    parts: null,
    chips: chips.map((text, id) => ({ id, text })),
    answer,
  }
}

function buildArth(shlok, all) {
  const distractors = otherShloks(all, shlok, 2)
  return {
    kind: "mcq",
    instruction: "Which shlok matches this meaning?",
    prompt: `“${shlok.meaning}”`,
    options: shuffle([
      { text: shlok.chunks[0] + " …", correct: true },
      ...distractors.map((s) => ({ text: s.chunks[0] + " …", correct: false })),
    ]),
  }
}

function buildLion(shlok, all) {
  const c = Math.random() < 0.5 ? buildLionScramble(shlok) : buildMissing(shlok, all, 3)
  c.instruction = "🦁 LION ROUND — get it right to STEAL a bead! " + c.instruction
  return c
}

export function buildChallenge(typeKey, shlok, allShloks) {
  const meta = CHALLENGE_TYPES.find((t) => t.key === typeKey)
  const base =
    typeKey === "finish"   ? buildFinish(shlok, allShloks) :
    typeKey === "missing"  ? buildMissing(shlok, allShloks) :
    typeKey === "scramble" ? buildScramble(shlok) :
    typeKey === "arth"     ? buildArth(shlok, allShloks) :
    buildLion(shlok, allShloks)
  return { ...base, type: typeKey, typeMeta: meta, shlokId: shlok.id }
}

// Pick which bead this turn plays for. Lion rounds steal; otherwise
// unclaimed beads come first, then stealing once the board is full.
export function chooseBead(beads, teamId, isLion) {
  const idx = beads.map((_, i) => i)
  const unclaimed = idx.filter((i) => !beads[i])
  const stealable = idx.filter((i) => beads[i] && beads[i] !== teamId)
  const pick = (list) => list[Math.floor(Math.random() * list.length)]
  // Steal from the group holding the most beads.
  const pickSteal = () => {
    const counts = {}
    for (const i of stealable) counts[beads[i]] = (counts[beads[i]] || 0) + 1
    const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
    return pick(stealable.filter((i) => beads[i] === top))
  }
  let index
  if (isLion && stealable.length) index = pickSteal()
  else if (unclaimed.length) index = pick(unclaimed)
  else if (stealable.length) index = pickSteal()
  else index = pick(idx) // player's team owns everything
  return { index, prevOwner: beads[index] || null }
}
