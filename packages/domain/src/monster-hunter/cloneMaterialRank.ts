export type MaterialRank = "LOW" | "HIGH" | "MASTER";

export type MaterialCloneSource = {
  name: string;
  targetReward: number;
  captureReward: number;
  brokenPartReward: number;
  carveReward: number;
  dropMaterialReward: number;
};

export function rankCloneSuffix(from: MaterialRank, to: MaterialRank): string {
  if (from === "LOW" && to === "HIGH") return "+";
  if (from === "HIGH" && to === "MASTER") return "+";
  return "";
}

/** Clone material name for next rank (Scale → Scale+, Scale+ → Scale++). */
export function cloneMaterialName(name: string, from: MaterialRank, to: MaterialRank): string {
  const suffix = rankCloneSuffix(from, to);
  if (!suffix) return name;
  return `${name}${suffix}`;
}

export function cloneMaterialsForRank(
  sources: MaterialCloneSource[],
  from: MaterialRank,
  to: MaterialRank,
): MaterialCloneSource[] {
  return sources.map((m) => ({
    name: cloneMaterialName(m.name, from, to),
    targetReward: m.targetReward,
    captureReward: m.captureReward,
    brokenPartReward: m.brokenPartReward,
    carveReward: m.carveReward,
    dropMaterialReward: m.dropMaterialReward,
  }));
}
