  import { useState, useEffect, useRef } from "react";
  
  const LANGUAGES = ["English","Spanish","French","Portuguese","Chinese","Arabic","Vietnamese","Korean","Tagalog","Hindi"];
  const API_URL = import.meta.env.VITE_API_URL || "https://api.anthropic.com/v1/messages";
  
  const TITLE_TRANSLATIONS = [
    { text: "Let's Make You a Citizen!", lang: "English" },
    { text: "¡Hagámosте Ciudadano!", lang: "Español" },
    { text: "Devenez Citoyen!", lang: "Français" },
    { text: "Vamos Te Tornar Cidadão!", lang: "Português" },
    { text: "让我们让你成为公民！", lang: "中文" },
    { text: "لنجعلك مواطناً!", lang: "العربية" },
    { text: "Hãy Trở Thành Công Dân!", lang: "Tiếng Việt" },
    { text: "시민이 되어봅시다!", lang: "한국어" },
    { text: "Maging Mamamayan Ka!", lang: "Tagalog" },
    { text: "आइए आपको नागरिक बनाएं!", lang: "हिन्दी" },
  ];
  
  const USCIS_QA = [
    { q: "What is the supreme law of the land?", a: "the Constitution" },
    { q: "What does the Constitution do?", a: "sets up the government, defines the government, protects basic rights of Americans" },
    { q: "The idea of self-government is in the first three words of the Constitution. What are these words?", a: "We the People" },
    { q: "What is an amendment?", a: "a change to the Constitution, an addition to the Constitution" },
    { q: "What do we call the first ten amendments to the Constitution?", a: "the Bill of Rights" },
    { q: "What is one right or freedom from the First Amendment?", a: "speech, religion, assembly, press, petition the government" },
    { q: "How many amendments does the Constitution have?", a: "twenty-seven (27)" },
    { q: "What did the Declaration of Independence do?", a: "announced our independence from Great Britain" },
    { q: "What are two rights in the Declaration of Independence?", a: "life, liberty, pursuit of happiness" },
    { q: "What is freedom of religion?", a: "You can practice any religion, or not practice a religion." },
    { q: "What is the economic system in the United States?", a: "capitalist economy, market economy" },
    { q: "What is the rule of law?", a: "Everyone must follow the law. No one is above the law." },
    { q: "Name one branch or part of the government.", a: "Congress, legislative, President, executive, the courts, judicial" },
    { q: "What stops one branch of government from becoming too powerful?", a: "checks and balances, separation of powers" },
    { q: "Who is in charge of the executive branch?", a: "the President" },
    { q: "Who makes federal laws?", a: "Congress, Senate and House of Representatives" },
    { q: "What are the two parts of the U.S. Congress?", a: "the Senate and House of Representatives" },
    { q: "How many U.S. Senators are there?", a: "one hundred (100)" },
    { q: "We elect a U.S. Senator for how many years?", a: "six (6)" },
    { q: "Who is one of your state's U.S. Senators now?", a: "Answers will vary by state" },
    { q: "The House of Representatives has how many voting members?", a: "four hundred thirty-five (435)" },
    { q: "We elect a U.S. Representative for how many years?", a: "two (2)" },
    { q: "Name your U.S. Representative.", a: "Answers will vary by district" },
    { q: "Who does a U.S. Senator represent?", a: "all people of the state" },
    { q: "Why do some states have more Representatives than other states?", a: "because of the state's population" },
    { q: "We elect a President for how many years?", a: "four (4)" },
    { q: "In what month do we vote for President?", a: "November" },
    { q: "If the President can no longer serve, who becomes President?", a: "the Vice President" },
    { q: "If both the President and the Vice President can no longer serve, who becomes President?", a: "the Speaker of the House" },
    { q: "Who is the Commander in Chief of the military?", a: "the President" },
    { q: "Who signs bills to become laws?", a: "the President" },
    { q: "Who vetoes bills?", a: "the President" },
    { q: "What does the President's Cabinet do?", a: "advises the President" },
    { q: "What are two Cabinet-level positions?", a: "Secretary of State, Secretary of Defense, Attorney General, Vice President" },
    { q: "What does the judicial branch do?", a: "reviews laws, explains laws, resolves disputes" },
    { q: "What is the highest court in the United States?", a: "the Supreme Court" },
    { q: "How many justices are on the Supreme Court?", a: "nine (9)" },
    { q: "Who is the Chief Justice of the United States now?", a: "John Roberts" },
    { q: "What is one power of the federal government?", a: "to print money, to declare war, to create an army, to make treaties" },
    { q: "What is one power of the states?", a: "provide schooling and education, give a driver's license, approve zoning and land use" },
    { q: "Who is the Governor of your state now?", a: "Answers will vary by state" },
    { q: "What is the capital of your state?", a: "Answers will vary by state" },
    { q: "What are the two major political parties in the United States?", a: "Democratic and Republican" },
    { q: "Describe one amendment about who can vote.", a: "Citizens eighteen and older can vote. You do not have to pay a poll tax to vote. Any citizen can vote. Women and men can vote." },
    { q: "What is one responsibility that is only for United States citizens?", a: "serve on a jury, vote in a federal election" },
    { q: "Name one right only for United States citizens.", a: "vote in a federal election, run for federal office" },
    { q: "What are two rights of everyone living in the United States?", a: "freedom of expression, freedom of speech, freedom of assembly, freedom of religion, the right to bear arms" },
    { q: "What do we show loyalty to when we say the Pledge of Allegiance?", a: "the United States, the flag" },
    { q: "What is one promise you make when you become a United States citizen?", a: "give up loyalty to other countries, defend the Constitution, obey the laws of the United States" },
    { q: "How old do citizens have to be to vote for President?", a: "eighteen (18) and older" },
    { q: "What are two ways that Americans can participate in their democracy?", a: "vote, join a political party, run for office, write to a newspaper" },
    { q: "When is the last day you can send in federal income tax forms?", a: "April 15" },
    { q: "When must all men register for the Selective Service?", a: "at age eighteen, between eighteen and twenty-six" },
    { q: "What is one reason colonists came to America?", a: "freedom, religious freedom, economic opportunity, escape persecution" },
    { q: "Who lived in America before the Europeans arrived?", a: "American Indians, Native Americans" },
    { q: "What group of people was taken to America and sold as slaves?", a: "Africans, people from Africa" },
    { q: "Why did the colonists fight the British?", a: "because of high taxes, because they did not have self-government" },
    { q: "Who wrote the Declaration of Independence?", a: "Thomas Jefferson" },
    { q: "When was the Declaration of Independence adopted?", a: "July 4, 1776" },
    { q: "There were 13 original states. Name three.", a: "New Hampshire, Massachusetts, Rhode Island, Connecticut, New York, New Jersey, Pennsylvania, Delaware, Maryland, Virginia, North Carolina, South Carolina, Georgia" },
    { q: "What happened at the Constitutional Convention?", a: "The Constitution was written." },
    { q: "When was the Constitution written?", a: "1787" },
    { q: "Name one writer of the Federalist Papers.", a: "James Madison, Alexander Hamilton, John Jay" },
    { q: "What is one thing Benjamin Franklin is famous for?", a: "U.S. diplomat, oldest member of the Constitutional Convention, first Postmaster General" },
    { q: "Who is the Father of Our Country?", a: "George Washington" },
    { q: "Who was the first President?", a: "George Washington" },
    { q: "What territory did the United States buy from France in 1803?", a: "the Louisiana Territory" },
    { q: "Name one war fought by the United States in the 1800s.", a: "War of 1812, Mexican-American War, Civil War, Spanish-American War" },
    { q: "What did the Emancipation Proclamation do?", a: "freed the slaves in the Confederacy" },
    { q: "What did Susan B. Anthony do?", a: "fought for women's rights" },
    { q: "Name one war fought by the United States in the 1900s.", a: "World War I, World War II, Korean War, Vietnam War, Gulf War" },
    { q: "Why did the United States enter World War I?", a: "because Archduke Franz Ferdinand was assassinated, to support the allies" },
    { q: "When did all men and women get the right to vote?", a: "1920" },
    { q: "What movement tried to end racial discrimination?", a: "civil rights movement" },
    { q: "What did Martin Luther King Jr. do?", a: "fought for civil rights, worked for equality for all Americans" },
    { q: "What major event happened on September 11, 2001?", a: "Terrorists attacked the United States." },
    { q: "Name one American Indian tribe in the United States.", a: "Cherokee, Navajo, Sioux, Apache, Iroquois, Creek, Seminole, Cheyenne, Lakota, Hopi, Inuit" },
    { q: "Name one of the two longest rivers in the United States.", a: "Missouri River, Mississippi River" },
    { q: "What ocean is on the West Coast of the United States?", a: "Pacific Ocean" },
    { q: "What ocean is on the East Coast of the United States?", a: "Atlantic Ocean" },
    { q: "Name one U.S. territory.", a: "Puerto Rico, U.S. Virgin Islands, American Samoa, Northern Mariana Islands, Guam" },
    { q: "Name one state that borders Canada.", a: "Maine, New Hampshire, Vermont, New York, Ohio, Michigan, Minnesota, North Dakota, Montana, Idaho, Washington, Alaska" },
    { q: "Name one state that borders Mexico.", a: "California, Arizona, New Mexico, Texas" },
    { q: "What is the capital of the United States?", a: "Washington, D.C." },
    { q: "Where is the Statue of Liberty?", a: "New York Harbor, Liberty Island" },
    { q: "Why does the flag have 13 stripes?", a: "because there were 13 original colonies" },
    { q: "Why does the flag have 50 stars?", a: "because there is one star for each state" },
    { q: "What is the name of the national anthem?", a: "The Star-Spangled Banner" },
    { q: "When do we celebrate Independence Day?", a: "July 4" },
    { q: "Name two national U.S. holidays.", a: "New Year's Day, Martin Luther King Jr. Day, Presidents Day, Memorial Day, Independence Day, Labor Day, Veterans Day, Thanksgiving, Christmas" },
  ];
  
  const SYSTEM_PROMPT = `You are a U.S. citizenship test quiz generator. You will receive a list of civics questions with their official answers.
  Your job is to turn each one into a multiple choice question with 4 options.
  
  OUTPUT FORMAT: Return ONLY a raw JSON array. No markdown. No code fences. No explanation. Begin your entire response with [ and end with ].
  
  Each item in the array must look exactly like this:
  {"question":"...","options":["option text A","option text B","option text C","option text D"],"answer":"A","explanation":"..."}
  
  Rules:
  - "answer" must be exactly "A", "B", "C", or "D" — nothing else
  - options is an array of exactly 4 strings
  - Randomly place the correct answer at position A, B, C, or D
  - Write 3 wrong but plausible distractors
  - Write all text in the language specified by the user
  - Explanations should be 1 sentence`;
  
  // ─── SVG Background ───────────────────────────────────────────────────────────
  function USBackground() {
    return (
      <svg
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="usbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1a237e" />
            <stop offset="100%" stopColor="#0d0d2b" />
          </radialGradient>
          <pattern id="uspat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,5 32,22 50,22 36,33 41,50 30,39 19,50 24,33 10,22 28,22" fill="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#usbg)" />
        <rect width="100%" height="100%" fill="url(#uspat)" />
        {[0,1,2,3,4,5].map(i => (
          <rect key={i} x="0" y={`${78 + i * 4}%`} width="100%" height="3.2%"
            fill={i % 2 === 0 ? "rgba(178,34,34,0.35)" : "rgba(255,255,255,0.07)"} />
        ))}
        {/* Flag corner */}
        <g opacity="0.12">
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={i} x="0" y={i * 22} width="220" height="11" fill={i % 2 === 0 ? "#b22234" : "white"} />
          ))}
          <rect x="0" y="0" width="90" height="77" fill="#002868" opacity="0.9" />
          {[[15,10],[30,10],[45,10],[60,10],[75,10],[22,22],[37,22],[52,22],[67,22],[15,34],[30,34],[45,34],[60,34],[75,34],[22,46],[37,46],[52,46],[67,46],[15,58],[30,58],[45,58],[60,58],[75,58]].map(([sx,sy],i) => (
            <circle key={i} cx={sx} cy={sy} r="3" fill="rgba(255,255,255,0.7)" />
          ))}
        </g>
        {/* Statue of Liberty */}
        <g transform="translate(80,120) scale(0.9)" opacity="0.18" fill="#c8a84b">
          <rect x="38" y="180" width="24" height="120" rx="2" />
          <rect x="20" y="200" width="60" height="12" rx="2" />
          <rect x="28" y="140" width="44" height="50" rx="4" />
          <rect x="35" y="100" width="30" height="45" rx="3" />
          <ellipse cx="50" cy="95" rx="18" ry="20" />
          {[-2,0,2].map((x,i) => <rect key={i} x={46 + x * 4} y="70" width="4" height="18" rx="1" />)}
          <rect x="72" y="118" width="8" height="30" rx="2" transform="rotate(-20,76,133)" />
          <ellipse cx="82" cy="110" rx="5" ry="8" fill="#ffe066" />
        </g>
        {/* Capitol */}
        <g transform="translate(680,200) scale(1.1)" opacity="0.15" fill="#b0bec5">
          <rect x="10" y="130" width="180" height="70" rx="2" />
          <rect x="30" y="100" width="140" height="35" rx="2" />
          <rect x="55" y="55" width="90" height="50" rx="4" />
          <ellipse cx="100" cy="52" rx="42" ry="45" />
          <rect x="92" y="10" width="16" height="48" rx="3" />
          <ellipse cx="100" cy="8" rx="8" ry="8" />
          {[0,1,2,3,4,5,6].map(i => <rect key={i} x={20 + i * 25} y="100" width="8" height="35" rx="1" opacity="0.5" />)}
        </g>
        {/* Stars scattered */}
        {[[120,320],[200,80],[450,200],[600,90],[750,310],[500,350],[150,450],[680,420],[350,480],[820,160]].map(([x,y],i) => (
          <polygon key={i} fill="rgba(255,220,100,0.22)"
            points={`${x},${y-8} ${x+2},${y-2} ${x+9},${y-2} ${x+3},${y+2} ${x+5},${y+9} ${x},${y+5} ${x-5},${y+9} ${x-3},${y+2} ${x-9},${y-2} ${x-2},${y-2}`} />
        ))}
        {/* Liberty Bell */}
        <g transform="translate(560,300) scale(0.7)" opacity="0.13" fill="#c8a84b">
          <rect x="30" y="0" width="40" height="15" rx="3" />
          <rect x="42" y="15" width="16" height="20" rx="2" />
          <path d="M10,35 Q10,110 50,115 Q90,110 90,35 Q70,25 50,25 Q30,25 10,35Z" />
          <path d="M5,112 Q50,125 95,112" stroke="#c8a84b" strokeWidth="5" fill="none" />
          <rect x="44" y="90" width="12" height="25" rx="3" />
          <ellipse cx="50" cy="117" rx="8" ry="5" />
        </g>
        <text x="50%" y="52%" textAnchor="middle" fontFamily="Georgia,serif" fontSize="72"
          fontWeight="bold" fill="rgba(255,255,255,0.03)" letterSpacing="6">WE THE PEOPLE</text>
      </svg>
    );
  }
  
  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  function parseStreamedQuestions(text) {
    const clean = text.replace(/```[\w]*\n?/g, "").replace(/```/g, "").trim();
    const results = [];
    let depth = 0, start = -1;
    for (let i = 0; i < clean.length; i++) {
      if (clean[i] === "{") { if (depth === 0) start = i; depth++; }
      else if (clean[i] === "}") {
        depth--;
        if (depth === 0 && start !== -1) {
          try {
            const obj = JSON.parse(clean.slice(start, i + 1));
            if (
              typeof obj.question === "string" &&
              Array.isArray(obj.options) && obj.options.length === 4 &&
              ["A","B","C","D"].includes(obj.answer) &&
              typeof obj.explanation === "string"
            ) {
              results.push(obj);
            }
          } catch (_) {}
          start = -1;
        }
      }
    }
    return results;
  }
  
  function buildEmailBody(rounds) {
    return rounds.map((r, i) => {
      const pct = Math.round((r.score / r.total) * 100);
      const header = `Round ${i + 1} — Score: ${r.score}/${r.total} (${pct}%)`;
      const lines = r.questions.map((q, qi) => {
        const a = r.answers[qi];
        const si = ["A","B","C","D"].indexOf(a?.selected);
        const ci = ["A","B","C","D"].indexOf(q.answer);
        return `${a?.correct ? "✅" : "❌"} ${q.question}\n   Yours: ${si >= 0 ? q.options[si] : "—"}  |  Correct: ${q.options[ci]}`;
      });
      return [header, "", ...lines].join("\n");
    }).join("\n\n────────────────────\n\n");
  }
  
  // ─── Main component ───────────────────────────────────────────────────────────
  export default function App() {
    // screens: "home" | "quiz" | "result"
    const [screen, setScreen]       = useState("home");
    const [language, setLanguage]   = useState("English");
    const [titleIdx, setTitleIdx]   = useState(0);
    const [titleVisible, setTV]     = useState(true);
    const [starting, setStarting]   = useState(false);
    const [error, setError]         = useState("");
  
    // quiz state
    const [questions, setQuestions] = useState([]);   // all 10, set once stream is complete
    const [totalQ, setTotalQ]       = useState(10);
    const [qIndex, setQIndex]       = useState(0);
    const [selected, setSelected]   = useState(null);
    const [revealed, setRevealed]   = useState(false);
    const [score, setScore]         = useState(0);
  
    // history
    const [usedIdx, setUsedIdx]     = useState([]);
    const [history, setHistory]     = useState([]);   // completed rounds
  
    // post-round UI
    const [showEmail, setShowEmail]     = useState(false);
    const [emailTo, setEmailTo]         = useState("");
    const [emailSent, setEmailSent]     = useState(false);
    const [totalRoundsPlayed, setTotalRoundsPlayed] = useState(0);
    const [showSurveyBanner, setShowSurveyBanner] = useState(false);
    const [phone, setPhone]             = useState("");
    const [reminderTime, setReminderTime] = useState("09:00");
    const [smsSent, setSmsSent]         = useState(false);
    const [reminderDismissed, setRD]    = useState(false);
    const [smsError, setSmsError]       = useState("");
  
    // refs to avoid stale-closure bugs when finalising a round
    const answersRef  = useRef([]);
    const scoreRef    = useRef(0);
    const questionsRef = useRef([]);
  
    // ── Title cycle ──
    useEffect(() => {
      if (screen !== "home") return;
      const id = setInterval(() => {
        setTV(false);
        setTimeout(() => { setTitleIdx(n => (n + 1) % TITLE_TRANSLATIONS.length); setTV(true); }, 400);
      }, 2600);
      return () => clearInterval(id);
    }, [screen]);
  
    // ── Pick 10 unseen questions ──
    function pickBatch(used) {
      const avail = USCIS_QA.map((_, i) => i).filter(i => !used.includes(i));
      const pool  = avail.length >= 10 ? avail : USCIS_QA.map((_, i) => i);
      return shuffle(pool).slice(0, 10);
    }
  
    // ── Start / continue quiz ──
    async function startQuiz() {
      if (starting) return;
      setError("");
      setStarting(true);
  
      const picked = pickBatch(usedIdx);
      setUsedIdx(prev => [...prev, ...picked]);
      const batch = picked.map(i => USCIS_QA[i]);
  
      // reset round
      answersRef.current   = [];
      scoreRef.current     = 0;
      questionsRef.current = [];
      setQuestions([]);
      setTotalQ(10);
      setQIndex(0);
      setSelected(null);
      setRevealed(false);
      setScore(0);
  
      // add pending history entry
      setHistory(h => [...h, { questions: [], answers: [], score: 0, total: 10, pending: true }]);
  
      const qaText = batch
        .map((item, i) => `${i + 1}. Q: ${item.q}\n   Official answer: ${item.a}`)
        .join("\n\n");
  
      const userPrompt =
        `Language: ${language}\n\n` +
        `Here are 10 official U.S. citizenship questions. Convert each into a multiple-choice question.\n\n` +
        `${qaText}\n\n` +
        `Remember: respond with ONLY a raw JSON array starting with [ and ending with ].`;
  
      try {
      // Send question indices + raw USCIS data to backend
      // Backend checks cache per question, only calls Claude for uncached ones
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          uscisQuestions: picked.map(i => ({ index: i, q: USCIS_QA[i].q, a: USCIS_QA[i].a })),
        }),
      });
  
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error || `HTTP ${res.status}`);
      }
  
      const data = await res.json();
      if (!data.questions?.length) throw new Error("No questions returned.");
  
      const finalQs = data.questions;
      questionsRef.current = finalQs;
      setQuestions(finalQs);
      setTotalQ(finalQs.length);
      setHistory(h => h.map((e, i) =>
        i === h.length - 1 ? { ...e, questions: finalQs, total: finalQs.length } : e
      ));
      setStarting(false);
      setScreen("quiz");
  
      } catch (e) {
        setError(e.message || "Something went wrong. Please try again.");
        setStarting(false);
        setScreen("home");
      }
    }
  
    // ── Answer a question ──
    function handleSelect(opt) {
      if (revealed) return;
      const q = questions[qIndex];
      if (!q) return;
      const correct = q.answer === opt;
      setSelected(opt);
      setRevealed(true);
      if (correct) { scoreRef.current++; setScore(s => s + 1); }
      answersRef.current = [...answersRef.current, { selected: opt, correct, answer: q.answer }];
    }
  
    // ── Advance ──
    function handleNext() {
      const next = qIndex + 1;
      const qs   = questionsRef.current;
  
      if (next >= qs.length) {
        // finalise round
        setHistory(h => h.map((e, i) =>
          i === h.length - 1
            ? { ...e, questions: qs, answers: answersRef.current, score: scoreRef.current, total: qs.length, pending: false }
            : e
        ));
        setShowEmail(false); setEmailTo(""); setEmailSent(false);
        setShowSMS(false);   setPhone("");   setSmsSent(false);
        setRD(false);
  
        const newTotal = totalRoundsPlayed + 1;
        setTotalRoundsPlayed(newTotal);
        if (newTotal === 3) setShowSurveyBanner(true);
        setScreen("result");
      } else {
        setQIndex(next);
        setSelected(null);
        setRevealed(false);
      }
    }
  
    // ── Full reset ──
    function reset() {
      setScreen("home");
      setUsedIdx([]);
      setHistory([]);
      setError("");
      setShowEmail(false); setEmailTo(""); setEmailSent(false);
      setShowSMS(false);   setPhone("");   setSmsSent(false);
      setRD(false);
      answersRef.current   = [];
      scoreRef.current     = 0;
      questionsRef.current = [];
    }
  
    // ── Email ──
    function sendEmail() {
      const done = history.filter(r => !r.pending);
      const ts   = done.reduce((s, r) => s + r.score, 0);
      const tq   = done.reduce((s, r) => s + r.total, 0);
      const subj = encodeURIComponent("My Citizenship Test Results 🗽");
      const body = encodeURIComponent(
        `Overall: ${ts}/${tq} (${Math.round(ts/tq*100)}%)\n\n` + buildEmailBody(done)
      );
      window.open(`mailto:${encodeURIComponent(emailTo)}?subject=${subj}&body=${body}`);
      setEmailSent(true);
    }
  
    // ── SMS ──
    async function saveReminder() {
      setSmsError("");
      const completed = history.filter(r => !r.pending);
      const wrongQs = completed.flatMap(r =>
        r.questions.filter((_, qi) => !r.answers[qi]?.correct).map(q => q.question)
      );
      // Convert local time to UTC hour
      const [h, m] = reminderTime.split(":").map(Number);
      const localDate = new Date();
      localDate.setHours(h, m, 0, 0);
      const utcHour = localDate.getUTCHours();
  
      try {
        const res = await fetch(API_URL.replace("/quiz", "/reminder"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            language,
            wrongQuestions: wrongQs.slice(0, 5),
            reminderHour: utcHour,
          }),
        });
        if (!res.ok) throw new Error("Failed to save reminder");
        setSmsSent(true);
        setShowSMS(false);
      } catch (e) {
        setSmsError("Could not save reminder. Please try again.");
      }
    }
  
    // ─── Shared styles ──────────────────────────────────────────────────────────
    const S = {
      wrap:   { position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem" },
      card:   { position:"relative", zIndex:1, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(8px)", borderRadius:"1.25rem", boxShadow:"0 20px 60px rgba(0,0,0,0.45)", padding:"1.75rem", width:"100%", maxWidth:"540px" },
      btnPri: { width:"100%", background:"#1d4ed8", color:"white", fontWeight:700, padding:"0.85rem", borderRadius:"0.75rem", border:"none", cursor:"pointer", fontSize:"1rem", marginTop:"0.5rem" },
      btnOut: { width:"100%", background:"white", color:"#1d4ed8", fontWeight:700, padding:"0.85rem", borderRadius:"0.75rem", border:"2px solid #bfdbfe", cursor:"pointer", fontSize:"1rem", marginTop:"0.5rem" },
      input:  { width:"100%", border:"2px solid #e5e7eb", borderRadius:"0.65rem", padding:"0.5rem 0.75rem", fontSize:"0.875rem", boxSizing:"border-box", marginBottom:"0.4rem" },
    };
  
    const optStyle = (opt) => {
      const q = questions[qIndex];
      const base = { width:"100%", textAlign:"left", padding:"0.7rem 1rem", borderRadius:"0.75rem", border:"2px solid", fontWeight:500, cursor: revealed ? "default" : "pointer", fontSize:"0.95rem", background:"white", display:"block", marginBottom:"0.45rem", transition:"background 0.15s" , color: "#1f2937"};
      if (!revealed)               return { ...base, borderColor:"#e5e7eb" };
      if (opt === q?.answer)       return { ...base, borderColor:"#4ade80", background:"#f0fdf4", color:"#166534" };
      if (opt === selected)        return { ...base, borderColor:"#f87171", background:"#fef2f2", color:"#991b1b" };
      return { ...base, borderColor:"#e5e7eb", color:"#9ca3af" };
    };
  
    // ═══════════════════════════════════════════════════════════════════════════
    //  RENDER
    // ═══════════════════════════════════════════════════════════════════════════
  
    // ── Quiz ──
    if (screen === "quiz") {
      const q = questions[qIndex];
  
      if (!q) return (
        <div style={S.wrap}>
          <USBackground />
          <div style={{ position:"relative", zIndex:1, textAlign:"center", color:"white" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:"0.5rem" }}>📝</div>
            <p style={{ fontSize:"1.1rem", fontWeight:600 }}>Loading first question…</p>
          </div>
        </div>
      );
  
      const isLast = qIndex + 1 >= questions.length;
  
      return (
        <div style={S.wrap}>
          <USBackground />
          <div style={S.card}>
            {/* header */}
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.85rem", color:"#6b7280", marginBottom:"0.65rem" }}>
              <span>Question {qIndex + 1} of {questions.length}</span>
              <span style={{ fontWeight:700, color:"#1d4ed8" }}>Score: {score}</span>
            </div>
            {/* progress bar */}
            <div style={{ height:6, background:"#f3f4f6", borderRadius:999, marginBottom:"1.2rem" }}>
              <div style={{ height:6, background:"#1d4ed8", borderRadius:999, width:`${(qIndex / Math.max(questions.length,1)) * 100}%`, transition:"width 0.3s" }} />
            </div>
            {/* question */}
            <p style={{ fontWeight:700, fontSize:"1.05rem", color:"#1f2937", marginBottom:"1.1rem", lineHeight:1.45 }}>{q.question}</p>
            {/* options */}
            {["A","B","C","D"].map((opt, i) => (
              <button key={opt} style={optStyle(opt)} onClick={() => handleSelect(opt)}>
                <span style={{ fontWeight:800, marginRight:"0.4rem" }}>{opt}.</span>{q.options[i]}
              </button>
            ))}
            {/* explanation */}
            {revealed && (
              <div style={{ marginTop:"0.75rem", padding:"0.7rem 0.9rem", background:"#eff6ff", borderRadius:"0.65rem", fontSize:"0.875rem", color:"#1e40af", lineHeight:1.5 }}>
                💡 {q.explanation}
              </div>
            )}
            {/* next */}
            {revealed && (
              <button onClick={handleNext} style={S.btnPri}>
                {isLast ? "See Results →" : "Next Question →"}
              </button>
            )}
          </div>
        </div>
      );
    }
  
    // ── Result ──
    if (screen === "result") {
      const done  = history.filter(r => !r.pending);
      const last  = done[done.length - 1];
      const pct   = last ? Math.round((last.score / last.total) * 100) : 0;
      const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "👏" : "💪";
      const ts    = done.reduce((s, r) => s + r.score, 0);
      const tq    = done.reduce((s, r) => s + r.total, 0);
  
      return (
        <div style={S.wrap}>
          <USBackground />
          <div style={S.card}>
            {/* score summary */}
            <div style={{ textAlign:"center", marginBottom:"1rem" }}>
              <div style={{ fontSize:"3rem" }}>{emoji}</div>
              <h2 style={{ fontWeight:800, fontSize:"1.6rem", color:"#1f2937", margin:"0.4rem 0 0.2rem" }}>Round Complete!</h2>
              <div style={{ fontSize:"2.8rem", fontWeight:800, color:"#1d4ed8" }}>
                {last?.score}<span style={{ fontSize:"1.4rem", color:"#9ca3af" }}>/{last?.total}</span>
              </div>
              <p style={{ color:"#9ca3af", fontSize:"0.85rem" }}>{pct}% correct</p>
              <div style={{ display:"flex", gap:"0.3rem", justifyContent:"center", flexWrap:"wrap", margin:"0.6rem 0" }}>
                {last?.answers.map((a, i) => (
                  <span key={i} style={{ fontSize:"1.1rem", opacity: a.correct ? 1 : 0.25 }}>{a.correct ? "✅" : "❌"}</span>
                ))}
              </div>
              {done.length > 1 && (
                <div style={{ background:"#eff6ff", borderRadius:"0.65rem", padding:"0.5rem 0.9rem", fontSize:"0.85rem", color:"#1d4ed8", marginTop:"0.4rem" }}>
                  <strong>Overall ({done.length} rounds):</strong> {ts}/{tq} ({Math.round(ts/tq*100)}%)
                </div>
              )}
            </div>
  
            <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:"1rem" }}>
              {/* Email */}
              {!showEmail ? (
                <button style={S.btnOut} onClick={() => setShowEmail(true)}>📧 Email Results</button>
              ) : (
                <div style={{ marginBottom:"0.5rem" }}>
                  <p style={{ fontSize:"0.85rem", fontWeight:600, color:"#374151", marginBottom:"0.3rem" }}>Send results to:</p>
                  <input style={S.input} type="email" placeholder="email@example.com" value={emailTo}
                    onChange={e => { setEmailTo(e.target.value); setEmailSent(false); }} />
                  <p style={{ fontSize:"0.72rem", color:"#9ca3af", marginBottom:"0.4rem" }}>Separate multiple with commas</p>
                  <div style={{ display:"flex", gap:"0.5rem" }}>
                    <button onClick={sendEmail} style={{ ...S.btnPri, marginTop:0, flex:1 }}>
                      {emailSent ? "✅ Opened Mail App" : "Send Email"}
                    </button>
                    <button onClick={() => { setShowEmail(false); setEmailSent(false); }}
                      style={{ padding:"0.5rem 1rem", borderRadius:"0.65rem", border:"2px solid #e5e7eb", color:"#6b7280", background:"white", cursor:"pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
  
              {/* Daily reminder */}
              {!reminderDismissed && !showSMS && !smsSent && (
                <div style={{ background:"#fffbeb", border:"2px solid #fde68a", borderRadius:"0.75rem", padding:"0.85rem", margin:"0.5rem 0" }}>
                  <p style={{ fontWeight:700, color:"#92400e", fontSize:"0.875rem", marginBottom:"0.2rem" }}>🔔 Stay on track!</p>
                  <p style={{ color:"#b45309", fontSize:"0.85rem", marginBottom:"0.55rem" }}>Want a daily text reminder to practice?</p>
                  <div style={{ display:"flex", gap:"0.5rem" }}>
                    <button onClick={() => setShowSMS(true)}
                      style={{ flex:1, background:"#f59e0b", color:"white", fontWeight:700, padding:"0.45rem", borderRadius:"0.5rem", border:"none", cursor:"pointer", fontSize:"0.875rem" }}>
                      Yes, remind me!
                    </button>
                    <button onClick={() => setRD(true)}
                      style={{ flex:1, border:"2px solid #fcd34d", color:"#92400e", fontWeight:700, padding:"0.45rem", borderRadius:"0.5rem", background:"white", cursor:"pointer", fontSize:"0.875rem" }}>
                      No thanks
                    </button>
                  </div>
                </div>
              )}
              {showSMS && !smsSent && (
                <div style={{ background:"#fffbeb", border:"2px solid #fde68a", borderRadius:"0.75rem", padding:"0.85rem", margin:"0.5rem 0" }}>
                  <p style={{ fontSize:"0.875rem", fontWeight:600, color:"#374151", marginBottom:"0.3rem" }}>📱 Your phone number:</p>
                  <input style={S.input} type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
                  <div style={{ display:"flex", gap:"0.5rem" }}>
                    <button onClick={sendSMS}
                      style={{ flex:1, background:"#f59e0b", color:"white", fontWeight:700, padding:"0.45rem", borderRadius:"0.5rem", border:"none", cursor:"pointer", fontSize:"0.875rem" }}>
                      Send Text
                    </button>
                    <button onClick={() => setShowSMS(false)}
                      style={{ padding:"0.45rem 0.9rem", borderRadius:"0.5rem", border:"2px solid #e5e7eb", color:"#6b7280", background:"white", cursor:"pointer", fontSize:"0.875rem" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {smsSent && (
                <div style={{ background:"#f0fdf4", border:"2px solid #bbf7d0", borderRadius:"0.65rem", padding:"0.65rem", textAlign:"center", fontSize:"0.875rem", color:"#15803d", fontWeight:600, margin:"0.5rem 0" }}>
                  📱 Text opened — hit Send in your messaging app!
                </div>
              )}
  
              {/* Continue / reset */}
              <button onClick={startQuiz} disabled={starting} style={S.btnPri}>
                {starting ? "⏳ Preparing…"
                  : usedIdx.length >= USCIS_QA.length
                  ? "🔄 Restart — All 100 Questions Covered!"
                  : `📝 Next 10 Questions (${Math.min(usedIdx.length, USCIS_QA.length)}/${USCIS_QA.length} done)`}
              </button>
              <button onClick={reset} style={S.btnOut}>Start Over</button>
            </div>
          </div>
        </div>
      );
    }
  
    // ── Home ──
    const titleEntry = TITLE_TRANSLATIONS[titleIdx];
    return (
      <div style={S.wrap}>
        <USBackground />
        <div style={{ ...S.card, maxWidth:"460px" }}>
          <div style={{ textAlign:"center", marginBottom:"1.4rem" }}>
            <div style={{ fontSize:"2.75rem", marginBottom:"0.4rem" }}>🗽</div>
            <div style={{ minHeight:"3.6rem", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <h1 style={{ fontSize:"1.5rem", fontWeight:800, color:"#1d4ed8", margin:0, lineHeight:1.25, textAlign:"center", transition:"opacity 0.4s", opacity: titleVisible ? 1 : 0 }}>
                {titleEntry.text}
              </h1>
              <span style={{ fontSize:"0.72rem", color:"#9ca3af", marginTop:"0.15rem", transition:"opacity 0.4s", opacity: titleVisible ? 1 : 0 }}>
                {titleEntry.lang}
              </span>
            </div>
            <p style={{ color:"#6b7280", fontSize:"0.875rem", marginTop:"0.4rem" }}>
              Practice all 100 official USCIS civics questions
            </p>
          </div>
  
          {error && (
            <div style={{ marginBottom:"1rem", padding:"0.75rem", background:"#fef2f2", color:"#b91c1c", borderRadius:"0.65rem", fontSize:"0.875rem" }}>
              {error}
            </div>
          )}
  
          <div style={{ marginBottom:"1.2rem" }}>
            <label style={{ display:"block", fontSize:"0.875rem", fontWeight:600, color:"#4b5563", marginBottom:"0.45rem" }}>
              Quiz Language
            </label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4rem" }}>
              {LANGUAGES.map(l => (
                <button key={l} onClick={() => setLanguage(l)}
                  style={{ padding:"0.45rem", borderRadius:"0.5rem", fontSize:"0.875rem", fontWeight:500,
                    border:`2px solid ${language === l ? "#3b82f6" : "#e5e7eb"}`,
                    background: language === l ? "#eff6ff" : "white",
                    color: language === l ? "#1d4ed8" : "#4b5563",
                    cursor:"pointer" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
  
          <button
            onClick={startQuiz}
            disabled={starting}
            style={{
              width:"100%", color:"white", fontWeight:700, padding:"1rem", borderRadius:"0.75rem",
              border:"none", cursor: starting ? "not-allowed" : "pointer", fontSize:"1.05rem",
              background: starting ? "#6b7280" : "linear-gradient(135deg,#1d4ed8,#b91c1c)",
              boxShadow:"0 4px 14px rgba(29,78,216,0.35)", transition:"background 0.2s",
            }}>
            {starting ? "⏳ Preparing your quiz…" : "Start Practice Test 🚀"}
          </button>
  
          <p style={{ textAlign:"center", fontSize:"0.72rem", color:"#9ca3af", marginTop:"0.55rem" }}>
            Based on the official USCIS 100 civics questions
          </p>
        </div>
      </div>
    );
  }
  