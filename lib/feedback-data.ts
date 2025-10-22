import { prisma } from "./prisma";
import { getCurrentDayIdx } from "./date-utils";

export interface HistogramData {
  bins: { score: number; count: number; isOwnBin: boolean }[];
  workerScore: number | null;
}

export interface GoalData {
  current: number;
  target: number;
  threshold: number;
}

export async function getYesterdayHistogram(
  workerId: string
): Promise<HistogramData> {
  const yesterdayIdx = getCurrentDayIdx() - 1;

  const scoresRaw = await prisma.$queryRaw<{ score: number; count: bigint }[]>`
    SELECT s.score, COUNT(*) as count
    FROM scores s
    INNER JOIN submissions sub ON s.submission_id = sub.id
    WHERE sub.day_idx = ${yesterdayIdx}
    GROUP BY s.score
    ORDER BY s.score
  `;

  const workerScoreResult = await prisma.$queryRaw<{ score: number }[]>`
    SELECT s.score
    FROM scores s
    INNER JOIN submissions sub ON s.submission_id = sub.id
    WHERE sub.worker_id = ${workerId} AND sub.day_idx = ${yesterdayIdx}
    LIMIT 1
  `;

  const workerScore =
    workerScoreResult.length > 0 ? workerScoreResult[0].score : null;

  const bins = Array.from({ length: 11 }, (_, i) => {
    const scoreData = scoresRaw.find((s) => s.score === i);
    return {
      score: i,
      count: scoreData ? Number(scoreData.count) : 0,
      isOwnBin: workerScore === i,
    };
  });

  return { bins, workerScore };
}

export async function getYesterdayGoalProgress(): Promise<GoalData> {
  const todayIdx = getCurrentDayIdx();
  const target = parseInt(process.env.GOAL_TARGET || "50", 10);
  const threshold = parseInt(process.env.GOAL_THRESHOLD || "7", 10);

  // submissionsテーブルから前日まで（当日は含まない）のscoreAとscoreBをそれぞれ独立してカウント
  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT 
      (CASE WHEN sub.score_a IS NOT NULL AND sub.score_a >= ${threshold} THEN 1 ELSE 0 END) +
      (CASE WHEN sub.score_b IS NOT NULL AND sub.score_b >= ${threshold} THEN 1 ELSE 0 END) as count
    FROM submissions sub
    WHERE sub.day_idx < ${todayIdx}
  `;

  const current = result.reduce((total, row) => total + Number(row.count), 0);

  return { current, target, threshold };
}
