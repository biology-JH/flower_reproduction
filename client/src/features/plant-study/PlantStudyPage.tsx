import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BookOpen,
  Check,
  CheckCircle2,
  CircleHelp,
  Droplets,
  Flower2,
  Leaf,
  RotateCcw,
  Sparkles,
  Sprout,
  Thermometer,
  Wind,
  X,
} from "lucide-react";
import {
  adaptationRows,
  flowerParts,
  quizQuestions,
  syllabusSections,
  type FlowerPartId,
  type Tier,
  type TierFilter,
} from "./data";
import { LearningObjectives, Plenary, Starter } from "./LessonBookends";
import { COURSE_SESSIONS } from "./sessionData";
import { shuffleIndexedChoices } from "./questionUtils";
import { CourseProgressNav, StudySessionFrame } from "./StudySessions";

const ANSWERS_KEY = "fieldnotes-plant-reproduction-quiz-v2";
const COURSE_PROGRESS_KEY = "fieldnotes-plant-reproduction-sequential-course-v1";
const COURSE_ACTIVE_POINT_KEY = "fieldnotes-plant-reproduction-active-point-v1";

function readSavedCompletedPoints(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(COURSE_PROGRESS_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return [...new Set<number>(parsed.filter((point): point is number =>
      typeof point === "number" && Number.isInteger(point) && point >= 1 && point <= COURSE_SESSIONS.length,
    ))].sort((left, right) => left - right);
  } catch {
    return [];
  }
}

function getFirstIncompletePoint(completed: number[]): number {
  return COURSE_SESSIONS.find((session) => !completed.includes(session.number))?.number ?? 1;
}

function readSavedActivePoint(): number {
  if (typeof window === "undefined") return 1;
  try {
    const saved = Number(window.sessionStorage.getItem(COURSE_ACTIVE_POINT_KEY));
    if (Number.isInteger(saved) && saved >= 1 && saved <= COURSE_SESSIONS.length) return saved;
  } catch {
    return getFirstIncompletePoint(readSavedCompletedPoints());
  }
  return getFirstIncompletePoint(readSavedCompletedPoints());
}

const DOCX_MEDIA = {
  header: "/images/docx-header.png",
  headerWind: "/images/docx-wind-header.png",
  headerBee: "/images/docx-bee-header.png",
  antherCloseup: "/images/docx-anther-closeup.png",
  stigmaCloseup: "/images/docx-stigma-closeup.png",
  crossPollination: "/images/docx-cross-pollination.png",
} as const;

const PPT_MEDIA = {
  heroFlower: "/images/ppt-cover-flower.jpg",
  beeFlower: "/images/ppt-bee-pollination.png",
  budStages: "/images/ppt-bud-stages.png",
  purpleDaisy: "/images/ppt-purple-daisy.jpg",
  flowerAnatomy: "/images/ppt-flower-anatomy.png",
  windStructures: "/images/ppt-wind-structures.png",
  pollenMicrograph: "/images/ppt-pollen-micrograph.png",
  fieldContrast: "/images/ppt-field-contrast.png",
  selfPollination: "/images/ppt-self-pollination.png",
  crossPollination: "/images/ppt-cross-pollination.png",
  alpineFlowers: "/images/ppt-alpine-flowers.jpg",
  pollenTube: "/images/ppt-pollen-tube.png",
  fertilisation: "/images/ppt-fertilisation.png",
  seedlings: "/images/ppt-seedlings.jpg",
  germination: "/images/ppt-germination.png",
} as const;

type Answers = Record<string, number>;

function readSavedAnswers(): Answers {
  if (typeof window === "undefined") return {};
  try {
    const value: unknown = JSON.parse(window.sessionStorage.getItem(ANSWERS_KEY) ?? "{}");
    if (value && typeof value === "object" && !Array.isArray(value)) return value as Answers;
  } catch {
    // A fresh, empty quiz is safer than blocking the lesson on corrupt local session data.
  }
  return {};
}

function Badge({ tier }: { tier: Tier }) {
  return <span className={`tier-badge ${tier === "CORE" ? "core" : "supplement"}`} aria-label={tier === "CORE" ? "Core tier" : "Extended, Supplement tier"}>{tier === "CORE" ? "Core" : "Extended"}</span>;
}

function SectionFrame({
  id,
  point,
  tier,
  title,
  description,
  children,
}: {
  id: string;
  point: number;
  tier: Tier;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="syllabus-section" id={id} aria-labelledby={`${id}-title`}>
      <aside className="section-rail" aria-hidden="true">
        <span className="section-number">{String(point).padStart(2, "0")}</span>
        <span className="rail-rule" />
        <Badge tier={tier} />
      </aside>
      <div className="section-body">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Syllabus point {String(point).padStart(2, "0")}</div>
            <h2 id={`${id}-title`}>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <div className="section-card">{children}</div>
      </div>
    </section>
  );
}

function SiteHeader({ filter, onFilter }: { filter: TierFilter; onFilter: (value: TierFilter) => void }) {
  return (
    <>
      <a className="sr-only" href="#main-content">Skip to lesson</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label="Fieldnotes Biology, back to top">
            <span className="wordmark-icon" aria-hidden="true"><Flower2 size={21} /></span>
            <span>
              <span className="wordmark-title">Fieldnotes</span>
              <span className="wordmark-sub">Biology · 16.3</span>
            </span>
          </a>
          <div className="tier-toggle" role="group" aria-label="Choose the tier focus for the final quiz; all course points remain available">
            <button type="button" aria-pressed={filter === "all"} onClick={() => onFilter("all")}>All quiz</button>
            <button type="button" aria-pressed={filter === "core"} onClick={() => onFilter("core")}>Core quiz</button>
            <button type="button" aria-pressed={filter === "supplement"} onClick={() => onFilter("supplement")}>Extended quiz</button>
          </div>
        </div>
      </header>
    </>
  );
}

