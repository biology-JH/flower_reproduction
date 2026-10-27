import { useEffect, useMemo, useState } from "react";
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

const ANSWERS_KEY = "fieldnotes-plant-reproduction-quiz-v2";

const DOCX_MEDIA = {
  header: "/manus-storage/01_585ddc74.png",
  headerWind: "/manus-storage/02_47342a28.png",
  headerBee: "/manus-storage/03_c3784110.png",
  antherCloseup: "/manus-storage/04_b2336b89.png",
  beePair: "/manus-storage/05_2718934f.png",
  stigmaCloseup: "/manus-storage/06_55da4129.png",
  ovuleCloseup: "/manus-storage/07_02cba3bf.png",
  fertilisationSequence: "/manus-storage/08_6253bbf6.png",
  flowerToSeed: "/manus-storage/09_dac06813.png",
  flowerAnatomy: "/manus-storage/10_dad8d9f6.png",
  crossPollination: "/manus-storage/11_0af2a73c.png",
  windPollination: "/manus-storage/12_4fadfc3b.png",
  insectPollination: "/manus-storage/13_726c9876.png",
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
            <img src="/brand-mark.svg" alt="" />
            <span>
              <span className="wordmark-title">Fieldnotes</span>
              <span className="wordmark-sub">Biology · 16.3</span>
            </span>
          </a>
          <div className="tier-toggle" role="group" aria-label="Filter syllabus material by Core or Extended tier">
            <button type="button" aria-pressed={filter === "all"} onClick={() => onFilter("all")}>All</button>
            <button type="button" aria-pressed={filter === "core"} onClick={() => onFilter("core")}>Core</button>
            <button type="button" aria-pressed={filter === "supplement"} onClick={() => onFilter("supplement")}>Extended</button>
          </div>
        </div>
      </header>
    </>
  );
}

function SectionNav({ filter }: { filter: TierFilter }) {
  const shown = syllabusSections.filter((item) => filter === "all" || item.tier.toLowerCase() === filter);
  return (
    <nav className="quick-nav" aria-label="Lesson sections">
      <div className="quick-nav-inner">
        <a href="#starter">Starter</a>
        <a href="#learning-objectives">Objectives</a>
        {shown.map((item, index) => (
          <span key={item.id} style={{ display: "contents" }}>
            {(index === 0 || item.tier !== shown[index - 1]?.tier) && (
              <span className="nav-tier">{item.tier === "CORE" ? "CORE" : "EXTENDED"}</span>
            )}
            <a href={`#${item.id}`} title={`Point ${item.point}: ${item.label}`}>
              {String(item.point).padStart(2, "0")} · {item.label}
            </a>
          </span>
        ))}
        <a href="#self-assessment">Quiz ↗</a>
        <a href="#plenary">Plenary</a>
      </div>
    </nav>
  );
}

