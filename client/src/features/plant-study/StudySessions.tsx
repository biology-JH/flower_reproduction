import { type ReactNode, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Target } from "lucide-react";
import type { TierFilter } from "./data";

type MultipleChoiceCheck = {
  id: string;
  tier?: "CORE" | "SUPPLEMENT" | "BOTH";
  kind: "multiple-choice";
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

type FillCheck = {
  id: string;
  tier?: "CORE" | "SUPPLEMENT" | "BOTH";
  kind: "fill-in-the-blank";
  prompt: string;
  answer: string;
  explanation: string;
};

type MatchingCheck = {
  id: string;
  tier?: "CORE" | "SUPPLEMENT" | "BOTH";
  kind: "matching";
  prompt: string;
  pairs: { term: string; definition: string }[];
  explanation: string;
};

type SessionQuestion = MultipleChoiceCheck | FillCheck | MatchingCheck;

type SessionTier = "CORE" | "SUPPLEMENT" | "MIXED";

export type CourseSession = {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  syllabus: string;
  points: number[];
  tier: SessionTier;
  objectives: {
    what: string;
    why: string;
    how: string[];
  };
  questions: SessionQuestion[];
};

export const COURSE_SESSIONS: CourseSession[] = [
  {
    id: "session-01",
    number: 1,
    title: "Flower anatomy & function",
    shortTitle: "Flower anatomy",
    summary: "Meet the structures of an insect-pollinated flower and connect each part to its job.",
    syllabus: "Core points 1–2",
    points: [1, 2],
    tier: "CORE",
    objectives: {
      what: "Identify the ten key flower structures and explain the function of each one.",
      why: "Knowing where pollen is made, received and carried makes the whole reproduction story easier to understand.",
      how: [
        "Explore the flower diagram and select each structure.",
        "Read the structure–function cards, then match all ten parts to their roles.",
      ],
    },
    questions: [
      {
        id: "s1-q1",
        kind: "multiple-choice",
        prompt: "Which structure produces and releases pollen grains?",
        choices: ["Anther", "Stigma", "Ovary", "Sepal"],
        answer: 0,
        explanation: "Anthers produce and release pollen; each anther is supported by a filament.",
      },
      {
        id: "s1-q2",
        kind: "multiple-choice",
        prompt: "Where does a pollen grain land for pollination to occur?",
        choices: ["On a stigma", "Inside the ovary", "On a petal", "At the base of a sepal"],
        answer: 0,
        explanation: "Pollination is the transfer of pollen grains from an anther to a stigma.",
      },
      {
        id: "s1-q3",
        kind: "fill-in-the-blank",
        prompt: "The stalk that supports and positions an anther is the ____.",
        answer: "filament",
        explanation: "The filament supports the anther and helps position it for pollen release.",
      },
      {
        id: "s1-q4",
        kind: "matching",
        prompt: "Match each structure to its role.",
        pairs: [
          { term: "Sepal", definition: "Protects the developing flower bud." },
          { term: "Petal", definition: "Often attracts animal pollinators." },
          { term: "Ovary", definition: "Contains and protects the ovules." },
        ],
        explanation: "Sepals protect the bud, petals can attract pollinators, and ovules are contained inside the ovary.",
      },
    ],
  },
  {
    id: "session-02",
    number: 2,
    title: "Pollination & flower adaptations",
    shortTitle: "Pollination",
    summary: "Compare insect- and wind-pollinated flowers, then follow the transfer pollen must make.",
    syllabus: "Core points 3–5 and 7",
    points: [3, 4, 5, 7],
    tier: "CORE",
    objectives: {
      what: "Compare wind- and insect-pollinated structures and pollen, define pollination, and explain key flower adaptations.",
      why: "Each feature helps pollen travel by a particular route; precise wording also separates pollination from fertilisation.",
      how: [
        "Compare anther and stigma positions, then inspect the two pollen types.",
        "State the anther-to-stigma definition and use the adaptation matrix to connect features with their purpose.",
      ],
    },
    questions: [
      {
        id: "s2-q1",
        kind: "multiple-choice",
        prompt: "Which pair is typical of many wind-pollinated flowers?",
        choices: ["Exposed, hanging anthers and a large feathery stigma", "Hidden anthers and a small closed stigma", "Bright petals and nectar only", "Sticky pollen and a buried stigma"],
        answer: 0,
        explanation: "Exposed anthers release pollen into air currents, and feathery stigmas can intercept it.",
      },
      {
        id: "s2-q2",
        kind: "multiple-choice",
        prompt: "Which pollen grain is best adapted to cling to an insect?",
        choices: ["Large, rough or spiky, and sticky", "Small, smooth, dry, and very light", "Waterlogged and slippery", "Smooth grains produced one at a time"],
        answer: 0,
        explanation: "A rough, barbed or sticky surface helps insect-carried pollen cling to the pollinator.",
      },
      {
        id: "s2-q3",
        kind: "fill-in-the-blank",
        prompt: "Pollination is the transfer of pollen grains from an anther to a ____.",
        answer: "stigma",
        explanation: "The recipient is the stigma. Pollination is pollen transfer, not the later fusion of nuclei.",
      },
      {
        id: "s2-q4",
        kind: "matching",
        prompt: "Match each feature to the pollination route it supports.",
        pairs: [
          { term: "Nectar and conspicuous petals", definition: "Attract animal pollinators to the flower." },
          { term: "Feathery exposed stigma", definition: "Catches pollen moving through the air." },
          { term: "Light, smooth pollen", definition: "Travels readily in wind currents." },
        ],
        explanation: "Insect-pollinated flowers often attract animal visitors; wind-pollinated stigmas and pollen are adapted to air movement.",
      },
    ],
  },
  {
    id: "session-03",
    number: 3,
    title: "Fertilisation & pollen-tube growth",
    shortTitle: "Fertilisation",
    summary: "Follow the change from pollen transfer to nuclear fusion, including the Extended route into an ovule.",
    syllabus: "Core point 6 · Extended / Supplement point 12",
    points: [6, 12],
    tier: "MIXED",
    objectives: {
      what: "Explain fertilisation as nuclear fusion; for Extended, trace the pollen tube from the stigma through the style and micropyle into an ovule.",
      why: "This connects pollen arriving on a flower to delivery of the male nucleus and formation of a zygote.",
      how: [
        "Step through the fertilisation timeline and distinguish it from pollination.",
        "For Extended, order the pollen-tube sequence and locate the micropyle on the ovule.",
      ],
    },
    questions: [
      {
        id: "s3-q1",
        tier: "BOTH",
        kind: "multiple-choice",
        prompt: "What defines fertilisation in a flowering plant?",
        choices: ["A pollen nucleus fuses with a nucleus in an ovule", "A pollen grain lands on a stigma", "An anther releases pollen", "A pollen tube grows through the style"],
        answer: 0,
        explanation: "Fertilisation is the fusion of the pollen nucleus with a female nucleus inside an ovule.",
      },
      {
        id: "s3-q2",
        tier: "SUPPLEMENT",
        kind: "multiple-choice",
        prompt: "Through which opening does the pollen tube enter an ovule?",
        choices: ["The micropyle", "The stigma", "The filament", "The petal"],
        answer: 0,
        explanation: "The pollen tube enters the ovule through its micropyle and delivers the pollen nucleus.",
      },
      {
        id: "s3-q3",
        tier: "BOTH",
        kind: "fill-in-the-blank",
        prompt: "Fusion of the pollen nucleus and the ovule nucleus forms a ____.",
        answer: "zygote",
        explanation: "The fused nuclei form a zygote, the first cell of the new organism.",
      },
      {
        id: "s3-q4",
        tier: "BOTH",
        kind: "matching",
        prompt: "Match each term to the event it describes.",
        pairs: [
          { term: "Pollination", definition: "Transfer of pollen from anther to stigma." },
          { term: "Fertilisation", definition: "Fusion of nuclei inside an ovule." },
          { term: "Zygote", definition: "The first cell formed after the nuclei fuse." },
        ],
        explanation: "Pollination transfers pollen, fertilisation fuses nuclei inside an ovule, and the fused nuclei form a zygote.",
      },
    ],
  },
  {
    id: "session-04",
    number: 4,
    title: "Seed germination",
    shortTitle: "Germination",
    summary: "Test the conditions a seed needs before it can begin to grow.",
    syllabus: "Core point 8",
    points: [8],
    tier: "CORE",
    objectives: {
      what: "Name water, oxygen and a suitable temperature as the three requirements for germination, and explain each role.",
      why: "These conditions let a dormant seed restart metabolism and release the energy needed for early growth.",
      how: [
        "Toggle water and oxygen in the germination model.",
        "Adjust the temperature slider and identify which missing condition prevents germination.",
      ],
    },
    questions: [
      {
        id: "s4-q1",
        kind: "multiple-choice",
        prompt: "Which combination is required for seed germination?",
        choices: ["Water, oxygen, and a suitable temperature", "Light, soil, and water", "Carbon dioxide, light, and warmth", "Water and soil only"],
        answer: 0,
        explanation: "The standard requirements are water, oxygen, and a suitable temperature; light and soil are not required for germination itself.",
      },
      {
        id: "s4-q2",
        kind: "multiple-choice",
        prompt: "Why does a germinating seed need oxygen?",
        choices: ["For aerobic respiration to release energy", "To make petals", "To attract pollinators", "To form a pollen tube"],
        answer: 0,
        explanation: "Oxygen is used in aerobic respiration, which releases energy for growth.",
      },
      {
        id: "s4-q3",
        kind: "fill-in-the-blank",
        prompt: "Which condition rehydrates a seed and helps activate its enzymes? ____",
        answer: "water",
        explanation: "Water is absorbed by the seed; it rehydrates tissues and helps activate enzymes.",
      },
      {
        id: "s4-q4",
        kind: "matching",
        prompt: "Match each condition to its role in germination.",
        pairs: [
          { term: "Water", definition: "Rehydrates tissues and helps activate enzymes." },
          { term: "Oxygen", definition: "Enables aerobic respiration to release energy." },
          { term: "Suitable temperature", definition: "Supports the enzyme activity needed for growth." },
        ],
        explanation: "All three conditions are needed together: water, oxygen, and a suitable temperature.",
      },
    ],
  },
  {
    id: "session-05",
    number: 5,
    title: "Self-/cross-pollination & population impact",
    shortTitle: "Pollination strategies",
    summary: "Use the plant boundary to distinguish the two strategies, then weigh their possible effects on a population.",
    syllabus: "Extended / Supplement points 9–11",
    points: [9, 10, 11],
    tier: "SUPPLEMENT",
    objectives: {
      what: "Distinguish self- from cross-pollination and compare their possible effects on variation, resilience and vector reliance.",
      why: "The comparison explains a trade-off between reproductive assurance and new allele combinations that may help a population respond to change.",
      how: [
        "Choose each transfer route and check whether the pollen crosses a plant boundary.",
        "Compare the population-impact columns and describe advantages without treating either outcome as guaranteed.",
      ],
    },
    questions: [
      {
        id: "s5-q1",
        kind: "multiple-choice",
        prompt: "Which transfer is self-pollination?",
        choices: ["Pollen reaches the same flower or another flower on the same plant", "Pollen reaches another species", "A pollen tube enters an ovule", "Pollen moves from stigma to anther"],
        answer: 0,
        explanation: "Self-pollination stays within one flower or one plant; a second flower on the same plant still counts.",
      },
      {
        id: "s5-q2",
        kind: "multiple-choice",
        prompt: "Which transfer is cross-pollination?",
        choices: ["Pollen reaches a flower on a different plant of the same species", "Pollen reaches another flower on the same plant", "Pollen lands on a petal", "Two nuclei fuse in an ovule"],
        answer: 0,
        explanation: "Cross-pollination crosses to a different plant, and the receiving plant must be of the same species.",
      },
      {
        id: "s5-q3",
        kind: "fill-in-the-blank",
        prompt: "For cross-pollination, the receiving flower must be on a different plant of the same ____.",
        answer: "species",
        explanation: "The different-plant boundary and same-species condition together define cross-pollination.",
      },
      {
        id: "s5-q4",
        kind: "matching",
        prompt: "Match each idea to the best description.",
        pairs: [
          { term: "Self-pollination", definition: "Pollen transfer within the same flower or plant." },
          { term: "Cross-pollination", definition: "Pollen transfer to a different plant of the same species." },
          { term: "Greater genetic variation", definition: "May mean some plants are better suited to a change; it is not a guarantee." },
        ],
        explanation: "Self-pollination can provide reproductive assurance, while cross-pollination often increases variation; neither strategy guarantees survival.",
      },
    ],
  },
];

export function getVisibleCourseSessions(filter: TierFilter): CourseSession[] {
  return COURSE_SESSIONS.filter((session) =>
    session.points.some((point) => filter === "all" || (filter === "core" ? point <= 8 : point >= 9)),
  );
}

function SessionQuestionCard({ question, index }: { question: SessionQuestion; index: number }) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [matches, setMatches] = useState<Record<string, string>>({});
  const titleId = `${question.id}-title`;
  const kindLabel = question.kind === "multiple-choice"
    ? "Multiple choice"
    : question.kind === "fill-in-the-blank"
      ? "Fill in the blank"
      : "Matching";

  return (
    <article className="session-question-card">
      <div className="session-question-meta">
        <span>Check {String(index + 1).padStart(2, "0")}</span>
        <span>{kindLabel}</span>
      </div>
      <h4 id={titleId}>{question.prompt}</h4>
      {question.kind === "multiple-choice" && (
        <div className="session-choice-list" role="group" aria-labelledby={titleId}>
          {question.choices.map((choice, choiceIndex) => (
            <button
              className={`session-answer-choice ${selectedChoice === choiceIndex ? "selected" : ""}`}
              type="button"
              key={choice}
              aria-pressed={selectedChoice === choiceIndex}
              onClick={() => setSelectedChoice(choiceIndex)}
            >
              <span className="session-choice-marker">{String.fromCharCode(65 + choiceIndex)}</span>
              <span>{choice}</span>
            </button>
          ))}
        </div>
      )}
      {question.kind === "fill-in-the-blank" && (
        <label className="session-fill-wrap">
          <span className="sr-only">Your answer for check {index + 1}</span>
          <input
            className="session-fill-input"
            type="text"
            value={fillAnswer}
            onChange={(event) => setFillAnswer(event.target.value)}
            placeholder="Write a word or short phrase"
            autoComplete="off"
          />
        </label>
      )}
      {question.kind === "matching" && (
        <div className="session-match-list" aria-labelledby={titleId}>
          {question.pairs.map((pair) => (
            <label className="session-match-row" key={pair.term}>
              <span className="session-match-term">{pair.term}</span>
              <select
                value={matches[pair.term] ?? ""}
                onChange={(event) => setMatches((current) => ({ ...current, [pair.term]: event.target.value }))}
                aria-label={`Match ${pair.term} to a definition`}
              >
                <option value="">Choose a definition</option>
                {[...question.pairs].reverse().map((option) => (
                  <option key={option.term} value={option.definition}>{option.definition}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
    </article>
  );
}

function questionAnswer(question: SessionQuestion): string {
  if (question.kind === "multiple-choice") return question.choices[question.answer];
  if (question.kind === "fill-in-the-blank") return question.answer;
  return question.pairs.map((pair) => `${pair.term} — ${pair.definition}`).join(" · ");
}

function SessionKnowledgeCheck({ session, filter }: { session: CourseSession; filter: TierFilter }) {
  const questions = session.questions.filter((question) => {
    if (filter === "all") return true;
    const tier = question.tier ?? session.tier;
    return tier === "BOTH" || (filter === "core" ? tier !== "SUPPLEMENT" : tier !== "CORE");
  });
  return (
    <section className="session-check" aria-labelledby={`${session.id}-check-title`}>
      <div className="session-check-heading">
        <div>
          <div className="eyebrow"><CheckCircle2 size={15} aria-hidden="true" /> Knowledge check · session {String(session.number).padStart(2, "0")}</div>
          <h3 id={`${session.id}-check-title`}>Pause, try, then reveal</h3>
          <p>Answer all {questions.length} visible prompts before opening the key. You can change your choices or text at any time.</p>
        </div>
        <span className="session-check-count">{questions.length} questions</span>
      </div>
      <div className="session-question-grid">
        {questions.map((question, index) => (
          <SessionQuestionCard key={question.id} question={question} index={index} />
        ))}
      </div>
      <details className="session-answer-key">
        <summary>Answer Key &amp; Explanations</summary>
        <ol>
          {questions.map((question, index) => (
            <li key={question.id}>
              <div className="session-key-meta">Check {String(index + 1).padStart(2, "0")} · {question.kind === "multiple-choice" ? "Multiple choice" : question.kind === "fill-in-the-blank" ? "Fill in the blank" : "Matching"}</div>
              <strong>{questionAnswer(question)}</strong>
              <p>{question.explanation}</p>
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}

export function StudySessionFrame({
  session,
  filter,
  totalSessions,
  previous,
  next,
  children,
}: {
  session: CourseSession;
  filter: TierFilter;
  totalSessions: number;
  previous?: CourseSession;
  next?: CourseSession;
  children: ReactNode;
}) {
  return (
    <section className="study-session" id={session.id} aria-labelledby={`${session.id}-title`}>
      <header className="study-session-header">
        <div className="session-heading-row">
          <div className="session-heading-copy">
            <div className="session-kicker"><BookOpen size={15} aria-hidden="true" /> Session {String(session.number).padStart(2, "0")} <span>of {String(totalSessions).padStart(2, "0")}</span></div>
            <h2 id={`${session.id}-title`}>{session.title}</h2>
            <p>{session.summary}</p>
            <div className="session-badges">
              {session.tier === "MIXED" ? <>
                <span className="tier-badge core">Core · point 6</span>
                <span className="tier-badge supplement">Extended · point 12</span>
              </> : <span className={`tier-badge ${session.tier === "CORE" ? "core" : "supplement"}`}>{session.tier === "CORE" ? "Core" : "Extended / Supplement"}</span>}
              <span className="session-syllabus"><BookOpen size={13} aria-hidden="true" /> {session.syllabus}</span>
            </div>
          </div>
          <nav className="session-stepper" aria-label={`Navigate from session ${session.number}`}>
            {previous ? <a className="session-step-link previous" href={`#${previous.id}`}><ArrowLeft size={15} /> <span><small>Previous</small>{previous.shortTitle}</span></a> : <span className="session-step-placeholder">First session</span>}
            {next ? <a className="session-step-link next" href={`#${next.id}`}><span><small>Next session</small>{next.shortTitle}</span> <ArrowRight size={15} /></a> : <span className="session-step-placeholder">Final session</span>}
          </nav>
        </div>
        <div className="session-objectives" aria-label={`Learning objectives for session ${session.number}`}>
          <div className="session-objectives-title"><span className="session-target-icon"><Target size={18} aria-hidden="true" /></span><h3>Learning Objectives</h3><span>Before the content</span></div>
          <div className="session-objectives-grid">
            <article className="session-objective-card">
              <span className="session-objective-label">WHAT</span>
              <p>{session.objectives.what}</p>
            </article>
            <article className="session-objective-card">
              <span className="session-objective-label">WHY</span>
              <p>{session.objectives.why}</p>
            </article>
            <article className="session-objective-card session-objective-how">
              <span className="session-objective-label">HOW</span>
              <ol>{session.objectives.how.map((step) => <li key={step}>{step}</li>)}</ol>
            </article>
          </div>
        </div>
      </header>
      <div className="study-session-content">
        <div className="session-core-content-label">
          <span>CORE CONTENT</span>
          <p>Work through the explanations, diagrams and interactive activities below.</p>
        </div>
        {children}
      </div>
      <SessionKnowledgeCheck session={session} filter={filter} />
    </section>
  );
}

export function getSessionNavigationLabel(session: CourseSession, filter: TierFilter): string {
  if (filter === "core" && session.points.every((point) => point >= 9)) return `${session.shortTitle} (Extended)`;
  return session.shortTitle;
}