function SectionNav({ activePoint, completedPoints, courseComplete, onSelectPoint }: {
  activePoint: number;
  completedPoints: number[];
  courseComplete: boolean;
  onSelectPoint: (point: number) => void;
}) {
  return (
    <CourseProgressNav
      activePoint={activePoint}
      completedPoints={completedPoints}
      courseComplete={courseComplete}
      onSelectPoint={onSelectPoint}
    />
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-image-wrap">
        <img className="hero-photo" src={DOCX_MEDIA.header} alt="Pink lilies with a bee carrying pollen between anthers and stigmas" />
        <div className="hero-banner-shade" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow">IGCSE Biology · Topic 16.3</div>
          <h1 className="hero-title">A flower’s<br />next <em>chapter.</em></h1>
          <p className="hero-lede">Choose any of the twelve syllabus points from the menu. Get instant feedback as you practise, and return to any point whenever you like.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#starter">Start the warm-up <ArrowRight size={16} /></a>
            <a className="button-secondary" href="#course-sequence">Choose a syllabus point <Sprout size={15} /></a>
          </div>
        </div>
        <div className="image-caption">
          <span className="caption-mark"><Flower2 size={18} /></span>
          <span><span className="caption-title">Pollen in motion</span><span className="caption-sub">Anther → pollen → stigma</span></span>
        </div>
      </div>
      <div className="page-wrap hero-meta">
        <div className="hero-stats" aria-label="Lesson overview">
          <div className="hero-stat"><span className="hero-stat-dot" /><span><strong>8</strong> Core points</span></div>
          <div className="hero-stat"><span className="hero-stat-dot" style={{ background: "#78946f" }} /><span><strong>4</strong> Extended points</span></div>
          <div className="hero-stat"><BookOpen size={17} /><span><strong>12</strong> open points</span></div>
          <div className="hero-stat"><BookOpen size={17} /><span><strong>24</strong> quiz questions</span></div>
        </div>
        <div className="hero-photo-strip" aria-label="Pollination examples">
          <figure><img src={DOCX_MEDIA.headerWind} alt="Close view of wind-pollinated grass with hanging anthers and feathery stigmas" /><figcaption>Wind · exposed structures</figcaption></figure>
          <figure><img src={DOCX_MEDIA.headerBee} alt="A bee visiting the reproductive parts of a pink flower" /><figcaption>Insect · pollen transfer</figcaption></figure>
        </div>
      </div>
    </section>
  );
}

function LessonIntro({ filter }: { filter: TierFilter }) {
  const quizFocus = filter === "core"
    ? <>The final assessment is focused on <strong>Core questions.</strong></>
    : filter === "supplement"
      ? <>The final assessment is focused on <strong>Extended / Supplement questions.</strong></>
      : <>The final assessment includes <strong>all tiers.</strong></>;
  return (
    <div className="intro-band">
      <div className="page-wrap intro-band-inner">
        <p>All twelve points stay available: <strong>choose any session, in any order.</strong> {quizFocus} Badges mark Core (1–8) and Extended / Supplement (9–12).</p>
        <div className="intro-key"><Badge tier="CORE" /><Badge tier="SUPPLEMENT" /></div>
      </div>
    </div>
  );
}

function AnatomyExplorer({ activePart, setActivePart }: { activePart: FlowerPartId; setActivePart: (part: FlowerPartId) => void }) {
  const selected = flowerParts.find((part) => part.id === activePart) ?? flowerParts[0];
  return (
    <div className="section-card-pad anatomy-layout">
      <figure className="anatomy-art">
        <img src={PPT_MEDIA.flowerAnatomy} alt="Flower anatomy diagram labelled with petals, sepals, stamens, anthers, stigma, style, ovary and ovules" />
        <div className="botanical-photo-pair" aria-label="Two flower examples">
          <img src={PPT_MEDIA.budStages} alt="Pink flower buds at two stages before opening" />
          <img src={PPT_MEDIA.purpleDaisy} alt="Purple daisy showing its conspicuous petals" />
        </div>
        <figcaption className="art-note">Use the labelled structure diagram, then look at the buds and open flower.</figcaption>
      </figure>
      <div className="part-explorer">
        <div>
          <span className="card-tag"><Flower2 size={14} /> Tap a structure to explore</span>
          <p className="part-intro">Choose a label—or use a keyboard—to reveal its name and role. The next point turns these parts into a function checklist.</p>
        </div>
        <div className="part-chip-grid" aria-label="Flower structures">
          {flowerParts.map((part) => (
            <button className="part-chip" type="button" key={part.id} aria-pressed={activePart === part.id} onClick={() => setActivePart(part.id)}>{part.name}</button>
          ))}
        </div>
        <div className="part-detail" aria-live="polite">
          <div className="mini-label">{selected.group}</div>
          <h3>{selected.name}</h3>
          <p>{selected.function}</p>
        </div>
      </div>
    </div>
  );
}

