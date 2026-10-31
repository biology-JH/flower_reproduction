import { type ReactNode, useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, CircleHelp, Target, X } from "lucide-react";
import { COURSE_SESSIONS, type CourseSession, type SessionQuestion } from "./sessionData";
import { matchesShortAnswer, shuffleIndexedChoices } from "./questionUtils";

type CourseProgressNavProps = {
  activePoint: number;
  completedPoints: number[];
  courseComplete: boolean;
  onSelectPoint: (point: number) => void;
};

export function CourseProgressNav({ activePoint, completedPoints, courseComplete, onSelectPoint }: CourseProgressNavProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollMenu = (direction: -1 | 1) => {
    menuRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  };

  return (
    <nav id="course-sequence" className="quick-nav" aria-label="Choose any IGCSE Biology syllabus point">
      <div className="course-progress-nav-shell">
        <button
          className="course-nav-scroll-control"
          type="button"
          aria-label="Scroll syllabus menu left"
          aria-controls="course-progress-list"
          onClick={() => scrollMenu(-1)}
        >
          <ArrowLeft size={15} aria-hidden="true" />
        </button>
        <div
          id="course-progress-list"
          ref={menuRef}
          className="quick-nav-inner course-progress-nav-inner"
          tabIndex={0}
          aria-label="Scrollable menu of all twelve syllabus points"
        >
          <a href="#starter">Starter</a>
          <a href="#learning-objectives">Objectives</a>
          <span className="nav-tier">CHOOSE ANY POINT · 1–12</span>
          {COURSE_SESSIONS.map((session) => {
            const isCompleted = completedPoints.includes(session.number);
            const isCurrent = session.number === activePoint;
            return (
              <button
                className={`course-progress-step${isCompleted ? " completed" : ""}${isCurrent ? " current" : ""}`}
                type="button"
                key={session.id}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Open syllabus point ${session.number}: ${session.shortTitle}; ${session.tier === "CORE" ? "Core" : "Extended / Supplement"}; ${isCompleted ? "complete, available to review" : "available"}`}
                title={`Open point ${session.number} · ${session.tier === "CORE" ? "Core" : "Extended / Supplement"}`}
                onClick={() => onSelectPoint(session.number)}
              >
                <span className="course-step-number">{String(session.number).padStart(2, "0")}</span>
                <span className="course-step-tier">{session.tier === "CORE" ? "CORE" : "EXT"}</span>
                <span className="course-step-label">{session.shortTitle}</span>
                {isCompleted && <Check size={14} aria-hidden="true" />}
              </button>
            );
          })}
          {courseComplete ? (
            <>
              <a href="#self-assessment">Quiz</a>
              <a href="#plenary">Plenary</a>
            </>
          ) : (
            <span className="course-nav-note" aria-label="The assessment and Plenary are available after all twelve points are complete">
              Quiz &amp; Plenary · after 12/12
            </span>
          )}
        </div>
        <button
          className="course-nav-scroll-control"
          type="button"
          aria-label="Scroll syllabus menu right"
          aria-controls="course-progress-list"
          onClick={() => scrollMenu(1)}
        >
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

function SessionQuestionCard({
  question,
  index,
  onAttemptChange,
}: {
  question: SessionQuestion;
  index: number;
  onAttemptChange: (id: string, attempted: boolean) => void;
}) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [fillAnswer, setFillAnswer] = useState("");
  const [submittedFillAnswer, setSubmittedFillAnswer] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [shuffledChoices] = useState(() =>
    question.kind === "multiple-choice" ? shuffleIndexedChoices(question.choices) : [],
  );
  const [shuffledDefinitions] = useState(() =>
    question.kind === "matching"
      ? shuffleIndexedChoices(question.pairs.map((pair) => pair.definition)).map((choice) => choice.text)
      : [],
  );
  const titleId = `${question.id}-title`;
  const kindLabel = question.kind === "multiple-choice"
    ? "Multiple choice · instant"
    : question.kind === "fill-in-the-blank"
      ? "Fill in · check answer"
      : "Matching · instant";

  return (
    <article className="session-question-card">
      <div className="session-question-meta">
        <span>Check {String(index + 1).padStart(2, "0")}</span>
        <span>{kindLabel}</span>
      </div>
      <h4 id={titleId}>{question.prompt}</h4>

      {question.kind === "multiple-choice" && (() => {
        const correctDisplayIndex = shuffledChoices.findIndex((choice) => choice.originalIndex === question.answer);
        const isCorrect = selectedChoice !== null && shuffledChoices[selectedChoice]?.originalIndex === question.answer;
        return (
          <>
            <div className="session-choice-list" role="group" aria-labelledby={titleId}>
              {shuffledChoices.map((choice, choiceIndex) => {
                const isSelected = selectedChoice === choiceIndex;
                const isCorrectOption = choice.originalIndex === question.answer;
                const stateClass = selectedChoice === null
                  ? ""
                  : isSelected && isCorrectOption
                    ? "correct"
                    : isSelected
                      ? "incorrect"
                      : isCorrectOption
                        ? "correct-answer"
                        : "";
                return (
                  <button
                    className={`session-answer-choice ${stateClass}`}
                    type="button"
                    key={choice.originalIndex}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedChoice(choiceIndex);
                      onAttemptChange(question.id, true);
                    }}
                  >
                    <span className="session-choice-marker">
                      {selectedChoice !== null && isCorrectOption
                        ? <Check size={13} aria-hidden="true" />
                        : isSelected && !isCorrectOption
                          ? <X size={13} aria-hidden="true" />
                          : String.fromCharCode(65 + choiceIndex)}
                    </span>
                    <span>{choice.text}</span>
                  </button>
                );
              })}
            </div>
            {selectedChoice !== null && (
              <div className={`session-auto-feedback ${isCorrect ? "correct" : "incorrect"}`} role="status" aria-live="polite">
                {isCorrect ? <CheckCircle2 size={16} aria-hidden="true" /> : <CircleHelp size={16} aria-hidden="true" />}
                <div>
                  <strong>{isCorrect ? "Correct." : "Not quite."}</strong>
                  {!isCorrect && <p>Correct answer: <strong>{shuffledChoices[correctDisplayIndex]?.text}</strong></p>}
                  <p>{question.explanation}</p>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {question.kind === "fill-in-the-blank" && (() => {
        const isCorrect = submittedFillAnswer !== null && matchesShortAnswer(
          submittedFillAnswer,
          question.answer,
          question.acceptedAnswers ?? [],
        );
        return (
          <>
            <form
              className="session-fill-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!fillAnswer.trim()) return;
                setSubmittedFillAnswer(fillAnswer);
                onAttemptChange(question.id, true);
              }}
            >
              <label className="session-fill-wrap">
                <span className="sr-only">Your answer for check {index + 1}</span>
                <input
                  className="session-fill-input"
                  type="text"
                  value={fillAnswer}
                  onChange={(event) => {
                    setFillAnswer(event.target.value);
                    setSubmittedFillAnswer(null);
                    onAttemptChange(question.id, false);
                  }}
                  placeholder="Write a word or short phrase"
                  autoComplete="off"
                  aria-describedby={`${question.id}-fill-help`}
                />
              </label>
              <button className="session-fill-check" type="submit" disabled={!fillAnswer.trim()}>
                Check answer
              </button>
              <span id={`${question.id}-fill-help`} className="sr-only">Your answer is marked automatically when you choose Check answer.</span>
            </form>
            {submittedFillAnswer !== null && (
              <div className={`session-auto-feedback ${isCorrect ? "correct" : "incorrect"}`} role="status" aria-live="polite">
                {isCorrect ? <CheckCircle2 size={16} aria-hidden="true" /> : <CircleHelp size={16} aria-hidden="true" />}
                <div>
                  <strong>{isCorrect ? "Correct." : "Not quite."}</strong>
                  {!isCorrect && <p>Expected answer: <strong>{question.answer}</strong></p>}
                  <p>{question.explanation}</p>
                </div>
              </div>
            )}
          </>
        );
      })()}

      {question.kind === "matching" && (() => {
        const allMatched = question.pairs.every((pair) => Boolean(matches[pair.term]));
        const allCorrect = allMatched && question.pairs.every((pair) => matches[pair.term] === pair.definition);
        return (
          <div className="session-match-list" aria-labelledby={titleId}>
            {question.pairs.map((pair, pairIndex) => {
              const selectedDefinition = matches[pair.term] ?? "";
              const isCorrectPair = selectedDefinition === pair.definition;
              return (
                <div className="session-match-item" key={pair.term}>
                  <label className="session-match-row">
                    <span className="session-match-term">{pair.term}</span>
                    <select
                      value={selectedDefinition}
                      onChange={(event) => {
                        const nextMatches = { ...matches, [pair.term]: event.target.value };
                        setMatches(nextMatches);
                        onAttemptChange(
                          question.id,
                          question.pairs.every((item) => Boolean(nextMatches[item.term])),
                        );
                      }}
                      aria-label={`Match ${pair.term} to a definition`}
                    >
                      <option value="">Choose a definition</option>
                      {shuffledDefinitions.map((definition, optionIndex) => (
                        <option key={`${optionIndex}-${definition}`} value={definition}>{definition}</option>
                      ))}
                    </select>
                  </label>
                  {selectedDefinition && (
                    <p className={`session-match-feedback ${isCorrectPair ? "correct" : "incorrect"}`} role="status" aria-live="polite">
                      {isCorrectPair
                        ? <>Correct match: <strong>{pair.definition}</strong></>
                        : <>Not quite. Correct match: <strong>{pair.definition}</strong></>}
                    </p>
                  )}
                </div>
              );
            })}
            {allMatched && (
              <div className={`session-auto-feedback ${allCorrect ? "correct" : "incorrect"}`} role="status" aria-live="polite">
                {allCorrect ? <CheckCircle2 size={16} aria-hidden="true" /> : <CircleHelp size={16} aria-hidden="true" />}
                <div>
                  <strong>{allCorrect ? "All matches are correct." : "Review the pair feedback above."}</strong>
                  <p>{question.explanation}</p>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </article>
  );
}

function SessionKnowledgeCheck({
  session,
  isCompleted,
  courseComplete,
  onComplete,
  onNext,
}: {
  session: CourseSession;
  isCompleted: boolean;
  courseComplete: boolean;
  onComplete: () => void;
  onNext: () => void;
}) {
  const [attempted, setAttempted] = useState<Record<string, boolean>>({});
  const [showAttemptReminder, setShowAttemptReminder] = useState(false);
  const recordAttempt = useCallback((id: string, hasAttempted: boolean) => {
    setAttempted((current) => current[id] === hasAttempted ? current : { ...current, [id]: hasAttempted });
    setShowAttemptReminder(false);
  }, []);
  const attemptedCount = session.questions.filter((question) => attempted[question.id]).length;
  const allAttempted = attemptedCount === session.questions.length;
  const canRevealAnswers = allAttempted || isCompleted;

  return (
    <section className="session-check" aria-labelledby={`${session.id}-check-title`}>
      <div className="session-check-heading">
        <div>
          <div className="eyebrow"><CheckCircle2 size={15} aria-hidden="true" /> Knowledge check · point {String(session.number).padStart(2, "0")}</div>
          <h3 id={`${session.id}-check-title`}>Check as you go</h3>
          <p>Multiple-choice and matching answers are marked immediately. For the fill-in prompt, type an answer and select “Check answer.” The detailed answer key is optional.</p>
        </div>
        <span className="session-check-count">{attemptedCount} / {session.questions.length} checked</span>
      </div>
      <div className="session-question-grid">
        {session.questions.map((question, index) => (
          <SessionQuestionCard key={question.id} question={question} index={index} onAttemptChange={recordAttempt} />
        ))}
      </div>
      <p className="session-attempt-status" role="status" aria-live="polite">
        {isCompleted
          ? "This point is complete. You can revisit it or practice the checks again; no other point is locked."
          : allAttempted
            ? "All three prompts have been checked. You may mark this point complete now; reading the optional answer key is not required."
            : `Check each prompt to record this point as complete. You can still open any other point at any time. ${session.questions.length - attemptedCount} remaining.`}
      </p>
      {showAttemptReminder && !canRevealAnswers && (
        <p className="session-key-locked-message" role="status">Check all three answers first to reveal the optional explanations. You may continue to any other point now.</p>
      )}
      <div className="session-completion-panel">
        {isCompleted ? (
          <>
            <p className="session-completion-message"><CheckCircle2 size={17} aria-hidden="true" /> Point {session.number} is marked complete. All twelve points remain available in any order.</p>
            <div className="session-finish-links">
              {session.number < 12 && (
                <button className="session-complete-button" type="button" onClick={onNext}>
                  Optional: visit point {session.number + 1} <ArrowRight size={16} />
                </button>
              )}
              {courseComplete && <>
                <a className="session-complete-button" href="#self-assessment">Open the 24-question assessment <ArrowRight size={16} /></a>
                <a href="#plenary">Go to the Plenary</a>
              </>}
            </div>
          </>
        ) : (
          <>
            <p>{allAttempted
              ? "Your three responses have all been checked. Mark this point complete if you are ready; the optional key is not required."
              : `Check all three prompts to mark this point complete. You can switch to any other point without waiting. ${session.questions.length - attemptedCount} remaining.`}</p>
            <button className="session-complete-button" type="button" disabled={!allAttempted} onClick={onComplete}>
              Mark point {session.number} complete <Check size={16} />
            </button>
          </>
        )}
      </div>
      <details className="session-answer-key">
        <summary
          aria-disabled={!canRevealAnswers}
          onClick={(event) => {
            if (!canRevealAnswers) {
              event.preventDefault();
              setShowAttemptReminder(true);
            }
          }}
        >
          Optional Answer Key &amp; Explanations{canRevealAnswers ? "" : " · available after checking all three"}
        </summary>
        <ol>
          {session.questions.map((question, index) => (
            <li key={question.id}>
              <div className="session-key-meta">Check {String(index + 1).padStart(2, "0")} · {question.kind === "multiple-choice" ? "Multiple choice" : question.kind === "fill-in-the-blank" ? "Fill in the blank" : "Matching"}</div>
              {question.kind === "matching" ? (
                <ul className="session-key-matches">
                  {question.pairs.map((pair) => <li key={pair.term}><strong>{pair.term}:</strong> {pair.definition}</li>)}
                </ul>
              ) : (
                <strong>{question.kind === "multiple-choice" ? question.choices[question.answer] : question.answer}</strong>
              )}
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
  totalPoints,
  completedPoints,
  courseComplete,
  onComplete,
  onPrevious,
  onNext,
  children,
}: {
  session: CourseSession;
  totalPoints: number;
  completedPoints: number[];
  courseComplete: boolean;
  onComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
  children: ReactNode;
}) {
  const isCompleted = completedPoints.includes(session.number);

  return (
    <section className="study-session" id="current-point" aria-labelledby={`${session.id}-title`}>
      <header className="study-session-header">
        <div className="session-heading-row">
          <div className="session-heading-copy">
            <div className="session-kicker"><BookOpen size={15} aria-hidden="true" /> Syllabus point {String(session.number).padStart(2, "0")} <span>of {String(totalPoints).padStart(2, "0")} · choose any order</span></div>
            <h2 id={`${session.id}-title`}>{session.title}</h2>
            <p>{session.summary}</p>
            <div className="session-badges">
              <span className={`tier-badge ${session.tier === "CORE" ? "core" : "supplement"}`}>{session.tier === "CORE" ? "Core" : "Extended / Supplement"}</span>
              <span className="session-syllabus"><BookOpen size={13} aria-hidden="true" /> {session.syllabus}</span>
              {isCompleted && <span className="session-complete-indicator"><CheckCircle2 size={14} aria-hidden="true" /> Complete</span>}
            </div>
          </div>
          <nav className="session-stepper" aria-label={`Navigate between syllabus points; all points are available. Current point ${session.number}`}>
            <button className="session-step-link previous" type="button" disabled={session.number === 1} onClick={onPrevious}>
              <ArrowLeft size={15} aria-hidden="true" /> <span><small>Previous point</small>{session.number === 1 ? "Start" : `Point ${session.number - 1}`}</span>
            </button>
            {session.number < totalPoints ? (
              <button className="session-step-link next" type="button" onClick={onNext}>
                <span><small>Optional shortcut · any order</small>Point {session.number + 1}</span> <ArrowRight size={15} aria-hidden="true" />
              </button>
            ) : courseComplete ? (
              <a className="session-step-link next" href="#self-assessment"><span><small>All points complete</small>Assessment</span> <ArrowRight size={15} aria-hidden="true" /></a>
            ) : (
              <div className="session-step-placeholder" aria-label="This is the final numbered point; all points remain available from the menu.">End of point 12 · choose any other point above</div>
            )}
          </nav>
        </div>
        <div className="session-objectives" aria-label={`Learning objectives for syllabus point ${session.number}`}>
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
          <span>LESSON CONTENT · POINT {session.number}</span>
          <p>Work through the explanations, diagrams and activities for this point.</p>
        </div>
        {children}
      </div>
      <SessionKnowledgeCheck
        session={session}
        isCompleted={isCompleted}
        courseComplete={courseComplete}
        onComplete={onComplete}
        onNext={onNext}
      />
    </section>
  );
}