function Hero({ onFilter }: { onFilter: (value: TierFilter) => void }) {
  return (
    <section className="hero" id="top">
      <div className="page-wrap hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">IGCSE Biology · Topic 16.3</div>
          <h1 className="hero-title">A flower’s<br />next <em>chapter.</em></h1>
          <p className="hero-lede">Follow the journey from flower parts to pollen, fertilisation and a seed ready to grow. A visual, exam-focused field guide—one syllabus point at a time.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#starter">Start the warm-up <ArrowRight size={16} /></a>
            <button className="button-secondary" type="button" onClick={() => { onFilter("supplement"); document.getElementById("supplement-09")?.scrollIntoView({ behavior: "smooth" }); }}>Go to Extended <Sprout size={15} /></button>
          </div>
          <div className="hero-stats" aria-label="Lesson overview">
            <div className="hero-stat"><span className="hero-stat-dot" /><span><strong>8</strong> Core points</span></div>
            <div className="hero-stat"><span className="hero-stat-dot" style={{ background: "#78946f" }} /><span><strong>4</strong> Extended points</span></div>
            <div className="hero-stat"><BookOpen size={15} /><span><strong>24</strong> quiz questions</span></div>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img className="hero-photo" src={DOCX_MEDIA.header} alt="Wide pink lilies with a bee carrying pollen between their anthers and stigmas—the first picture in the supplied DOCX" />
          <div className="image-caption">
            <span className="caption-mark"><Flower2 size={18} /></span>
            <span><span className="caption-title">Opening image · pollen in motion</span><span className="caption-sub">Start with the journey from anther to stigma.</span></span>
          </div>
          <div className="hero-photo-strip" aria-label="Two more pictures from the supplied DOCX">
            <figure><img src={DOCX_MEDIA.headerWind} alt="Close view of wind-pollinated grass with hanging anthers and feathery stigmas" /><figcaption>Wind · exposed structures</figcaption></figure>
            <figure><img src={DOCX_MEDIA.headerBee} alt="A bee visiting the reproductive parts of a pink flower" /><figcaption>Insect · pollen transfer</figcaption></figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function LessonIntro({ filter }: { filter: TierFilter }) {
  const text = filter === "core"
    ? <>Showing <strong>Core points 1–8.</strong> These form the shared foundation of the topic.</>
    : filter === "supplement"
      ? <>Showing <strong>Extended / Supplement points 9–12.</strong> Start here when you are ready to extend the story.</>
      : <>Move between <strong>Core (1–8)</strong> and <strong>Extended / Supplement (9–12)</strong> using the filter above. Every point badge marks its exam tier.</>;
  return (
    <div className="intro-band">
      <div className="page-wrap intro-band-inner">
        <p>{text}</p>
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
        <img src={DOCX_MEDIA.flowerAnatomy} alt="Illustration of a flower with petals, sepals, stamens, anthers, stigma, style and ovary" />
        <div className="botanical-photo-pair" aria-label="Close-up views of anther and stigma structures from the supplied DOCX">
          <img src={DOCX_MEDIA.antherCloseup} alt="Close-up of the anthers and central stigma inside a pink flower" />
          <img src={DOCX_MEDIA.stigmaCloseup} alt="Close-up of a flower stigma and pollen-receiving surface" />
        </div>
        <figcaption className="art-note">Flower overview with close-ups of pollen-producing anthers and the pollen-receiving stigma.</figcaption>
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

function StructureFunctionExplorer({ activePart, setActivePart }: { activePart: FlowerPartId; setActivePart: (part: FlowerPartId) => void }) {
  const selected = flowerParts.find((part) => part.id === activePart) ?? flowerParts[0];
  return (
    <div className="section-card-pad">
      <div className="part-intro" style={{ marginBottom: 15 }}>The reproductive parts are grouped into a male <strong>stamen</strong> (anther + filament) and a female <strong>carpel</strong> (stigma + style + ovary). Select any card to focus its function.</div>
      <div className="part-function-grid">
        {flowerParts.map((part) => (
          <button className="function-card" type="button" key={part.id} aria-pressed={activePart === part.id} onClick={() => setActivePart(part.id)}>
            <span className="function-card-top"><strong>{part.name}</strong><small>{part.group}</small></span>
            <p>{part.function}</p>
          </button>
        ))}
      </div>
      <div className="key-callout" style={{ marginTop: 14 }}><CheckCircle2 size={17} /><span><strong>{selected.name}</strong> is selected. In exam answers, name the structure and link it to its job—e.g. the filament supports the anther.</span></div>
    </div>
  );
}

function StructureSketch({ kind }: { kind: "insect" | "wind" }) {
  if (kind === "insect") {
    return (
      <svg viewBox="0 0 270 120" role="img" aria-label="Anthers and stigma held inside an insect-pollinated flower">
        <path d="M136 107V39" stroke="#6c8b58" strokeWidth="7" strokeLinecap="round" />
        <path d="M134 68C99 39 79 43 62 52c15 24 37 33 72 28M137 70c32-31 57-33 76-22-12 25-36 36-76 31" fill="#e6efe0" stroke="#9bb293" strokeWidth="2" />
        <path d="M111 44c-28-33-43-30-53-22 8 22 25 33 52 37M151 44c28-33 43-30 53-22-8 22-25 33-52 37" fill="#f2dcd5" stroke="#d69c89" strokeWidth="2" />
        <path d="M133 40V15" stroke="#678751" strokeWidth="5" strokeLinecap="round" />
        <path d="M124 14h18" stroke="#678751" strokeWidth="5" strokeLinecap="round" />
        <path d="M98 59 86 36M169 59l12-23" stroke="#82965e" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="83" cy="33" rx="5" ry="9" fill="#dc9b4f" transform="rotate(-18 83 33)" />
        <ellipse cx="184" cy="33" rx="5" ry="9" fill="#dc9b4f" transform="rotate(18 184 33)" />
        <text x="136" y="10" textAnchor="middle" fill="#61735d" fontSize="9">stigma</text>
        <text x="77" y="20" textAnchor="middle" fill="#61735d" fontSize="9">anther</text>
        <text x="193" y="20" textAnchor="middle" fill="#61735d" fontSize="9">anther</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 270 120" role="img" aria-label="A loosely hinged versatile anther hangs from a flexible filament while a feathery stigma projects into the wind">
      <path d="M60 108V18M60 50c-15-13-27-12-39-9M60 69c14-13 29-13 40-8" stroke="#789260" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M60 20c-11-5-15-1-14 8 4 7 11 9 17 7" fill="#e2b76d" stroke="#b88c4f" strokeWidth="2" />
      <path d="M206 106V38" stroke="#789260" strokeWidth="5" strokeLinecap="round" />
      <path d="M206 39V24" stroke="#789260" strokeWidth="3" />
      <path d="M205 26 186 10M205 26 197 5M205 26 212 5M205 26 225 10M205 28 186 42M205 28 199 48M205 28 212 49M205 28 226 42" stroke="#8eaa78" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 44c16 7 24 17 30 28" fill="none" stroke="#af956b" strokeDasharray="3 4" strokeWidth="2" />
      <path d="M121 58c12-8 21-8 31 0-10 8-19 8-31 0Z" fill="#ecce89" opacity=".75" />
      <text x="57" y="113" textAnchor="middle" fill="#61735d" fontSize="9">versatile anther</text>
      <text x="205" y="113" textAnchor="middle" fill="#61735d" fontSize="9">feathery stigma</text>
      <path d="M122 24h27" stroke="#9da99a" strokeWidth="1.5" strokeDasharray="2 4" />
      <path d="M141 19l8 5-8 5" fill="none" stroke="#9da99a" strokeWidth="1.5" />
      <text x="134" y="17" textAnchor="middle" fill="#899486" fontSize="8">air current</text>
    </svg>
  );
}

function WindComparison() {
  return (
    <div className="section-card-pad">
      <div className="compare-grid">
        <article className="compare-card">
          <div className="compare-card-head"><h3>Insect-pollinated</h3><span>Inside the flower</span></div>
          <div className="compare-card-body">
            <div className="structure-sketch"><StructureSketch kind="insect" /></div>
            <div className="compare-fact"><strong>Anthers</strong>Firmly held inside, where a visiting insect brushes against them.</div>
            <div className="compare-fact"><strong>Stigma</strong>Compact and sticky, positioned to receive pollen from an insect.</div>
          </div>
        </article>
        <article className="compare-card">
          <div className="compare-card-head"><h3>Wind-pollinated</h3><span>Exposed to air</span></div>
          <div className="compare-card-body">
            <div className="structure-sketch"><img className="wind-source-image" src={DOCX_MEDIA.windPollination} alt="Illustration of wind carrying pollen from hanging grass anthers toward feathery stigmas" /></div>
            <div className="compare-fact"><strong>Anthers</strong>Loosely hinged (versatile) on long, flexible filaments; they sway and release pollen into the air.</div>
            <div className="compare-fact"><strong>Stigma</strong>Large, feathery and exposed, with a broad surface that can catch airborne pollen.</div>
          </div>
        </article>
      </div>
      <div className="key-callout" style={{ marginTop: 13 }}><Wind size={17} /><span>Think of the route: <strong>release into air → intercept from air.</strong> Both structures are positioned to make wind transfer more likely.</span></div>
    </div>
  );
}

function PollenGrainIllustration({ kind }: { kind: "insect" | "wind" }) {
  const isInsect = kind === "insect";
  const spikes = isInsect ? Array.from({ length: 12 }, (_, index) => index * 30) : [];
  return (
    <svg viewBox="0 0 140 112" role="img" aria-label={isInsect ? "Schematic of a larger rough pollen grain with barbs" : "Schematic of a smaller smooth pollen grain with an aerodynamic shape"}>
      <defs>
        <radialGradient id={isInsect ? "insect-grain" : "wind-grain"} cx="35%" cy="30%">
          <stop offset="0" stopColor={isInsect ? "#f6d59a" : "#dcead0"} />
          <stop offset="1" stopColor={isInsect ? "#cf8b55" : "#78976c"} />
        </radialGradient>
      </defs>
      {spikes.map((angle) => <path key={angle} d="M70 16L65 33L75 33Z" transform={`rotate(${angle} 70 56)`} fill="#b7774b" stroke="#925c39" strokeWidth="1" />)}
      <ellipse cx="70" cy="56" rx={isInsect ? 31 : 23} ry={isInsect ? 25 : 17} fill={`url(#${isInsect ? "insect-grain" : "wind-grain"})`} stroke={isInsect ? "#9d663f" : "#67845d"} strokeWidth="2" />
      {isInsect ? <ellipse cx="59" cy="47" rx="6" ry="4" fill="#fff4d6" opacity=".55" /> : <>
        <path d="M52 51c9-7 22-7 33 0" fill="none" stroke="#f3f7e9" strokeWidth="2" opacity=".7" />
        <path d="M55 62c8 4 17 4 26 0" fill="none" stroke="#54734d" strokeWidth="1.5" opacity=".35" />
        <path d="M99 56h22m-7-7 7 7-7 7" fill="none" stroke="#7b9271" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>}
    </svg>
  );
}

function PollenComparison() {
  return (
    <div className="section-card-pad pollen-grid">
      <div className="pollen-visual-grid" aria-label="Schematic comparison of pollen grain size and surface">
        <figure className="pollen-shape-card insect-shape"><PollenGrainIllustration kind="insect" /><figcaption><strong>Cling to a visitor</strong><span>larger · rough / barbed</span></figcaption></figure>
        <figure className="pollen-shape-card wind-shape"><PollenGrainIllustration kind="wind" /><figcaption><strong>Drift through air</strong><span>smaller · smooth / light</span></figcaption></figure>
        <p className="pollen-schematic-note">Schematic feature view · not to scale</p>
      </div>
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
        <img className="definition-photo" src={DOCX_MEDIA.beePair} alt="Bee moving between two purple flowers while pollen is transferred" />
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
        <img src={DOCX_MEDIA.fertilisationSequence} alt="Three microscopy-style stages of a pollen tube reaching an ovule and nuclei fusing" />
        <figcaption>Three stages inside the ovule: the pollen nucleus reaches the female nucleus and they fuse.</figcaption>
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
        <img src={DOCX_MEDIA.insectPollination} alt="Illustration of an insect visiting flowers and carrying pollen between them" />
        <figcaption>Conspicuous petals and a pollinator illustrate an insect-pollinated route.</figcaption>
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
          <div className="anatomy-art" style={{ padding: 10 }}><img src={DOCX_MEDIA.flowerToSeed} alt="A sequence from an open flower to a swelling ovary and a mature fruit containing seeds" style={{ maxHeight: 255, aspectRatio: "1.12 / 1" }} /></div>
          <figcaption className="art-note">After fertilisation, ovules become seeds. The interactive controls above model the water, oxygen and suitable temperature those seeds need to germinate.</figcaption>
        </figure>
      </div>
    </div>
  );
}

function FlowerMark({ color = "#d88e7b" }: { color?: string }) {
  return (
    <svg viewBox="0 0 70 84" aria-hidden="true">
      <path d="M35 38v38" stroke="#6f8e61" strokeWidth="4" strokeLinecap="round" />
      <path d="M34 63c-13-11-21-9-27-6 6 11 15 14 28 11M36 57c9-12 19-14 27-12-3 12-12 18-28 18" fill="#a5bb98" />
      <g transform="translate(35 25)" fill={color}>
        <ellipse cy="-12" rx="7" ry="13" /><ellipse cy="-12" rx="7" ry="13" transform="rotate(60)" /><ellipse cy="-12" rx="7" ry="13" transform="rotate(120)" /><ellipse cy="-12" rx="7" ry="13" transform="rotate(180)" /><ellipse cy="-12" rx="7" ry="13" transform="rotate(240)" /><ellipse cy="-12" rx="7" ry="13" transform="rotate(300)" />
        <circle r="5" fill="#edc873" />
      </g>
    </svg>
  );
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
        <div className="flow-node"><span className="flower-mark"><FlowerMark /></span><span>{isSameFlower ? "One flower · anther" : "Flower 1 · anther"}</span></div>
        <div className="flow-arrow" aria-hidden="true"><span className="pollen-dot-trail" /><ArrowRight size={20} /></div>
        <div className="flow-node"><span className="flower-mark"><FlowerMark color="#e0a174" /></span><span>{isSameFlower ? "Same flower · stigma" : "Flower 2 · stigma"}</span></div>
      </div>
      <p className="flow-fact"><strong>Self-pollination:</strong> pollen moves from an anther to the stigma of the same flower, or to a different flower on the same plant. {isSameFlower ? "The pollen returns to the stigma of its own flower." : "Both flowers belong to the same individual plant."}</p>
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
        <div className="flow-node"><span className="flower-mark"><FlowerMark /></span><span>Plant A · pollen donor</span></div>
        <div className="flow-arrow" aria-hidden="true"><span className="pollen-dot-trail" style={{ animationDuration: vector === "wind" ? "1.65s" : "2.5s" }} />{vector === "wind" ? <Wind size={20} /> : <ArrowRight size={20} />}</div>
        <div className="flow-node"><span className="flower-mark"><FlowerMark color="#e0a174" /></span><span>Plant B · stigma receives pollen</span></div>
      </div>
      <p className="flow-fact"><strong>Cross-pollination:</strong> pollen moves from an anther to a flower on a <strong>different plant of the same species.</strong> The second plant boundary is the key distinction from self-pollination.</p>
      <figure className="anatomy-art" style={{ margin: "16px 0 0", padding: 10 }}>
        <img src={DOCX_MEDIA.crossPollination} alt="Illustration of a bee carrying pollen from one flower to another flower on a different plant" style={{ maxHeight: 240 }} />
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
      <div className="population-insight"><div className="supplement-note"><strong>Balanced answer:</strong> self-pollination can provide reproductive assurance when another plant or vector is scarce; cross-pollination can increase variation, which may help a population respond to change.</div><p className="part-intro">More variation can increase the chance that some plants suit a changed environment, but it does not guarantee survival.</p></div>
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
        <img src={DOCX_MEDIA.ovuleCloseup} alt="Close view of a flower's style and ovule, showing the pollen tube route into the ovule" />
        <figcaption className="art-note">The close-up connects the style to the ovule; the pollen tube enters through the micropyle.</figcaption>
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
              <div className="answer-list" role="group" aria-label="Answer choices">
                {question.choices.map((choice, index) => {
                  const wasAnswered = selectedAnswer !== undefined;
                  const isCorrectChoice = wasAnswered && index === question.answer;
                  const isWrongChoice = wasAnswered && selectedAnswer === index && index !== question.answer;
                  return <button className={`answer-option ${isCorrectChoice ? "correct" : ""} ${isWrongChoice ? "incorrect" : ""}`} key={choice} type="button" onClick={() => answerQuestion(index)} aria-pressed={selectedAnswer === index}>
                    <span className="answer-key">{isCorrectChoice ? <Check size={14} /> : isWrongChoice ? <X size={14} /> : String.fromCharCode(65 + index)}</span><span>{choice}</span>
                  </button>;
                })}
              </div>
              {selectedAnswer !== undefined && <div className={`quiz-feedback ${selectedAnswer === question.answer ? "right" : "wrong"}`} role="status">
                {selectedAnswer === question.answer ? <CheckCircle2 size={17} /> : <CircleHelp size={17} />}<span><strong>{selectedAnswer === question.answer ? "Exactly right." : "Not quite—try the key idea again."}</strong> {question.explanation}</span>
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

export default function PlantStudyPage() {
  const [filter, setFilter] = useState<TierFilter>("all");
  const [activePart, setActivePart] = useState<FlowerPartId>("stigma");
  const showCore = filter !== "supplement";
  const showSupplement = filter !== "core";
  return (
    <div id="main-content">
      <SiteHeader filter={filter} onFilter={setFilter} />
      <SectionNav filter={filter} />
      <main>
        <Hero onFilter={setFilter} />
        <Starter />
        <LearningObjectives />
        <LessonIntro filter={filter} />
        <div className="page-wrap section-stack">
          {showCore && <>
            <SectionFrame id="core-01" point={1} tier="CORE" title="A flower, opened up" description="Meet the parts of an insect-pollinated flower—and see how the same plan contrasts with a wind-pollinated grass.">
              <AnatomyExplorer activePart={activePart} setActivePart={setActivePart} />
            </SectionFrame>
            <SectionFrame id="core-02" point={2} tier="CORE" title="Every part has a purpose" description="Explore what each structure does. A precise structure–function link is the beginning of a strong biology answer.">
              <StructureFunctionExplorer activePart={activePart} setActivePart={setActivePart} />
            </SectionFrame>
            <SectionFrame id="core-03" point={3} tier="CORE" title="Built for the breeze" description="Wind-pollinated flowers expose their pollen-releasing and pollen-catching parts to moving air.">
              <WindComparison />
            </SectionFrame>
            <SectionFrame id="core-04" point={4} tier="CORE" title="Two grains, two journeys" description="Pollen shape matches its route: cling to an insect, or drift through air.">
              <PollenComparison />
            </SectionFrame>
            <SectionFrame id="core-05" point={5} tier="CORE" title="Pollination: the transfer" description="One short definition draws a clear line between moving pollen and joining nuclei.">
              <PollinationDefinition />
            </SectionFrame>
            <SectionFrame id="core-06" point={6} tier="CORE" title="Fertilisation: the fusion" description="A pollen nucleus and a nucleus inside an ovule unite. Step through the event and watch the two become one.">
              <FertilisationTimeline />
            </SectionFrame>
            <SectionFrame id="core-07" point={7} tier="CORE" title="Adaptations at a glance" description="Filter or sort the flower traits. Each difference helps explain how pollen is transferred.">
              <AdaptationMatrix />
            </SectionFrame>
            <SectionFrame id="core-08" point={8} tier="CORE" title="A seed’s wake-up call" description="Try changing the conditions. A seed needs the right combination before germination can begin.">
              <GerminationExplorer />
            </SectionFrame>
          </>}
          {showSupplement && <>
            <div className="intro-band" style={{ padding: "32px 0 0" }}><div className="intro-band-inner"><p><strong>Supplement / Extended · points 9–12</strong> — continue from pollen transfer into inheritance, populations and the pollen tube’s route.</p><div className="intro-key"><Badge tier="SUPPLEMENT" /></div></div></div>
            <SectionFrame id="supplement-09" point={9} tier="SUPPLEMENT" title="Self-pollination stays close" description="The pollen recipient can be the very same flower, or another flower on that same plant.">
              <SelfPollinationFlow />
            </SectionFrame>
            <SectionFrame id="supplement-10" point={10} tier="SUPPLEMENT" title="Cross-pollination crosses plants" description="The receiving flower must be on a different plant of the same species—not simply the next flower along.">
              <CrossPollinationFlow />
            </SectionFrame>
            <SectionFrame id="supplement-11" point={11} tier="SUPPLEMENT" title="A population-level trade-off" description="Compare variation, possible resilience and reliance on pollen vectors—without treating either strategy as a guarantee.">
              <PopulationImpact />
            </SectionFrame>
            <SectionFrame id="supplement-12" point={12} tier="SUPPLEMENT" title="The pollen tube’s route" description="Follow compatible pollen from the stigma, down the style, and through the micropyle into an ovule.">
              <PollenTubeSequence />
            </SectionFrame>
          </>}
        </div>
        <QuizDashboard filter={filter} />
        <Plenary />
      </main>
      <footer className="footer">
        <div className="page-wrap footer-inner"><span className="footer-brand"><img src="/brand-mark.svg" alt="" /> Fieldnotes · IGCSE Biology</span><span>Topic 16.3 · Core 1–8 · Extended / Supplement 9–12</span><span>Built for curious minds and careful answers.</span></div>
      </footer>
    </div>
  );
}
