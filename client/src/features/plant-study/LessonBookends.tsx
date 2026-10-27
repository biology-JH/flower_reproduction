import { useState } from "react";
import { Check, CheckCircle2, CircleHelp, Sparkles, Target } from "lucide-react";

type QuickQuestion = {
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

const starterQuestions: QuickQuestion[] = [
  {
    prompt: "Which flower part produces pollen?",
    choices: ["Anther", "Stigma", "Ovary"],
    answer: 0,
    explanation: "Anthers make and release pollen grains.",
  },
  {
    prompt: "Where does pollen need to land for pollination?",
    choices: ["On a petal", "On a stigma", "Inside an ovule"],
    answer: 1,
    explanation: "Pollination is pollen transfer from an anther to a stigma.",
  },
  {
    prompt: "Which three conditions let a seed begin to germinate?",
    choices: ["Light, soil and water", "Water, oxygen and suitable warmth", "Carbon dioxide, light and soil"],
    answer: 1,
    explanation: "A seed needs water, oxygen and a suitable temperature; soil and light are not universal requirements.",
  },
];

export function Starter() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answered = Object.keys(answers).length;
  const correct = starterQuestions.filter((question, index) => answers[index] === question.answer).length;

  return (
    <section className="lesson-start-section" id="starter" aria-labelledby="starter-title">
      <div className="page-wrap">
        <div className="lesson-block-heading">
          <div>
            <div className="eyebrow"><Sparkles size={15} aria-hidden="true" /> Starter · wake up what you know</div>
            <h2 id="starter-title">Three quick warm-up questions</h2>
            <p>Choose an answer for each. You’ll get instant feedback—this is a starting point, not a test.</p>
          </div>
          <div className="starter-score" aria-live="polite"><strong>{correct}/3</strong><span>{answered === 3 ? "Starter complete" : `${answered} of 3 answered`}</span></div>
        </div>
        <div className="starter-grid">
          {starterQuestions.map((question, questionIndex) => {
            const selected = answers[questionIndex];
            return (
              <article className="starter-card" key={question.prompt}>
                <div className="starter-card-top"><span>Warm-up {String(questionIndex + 1).padStart(2, "0")}</span><span>{selected === undefined ? "Choose one" : selected === question.answer ? "Correct" : "Review"}</span></div>
                <h3>{question.prompt}</h3>
                <div className="starter-choices" role="group" aria-label={`Answers for warm-up ${questionIndex + 1}`}>
                  {question.choices.map((choice, choiceIndex) => {
                    const answeredThis = selected !== undefined;
                    const isCorrect = answeredThis && choiceIndex === question.answer;
                    const isWrong = answeredThis && selected === choiceIndex && choiceIndex !== question.answer;
                    return (
                      <button
                        className={`starter-choice ${isCorrect ? "correct" : ""} ${isWrong ? "incorrect" : ""}`}
                        type="button"
                        key={choice}
                        aria-pressed={selected === choiceIndex}
                        onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: choiceIndex }))}
                      >
                        <span className="starter-answer-key">{isCorrect ? <Check size={15} /> : String.fromCharCode(65 + choiceIndex)}</span>
                        <span>{choice}</span>
                      </button>
                    );
                  })}
                </div>
                {selected !== undefined && (
                  <p className={`starter-feedback ${selected === question.answer ? "right" : "wrong"}`} role="status">
                    {selected === question.answer ? <CheckCircle2 size={17} /> : <CircleHelp size={17} />}
                    <span><strong>{selected === question.answer ? "Well recalled." : "Good one to revisit."}</strong> {question.explanation}</span>
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LearningObjectives() {
  return (
    <section className="objectives-section page-wrap" id="learning-objectives" aria-labelledby="objectives-title">
      <div className="objectives-heading">
        <span className="objectives-icon"><Target size={22} aria-hidden="true" /></span>
        <div><div className="eyebrow">Your learning map</div><h2 id="objectives-title">Learning objectives</h2><p>By the end of the lesson, you should be able to…</p></div>
      </div>
      <div className="objectives-grid">
        <article className="objective-panel core-objective">
          <span className="tier-badge core">Core · points 1–8</span>
          <ul>
            <li>Identify the main parts of an insect-pollinated flower and state their functions.</li>
            <li>Compare wind-pollinated structures and pollen with insect-pollinated ones.</li>
            <li>Define pollination and fertilisation accurately, and tell them apart.</li>
            <li>Explain flower adaptations and the requirements for seed germination.</li>
          </ul>
        </article>
        <article className="objective-panel extended-objective">
          <span className="tier-badge supplement">Extended / Supplement · points 9–12</span>
          <ul>
            <li>Distinguish self-pollination from cross-pollination.</li>
            <li>Compare their effects on genetic variation, environmental resilience and pollinator reliance.</li>
            <li>Trace pollen-tube growth down the style and entry through the micropyle.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

const plenaryPrompts = [
  { prompt: "Define pollination in one clear sentence.", answer: "Pollination is the transfer of pollen grains from an anther to a stigma." },
  { prompt: "What fuses during fertilisation?", answer: "A pollen nucleus fuses with a female nucleus in an ovule; this forms a zygote." },
  { prompt: "Name the three requirements for seed germination.", answer: "Water, oxygen and a suitable temperature." },
  { prompt: "What is the key difference between self- and cross-pollination?", answer: "Self-pollination stays within the same flower or plant; cross-pollination reaches a flower on a different plant of the same species." },
];

export function Plenary() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [confidence, setConfidence] = useState(3);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const confidenceText = ["I need another look", "Still practising", "Getting there", "Mostly confident", "Ready to explain it"];

  return (
    <section className="plenary-section" id="plenary" aria-labelledby="plenary-title">
      <div className="page-wrap">
        <div className="plenary-banner">
          <div><span className="plenary-kicker"><Sparkles size={15} aria-hidden="true" /> Plenary · exit ticket</span><h2 id="plenary-title">Can you tell the whole story?</h2><p>Before you leave, answer these four short prompts aloud or in your own words—then reveal the key idea and check it off.</p></div>
          <div className="plenary-progress" aria-live="polite"><strong>{checkedCount}/4</strong><span>exit prompts checked</span></div>
        </div>
        <div className="plenary-card">
          <div className="plenary-question-grid">
            {plenaryPrompts.map((item, index) => (
              <article className={`plenary-question ${revealed[index] ? "is-revealed" : ""}`} key={item.prompt}>
                <div className="plenary-question-number">Exit {String(index + 1).padStart(2, "0")}</div>
                <h3>{item.prompt}</h3>
                {revealed[index] ? <p className="plenary-answer"><CheckCircle2 size={18} />{item.answer}</p> : <p className="plenary-prompt-note">Pause and try to answer first.</p>}
                <div className="plenary-question-actions">
                  <button type="button" className="plenary-reveal" onClick={() => setRevealed((current) => ({ ...current, [index]: true }))} disabled={Boolean(revealed[index])}>{revealed[index] ? "Answer revealed" : "Reveal answer"}</button>
                  <button type="button" className="plenary-check" aria-pressed={Boolean(checked[index])} disabled={!revealed[index]} onClick={() => setChecked((current) => ({ ...current, [index]: !current[index] }))}>{checked[index] ? <><Check size={15} /> Checked</> : "I can explain it"}</button>
                </div>
              </article>
            ))}
          </div>
          <div className="plenary-confidence">
            <div><strong>How confident do you feel?</strong><p>Use this to decide what to review next—not as a mark.</p><div className="confidence-label">{confidenceText[confidence - 1]}</div></div>
            <label className="sr-only" htmlFor="confidence-range">Rate your confidence from 1 to 5</label>
            <input id="confidence-range" type="range" min="1" max="5" step="1" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} />
            <span className="confidence-value">{confidence}/5</span>
          </div>
          <div className="plenary-takeaway"><span className="takeaway-icon"><CheckCircle2 size={19} /></span><p><strong>Takeaway:</strong> pollination moves pollen; fertilisation joins nuclei; a seed germinates when it has water, oxygen and a suitable temperature.</p></div>
          <p className="plenary-finish" aria-live="polite">{checkedCount === 4 ? "Plenary complete — you’ve reviewed the key ideas. Well done." : `Check off each answer when you can explain it: ${checkedCount} of 4 complete.`}</p>
        </div>
      </div>
    </section>
  );
}
