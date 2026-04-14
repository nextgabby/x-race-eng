export const RESULT_TIERS = [
  { minPoints: 15, title: "RACE WINNER", tier: "P1", emoji: "\u{1F3C6}", color: "#FFD700" },
  { minPoints: 12, title: "SO CLOSE", tier: "P2", emoji: "\u{1F948}", color: "#C0C0C0" },
  { minPoints: 9, title: "PODIUM FINISH", tier: "P3", emoji: "\u{1F949}", color: "#CD7F32" },
  { minPoints: 6, title: "POINTS FINISH", tier: "P6", emoji: "\u{1F3C1}", color: "#CD7F32" },
  { minPoints: 0, title: "OFF THE PACE", tier: "P14", emoji: "\u{1F4A8}", color: "#EF4444" },
];

export function getResult(points) {
  return RESULT_TIERS.find((r) => points >= r.minPoints);
}