function FlowerFunctionMatch({ onMatch }: { onMatch: (part: FlowerPartId) => void }) {
  const [matches, setMatches] = useState<Partial<Record<FlowerPartId, FlowerPartId>>>({});
  const [selectedPart, setSelectedPart] = useState<FlowerPartId | null>(null);
  const [draggedPart, setDraggedPart] = useState<FlowerPartId | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [feedback, setFeedback] = useState<{ targetId: FlowerPartId; kind: "correct" | "incorrect" } | null>(null);
  const [message, setMessage] = useState("Drag a flower part to its function. On a keyboard: choose a part, then activate a function target.");
  const feedbackTimer = useRef<number | undefined>(undefined);
  const matchedParts = useMemo(() => Object.values(matches).filter((part): part is FlowerPartId => Boolean(part)), [matches]);
  const matchedCount = matchedParts.length;

  const matchPart = useCallback((partId: FlowerPartId, targetId: FlowerPartId) => {
    if (matches[targetId]) {
      setMessage("That function already has a match. Try another target.");
      return;
    }
    const part = flowerParts.find((item) => item.id === partId);
    if (!part || matchedParts.includes(partId)) return;
    if (partId === targetId) {
      if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current);
      setMatches((current) => ({ ...current, [targetId]: partId }));
      setFeedback({ targetId, kind: "correct" });
      setSelectedPart(null);
      setMessage(matchedCount === flowerParts.length - 1 ? "All ten matches are correct. Excellent structure–function thinking." : `Correct — ${part.name}: ${part.function}`);
      onMatch(partId);
    } else {
      setFeedback({ targetId, kind: "incorrect" });
      setMessage("Not quite. Re-read the function and try a different structure.");
      if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current);
      feedbackTimer.current = window.setTimeout(() => setFeedback(null), 850);
    }
  }, [matches, matchedParts, matchedCount, onMatch]);

  useEffect(() => {
    if (!draggedPart) return;
    const move = (event: PointerEvent) => setPointer({ x: event.clientX, y: event.clientY });
    const drop = (event: PointerEvent) => {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-function-target]");
      const targetId = target?.dataset.functionTarget as FlowerPartId | undefined;
      if (targetId) matchPart(draggedPart, targetId);
      setDraggedPart(null);
    };
    const cancel = () => setDraggedPart(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", drop);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", drop);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [draggedPart, matchPart]);

  useEffect(() => () => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current);
  }, []);

  const reset = () => {
    if (feedbackTimer.current !== undefined) window.clearTimeout(feedbackTimer.current);
    setMatches({});
    setSelectedPart(null);
    setDraggedPart(null);
    setFeedback(null);
    setMessage("New round. Match each flower part to its function.");
  };

  return (
    <div className="function-match-game">
      <div className="match-game-topline">
        <div><span className="match-kicker">Structure → function</span><p className="match-instruction">Drag each part onto its job, or tap a part and then a target. Match all ten.</p></div>
        <div className="match-score" aria-label={`${matchedCount} of ten matches correct`}><strong>{matchedCount}</strong><span>/ 10 matched</span></div>
      </div>
      <div className="match-board">
        <section className="match-bank" aria-label="Draggable flower parts">
          <h3><span>Flower parts</span><small>Drag or select</small></h3>
          <div className="draggable-grid">
            {flowerParts.map((part) => {
              const isMatched = matchedParts.includes(part.id);
              return <button key={part.id} type="button" className={`drag-part ${isMatched ? "matched" : ""} ${selectedPart === part.id ? "selected" : ""}`} disabled={isMatched} aria-pressed={selectedPart === part.id} draggable={false} onClick={() => setSelectedPart((current) => current === part.id ? null : part.id)} onPointerDown={(event) => { if (event.button !== 0 || isMatched) return; setDraggedPart(part.id); setPointer({ x: event.clientX, y: event.clientY }); }}>
                <span className="drag-grip" aria-hidden="true">⠿</span><span><strong>{part.name}</strong><small>{part.group}</small></span>{isMatched && <Check size={17} aria-hidden="true" />}
              </button>;
            })}
          </div>
        </section>
        <section className="match-targets" aria-label="Function drop targets">
          <h3><span>What does it do?</span><small>Drop zone</small></h3>
          <div className="drop-target-grid">
            {[...flowerParts].reverse().map((target) => {
              const matchedPart = matches[target.id] ? flowerParts.find((part) => part.id === matches[target.id]) : undefined;
              const isFeedbackTarget = feedback?.targetId === target.id;
              return <button key={target.id} type="button" data-function-target={target.id} className={`drop-zone ${matchedPart ? "matched" : ""} ${isFeedbackTarget ? feedback.kind : ""}`} aria-label={`${matchedPart ? `Matched with ${matchedPart.name}. ` : "Drop or select a part for this function: "}${target.function}`} onClick={() => { if (selectedPart) matchPart(selectedPart, target.id); }}>
                <span className="drop-zone-copy">{target.function}</span>
                <span className="drop-zone-label">{matchedPart ? <><CheckCircle2 size={15} /> {matchedPart.name}</> : "Drop a part here"}</span>
              </button>;
            })}
          </div>
        </section>
      </div>
      <div className={`match-live ${feedback?.kind ?? ""}`} role="status" aria-live="polite"><span className="match-live-dot" />{message}</div>
      <div className="match-game-footer"><span>Score: <strong>{matchedCount} / {flowerParts.length}</strong></span><button type="button" className="match-reset" onClick={reset}><RotateCcw size={15} /> Reset match game</button></div>
      {draggedPart && <div className="drag-ghost" aria-hidden="true" style={{ transform: `translate3d(${pointer.x + 14}px, ${pointer.y + 14}px, 0)` }}>{flowerParts.find((part) => part.id === draggedPart)?.name}</div>}
    </div>
  );
}

function StructureFunctionExplorer({ activePart, setActivePart }: { activePart: FlowerPartId; setActivePart: (part: FlowerPartId) => void }) {
  const selected = flowerParts.find((part) => part.id === activePart) ?? flowerParts[0];
  return (
    <div className="section-card-pad">
      <div className="part-intro match-lead">The reproductive parts are grouped into a male <strong>stamen</strong> (anther + filament) and a female <strong>carpel</strong> (stigma + style + ovary). Match each structure to the job it performs.</div>
      <FlowerFunctionMatch onMatch={setActivePart} />
      <div className="key-callout" style={{ marginTop: 14 }}><CheckCircle2 size={17} /><span><strong>{selected.name}</strong> is selected. In exam answers, name the structure and link it to its job—e.g. the filament supports the anther.</span></div>
    </div>
  );
}

function WindComparison() {
  return (
    <div className="section-card-pad">
      <div className="compare-grid">
        <article className="compare-card">
          <div className="compare-card-head"><h3>Insect-pollinated</h3><span>Inside the flower</span></div>
          <div className="compare-card-body">
            <div className="structure-sketch">
              <div className="structure-photo-pair" aria-label="Close-ups of the anther and stigma">
                <img src={DOCX_MEDIA.antherCloseup} alt="Close-up of anthers inside an insect-pollinated flower" />
                <img src={DOCX_MEDIA.stigmaCloseup} alt="Close-up of a flower's stigma and pollen-receiving surface" />
              </div>
            </div>
            <div className="compare-fact"><strong>Anthers</strong>Firmly held inside, where a visiting insect brushes against them.</div>
            <div className="compare-fact"><strong>Stigma</strong>Compact and sticky, positioned to receive pollen from an insect.</div>
          </div>
        </article>
        <article className="compare-card">
          <div className="compare-card-head"><h3>Wind-pollinated</h3><span>Exposed to air</span></div>
          <div className="compare-card-body">
            <div className="structure-sketch"><img className="wind-source-image" src={PPT_MEDIA.windStructures} alt="Long, loosely hinged grass anthers and exposed feathery stigmas" /></div>
            <div className="compare-fact"><strong>Anthers</strong>Loosely hinged (versatile) on long, flexible filaments; they sway and release pollen into the air.</div>
            <div className="compare-fact"><strong>Stigma</strong>Large, feathery and exposed, with a broad surface that can catch airborne pollen.</div>
          </div>
        </article>
      </div>
      <div className="key-callout" style={{ marginTop: 13 }}><Wind size={17} /><span>Think of the route: <strong>release into air → intercept from air.</strong> Both structures are positioned to make wind transfer more likely.</span></div>
    </div>
  );
}

function PollenComparison() {
  return (
    <div className="section-card-pad pollen-grid">
      <figure className="pollen-figure">
        <img src={PPT_MEDIA.pollenMicrograph} alt="Scanning electron micrographs comparing larger textured insect-carried pollen with smaller, smoother wind-borne pollen" />
        <figcaption>Compare grain size and surface: one clings, while the other travels easily in air.</figcaption>
      </figure>
      <div className="pollen-facts">
        <div className="pollen-type insect">
          <h3>Insect-carried pollen</h3>
          <div className="fact-pills"><span className="fact-pill">Relatively large</span><span className="fact-pill">Heavier</span><span className="fact-pill">Spiky / rough</span><span className="fact-pill">Sticky</span></div>
          <p className="part-intro" style={{ marginBottom: 0, marginTop: 9 }}>The textured or sticky surface helps grains cling to an insect and then rub off on a stigma.</p>
        </div>
        <div className="pollen-type wind">
          <h3>Wind-borne pollen</h3>
          <div className="fact-pills"><span className="fact-pill">Small</span><span className="fact-pill">Light</span><span className="fact-pill">Smooth</span><span className="fact-pill">Dry · abundant</span></div>
          <p className="part-intro" style={{ marginBottom: 0, marginTop: 9 }}>Smooth, light grains drift in air currents. Large quantities compensate for pollen that never reaches a stigma.</p>
        </div>
      </div>
    </div>
  );
}

