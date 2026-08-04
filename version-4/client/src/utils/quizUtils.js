// Pure helpers for the flag quiz. No React, no DOM, no localStorage here.

export function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getUsableCountries(data) {
  return data.filter(
    (c) => c && typeof c.name === "string" && c.name.trim() !== "" && (c.flags?.svg || c.flags?.png)
  );
}

export function generateRoundQuestions(data, roundSize = 10) {
  const pool = getUsableCountries(data);
  if (pool.length < roundSize) return [];
  return shuffleArray(pool).slice(0, roundSize);
}

export function generateOptions(correctCountry, data, numOptions = 4) {
  const pool = getUsableCountries(data);
  const shuffledCandidates = shuffleArray(pool.filter((c) => c.name !== correctCountry.name));

  const seenNames = new Set([correctCountry.name]);
  const distractors = [];
  for (const candidate of shuffledCandidates) {
    if (distractors.length === numOptions - 1) break;
    if (seenNames.has(candidate.name)) continue;
    seenNames.add(candidate.name);
    distractors.push(candidate);
  }

  return shuffleArray([correctCountry, ...distractors]);
}
