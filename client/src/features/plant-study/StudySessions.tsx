import { type ReactNode, useCallback, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, LockKeyhole, Target } from "lucide-react";
import { COURSE_SESSIONS, type CourseSession, type SessionQuestion } from "./sessionData";

type CourseProgressNavProps = {
  activePoint: number;
  completedPoints: number[];
  courseComplete: boolean;
  onSelectPoint: (point: number) => void;
};

export function CourseProgressNav({ activePoint, completedPoints, courseComplete, onSelectPoint }: CourseProgressNavProps) {
  const highestUnlockedPoint = Math.min(COURSE_SESSIONS.length, completedPoints.length + 1);

  return (
    <nav id="course-sequence" className="quick-nav" aria-label="Syllabus point sequence, complete in order">
      <div className="quick-nav-inner course-progress-nav-inner">
        <a href="#starter">Starter</a>
        <a href="#learning-objectives">Objectives</a>
        <span className="nav-tier">POINTS · 1 → 12</span>
        {COURSE_SESSIONS.map((session) => {
          const isCompleted = completedPoints.includes(session.number);
          const isUnlocked = session.number <= highestUnlockedPoint;
          const isCurrent = session.number === activePoint;
          return (
            <button
              className={`course-progress-step${isCompleted ? " completed" : ""}${isCurrent ? " current" : ""}`}
              type="button"
              key={session.id}
              disabled={!isUnlocked}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Syllabus point ${session.number}: ${session.shortTitle}; ${session.tier === "CORE" ? "Core" : "Extended / Supplement"}; ${isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked until the previous point is complete"}`}
              onClick={() => onSelectPoint(session.number)}
            >
              <span className="course-step-number">{String(session.number).padStart(2, "0")}</span>
              <span className="course-step-tier">{session.tier === "CORE" ? "CORE" : "EXT"}</span>
              <span className="course-step-label">{session.shortTitle}</span>
              {isCompleted ? <Check size={14} aria-hidden="true" /> : !isUnlocked ? <LockKeyhole size={13} aria-hidden="true" /> : null}
            </button>
          );
        })}
        {courseComplete ? (
          <>
            <a href="#self-assessment">Quiz</a>
            <a href="#plenary">Plenary</a>
          </>
        ) : (
          <span className="course-nav-locked" aria-label="Assessment and Plenary unlock after point 12 is complete">
            Quiz &amp; Plenary unlock after point 12
          </span>
        )}
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
              onClick={() => {
                setSelectedChoice(choiceIndex);
                onAttemptChange(question.id, true);
              }}
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
            onChange={(event) => {
              const value = event.target.value;
              setFillAnswer(value);
              onAttemptChange(question.id, value.trim().length > 0);
            }}
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
                onChange={(event) => {
                  const nextMatches = { ...matches, [pair.term]: event.target.value };
                  setMatches(nextMatches);
                  onAttemptChange(question.id, question.pairs.every((item) => Boolean(nextMatches[item.term])));
                }}
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
          <h3 id={`${session.id}-check-title`}>Try all three before you reveal</h3>
          <p>{isCompleted ? "This point is already complete. You can retry the prompts, or open the answer key to review its explanations." : "Answer the multiple-choice, fill-in and matching prompts. The answer key stays closed until all three have an attempt."}</p>
        </div>
        <span className="session-check-count">{attemptedCount} / {session.questions.length} attempted</span>
      </div>
      <div className="session-question-grid">
        {session.questions.map((question, index) => (
          <SessionQuestionCard key={question.id} question={question} index={index} onAttemptChange={recordAttempt} />
        ))}
      </div>
      <p className="session-attempt-status" role="status" aria-live="polite">
        {isCompleted ? "This point is complete; the answer key is available for review." : allAttempted ? "All three prompts are attempted. Open the answer key, review the explanations, then mark this point complete." : `Attempt all three prompts to unlock the answer key and completion step. ${session.questions.length - attemptedCount} remaining.`}
      </p>
      {showAttemptReminder && !canRevealAnswers && (
        <p className="session-key-locked-message" role="status">Try the multiple-choice question, enter a short answer, and complete every match first.</p>
      )}
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
          Answer Key &amp; Explanations{canRevealAnswers ? "" : " · locked until all prompts are attempted"}
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
        <div className="session-completion-panel">
          {isCompleted ? (
            <>
              <p className="session-completion-message"><CheckCircle2 size={17} aria-hidden="true" /> {session.number < 12 ? `Syllabus point ${session.number} is complete. Point ${session.number + 1} is unlocked.` : "Syllabus point 12 is complete. The assessment and Plenary are unlocked."}</p>
              {session.number < 12 ? (
                <button className="session-complete-button" type="button" onClick={onNext}>
                  Continue to point {session.number + 1} <ArrowRight size={16} />
                </button>
              ) : courseComplete ? (
                <div className="session-finish-links">
                  <a className="session-complete-button" href="#self-assessment">Open the 24-question assessment <ArrowRight size={16} /></a>
                  <a href="#plenary">Go to the Plenary</a>
                </div>
              ) : null}
            </>
          ) : (
            <>
              <p>After you have attempted all three questions and reviewed their explanations, mark this point complete to unlock the next one.</p>
              <button className="session-complete-button" type="button" disabled={!allAttempted} onClick={onComplete}>
                Mark point {session.number} complete <Check size={16} />
              </button>
            </>
          )}
        </div>
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
  const canGoNext = isCompleted && session.number < totalPoints;

  return (
    <section className="study-session" id="current-point" aria-labelledby={`${session.id}-title`}>
      <header className="study-session-header">
        <div className="session-heading-row">
          <div className="session-heading-copy">
            <div className="session-kicker"><BookOpen size={15} aria-hidden="true" /> Syllabus point {String(session.number).padStart(2, "0")} <span>of {String(totalPoints).padStart(2, "0")} · in order</span></div>
            <h2 id={`${session.id}-title`}>{session.title}</h2>
            <p>{session.summary}</p>
            <div className="session-badges">
              <span className={`tier-badge ${session.tier === "CORE" ? "core" : "supplement"}`}>{session.tier === "CORE" ? "Core" : "Extended / Supplement"}</span>
              <span className="session-syllabus"><BookOpen size={13} aria-hidden="true" /> {session.syllabus}</span>
              {isCompleted && <span className="session-complete-indicator"><CheckCircle2 size={14} aria-hidden="true" /> Complete</span>}
            </div>
          </div>
          <nav className="session-stepper" aria-label={`Navigate from syllabus point ${session.number}`}>
            <button className="session-step-link previous" type="button" disabled={session.number === 1} onClick={onPrevious}>
              <ArrowLeft size={15} /> <span><small>Previous point</small>{session.number === 1 ? "Start" : `Point ${session.number - 1}`}</span>
            </button>
            {session.number < totalPoints ? (
              <button className="session-step-link next" type="button" disabled={!canGoNext} onClick={onNext}>
                <span><small>{canGoNext ? "Unlocked" : "Complete this point first"}</small>Point {session.number + 1}</span> <ArrowRight size={15} />
              </button>
            ) : courseComplete ? (
              <a className="session-step-link next" href="#self-assessment"><span><small>Course complete</small>Assessment</span> <ArrowRight size={15} /></a>
            ) : (
              <button className="session-step-link next" type="button" disabled><span><small>Final point</small>Complete point 12</span> <LockKeyhole size={14} /></button>
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
