type DistanceMatrix = Record<string, Record<string, number>>;

const Q1_DISTANCES: DistanceMatrix = {
  patent: { patent: 0, trade_secret: 1, open_source: 2 },
  trade_secret: { patent: 1, trade_secret: 0, open_source: 2 },
  open_source: { patent: 2, trade_secret: 2, open_source: 0 },
};

const Q2_DISTANCES: DistanceMatrix = {
  vc: { vc: 0, non_vc: 1, bootstrap: 2 },
  non_vc: { vc: 1, non_vc: 0, bootstrap: 1 },
  bootstrap: { vc: 2, non_vc: 1, bootstrap: 0 },
};

const Q3_DISTANCES: DistanceMatrix = {
  publisher: { publisher: 0, ai_lab: 1, edtech: 1, columbia: 2 },
  ai_lab: { publisher: 1, ai_lab: 0, edtech: 1, columbia: 2 },
  edtech: { publisher: 1, ai_lab: 1, edtech: 0, columbia: 2 },
  columbia: { publisher: 2, ai_lab: 2, edtech: 2, columbia: 0 },
};

const Q4_DISTANCES: DistanceMatrix = {
  bschools: { bschools: 0, universities: 1, k12: 2, corporate: 1 },
  universities: { bschools: 1, universities: 0, k12: 1, corporate: 2 },
  k12: { bschools: 2, universities: 1, k12: 0, corporate: 2 },
  corporate: { bschools: 1, universities: 2, k12: 2, corporate: 0 },
};

const Q5_DISTANCES: DistanceMatrix = {
  broad: { broad: 0, deep: 2 },
  deep: { broad: 2, deep: 0 },
};

const DISTANCE_MATRICES: Record<string, DistanceMatrix> = {
  q1_ip: Q1_DISTANCES,
  q2_funding: Q2_DISTANCES,
  q3_partnership: Q3_DISTANCES,
  q4_market: Q4_DISTANCES,
  q5_product: Q5_DISTANCES,
};

const QUESTION_KEYS = [
  "q1_ip",
  "q2_funding",
  "q3_partnership",
  "q4_market",
  "q5_product",
] as const;

export const MAX_DISTANCE = 10;

interface SubmissionAnswers {
  q1_ip: string | null;
  q2_funding: string | null;
  q3_partnership: string | null;
  q4_market: string | null;
  q5_product: string | null;
}

function questionDistance(
  questionKey: string,
  a: string | null,
  b: string | null
): number {
  if (!a || !b) return 0;
  const matrix = DISTANCE_MATRICES[questionKey];
  if (!matrix || !matrix[a] || !matrix[a][b]) return 0;
  return matrix[a][b];
}

export function computeDistance(
  a: SubmissionAnswers,
  b: SubmissionAnswers
): { total: number; breakdown: Record<string, number> } {
  const breakdown: Record<string, number> = {};
  let total = 0;

  for (const key of QUESTION_KEYS) {
    const dist = questionDistance(key, a[key], b[key]);
    breakdown[key] = dist;
    total += dist;
  }

  return { total, breakdown };
}

export interface TeamSubmission {
  teamId: string;
  teamName: string;
  answers: SubmissionAnswers;
}

export function findMostDivergentPair(
  teams: TeamSubmission[]
): {
  team1Index: number;
  team2Index: number;
  distance: number;
  breakdown: Record<string, number>;
} | null {
  if (teams.length < 2) return null;

  let maxDistance = -1;
  let bestPair: {
    team1Index: number;
    team2Index: number;
    distance: number;
    breakdown: Record<string, number>;
  } | null = null;

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const result = computeDistance(teams[i].answers, teams[j].answers);
      if (result.total > maxDistance) {
        maxDistance = result.total;
        bestPair = {
          team1Index: i,
          team2Index: j,
          distance: result.total,
          breakdown: result.breakdown,
        };
      }
    }
  }

  return bestPair;
}
