export type IndexedChoice = {
  text: string;
  originalIndex: number;
};

/** Randomize display order without losing each choice's source index for scoring. */
export function shuffleIndexedChoices(choices: readonly string[]): IndexedChoice[] {
  const shuffled = choices.map((text, originalIndex) => ({ text, originalIndex }));
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

/** Ignore case, accents, punctuation and repeated whitespace for short-answer checks. */
export function normalizeShortAnswer(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function matchesShortAnswer(
  response: string,
  expected: string,
  acceptedAnswers: readonly string[] = [],
): boolean {
  const normalizedResponse = normalizeShortAnswer(response);
  if (!normalizedResponse) return false;
  return [expected, ...acceptedAnswers].some(
    (candidate) => normalizeShortAnswer(candidate) === normalizedResponse,
  );
}