function PollinationDefinition() {
  return (
    <div className="section-card-pad">
      <div className="pollination-banner">
        <div>
          <div className="definition-word">The definition to learn</div>
          <p className="definition-text"><strong>Pollination</strong> is the transfer of pollen grains from an <strong>anther</strong> to a <strong>stigma.</strong></p>
          <p className="definition-note">It describes pollen transfer. It is a different event from fertilisation, which happens later inside an ovule.</p>
        </div>
        <div className="definition-photo-stack" role="group" aria-label="Flowers and a pollinator">
          <img className="definition-photo" src={PPT_MEDIA.heroFlower} alt="Close-up of a pink flower" />
          <img className="definition-photo-inset" src={PPT_MEDIA.beeFlower} alt="Bee visiting a coneflower" />
        </div>
      </div>
      <div className="distinction-strip"><CircleHelp size={16} /><span><strong>Exam-language check:</strong> pollen moves anther → stigma. Do not define pollination as the fusion of nuclei—that is fertilisation.</span></div>
    </div>
  );
}

const fertilisationStages = [
  { title: "The pollen nucleus travels", detail: "After pollen germinates, the male nucleus is carried towards an ovule." },
  { title: "The nuclei meet", detail: "The pollen nucleus reaches the female nucleus inside the ovule." },
  { title: "Fusion: fertilisation", detail: "The two nuclei fuse, forming a zygote." },
];

function FertilisationTimeline() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);
  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= fertilisationStages.length - 1) {
          window.clearInterval(timer);
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);
  const play = () => {
    if (reducedMotion) {
      setStep((current) => Math.min(fertilisationStages.length - 1, current + 1));
      return;
    }
    if (playing) {
      setPlaying(false);
      return;
    }
    if (step === fertilisationStages.length - 1) setStep(0);
    setPlaying(true);
  };
  return (
    <div className="section-card-pad">
      <div className="timeline-controls">
        <div><span className="card-tag"><Sparkles size={14} /> One key event</span><p className="part-intro" style={{ marginBottom: 0, marginTop: 6 }}>{reducedMotion ? "Reduced-motion mode: advance the nuclei one step at a time." : "Watch two nuclei come together. The fusion itself is fertilisation."}</p></div>
        <button className="button-secondary" type="button" onClick={play} aria-pressed={!reducedMotion && playing} disabled={reducedMotion && step === fertilisationStages.length - 1}>{reducedMotion ? step === fertilisationStages.length - 1 ? "Sequence complete" : "Next step" : playing ? "Pause sequence" : step === 2 ? "Replay sequence" : "Play sequence"} {playing && !reducedMotion ? <span aria-hidden="true">Ⅱ</span> : <ArrowRight size={14} />}</button>
      </div>
      <div className="timeline-track" aria-label="Fertilisation sequence">
        {fertilisationStages.map((stage, index) => (
          <div className={`timeline-step ${step === index ? "active" : ""} ${step > index ? "complete" : ""}`} key={stage.title}>
            <span className="timeline-dot">{step > index ? <Check size={15} /> : index + 1}</span>
            <strong>{stage.title}</strong><span>{stage.detail}</span>
          </div>
        ))}
      </div>
      <div className={`nucleus-scene ${step === 2 ? "fused" : ""}`} aria-live="polite">
        {step < 2 ? <><div className="nucleus pollen">Pollen<br />nucleus</div><span className="fusion-plus">{step === 0 ? "→" : "+"}</span><div className="nucleus egg">Ovule<br />nucleus</div></> : <div className="nucleus fused">Fused<br />nuclei · zygote</div>}
      </div>
      <figure className="fertilisation-reference">
        <img src={PPT_MEDIA.fertilisation} alt="Ovule diagram showing the pollen nucleus meeting the female nucleus inside an ovule" />
        <figcaption>The pollen nucleus reaches and fuses with a nucleus inside the ovule.</figcaption>
      </figure>
      <div className="key-callout" style={{ marginTop: 13 }}><CheckCircle2 size={17} /><span><strong>Fertilisation is the fusion of a pollen nucleus with the nucleus in an ovule.</strong> Pollination is the earlier transfer to the stigma.</span></div>
    </div>
  );
}

function AdaptationMatrix() {
  const [filter, setFilter] = useState<"all" | "attract" | "transfer">("all");
  const [ascending, setAscending] = useState(true);
  const rows = useMemo(() => adaptationRows.filter((row) => filter === "all" || row.type === filter).toSorted((a, b) => ascending ? a.feature.localeCompare(b.feature) : b.feature.localeCompare(a.feature)), [filter, ascending]);
  return (
    <div className="section-card-pad adaptation-layout">
      <figure className="adaptation-field-figure">
        <img src={PPT_MEDIA.fieldContrast} alt="Flower-rich meadow plants growing beside a dense crop field" />
        <figcaption>Field flowers and crops show flowering plants in contrasting environments.</figcaption>
      </figure>
      <div className="adaptation-content">
        <div className="adaptation-toolbar">
          <label className="sr-only" htmlFor="adaptation-filter">Filter adaptation table</label>
          <select id="adaptation-filter" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
            <option value="all">All adaptations</option><option value="attract">Attracting pollinators</option><option value="transfer">Position for pollen transfer</option>
          </select>
          <button className="sort-button" type="button" onClick={() => setAscending((value) => !value)}><ArrowUpDown size={14} style={{ verticalAlign: "-3px", marginRight: 5 }} />Sort {ascending ? "A–Z" : "Z–A"}</button>
        </div>
        <div className="table-scroll">
          <table className="adaptation-table">
            <thead><tr><th scope="col">Flower feature</th><th scope="col">Insect-pollinated</th><th scope="col">Wind-pollinated</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.feature}><td>{row.feature}</td><td>{row.insect}</td><td>{row.wind}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="key-callout" style={{ marginTop: 13 }}><Sparkles size={16} /><span>Adaptations work as a <strong>combination</strong>: attractants invite insects, while organ position and pollen shape support the route the pollen takes.</span></div>
      </div>
    </div>
  );
}

