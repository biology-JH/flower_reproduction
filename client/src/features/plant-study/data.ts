export type Tier = "CORE" | "SUPPLEMENT";
export type TierFilter = "all" | "core" | "supplement";

export const flowerParts = [
  {
    id: "sepals",
    name: "Sepals",
    group: "Outer whorl",
    function: "Protect the developing flower bud before it opens, helping shield delicate parts from damage and drying out.",
  },
  {
    id: "petals",
    name: "Petals",
    group: "Outer whorl",
    function: "Attract animal pollinators with conspicuous colour and, in many flowers, scent. Nectar may reward visiting pollinators.",
  },
  {
    id: "stamens",
    name: "Stamens",
    group: "Male part",
    function: "The male reproductive structures of a flower. Each stamen is made of an anther supported by a filament.",
  },
  {
    id: "filaments",
    name: "Filaments",
    group: "Male part",
    function: "Support and position the anther so pollen can be released where it can be transferred by insects or wind.",
  },
  {
    id: "anthers",
    name: "Anthers",
    group: "Male part",
    function: "Produce and release pollen grains, which contain the male nucleus.",
  },
  {
    id: "carpels",
    name: "Carpels",
    group: "Female part",
    function: "The female reproductive unit. A carpel includes a stigma, style and ovary; a flower may have one or more carpels.",
  },
  {
    id: "style",
    name: "Style",
    group: "Female part",
    function: "Supports the stigma above the ovary and provides the route down which a pollen tube grows after compatible pollen germinates.",
  },
  {
    id: "stigma",
    name: "Stigma",
    group: "Female part",
    function: "The receptive surface that receives pollen. In insect-pollinated flowers it is often sticky, helping pollen grains adhere.",
  },
  {
    id: "ovary",
    name: "Ovary",
    group: "Female part",
    function: "Contains and protects the ovules. It is at the base of the carpel.",
  },
  {
    id: "ovules",
    name: "Ovules",
    group: "Inside the ovary",
    function: "Each ovule contains a female gamete (egg cell). The pollen tube enters through its micropyle and delivers the male nucleus for fertilisation.",
  },
] as const;

export type FlowerPartId = (typeof flowerParts)[number]["id"];

export const adaptationRows = [
  {
    feature: "Scent",
    type: "attract",
    insect: "Often present; helps attract insect pollinators.",
    wind: "Usually absent; wind does not need a scent reward.",
  },
  {
    feature: "Nectar",
    type: "attract",
    insect: "Often produced as a food reward for visiting pollinators.",
    wind: "Absent; no animal pollinator needs to be rewarded.",
  },
  {
    feature: "Petal colour",
    type: "attract",
    insect: "Usually large and conspicuous, often brightly coloured.",
    wind: "Usually small, dull, greenish or absent.",
  },
  {
    feature: "Reproductive-organ position",
    type: "transfer",
    insect: "Anthers and stigma are usually held inside the flower, positioned to contact visiting insects.",
    wind: "Loosely hinged (versatile) anthers hang outside on flexible filaments; feathery stigmas project into moving air.",
  },
] as const;

export type QuizQuestion = {
  id: string;
  point: number;
  tier: Tier;
  title: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
};

type QuestionSeed = Pick<QuizQuestion, "prompt" | "choices" | "answer" | "explanation">;
type QuestionSet = { point: number; tier: Tier; title: string; questions: QuestionSeed[] };

