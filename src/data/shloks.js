// ============================================================================
// SHLOK DATA — Satsang Diksha shloks 1–25 (Sanskrit transliteration)
//
// Each shlok follows the kids' memorization method:
//   chunks:  4 rhythm chunks (2 per line) — memorize by chunks, not full lines
//   anchors: 2–4 anchor words that unlock the shlok
//   meaning: short English meaning for flow
//
// `transliteration` is derived automatically from the chunks.
// To add batch 2 (shloks 26–50), append entries with id: 26 ... 50 —
// the admin panel batch switcher picks them up automatically.
// ============================================================================

const RAW = [
  {
    id: 1,
    chunks: ["Svāminārāyaṇaḥ sākṣād", "akṣara-puruṣottamaḥ", "sarvebhyaḥ paramāṁ śāntim", "ānandaṁ sukham arpayet"],
    anchors: ["Svāminārāyaṇaḥ", "śāntim", "ānandaṁ", "sukham"],
    meaning: "May Swaminarayan Bhagwan, Akshar-Purushottam Maharaj himself, give ultimate peace, bliss, and happiness to all.",
  },
  {
    id: 2,
    chunks: ["Deho'yaṁ sādhanaṁ mukter", "na bhoga-mātra-sādhanam", "durlabho naśvaraś cā'yaṁ", "vāraṁ-vāraṁ na labhyate"],
    anchors: ["mukter", "durlabho", "naśvaraś", "vāraṁ-vāraṁ"],
    meaning: "This body is a means for moksha, not just enjoyment. It is rare, temporary, and not received again and again.",
  },
  {
    id: 3,
    chunks: ["Laukiko vyavahāras tu", "deha-nirvāha-hetukaḥ", "naiva sa paramaṁ lakṣyam", "asya manuṣya-janmanaḥ"],
    anchors: ["Laukiko", "vyavahāras", "paramaṁ", "lakṣyam"],
    meaning: "Worldly activities are for maintaining the body, but they are not the highest goal of human birth.",
  },
  {
    id: 4,
    chunks: ["Nāśāya sarva-doṣāṇāṁ", "brahma-sthiter avāptaye", "kartuṁ bhagavato bhaktim", "asya dehasya lambhanam"],
    anchors: ["Nāśāya", "sarva-doṣāṇāṁ", "bhaktim"],
    meaning: "This body has been received to remove all faults, attain the brahmic state, and offer devotion to Bhagwan.",
  },
  {
    id: 5,
    chunks: ["Sarvam idaṁ hi satsaṅgāl", "labhyate niścitaṁ janaiḥ", "ataḥ sadaiva satsaṅgaḥ", "karaṇīyo mumukṣubhiḥ"],
    anchors: ["satsaṅgāl", "sadaiva", "mumukṣubhiḥ"],
    meaning: "All this is certainly attained through satsang. Therefore, mumukshus should always practice satsang.",
  },
  {
    id: 6,
    chunks: ["Satsaṅgaḥ sthāpitas tasmād", "divyo'yaṁ parabrahmaṇā", "Svāminārāyaṇeneha", "sākṣād evā'vatīrya ca"],
    anchors: ["sthāpitas", "parabrahmaṇā", "Svāminārāyaṇeneha"],
    meaning: "For this reason, Parabrahman Swaminarayan personally manifested on earth and established this divine satsang.",
  },
  {
    id: 7,
    chunks: ["Satsaṅgasyā'sya vijñānaṁ", "mumukṣūṇāṁ bhaved iti", "śāstraṁ Satsaṅga-dīkṣeti", "śubhāśayād viracyate"],
    anchors: ["vijñānaṁ", "śāstraṁ", "Satsaṅga-dīkṣeti"],
    meaning: "This shastra, called Satsang Diksha, was composed so mumukshus can understand this satsang.",
  },
  {
    id: 8,
    chunks: ["Satyasya svātmanaḥ saṅgaḥ", "satyasya paramātmanaḥ", "satyasya ca guroḥ saṅgaḥ", "sacchāstrāṇāṁ tathaiva ca"],
    anchors: ["satyasya", "svātmanaḥ", "paramātmanaḥ", "guroḥ"],
    meaning: "True satsang means association with the true atma, true Paramatma, true guru, and true shastras.",
  },
  {
    id: 9,
    chunks: ["Vijñātavyam idaṁ satyaṁ", "satsaṅgasya hi lakṣaṇam", "kurvann evaṁvidhaṁ divyaṁ", "satsaṅgaṁ syāt sukhī janaḥ"],
    anchors: ["lakṣaṇam", "divyaṁ", "sukhī"],
    meaning: "This should be understood as the true meaning of satsang. One who practices this divine satsang becomes happy.",
  },
  {
    id: 10,
    chunks: ["Dīkṣeti dṛḍha-saṅkalpaḥ", "saśraddhaṁ niścayo'calaḥ", "samyak samarpaṇaṁ prītyā", "niṣṭhā vrataṁ dṛḍhāśrayaḥ"],
    anchors: ["dṛḍha-saṅkalpaḥ", "samarpaṇaṁ", "niṣṭhā", "dṛḍhāśrayaḥ"],
    meaning: "Diksha means firm resolve, unwavering conviction with faith, complete dedication, loving commitment, observance, and firm refuge.",
  },
  {
    id: 11,
    chunks: ["Śāstre'smiñ jñāpitā spaṣṭam", "ājñopāsanā-paddhatiḥ", "Paramātma-parabrahma-", "Sahajānanda-darśitā"],
    anchors: ["spaṣṭam", "ājñopāsanā-paddhatiḥ", "Sahajānanda-darśitā"],
    meaning: "This shastra clearly explains the method of agna and upasana revealed by Parabrahman Sahajanand Paramatma.",
  },
  {
    id: 12,
    chunks: ["Satsaṅgā'dhikṛtaḥ sarve", "sarve sukhā'dhikāriṇaḥ", "sarve'rhā brahmavidyāyāṁ", "nāryaś caiva narās tathā"],
    anchors: ["sarve", "brahmavidyāyāṁ", "nāryaś", "narās"],
    meaning: "All men and women are entitled to satsang, happiness, and brahmavidya.",
  },
  {
    id: 13,
    chunks: ["Naiva nyūnādhikatvaṁ syāt", "satsaṅge liṅga-bhedataḥ", "svasva-maryādayā sarve", "bhaktyā muktiṁ samāpnuyuḥ"],
    anchors: ["nyūnādhikatvaṁ", "liṅga-bhedataḥ", "bhaktyā", "muktiṁ"],
    meaning: "In satsang, no one is superior or inferior based on gender. All can attain moksha through devotion while following their own dharma.",
  },
  {
    id: 14,
    chunks: ["Sarvavarṇagatāḥ sarvā", "nāryaḥ sarve narās tathā", "satsaṅge brahmavidyāyāṁ", "mokṣe sadā'dhikāriṇaḥ"],
    anchors: ["Sarvavarṇagatāḥ", "mokṣe", "sadā'dhikāriṇaḥ"],
    meaning: "All men and women of all communities are always entitled to satsang, brahmavidya, and moksha.",
  },
  {
    id: 15,
    chunks: ["Na nyūnā'dhikatā kāryā", "varṇādhāreṇa karhicit", "tyaktvā svavarṇa-mānaṁ ca", "sevā kāryā mithaḥ samaiḥ"],
    anchors: ["varṇādhāreṇa", "tyaktvā", "sevā"],
    meaning: "Never see others as higher or lower based on community. Giving up such pride, everyone should serve one another equally.",
  },
  {
    id: 16,
    chunks: ["Jātyā naiva mahān ko'pi", "naiva nyūnas tathā yataḥ", "jātyā kleśo na kartavyaḥ", "sukhaṁ satsaṅgam ācaret"],
    anchors: ["Jātyā", "kleśo", "sukhaṁ"],
    meaning: "No one is great or low by birth. One should not quarrel over caste or class, but happily practice satsang.",
  },
  {
    id: 17,
    chunks: ["Sarve'dhikāriṇo mokṣe", "gṛhiṇas tyāgino'pi ca", "na nyūnā'dhikatā tatra", "sarve bhaktā yataḥ prabhoḥ"],
    anchors: ["mokṣe", "gṛhiṇas", "tyāgino'pi", "bhaktā"],
    meaning: "Householders and renunciants are both entitled to moksha. Neither is higher or lower, because all are devotees of Bhagwan.",
  },
  {
    id: 18,
    chunks: ["Svāminārāyaṇe'nanya-", "dṛḍha-parama-bhaktaye", "gṛhītvā'śraya-dīkṣāyā", "mantraṁ satsaṅgam āpnuyāt"],
    anchors: ["dṛḍha-parama-bhaktaye", "mantraṁ"],
    meaning: "For singular, firm, supreme devotion to Bhagwan Swaminarayan, one should receive the Ashray Diksha Mantra and enter satsang.",
  },
  {
    id: 19,
    chunks: ["Dhanyo'smi pūrṇa-kāmo'smi", "niṣpāpo nirbhayaḥ sukhī", "Akṣara-guru-yogena", "Svāminārāyaṇāśrayāt"],
    anchors: ["Dhanyo'smi", "niṣpāpo", "nirbhayaḥ", "sukhī"],
    meaning: "The Ashray Diksha Mantra: Through the association of the Akshar Guru and the refuge of Swaminarayan, I am blessed, fulfilled, sinless, fearless, and happy.",
  },
  {
    id: 20,
    chunks: ["Āśrayet Sahajānandaṁ", "Hariṁ brahmākṣaraṁ tathā", "Guṇātītaṁ guruṁ prītyā", "mumukṣuḥ svātma-muktaye"],
    anchors: ["Āśrayet", "Sahajānandaṁ", "Guṇātītaṁ", "guruṁ"],
    meaning: "For the moksha of one's atma, a mumukshu should lovingly take refuge in Sahajanand Shri Hari and the Aksharbrahman Gunatit Guru.",
  },
  {
    id: 21,
    chunks: ["Kāṣṭhajāṁ dviguṇāṁ mālāṁ", "kaṇṭhe sadaiva dhārayet", "satsaṅgaṁ hi samāśritya", "satsaṅga-niyamāṁs tathā"],
    anchors: ["Kāṣṭhajāṁ", "dviguṇāṁ", "mālāṁ", "kaṇṭhe"],
    meaning: "After taking refuge in satsang, one should always wear a double-stranded wooden kanthi and accept the niyams of satsang.",
  },
  {
    id: 22,
    chunks: ["Guruṁ brahmasvarūpaṁ tu", "vinā na sambhaved bhave", "tattvato brahmavidyāyāḥ", "sākṣātkāro hi jīvane"],
    anchors: ["brahmasvarūpaṁ", "vinā", "sākṣātkāro"],
    meaning: "In this world, brahmavidya cannot be truly realized in life without the Brahmaswarup Guru.",
  },
  {
    id: 23,
    chunks: ["Nottamo nirvikalpaś ca", "niścayaḥ paramātmanaḥ", "na svātma-brahma-bhāvo'pi", "brahmākṣaraṁ guruṁ vinā"],
    anchors: ["niścayaḥ", "svātma-brahma-bhāvo'pi", "vinā"],
    meaning: "Without the Aksharbrahman Guru, one cannot attain supreme unwavering conviction in Paramatma or brahmabhav in one's own atma.",
  },
  {
    id: 24,
    chunks: ["Naivā'pi tattvato bhaktiḥ", "paramānanda-prāpaṇam", "nā'pi trividha-tāpānāṁ", "nāśo brahma-guruṁ vinā"],
    anchors: ["bhaktiḥ", "paramānanda-prāpaṇam", "trividha-tāpānāṁ"],
    meaning: "Without the Brahmaswarup Guru, true bhakti, ultimate bliss, and removal of the three types of misery cannot be fully attained.",
  },
  {
    id: 25,
    chunks: ["Ataḥ samāśrayen nityaṁ", "pratyakṣam akṣaraṁ gurum", "sarva-siddhikaraṁ divyaṁ", "paramātmā'nubhāvakam"],
    anchors: ["Ataḥ", "nityaṁ", "pratyakṣam", "akṣaraṁ"],
    meaning: "Therefore, one should always take refuge in the manifest Aksharbrahman Guru, who grants all spiritual attainments and helps one experience Paramatma.",
  },
]

export const SHLOKS = RAW.map((s) => ({
  ...s,
  transliteration: s.chunks.join(" "),
}))

// Two display lines (2 chunks each) for showing a shlok on screen.
export function shlokLines(shlok) {
  if (!shlok.chunks) return [shlok.transliteration]
  return [shlok.chunks.slice(0, 2).join("  "), shlok.chunks.slice(2).join("  ")]
}

// Teams (groups) competing on the mala board.
export const TEAMS = [
  { id: "2A", name: "Bal 2A", color: "#F5A623", dark: "#7a4d05" },
  { id: "2B", name: "Bal 2B", color: "#1FBFB0", dark: "#0b5850" },
  { id: "3",  name: "Bal 3",  color: "#E85D5D", dark: "#6e1717" },
]

export const GOAL_TEXT = "Goal: Every balak gives at least 1 test by July 26"