function GerminationExplorer() {
  const [water, setWater] = useState(true);
  const [oxygen, setOxygen] = useState(true);
  const [temperature, setTemperature] = useState(20);
  const suitableTemperature = temperature >= 15 && temperature <= 30;
  const allReady = water && oxygen && suitableTemperature;
  const missing = [!water && "water", !oxygen && "oxygen", !suitableTemperature && "a suitable temperature"].filter(Boolean);
  return (
    <div className="section-card-pad">
      <div className="germination-layout">
        <div>
          <div className="condition-list">
            <div className="condition-row">
              <span className="condition-symbol"><Droplets size={19} /></span><span><label htmlFor="water-toggle">Water</label><small>Rehydrates seed tissues and activates enzymes</small></span>
              <button id="water-toggle" type="button" className="switch-button" role="switch" aria-checked={water} aria-label="Water available" onClick={() => setWater((value) => !value)} />
            </div>
            <div className="condition-row">
              <span className="condition-symbol"><Wind size={19} /></span><span><label htmlFor="oxygen-toggle">Oxygen</label><small>Needed for aerobic respiration to release energy</small></span>
              <button id="oxygen-toggle" type="button" className="switch-button" role="switch" aria-checked={oxygen} aria-label="Oxygen present" onClick={() => setOxygen((value) => !value)} />
            </div>
            <div className="temp-card">
              <div className="temp-head"><span><Thermometer size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />Suitable temperature</span><span className="temp-value">{temperature}°C</span></div>
              <label className="sr-only" htmlFor="temperature-range">Set temperature for the seed-germination model</label>
              <input id="temperature-range" type="range" min="0" max="40" step="1" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} />
              <div className="range-labels"><span>Cool · 0°C</span><span>Warm · 40°C</span></div>
              <p className="temp-hint">The green band in this model is illustrative; suitable temperatures vary between species.</p>
            </div>
          </div>
          <div className={`germination-result ${allReady ? "" : "not-ready"}`} aria-live="polite">
            {allReady ? <CheckCircle2 size={19} /> : <CircleHelp size={19} />}
            <span>{allReady ? "All three requirements are available: germination can begin." : `Not all conditions are met: add ${missing.join(", ")}.`}</span>
          </div>
          <p className="exam-note"><strong>Exam note:</strong> light and soil are not required for a seed to begin germinating. Suitable temperature depends on the species.</p>
        </div>
        <figure style={{ margin: 0 }}>
          <div className="anatomy-art germination-figure"><img src={PPT_MEDIA.germination} alt="Experiment comparing seeds with and without water, oxygen and suitable temperature" /></div>
          <img className="seedling-photo" src={PPT_MEDIA.seedlings} alt="Young seedlings emerging from seeds" />
          <figcaption className="art-note">The experiment isolates germination conditions; the seedlings show the result. Try removing one condition above.</figcaption>
        </figure>
      </div>
    </div>
  );
}

function FlowerPhotoMark({ src }: { src: string }) {
  return <img src={src} alt="" aria-hidden="true" />;
}

function SelfPollinationFlow() {
  const [route, setRoute] = useState<"same-flower" | "same-plant">("same-flower");
  const isSameFlower = route === "same-flower";
  return (
    <div className="section-card-pad">
      <div className="flow-controls" role="group" aria-label="Choose a self-pollination route">
        <button className="flow-tab" type="button" aria-pressed={isSameFlower} onClick={() => setRoute("same-flower")}>Within the same flower</button>
        <button className="flow-tab" type="button" aria-pressed={!isSameFlower} onClick={() => setRoute("same-plant")}>Between flowers on one plant</button>
      </div>
      <div className="flow-diagram" aria-live="polite">
        <span className="species-label left">Plant A · same plant</span>
        <div className="flow-node"><span className="flower-mark"><FlowerPhotoMark src={DOCX_MEDIA.antherCloseup} /></span><span>{isSameFlower ? "One flower · anther" : "Flower 1 · anther"}</span></div>
        <div className="flow-arrow" aria-hidden="true"><span className="pollen-dot-trail" /><ArrowRight size={20} /></div>
        <div className="flow-node"><span className="flower-mark"><FlowerPhotoMark src={DOCX_MEDIA.stigmaCloseup} /></span><span>{isSameFlower ? "Same flower · stigma" : "Flower 2 · stigma"}</span></div>
      </div>
      <p className="flow-fact"><strong>Self-pollination:</strong> pollen moves from an anther to the stigma of the same flower, or to a different flower on the same plant. {isSameFlower ? "The pollen returns to the stigma of its own flower." : "Both flowers belong to the same individual plant."}</p>
      <figure className="source-flow-figure anatomy-art self-pollination-figure">
        <img src={PPT_MEDIA.selfPollination} alt="Self-pollination within one flower and between flowers on the same plant" />
        <figcaption className="art-note">Both routes count as self-pollination: the pollen stays on the same plant.</figcaption>
      </figure>
    </div>
  );
}

function CrossPollinationFlow() {
  const [vector, setVector] = useState<"insect" | "wind">("insect");
  return (
    <div className="section-card-pad">
      <div className="flow-controls" role="group" aria-label="Choose a pollen-transfer vector illustration">
        <button className="flow-tab" type="button" aria-pressed={vector === "insect"} onClick={() => setVector("insect")}>Insect-carried</button>
        <button className="flow-tab" type="button" aria-pressed={vector === "wind"} onClick={() => setVector("wind")}>Wind-borne</button>
      </div>
      <div className="flow-diagram" aria-live="polite">
        <span className="species-label left">Different plant · same species</span><span className="species-label right">Plant B · same species</span>
        <div className="flow-node"><span className="flower-mark"><FlowerPhotoMark src={DOCX_MEDIA.headerBee} /></span><span>Plant A · pollen donor</span></div>
        <div className="flow-arrow" aria-hidden="true"><span className="pollen-dot-trail" style={{ animationDuration: vector === "wind" ? "1.65s" : "2.5s" }} />{vector === "wind" ? <Wind size={20} /> : <ArrowRight size={20} />}</div>
        <div className="flow-node"><span className="flower-mark"><FlowerPhotoMark src={DOCX_MEDIA.crossPollination} /></span><span>Plant B · stigma receives pollen</span></div>
      </div>
      <p className="flow-fact"><strong>Cross-pollination:</strong> pollen moves from an anther to a flower on a <strong>different plant of the same species.</strong> The second plant boundary is the key distinction from self-pollination.</p>
      <figure className="anatomy-art cross-pollination-figure">
        <img src={PPT_MEDIA.crossPollination} alt="Pollen moving from one plant's anther to a flower's stigma on a different plant" />
        <figcaption className="art-note">Cross-pollination reaches a flower on a different plant of the same species.</figcaption>
      </figure>
    </div>
  );
}