const questionSets: QuestionSet[] = [
  {
    point: 1, tier: "CORE", title: "Flower anatomy", questions: [
      { prompt: "Where are the ovules found?", choices: ["Inside the ovary", "On the anther", "At the tip of the filament", "On a petal"], answer: 0, explanation: "The ovary is the basal part of a carpel and contains the ovules." },
      { prompt: "Which flower structure receives pollen during pollination?", choices: ["Stigma", "Ovary", "Sepal", "Filament"], answer: 0, explanation: "Pollen is transferred from an anther to a stigma." },
    ],
  },
  {
    point: 2, tier: "CORE", title: "Structure functions", questions: [
      { prompt: "Which structure supports and positions an anther?", choices: ["Stigma", "Filament", "Ovary", "Sepal"], answer: 1, explanation: "The filament is the stalk that supports the anther." },
      { prompt: "What is a main function of sepals?", choices: ["Protect the flower bud", "Make pollen grains", "Receive pollen", "Contain ovules"], answer: 0, explanation: "Sepals surround and protect the developing flower bud." },
    ],
  },
  {
    point: 3, tier: "CORE", title: "Wind-pollinated structures", questions: [
      { prompt: "Which pair best describes a wind-pollinated flower?", choices: ["Enclosed anthers and a small sticky stigma", "Pendulous anthers and a feathery exposed stigma", "Scented petals and nectar", "Heavy anthers and hidden stigma"], answer: 1, explanation: "Exposed anthers shed pollen into air currents; a large, feathery stigma can intercept pollen." },
      { prompt: "Why may wind-pollinated anthers hang loosely on flexible filaments?", choices: ["To sway and release pollen into moving air", "To make nectar easier to reach", "To protect the pollen from air", "To catch pollen on a sticky surface"], answer: 0, explanation: "Versatile anthers can swing in the wind, helping release pollen into air currents." },
    ],
  },
  {
    point: 4, tier: "CORE", title: "Pollen grain adaptations", questions: [
      { prompt: "Which pollen is most likely to cling to an insect?", choices: ["Large, rough or spiky, and sticky", "Small, dry, smooth and very light", "Waterlogged and slippery", "Smooth grains produced singly"], answer: 0, explanation: "A rough, barbed or sticky surface helps insect-carried pollen attach and rub off." },
      { prompt: "Why is wind-borne pollen usually light and smooth?", choices: ["It can travel more readily in air currents", "It can attach firmly to fur", "It can attract insects with nectar", "It can grow into a petal"], answer: 0, explanation: "Small, light, smooth grains are more easily carried by moving air." },
    ],
  },
  {
    point: 5, tier: "CORE", title: "Pollination", questions: [
      { prompt: "What is pollination?", choices: ["Fusion of two nuclei", "Transfer of pollen grains from an anther to a stigma", "Growth of a seed", "Transfer of pollen from an ovary to an ovule"], answer: 1, explanation: "Pollination is the transfer of pollen grains from an anther to a stigma. It is not fertilisation." },
      { prompt: "Which order describes pollination?", choices: ["Stigma → anther", "Anther → stigma", "Ovary → petal", "Ovule → filament"], answer: 1, explanation: "Pollen moves from the anther, where it is produced, to a stigma." },
    ],
  },
  {
    point: 6, tier: "CORE", title: "Fertilisation", questions: [
      { prompt: "What happens during fertilisation in a flowering plant?", choices: ["A pollen grain sticks to a petal", "A pollen nucleus fuses with a nucleus in an ovule", "The ovary opens", "The anther grows a pollen tube"], answer: 1, explanation: "Fertilisation is the fusion of a pollen nucleus with a female nucleus in an ovule." },
      { prompt: "Which event makes a zygote?", choices: ["A pollen grain lands on a stigma", "A pollen nucleus fuses with the ovule nucleus", "An anther releases pollen", "A seed absorbs water"], answer: 1, explanation: "Fusion of the two nuclei forms a zygote; pollen transfer itself is pollination." },
    ],
  },
  {
    point: 7, tier: "CORE", title: "Structural adaptations", questions: [
      { prompt: "Which feature is typical of an insect-pollinated flower?", choices: ["Nectar and conspicuous petals", "Dull petals and exposed anthers", "Feathery stigmas only", "A large cloud of smooth pollen"], answer: 0, explanation: "Colour, scent and nectar can attract insect pollinators." },
      { prompt: "Which combination is typical of wind pollination?", choices: ["Strong scent, nectar and vivid petals", "Small or absent petals with exposed organs", "Sticky pollen and enclosed anthers", "Nectar and a hidden stigma"], answer: 1, explanation: "Wind-pollinated flowers often have less need for showy petals and expose their anthers and stigmas to the air." },
    ],
  },
  {
    point: 8, tier: "CORE", title: "Seed germination", questions: [
      { prompt: "Which conditions are required for seed germination?", choices: ["Light, soil and water", "Water, oxygen and a suitable temperature", "Carbon dioxide and light", "Water and soil only"], answer: 1, explanation: "Seeds need water, oxygen and a suitable temperature. Light and soil are not universal requirements for germination." },
      { prompt: "Why does a germinating seed need oxygen?", choices: ["For aerobic respiration to release energy", "To make chlorophyll before it sprouts", "To attract pollinators", "To form a pollen tube"], answer: 0, explanation: "Oxygen is used in aerobic respiration, which releases energy for growth." },
    ],
  },
  {
    point: 9, tier: "SUPPLEMENT", title: "Self-pollination", questions: [
      { prompt: "Which transfer is self-pollination?", choices: ["Pollen reaches a flower on another species", "Pollen reaches the same flower or another flower on the same plant", "A pollen tube enters an ovule", "Pollen moves from stigma to anther"], answer: 1, explanation: "Self-pollination transfers pollen to the same flower or another flower on the same plant." },
      { prompt: "Two flowers on one plant exchange pollen. Which process is this?", choices: ["Cross-pollination", "Self-pollination", "Fertilisation", "Germination"], answer: 1, explanation: "Pollen transfer between flowers on the same plant is self-pollination." },
    ],
  },
  {
    point: 10, tier: "SUPPLEMENT", title: "Cross-pollination", questions: [
      { prompt: "Which statement defines cross-pollination?", choices: ["Pollen moves to a different flower on the same plant", "Pollen moves from anther to stigma within one flower", "Pollen moves to a flower on a different plant of the same species", "A pollen tube grows down the style"], answer: 2, explanation: "Cross-pollination transfers pollen to a flower on a different plant of the same species." },
      { prompt: "Does pollen transfer between two different species count as cross-pollination?", choices: ["Yes, whenever it reaches another flower", "No; cross-pollination is between different plants of the same species", "Yes, if the plants are the same colour", "No; cross-pollination only happens within one flower"], answer: 1, explanation: "The receiving flower must be on another plant of the same species." },
    ],
  },
  {
    point: 11, tier: "SUPPLEMENT", title: "Population impact & genetics", questions: [
      { prompt: "Why can cross-pollination help a population respond to environmental change?", choices: ["It makes every offspring identical", "It can increase genetic variation, so some individuals may be better suited to new conditions", "It removes the need for pollen", "It guarantees every plant survives"], answer: 1, explanation: "Greater variation may mean some plants carry alleles that help them survive change; it does not guarantee survival." },
      { prompt: "What is one possible advantage of self-pollination when mates or vectors are scarce?", choices: ["It can provide reproductive assurance", "It always creates more genetic variation", "It guarantees offspring survive", "It removes the need for ovules"], answer: 0, explanation: "Self-pollination can allow reproduction when another plant or pollinating vector is hard to find, although variation is often lower." },
    ],
  },
  {
    point: 12, tier: "SUPPLEMENT", title: "Pollen tube growth & entry", questions: [
      { prompt: "Which route does the pollen tube take?", choices: ["Petal → sepal → anther", "Stigma → down the style → ovary → micropyle of an ovule", "Ovary → filament → stigma", "Anther → ovary wall → leaf"], answer: 1, explanation: "The tube grows from the stigma down the style, into the ovary and through the micropyle into an ovule." },
      { prompt: "Where does the pollen tube enter an ovule?", choices: ["Through the micropyle", "Through the petal", "Through the stigma surface", "Through the filament"], answer: 0, explanation: "The pollen tube enters the ovule through the micropyle and delivers the pollen nucleus." },
    ],
  },
];

