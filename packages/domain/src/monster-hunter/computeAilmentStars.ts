export type AilmentResistanceInput = {
  id: string;
  initialResistance: number;
  nextResistanceThreshold: number;
  maximumResistance: number;
  naturalBuildUpDegradation: number;
  totalEffectiveness: number;
};

export type AilmentStarRating = 0 | 1 | 2 | 3;

function ailmentTotal(a: AilmentResistanceInput): number {
  return (
    a.initialResistance +
    a.nextResistanceThreshold +
    a.maximumResistance +
    a.naturalBuildUpDegradation +
    a.totalEffectiveness
  );
}

function hasZeroBar(a: AilmentResistanceInput): boolean {
  return (
    a.initialResistance === 0 ||
    a.nextResistanceThreshold === 0 ||
    a.maximumResistance === 0 ||
    a.naturalBuildUpDegradation === 0 ||
    a.totalEffectiveness === 0
  );
}

/** Any 0% bar → 0 stars; otherwise relative tiers within the monster's ailments. */
export function computeAilmentStars(ailments: AilmentResistanceInput[]): Record<string, AilmentStarRating> {
  const result: Record<string, AilmentStarRating> = {};

  for (const a of ailments) {
    if (hasZeroBar(a)) {
      result[a.id] = 0;
    }
  }

  const eligible = ailments
    .filter((a) => !hasZeroBar(a))
    .map((a) => ({ id: a.id, total: ailmentTotal(a) }))
    .sort((a, b) => b.total - a.total);

  if (eligible.length === 0) return result;

  const maxTotal = eligible[0]!.total;
  const minTotal = eligible[eligible.length - 1]!.total;

  for (const { id, total } of eligible) {
    if (maxTotal === minTotal) {
      result[id] = 3;
    } else if (total === maxTotal) {
      result[id] = 3;
    } else if (total === minTotal) {
      result[id] = 1;
    } else {
      const mid = (maxTotal + minTotal) / 2;
      result[id] = total >= mid ? 2 : 1;
    }
  }

  return result;
}

export function formatStarRating(stars: AilmentStarRating): string {
  if (stars === 0) return "-";
  return "★".repeat(stars);
}