const impactRows = [
  { label: "Genetic variation", self: "Usually lower among offspring; fewer new allele combinations.", cross: "Usually higher because genetic material comes from different plants." },
  { label: "Environmental resilience", self: "A population may have fewer variants suited to a new condition or disease.", cross: "Variation may mean some individuals are better suited to a change; survival is not guaranteed." },
  { label: "Pollinator vectors", self: "Can reproduce without pollen arriving from another plant; vector reliance may be lower, but transfer is not always vector-free.", cross: "Pollen must move between plants and often relies on insects or wind." },
];

function PopulationImpact() {
  const [focus, setFocus] = useState<"self" | "cross">("cross");
  return (
    <div className="section-card-pad">
      <div className="impact-tabs" role="group" aria-label="Highlight a pollination strategy">
        <button type="button" className="impact-tab" aria-pressed={focus === "self"} onClick={() => setFocus("self")}>Highlight self</button>
        <button type="button" className="impact-tab" aria-pressed={focus === "cross"} onClick={() => setFocus("cross")}>Highlight cross</button>
      </div>
      <div className="table-scroll">
        <table className="impact-table">
          <thead><tr><th scope="col">Population effect</th><th scope="col" className={focus === "self" ? "focus-column" : ""}>Self-pollination</th><th scope="col" className={focus === "cross" ? "focus-column" : ""}>Cross-pollination</th></tr></thead>
          <tbody>{impactRows.map((row) => <tr key={row.label}><td>{row.label}</td><td className={focus === "self" ? "focus-column" : ""}>{row.self}</td><td className={focus === "cross" ? "focus-column" : ""}>{row.cross}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="population-field-row">
        <figure><img src={PPT_MEDIA.alpineFlowers} alt="Wildflowers growing in a rocky alpine environment beneath mountain peaks" /><figcaption>Plants encounter different environments.</figcaption></figure>
        <div className="population-insight"><div className="supplement-note"><strong>Balanced answer:</strong> self-pollination can provide reproductive assurance when another plant or vector is scarce; cross-pollination can increase variation, which may help a population respond to change.</div><p className="part-intro">More variation can increase the chance that some plants suit a changed environment, but it does not guarantee survival.</p></div>
      </div>
    </div>
  );
}

const tubeSteps = [
  { title: "Pollen lands and germinates", detail: "A compatible pollen grain is received by the stigma and starts to grow." },
  { title: "The tube grows down the style", detail: "A pollen tube extends through the style towards the ovary." },
  { title: "It enters an ovule", detail: "The pollen tube reaches an ovule through its micropyle." },
  { title: "Nuclei fuse", detail: "The pollen nucleus fuses with a nucleus in the ovule: fertilisation." },
];

function PollenTubeSequence() {
  const [step, setStep] = useState(0);
  return (
    <div className="section-card-pad tube-layout">
      <figure className="tube-figure" style={{ margin: 0 }}>
        <img src={PPT_MEDIA.pollenTube} alt="A pollen grain germinating on the stigma and a tube growing through the style to the ovule's micropyle" />
        <figcaption className="art-note">Follow the pollen tube from the stigma down the style and through the micropyle.</figcaption>
      </figure>
      <div>
        <div className="step-list" aria-label="Pollen tube sequence">
          {tubeSteps.map((item, index) => (
            <button className="sequence-step" type="button" key={item.title} aria-current={step === index ? "step" : undefined} onClick={() => setStep(index)}>
              <span className="sequence-index">{index + 1}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span>
            </button>
          ))}
        </div>
        <div className="key-callout" aria-live="polite" style={{ marginTop: 12 }}><CheckCircle2 size={17} /><span><strong>Step {step + 1}:</strong> {tubeSteps[step].detail}</span></div>
        <div className="supplement-note" style={{ marginTop: 12 }}>Route to remember: <strong>stigma → style → ovary → micropyle → ovule.</strong></div>
      </div>
    </div>
  );
}

function QuizDashboard({ filter }: { filter: TierFilter }) {
  const [answers, setAnswers] = useState<Answers>(readSavedAnswers);
  const [questionIndex, setQuestionIndex] = useState(0);
  const visibleQuestions = useMemo(() => quizQuestions.filter((question) => filter === "all" || question.tier.toLowerCase() === filter), [filter]);
  const question = visibleQuestions[Math.min(questionIndex, Math.max(visibleQuestions.length - 1, 0))];
  const displayChoices = useMemo(() => question ? shuffleIndexedChoices(question.choices) : [], [question?.id]);
  useEffect(() => {
    try { window.sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(answers)); } catch { /* Scoring still works in memory if session storage is unavailable. */ }
  }, [answers]);
  useEffect(() => setQuestionIndex(0), [filter]);

  const totalQuestions = quizQuestions.length;
  const coreTotal = quizQuestions.filter((item) => item.tier === "CORE").length;
  const extendedTotal = quizQuestions.filter((item) => item.tier === "SUPPLEMENT").length;
  const score = quizQuestions.filter((item) => answers[item.id] === item.answer).length;
  const completed = quizQuestions.filter((item) => answers[item.id] !== undefined).length;
  const coreScore = quizQuestions.filter((item) => item.tier === "CORE" && answers[item.id] === item.answer).length;
  const extendedScore = quizQuestions.filter((item) => item.tier === "SUPPLEMENT" && answers[item.id] === item.answer).length;
  const coreDone = quizQuestions.filter((item) => item.tier === "CORE" && answers[item.id] !== undefined).length;
  const extendedDone = quizQuestions.filter((item) => item.tier === "SUPPLEMENT" && answers[item.id] !== undefined).length;
  const selectedAnswer = question ? answers[question.id] : undefined;
  const answerQuestion = (choice: number) => {
    if (question) setAnswers((current) => ({ ...current, [question.id]: choice }));
  };
  const jumpToPoint = (point: number) => {
    const firstUnanswered = visibleQuestions.findIndex((item) => item.point === point && answers[item.id] === undefined);
    const firstForPoint = visibleQuestions.findIndex((item) => item.point === point);
    const index = firstUnanswered >= 0 ? firstUnanswered : firstForPoint;
    if (index >= 0) setQuestionIndex(index);
  };
  const currentTierLabel = filter === "all" ? "All 12 syllabus points" : filter === "core" ? "Core points 1–8" : "Extended / Supplement points 9–12";

  return (
    <section className="quiz-section" id="self-assessment" aria-labelledby="quiz-title">
      <div className="page-wrap">
        <div className="quiz-banner">
          <div><div className="eyebrow" style={{ color: "#b5c5b1" }}>Your field check · instant feedback</div><h2 id="quiz-title">What’s taking root?</h2><p>Two questions for every syllabus point. Your progress is scored on this device’s current browser session—no account needed.</p></div>
          <div className="quiz-score-tile" aria-live="polite"><strong>{score}<span style={{ color: "#d0dfd0", fontSize: ".9rem" }}> / {totalQuestions}</span></strong><span>correct so far</span></div>
        </div>
        <div className="quiz-body">
          <div className="quiz-question">
            {question ? <>
              <div className="quiz-meta"><Badge tier={question.tier} /><span>Point {String(question.point).padStart(2, "0")} · {question.title}</span><span>Question {questionIndex + 1} of {visibleQuestions.length}</span></div>
              <h3>{question.prompt}</h3>
              <div className="answer-list" role="group" aria-label="Answer choices, shuffled for this question">
                {displayChoices.map((choice, index) => {
                  const wasAnswered = selectedAnswer !== undefined;
                  const isCorrectChoice = wasAnswered && choice.originalIndex === question.answer;
                  const isWrongChoice = wasAnswered && selectedAnswer === choice.originalIndex && choice.originalIndex !== question.answer;
                  return <button className={`answer-option ${isCorrectChoice ? "correct" : ""} ${isWrongChoice ? "incorrect" : ""}`} key={choice.originalIndex} type="button" onClick={() => answerQuestion(choice.originalIndex)} aria-pressed={selectedAnswer === choice.originalIndex}>
                    <span className="answer-key">{isCorrectChoice ? <Check size={14} /> : isWrongChoice ? <X size={14} /> : String.fromCharCode(65 + index)}</span><span>{choice.text}</span>
                  </button>;
                })}
              </div>
              {selectedAnswer !== undefined && <div className={`quiz-feedback ${selectedAnswer === question.answer ? "right" : "wrong"}`} role="status" aria-live="polite">
                {selectedAnswer === question.answer
                  ? <><CheckCircle2 size={17} /><span><strong>Exactly right.</strong> {question.explanation}</span></>
                  : <><CircleHelp size={17} /><span><strong>Not quite.</strong> Correct answer: <strong>{displayChoices.find((choice) => choice.originalIndex === question.answer)?.text}</strong>. {question.explanation}</span></>}
              </div>}
              <div className="quiz-controls">
                <button type="button" className="quiz-control-button" disabled={questionIndex === 0} onClick={() => setQuestionIndex((current) => Math.max(0, current - 1))}><ArrowLeft size={14} /> Previous</button>
                <button type="button" className="quiz-control-button" disabled={questionIndex >= visibleQuestions.length - 1} onClick={() => setQuestionIndex((current) => Math.min(visibleQuestions.length - 1, current + 1))}>Next question <ArrowRight size={14} /></button>
              </div>
            </> : <p>No questions for this filter.</p>}
          </div>
          <aside className="quiz-aside" aria-label="Assessment progress by Core and Extended syllabus point">
            <h3>Learning dashboard</h3><p>{currentTierLabel} · {completed} of {totalQuestions} questions attempted.</p>
            <div className="score-tier">Core · {coreDone}/{coreTotal} questions attempted</div>
            <div className="score-tier-row"><span>Correct</span><span>{coreScore} / {coreTotal}</span></div>
            <div className="progress-track"><span style={{ width: `${(coreScore / coreTotal) * 100}%` }} /></div>
            <div className="score-tier">Extended / Supplement · {extendedDone}/{extendedTotal} questions attempted</div>
            <div className="score-tier-row"><span>Correct</span><span>{extendedScore} / {extendedTotal}</span></div>
            <div className="progress-track supp"><span style={{ width: `${(extendedScore / extendedTotal) * 100}%` }} /></div>
            <div className="score-tier" style={{ marginTop: 16 }}>Jump to a syllabus point</div>
            <div className="point-progress">
              {syllabusSections.map((section) => {
                const pointQuestions = quizQuestions.filter((item) => item.point === section.point);
                const attempted = pointQuestions.filter((item) => answers[item.id] !== undefined).length;
                const correct = pointQuestions.filter((item) => answers[item.id] === item.answer).length;
                const hasIncorrect = pointQuestions.some((item) => answers[item.id] !== undefined && answers[item.id] !== item.answer);
                const complete = attempted === pointQuestions.length;
                const visible = filter === "all" || section.tier.toLowerCase() === filter;
                const status = attempted === 0 ? "not started" : `${attempted} of ${pointQuestions.length} attempted, ${correct} correct`;
                return <button type="button" key={section.point} className={`point-dot ${attempted ? "answered" : ""} ${section.tier === "SUPPLEMENT" ? "supp" : ""} ${hasIncorrect ? "incorrect" : ""} ${complete && correct === pointQuestions.length ? "correct" : ""}`} title={`Point ${section.point} · ${section.tier === "CORE" ? "Core" : "Extended"} · ${status}`} aria-label={`Go to point ${section.point}, ${section.tier === "CORE" ? "Core" : "Extended"}, ${status}`} aria-current={question?.point === section.point ? "step" : undefined} disabled={!visible} onClick={() => jumpToPoint(section.point)}>{String(section.point).padStart(2, "0")}</button>;
              })}
            </div>
            <button type="button" className="reset-button" onClick={() => { setAnswers({}); setQuestionIndex(0); }}><RotateCcw size={13} style={{ verticalAlign: "-3px", marginRight: 4 }} /> Reset this session</button>
          </aside>
        </div>
      </div>
    </section>
  );
}

function renderSyllabusPoint(point: number, activePart: FlowerPartId, setActivePart: (part: FlowerPartId) => void) {
  switch (point) {
    case 1:
      return <SectionFrame key="core-01" id="core-01" point={1} tier="CORE" title="A flower, opened up" description="Meet and label the structures of an insect-pollinated flower. Their functions follow in syllabus point 2."><AnatomyExplorer activePart={activePart} setActivePart={setActivePart} /></SectionFrame>;
    case 2:
      return <SectionFrame key="core-02" id="core-02" point={2} tier="CORE" title="Every part has a purpose" description="Explore what each structure does. A precise structure–function link is the beginning of a strong biology answer."><StructureFunctionExplorer activePart={activePart} setActivePart={setActivePart} /></SectionFrame>;
    case 3:
      return <SectionFrame key="core-03" id="core-03" point={3} tier="CORE" title="Built for the breeze" description="Wind-pollinated flowers expose their pollen-releasing and pollen-catching parts to moving air."><WindComparison /></SectionFrame>;
    case 4:
      return <SectionFrame key="core-04" id="core-04" point={4} tier="CORE" title="Two grains, two journeys" description="Pollen shape matches its route: cling to an insect, or drift through air."><PollenComparison /></SectionFrame>;
    case 5:
      return <SectionFrame key="core-05" id="core-05" point={5} tier="CORE" title="Pollination: the transfer" description="Define pollination precisely by naming the source of pollen and its destination."><PollinationDefinition /></SectionFrame>;
    case 6:
      return <SectionFrame key="core-06" id="core-06" point={6} tier="CORE" title="Fertilisation: the fusion" description="A pollen nucleus and a nucleus inside an ovule unite. Step through the event and watch the two become one."><FertilisationTimeline /></SectionFrame>;
    case 7:
      return <SectionFrame key="core-07" id="core-07" point={7} tier="CORE" title="Adaptations at a glance" description="Filter or sort the flower traits. Each difference helps explain how pollen is transferred."><AdaptationMatrix /></SectionFrame>;
    case 8:
      return <SectionFrame key="core-08" id="core-08" point={8} tier="CORE" title="A seed’s wake-up call" description="Try changing the conditions. A seed needs the right combination before germination can begin."><GerminationExplorer /></SectionFrame>;
    case 9:
      return <SectionFrame key="supplement-09" id="supplement-09" point={9} tier="SUPPLEMENT" title="Self-pollination stays close" description="The pollen recipient can be the very same flower, or another flower on that same plant."><SelfPollinationFlow /></SectionFrame>;
    case 10:
      return <SectionFrame key="supplement-10" id="supplement-10" point={10} tier="SUPPLEMENT" title="Cross-pollination crosses plants" description="The receiving flower must be on a different plant of the same species—not simply the next flower along."><CrossPollinationFlow /></SectionFrame>;
    case 11:
      return <SectionFrame key="supplement-11" id="supplement-11" point={11} tier="SUPPLEMENT" title="A population-level trade-off" description="Compare variation, possible resilience and reliance on pollen vectors—without treating either strategy as a guarantee."><PopulationImpact /></SectionFrame>;
    case 12:
      return <SectionFrame key="supplement-12" id="supplement-12" point={12} tier="SUPPLEMENT" title="The pollen tube’s route" description="Follow compatible pollen from the stigma, down the style, and through the micropyle into an ovule."><PollenTubeSequence /></SectionFrame>;
    default:
      return null;
  }
}

export default function PlantStudyPage() {
  const [filter, setFilter] = useState<TierFilter>("all");
  const [activePart, setActivePart] = useState<FlowerPartId>("stigma");
  const [completedPoints, setCompletedPoints] = useState<number[]>(() => readSavedCompletedPoints());
  const [activePoint, setActivePoint] = useState<number>(() => readSavedActivePoint());
  const [scrollToActivePoint, setScrollToActivePoint] = useState(false);
  const courseComplete = COURSE_SESSIONS.every((session) => completedPoints.includes(session.number));
  const activeSession = COURSE_SESSIONS[activePoint - 1];

  useEffect(() => {
    try {
      window.sessionStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(completedPoints));
    } catch {
      // The course still works when browser storage is unavailable; progress then lasts only in memory.
    }
  }, [completedPoints]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(COURSE_ACTIVE_POINT_KEY, String(activePoint));
    } catch {
      // The selected point still works in memory if browser storage is unavailable.
    }
  }, [activePoint]);

  useEffect(() => {
    if (!scrollToActivePoint) return;
    document.getElementById("current-point")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setScrollToActivePoint(false);
  }, [scrollToActivePoint]);

  const navigateToPoint = (point: number) => {
    if (point === activePoint) return;
    setActivePoint(point);
    setScrollToActivePoint(true);
  };
  const handleSelectPoint = (point: number) => {
    if (Number.isInteger(point) && point >= 1 && point <= COURSE_SESSIONS.length) navigateToPoint(point);
  };
  const handleCompletePoint = () => {
    setCompletedPoints((current) => current.includes(activePoint)
      ? current
      : [...current, activePoint].sort((left, right) => left - right));
  };
  const handlePreviousPoint = () => navigateToPoint(Math.max(1, activePoint - 1));
  const handleNextPoint = () => {
    if (activePoint < COURSE_SESSIONS.length) navigateToPoint(activePoint + 1);
  };

  return (
    <div id="main-content">
      <SiteHeader filter={filter} onFilter={setFilter} />
      <SectionNav activePoint={activePoint} completedPoints={completedPoints} courseComplete={courseComplete} onSelectPoint={handleSelectPoint} />
      <main>
        <Hero />
        <Starter />
        <LearningObjectives />
        <LessonIntro filter={filter} />
        <div className="page-wrap section-stack">
          <StudySessionFrame
            key={activeSession.id}
            session={activeSession}
            totalPoints={COURSE_SESSIONS.length}
            completedPoints={completedPoints}
            courseComplete={courseComplete}
            onComplete={handleCompletePoint}
            onPrevious={handlePreviousPoint}
            onNext={handleNextPoint}
          >
            {renderSyllabusPoint(activePoint, activePart, setActivePart)}
          </StudySessionFrame>
        </div>
        {courseComplete ? (
          <>
            <QuizDashboard filter={filter} />
            <Plenary />
          </>
        ) : (
          <section className="page-wrap assessment-lock" role="status" aria-labelledby="assessment-lock-title">
            <div className="assessment-lock-copy">
              <div className="eyebrow">Final review · course milestone</div>
              <h2 id="assessment-lock-title">Complete all twelve points—in any order</h2>
              <p>The 24-question self-assessment and Plenary appear after each point has been marked complete. You can open or revisit any point at any time. Progress is saved for this browser session.</p>
              <div className="assessment-lock-progress" role="progressbar" aria-label="Syllabus points completed" aria-valuemin={0} aria-valuemax={COURSE_SESSIONS.length} aria-valuenow={completedPoints.length}>
                <span style={{ width: `${(completedPoints.length / COURSE_SESSIONS.length) * 100}%` }} />
              </div>
              <strong>{completedPoints.length} of {COURSE_SESSIONS.length} points complete</strong>
            </div>
          </section>
        )}
      </main>
      <footer className="footer">
        <div className="page-wrap footer-inner"><span className="footer-brand"><span className="footer-mark" aria-hidden="true"><Flower2 size={17} /></span> Fieldnotes · IGCSE Biology</span><span>Topic 16.3 · Core 1–8 · Extended / Supplement 9–12</span><span>Built for curious minds and careful answers.</span></div>
      </footer>
    </div>
  );
}