export const quizQuestions: QuizQuestion[] = questionSets.flatMap((section) =>
  section.questions.map((question, index): QuizQuestion => ({
    ...question,
    id: `point-${section.point}-question-${index + 1}`,
    point: section.point,
    tier: section.tier,
    title: section.title,
  })),
);

export const syllabusSections = [
  { point: 1, tier: "CORE" as const, id: "core-01", label: "Flower anatomy" },
  { point: 2, tier: "CORE" as const, id: "core-02", label: "Structure functions" },
  { point: 3, tier: "CORE" as const, id: "core-03", label: "Wind-pollinated structures" },
  { point: 4, tier: "CORE" as const, id: "core-04", label: "Pollen grain adaptations" },
  { point: 5, tier: "CORE" as const, id: "core-05", label: "Pollination" },
  { point: 6, tier: "CORE" as const, id: "core-06", label: "Fertilisation" },
  { point: 7, tier: "CORE" as const, id: "core-07", label: "Structural adaptations" },
  { point: 8, tier: "CORE" as const, id: "core-08", label: "Seed germination" },
  { point: 9, tier: "SUPPLEMENT" as const, id: "supplement-09", label: "Self-pollination" },
  { point: 10, tier: "SUPPLEMENT" as const, id: "supplement-10", label: "Cross-pollination" },
  { point: 11, tier: "SUPPLEMENT" as const, id: "supplement-11", label: "Population impact & genetics" },
  { point: 12, tier: "SUPPLEMENT" as const, id: "supplement-12", label: "Pollen tube growth & entry" },
] as const;
