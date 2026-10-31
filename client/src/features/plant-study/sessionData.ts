export type SessionTier = "CORE" | "SUPPLEMENT";

export type MultipleChoiceCheck = {
  id: string;
  kind: "multiple-choice";
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

export type FillCheck = {
  id: string;
  kind: "fill-in-the-blank";
  prompt: string;
  answer: string;
  acceptedAnswers?: string[];
  explanation: string;
};

export type MatchingCheck = {
  id: string;
  kind: "matching";
  prompt: string;
  pairs: { term: string; definition: string }[];
  explanation: string;
};

export type SessionQuestion = MultipleChoiceCheck | FillCheck | MatchingCheck;

export type CourseSession = {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  summary: string;
  syllabus: string;
  tier: SessionTier;
  objectives: {
    what: string;
    why: string;
    how: string[];
  };
  questions: SessionQuestion[];
};

// Array order is intentional: array index + 1 must always equal the syllabus point number.
export const COURSE_SESSIONS: CourseSession[] = [
  {
    id: "session-01",
    number: 1,
    title: "Flower anatomy",
    shortTitle: "Flower anatomy",
    summary: "Explore the structures of an insect-pollinated flower. Point 2 explores their jobs; you can jump there whenever you choose.",
    syllabus: "Syllabus point 1 · Core",
    tier: "CORE",
    objectives: {
      what: "Identify sepals, petals, stamens, filaments, anthers, carpels, style, stigma, ovary and ovules on an insect-pollinated flower.",
      why: "Knowing where pollen is made and where it is received makes the later stages of reproduction easier to follow.",
      how: [
        "Use the supplied flower diagram to locate each named structure.",
        "Separate the male parts (stamen) from the female parts (carpel) and try the matching activity.",
      ],
    },
    questions: [
      {
        id: "p01-q1",
        kind: "multiple-choice",
        prompt: "Where are the ovules found?",
        choices: ["Inside the ovary", "On the anther", "At the tip of the filament", "On a petal"],
        answer: 0,
        explanation: "The ovary is at the base of the carpel and contains the ovules.",
      },
      {
        id: "p01-q2",
        kind: "fill-in-the-blank",
        prompt: "The female part that receives pollen grains is the ____.",
        answer: "stigma",
        explanation: "The stigma is the pollen-receiving surface at the top of the carpel.",
      },
      {
        id: "p01-q3",
        kind: "matching",
        prompt: "Match each structure to its position in the flower.",
        pairs: [
          { term: "Anther", definition: "At the end of a filament, as part of a stamen." },
          { term: "Style", definition: "Between the stigma and ovary, as part of a carpel." },
          { term: "Ovary", definition: "At the base of the carpel." },
        ],
        explanation: "Anthers belong to stamens; the stigma, style and ovary are parts of a carpel.",
      },
    ],
  },
  {
    id: "session-02",
    number: 2,
    title: "Flower structure functions",
    shortTitle: "Structure functions",
    summary: "Connect each flower structure with its precise function. Visit point 1 any time to review the labelled anatomy.",
    syllabus: "Syllabus point 2 · Core",
    tier: "CORE",
    objectives: {
      what: "Explain the functions of sepals, petals, stamens, filaments, anthers, carpels, style, stigma, ovary and ovules.",
      why: "Structure–function links explain how a flower protects, produces and receives the cells used in reproduction.",
      how: [
        "Select a structure in the explorer and read its function.",
        "Use the touch-friendly matching game to pair all ten structures with their roles.",
      ],
    },
    questions: [
      {
        id: "p02-q1",
        kind: "multiple-choice",
        prompt: "Which structure supports and positions an anther?",
        choices: ["Stigma", "Filament", "Ovary", "Sepal"],
        answer: 1,
        explanation: "A filament is the stalk that supports an anther and positions it for pollen release.",
      },
      {
        id: "p02-q2",
        kind: "fill-in-the-blank",
        prompt: "The ____ protect a developing flower bud before it opens.",
        answer: "sepals",
        explanation: "Sepals surround and protect the developing flower bud.",
      },
      {
        id: "p02-q3",
        kind: "matching",
        prompt: "Match each structure to its function.",
        pairs: [
          { term: "Petals", definition: "Often attract animal pollinators with colour or scent." },
          { term: "Stigma", definition: "Receives pollen grains." },
          { term: "Ovary", definition: "Contains and protects the ovules." },
        ],
        explanation: "Petals can attract pollinators, the stigma receives pollen and the ovary contains ovules.",
      },
    ],
  },
  {
    id: "session-03",
    number: 3,
    title: "Wind-pollinated structures",
    shortTitle: "Wind structures",
    summary: "Compare exposed anthers and feathery stigmas adapted to pollen moving through air.",
    syllabus: "Syllabus point 3 · Core",
    tier: "CORE",
    objectives: {
      what: "Describe how the anthers and stigmas of wind-pollinated flowers differ from those of insect-pollinated flowers.",
      why: "The position and shape of reproductive structures help pollen leave one flower and be caught by another.",
      how: [
        "Compare the supplied wind- and insect-pollinated flower images.",
        "Point out how exposed, hanging anthers release pollen and feathery stigmas catch it.",
      ],
    },
    questions: [
      {
        id: "p03-q1",
        kind: "multiple-choice",
        prompt: "Which pair is typical of many wind-pollinated flowers?",
        choices: ["Exposed, hanging anthers and a large feathery stigma", "Hidden anthers and a small stigma", "Nectar glands and a closed stigma", "Sticky anthers and buried stigmas"],
        answer: 0,
        explanation: "Exposed anthers shed pollen into air currents, while a feathery stigma can intercept airborne grains.",
      },
      {
        id: "p03-q2",
        kind: "fill-in-the-blank",
        prompt: "A large, feathery stigma helps ____ pollen moving through the air.",
        answer: "catch",
        explanation: "The expanded, feathery surface increases the chance of catching airborne pollen.",
      },
      {
        id: "p03-q3",
        kind: "matching",
        prompt: "Match each wind-pollinated feature to its role.",
        pairs: [
          { term: "Exposed anthers", definition: "Release pollen into moving air." },
          { term: "Feathery stigma", definition: "Intercepts pollen grains carried by wind." },
          { term: "Long, flexible filament", definition: "Positions an anther where air can move it." },
        ],
        explanation: "Wind-pollinated flowers expose the pollen source and provide a broad pollen-catching surface.",
      },
    ],
  },
  {
    id: "session-04",
    number: 4,
    title: "Pollen grain differences",
    shortTitle: "Pollen grains",
    summary: "See how pollen grain surfaces and size suit insect or wind transport.",
    syllabus: "Syllabus point 4 · Core",
    tier: "CORE",
    objectives: {
      what: "Compare the structural features of insect-pollinated and wind-pollinated pollen grains.",
      why: "A grain's size and surface affect whether it clings to an insect or travels readily in air.",
      how: [
        "Inspect the pollen image and compare the two pollen-type cards.",
        "Use the route of travel to explain why the grains have different surfaces and mass.",
      ],
    },
    questions: [
      {
        id: "p04-q1",
        kind: "multiple-choice",
        prompt: "Which pollen grain is best adapted to cling to an insect?",
        choices: ["Large, rough or spiky, and sticky", "Small, smooth, dry, and very light", "Waterlogged and slippery", "Smooth grains produced one at a time"],
        answer: 0,
        explanation: "A rough, spiky or sticky surface helps pollen attach to an insect and rub off at another flower.",
      },
      {
        id: "p04-q2",
        kind: "fill-in-the-blank",
        prompt: "Wind-transported pollen is often small, light and ____.",
        answer: "smooth",
        explanation: "A smooth, light grain is carried more readily in air currents.",
      },
      {
        id: "p04-q3",
        kind: "matching",
        prompt: "Match each pollen feature to its transport advantage.",
        pairs: [
          { term: "Insect pollen", definition: "Large, rough or spiky, and sticky." },
          { term: "Wind pollen", definition: "Small, smooth, dry, and light." },
          { term: "Spikes or sticky coating", definition: "Help pollen cling to an insect." },
        ],
        explanation: "Insect pollen tends to cling; wind pollen tends to travel through air more easily.",
      },
    ],
  },
  {
    id: "session-05",
    number: 5,
    title: "Pollination",
    shortTitle: "Pollination",
    summary: "Learn the exact anther-to-stigma definition and distinguish transfer from fertilisation.",
    syllabus: "Syllabus point 5 · Core",
    tier: "CORE",
    objectives: {
      what: "Define pollination as the transfer of pollen grains from an anther to a stigma.",
      why: "A precise definition prevents pollination (pollen transfer) being confused with fertilisation (nuclear fusion).",
      how: [
        "Trace the pollen path from its source in an anther to its destination on a stigma.",
        "Use the visual prompt to explain which event is pollination and which occurs later.",
      ],
    },
    questions: [
      {
        id: "p05-q1",
        kind: "multiple-choice",
        prompt: "What is pollination?",
        choices: ["Fusion of two nuclei", "Transfer of pollen grains from an anther to a stigma", "Growth of a seed", "Transfer of pollen from an ovary to an ovule"],
        answer: 1,
        explanation: "Pollination is pollen transfer from an anther to a stigma; it is not fertilisation.",
      },
      {
        id: "p05-q2",
        kind: "fill-in-the-blank",
        prompt: "Pollination transfers pollen grains from an anther to a ____.",
        answer: "stigma",
        explanation: "The stigma is the pollen-receiving surface.",
      },
      {
        id: "p05-q3",
        kind: "matching",
        prompt: "Match each word to its place in pollination.",
        pairs: [
          { term: "Anther", definition: "The source from which pollen is transferred." },
          { term: "Stigma", definition: "The destination to which pollen is transferred." },
          { term: "Pollination", definition: "The transfer between those structures." },
        ],
        explanation: "Pollination moves pollen from the anther to the stigma.",
      },
    ],
  },
  {
    id: "session-06",
    number: 6,
    title: "Fertilisation",
    shortTitle: "Fertilisation",
    summary: "Step through fertilisation: the pollen nucleus fuses with a nucleus inside an ovule.",
    syllabus: "Syllabus point 6 · Core",
    tier: "CORE",
    objectives: {
      what: "Explain that fertilisation is the fusion of a pollen nucleus with a nucleus inside an ovule.",
      why: "Fertilisation is the event that joins genetic material and forms the first cell of the new plant.",
      how: [
        "Use the timeline to distinguish pollination from the later nuclear fusion.",
        "Identify the two nuclei and describe what their fusion produces.",
      ],
    },
    questions: [
      {
        id: "p06-q1",
        kind: "multiple-choice",
        prompt: "What happens during fertilisation in a flowering plant?",
        choices: ["A pollen grain sticks to a petal", "A pollen nucleus fuses with a nucleus inside an ovule", "The ovary opens", "The anther grows a seed"],
        answer: 1,
        explanation: "Fertilisation is the fusion of a pollen nucleus with a female nucleus in an ovule.",
      },
      {
        id: "p06-q2",
        kind: "fill-in-the-blank",
        prompt: "The fused nuclei form a ____.",
        answer: "zygote",
        explanation: "The zygote is the first cell formed after the nuclei fuse.",
      },
      {
        id: "p06-q3",
        kind: "matching",
        prompt: "Match each term to the event it describes.",
        pairs: [
          { term: "Pollination", definition: "Transfer of pollen from anther to stigma." },
          { term: "Fertilisation", definition: "Fusion of nuclei inside an ovule." },
          { term: "Zygote", definition: "The first cell formed after the nuclei fuse." },
        ],
        explanation: "Pollination transfers pollen; fertilisation fuses nuclei; the fused nuclei form a zygote.",
      },
    ],
  },
  {
    id: "session-07",
    number: 7,
    title: "Structural adaptations",
    shortTitle: "Adaptations",
    summary: "Compare scent, nectar, colour and organ position as adaptations for pollen transfer.",
    syllabus: "Syllabus point 7 · Core",
    tier: "CORE",
    objectives: {
      what: "Compare how scent, nectar, colour and reproductive-organ position suit insect or wind pollination.",
      why: "Adaptations explain how flowers increase the chance of pollen reaching another flower of the same species.",
      how: [
        "Sort the adaptation matrix by pollination route and feature.",
        "Choose one feature and link its structure to the pollen-transfer method it supports.",
      ],
    },
    questions: [
      {
        id: "p07-q1",
        kind: "multiple-choice",
        prompt: "Which feature is typical of many insect-pollinated flowers?",
        choices: ["Conspicuous petals, scent or nectar", "Dull petals and exposed anthers only", "A large cloud of smooth pollen", "No attraction or reward for visitors"],
        answer: 0,
        explanation: "Colour and scent can attract insects, and nectar can reward a visit.",
      },
      {
        id: "p07-q2",
        kind: "fill-in-the-blank",
        prompt: "Nectar can act as a food ____ for a visiting pollinator.",
        answer: "reward",
        explanation: "Nectar rewards animal visitors and can encourage them to visit the flower.",
      },
      {
        id: "p07-q3",
        kind: "matching",
        prompt: "Match each adaptation to the way it supports pollination.",
        pairs: [
          { term: "Bright petals or scent", definition: "Attract insect pollinators." },
          { term: "Nectar", definition: "Provides a reward for visiting animals." },
          { term: "Exposed anthers and feathery stigmas", definition: "Suit pollen release and capture by wind." },
        ],
        explanation: "Insect-pollinated flowers often attract and reward visitors; wind-pollinated flowers expose reproductive structures to air currents.",
      },
    ],
  },
  {
    id: "session-08",
    number: 8,
    title: "Seed germination",
    shortTitle: "Germination",
    summary: "Test the combination of conditions a seed needs before it can begin to grow.",
    syllabus: "Syllabus point 8 · Core",
    tier: "CORE",
    objectives: {
      what: "Name water, oxygen and a suitable temperature as the three requirements for germination and explain their roles.",
      why: "These conditions let a seed restart metabolism and release the energy needed for early growth.",
      how: [
        "Toggle water and oxygen in the germination model.",
        "Adjust the temperature slider and identify which missing condition prevents germination.",
      ],
    },
    questions: [
      {
        id: "p08-q1",
        kind: "multiple-choice",
        prompt: "Which combination is required for seed germination?",
        choices: ["Water, oxygen and a suitable temperature", "Light, soil and water", "Carbon dioxide, light and warmth", "Water and soil only"],
        answer: 0,
        explanation: "Seeds need water, oxygen and a suitable temperature; soil and light are not universal requirements for germination itself.",
      },
      {
        id: "p08-q2",
        kind: "fill-in-the-blank",
        prompt: "A germinating seed uses oxygen for ____ respiration to release energy.",
        answer: "aerobic",
        explanation: "Oxygen is used in aerobic respiration, which releases energy for growth.",
      },
      {
        id: "p08-q3",
        kind: "matching",
        prompt: "Match each germination condition to its role.",
        pairs: [
          { term: "Water", definition: "Rehydrates the seed and helps activate enzymes." },
          { term: "Oxygen", definition: "Enables aerobic respiration to release energy." },
          { term: "Suitable temperature", definition: "Allows enzyme activity needed for growth." },
        ],
        explanation: "Water, oxygen and a suitable temperature are all required for germination.",
      },
    ],
  },
  {
    id: "session-09",
    number: 9,
    title: "Self-pollination",
    shortTitle: "Self-pollination",
    summary: "Keep track of the plant boundary: self-pollination stays within one flower or one plant.",
    syllabus: "Syllabus point 9 · Extended / Supplement",
    tier: "SUPPLEMENT",
    objectives: {
      what: "Explain that self-pollination transfers pollen to the stigma of the same flower or another flower on the same plant.",
      why: "Recognising the same-plant boundary helps distinguish self-pollination from cross-pollination in point 10.",
      how: [
        "Follow the arrows in the self-pollination diagram.",
        "Check whether the anther and receiving stigma belong to the same flower or plant.",
      ],
    },
    questions: [
      {
        id: "p09-q1",
        kind: "multiple-choice",
        prompt: "Which transfer is self-pollination?",
        choices: ["Pollen reaches the same flower or another flower on the same plant", "Pollen reaches a flower on another species", "A pollen tube enters an ovule", "Pollen moves from stigma to anther"],
        answer: 0,
        explanation: "Self-pollination occurs within the same flower or between flowers on the same plant.",
      },
      {
        id: "p09-q2",
        kind: "fill-in-the-blank",
        prompt: "Pollen transfer between two flowers on the same ____ is self-pollination.",
        answer: "plant",
        explanation: "Even when pollen moves between two different flowers, it is self-pollination if both are on the same plant.",
      },
      {
        id: "p09-q3",
        kind: "matching",
        prompt: "Match each transfer to its classification.",
        pairs: [
          { term: "Anther to stigma in one flower", definition: "Self-pollination." },
          { term: "One flower to another on the same plant", definition: "Self-pollination." },
          { term: "Different plant of the same species", definition: "Cross-pollination, not self-pollination." },
        ],
        explanation: "The key distinction is whether pollen stays within one flower/plant or crosses to another plant.",
      },
    ],
  },
  {
    id: "session-10",
    number: 10,
    title: "Cross-pollination",
    shortTitle: "Cross-pollination",
    summary: "Cross-pollination crosses to another plant, but the receiving plant must be the same species.",
    syllabus: "Syllabus point 10 · Extended / Supplement",
    tier: "SUPPLEMENT",
    objectives: {
      what: "Explain that cross-pollination transfers pollen from one plant to a flower on a different plant of the same species.",
      why: "The different-plant boundary distinguishes cross-pollination from self-pollination, even when both plants are close together.",
      how: [
        "Follow the pollen route between two plant boundaries in the supplied diagram.",
        "Check both conditions: a different plant and the same species.",
      ],
    },
    questions: [
      {
        id: "p10-q1",
        kind: "multiple-choice",
        prompt: "Which statement defines cross-pollination?",
        choices: ["Pollen moves to a flower on a different plant of the same species", "Pollen moves to another flower on the same plant", "Pollen lands on a petal", "Two nuclei fuse in one ovule"],
        answer: 0,
        explanation: "Cross-pollination transfers pollen to a flower on another plant of the same species.",
      },
      {
        id: "p10-q2",
        kind: "fill-in-the-blank",
        prompt: "The receiving flower must be on a different plant of the same ____.",
        answer: "species",
        explanation: "Both parts matter: the plant must be different, and it must belong to the same species.",
      },
      {
        id: "p10-q3",
        kind: "matching",
        prompt: "Match each route to its classification.",
        pairs: [
          { term: "Same flower", definition: "Self-pollination." },
          { term: "Different flower, same plant", definition: "Self-pollination." },
          { term: "Different plant, same species", definition: "Cross-pollination." },
        ],
        explanation: "Cross-pollination crosses the boundary between different plants of the same species.",
      },
    ],
  },
  {
    id: "session-11",
    number: 11,
    title: "Population impact and genetics",
    shortTitle: "Population impact",
    summary: "Compare possible effects of self- and cross-pollination on variation, resilience and pollinator reliance.",
    syllabus: "Syllabus point 11 · Extended / Supplement",
    tier: "SUPPLEMENT",
    objectives: {
      what: "Compare the effects of self- and cross-pollination on genetic variation, possible environmental resilience and reliance on pollinator vectors.",
      why: "Population variation can affect how a species responds to change, but no pollination strategy guarantees survival.",
      how: [
        "Compare the self- and cross-pollination columns in the population-impact matrix.",
        "State one possible advantage and one limitation without treating a tendency as a certainty.",
      ],
    },
    questions: [
      {
        id: "p11-q1",
        kind: "multiple-choice",
        prompt: "Why can cross-pollination help a population respond to environmental change?",
        choices: ["It makes every offspring identical", "It can increase variation, so some plants may be better suited to new conditions", "It guarantees that all plants survive", "It removes the need for pollen"],
        answer: 1,
        explanation: "More genetic variation may mean some individuals have helpful characteristics, but survival is never guaranteed.",
      },
      {
        id: "p11-q2",
        kind: "fill-in-the-blank",
        prompt: "Cross-pollination often increases genetic ____ in a population.",
        answer: "variation",
        explanation: "Pollen from different plants can combine different alleles, increasing variation among offspring.",
      },
      {
        id: "p11-q3",
        kind: "matching",
        prompt: "Match each strategy or outcome to a balanced description.",
        pairs: [
          { term: "Self-pollination", definition: "Can provide reproductive assurance, often with lower variation." },
          { term: "Cross-pollination", definition: "Often increases variation and may rely on a pollen vector." },
          { term: "Greater variation", definition: "May improve resilience for some individuals; it is not a guarantee." },
        ],
        explanation: "Self-pollination can reduce reliance on another plant/vector; cross-pollination often increases variation but may depend on pollen movement between plants.",
      },
    ],
  },
  {
    id: "session-12",
    number: 12,
    title: "Pollen tube growth and entry",
    shortTitle: "Pollen tube",
    summary: "Finish the sequence by tracing the pollen tube down the style and through the micropyle into an ovule.",
    syllabus: "Syllabus point 12 · Extended / Supplement",
    tier: "SUPPLEMENT",
    objectives: {
      what: "Describe how a compatible pollen grain germinates on the stigma and grows a tube down the style into the ovary, entering an ovule through the micropyle.",
      why: "The pollen tube provides the route for the pollen nucleus to reach the female nucleus for fertilisation.",
      how: [
        "Order the supplied pollen-tube growth diagrams from stigma to ovule.",
        "Locate the micropyle and explain how the tube enters the ovule before nuclear fusion.",
      ],
    },
    questions: [
      {
        id: "p12-q1",
        kind: "multiple-choice",
        prompt: "Which route does a pollen tube take to reach an ovule?",
        choices: ["Petal → sepal → anther", "Stigma → down the style → ovary → micropyle of an ovule", "Ovary → filament → stigma", "Anther → ovary wall → leaf"],
        answer: 1,
        explanation: "The tube grows from the stigma down the style, through the ovary and into an ovule through the micropyle.",
      },
      {
        id: "p12-q2",
        kind: "fill-in-the-blank",
        prompt: "The pollen tube enters the ovule through its ____.",
        answer: "micropyle",
        explanation: "The micropyle is the small opening through which the pollen tube enters the ovule.",
      },
      {
        id: "p12-q3",
        kind: "matching",
        prompt: "Match each structure or event to its place in the sequence.",
        pairs: [
          { term: "Compatible pollen grain", definition: "Germinates on the stigma." },
          { term: "Pollen tube", definition: "Grows down the style toward the ovary." },
          { term: "Micropyle", definition: "Opening through which the tube enters an ovule." },
        ],
        explanation: "The tube grows from a compatible pollen grain on the stigma, down the style, then enters an ovule through the micropyle.",
      },
    ],
  },
];

export function isOrderedTwelvePointCourse(sessions: CourseSession[] = COURSE_SESSIONS): boolean {
  return sessions.length === 12 && sessions.every((session, index) => session.number === index + 1);
}
