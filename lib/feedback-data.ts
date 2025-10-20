import { prisma } from './prisma';
import { getCurrentDayIdx } from './date-utils';

export interface HistogramData {
  bins: { score: number; count: number; isOwnBin: boolean }[];
  workerScore: number | null;
}

export interface GoalData {
  current: number;
  target: number;
  threshold: number;
}

export async function getYesterdayHistogram(workerId: string): Promise<HistogramData> {
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

  const workerScore = workerScoreResult.length > 0 ? workerScoreResult[0].score : null;

  const bins = Array.from({ length: 11 }, (_, i) => {
    const scoreData = scoresRaw.find(s => s.score === i);
    return {
      score: i,
      count: scoreData ? Number(scoreData.count) : 0,
      isOwnBin: workerScore === i,
    };
  });

  return { bins, workerScore };
}

export async function getYesterdayGoalProgress(): Promise<GoalData> {
  const yesterdayIdx = getCurrentDayIdx() - 1;
  const target = parseInt(process.env.GOAL_TARGET || '50', 10);
  const threshold = parseInt(process.env.GOAL_THRESHOLD || '7', 10);

  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count
    FROM scores s
    INNER JOIN submissions sub ON s.submission_id = sub.id
    WHERE sub.day_idx = ${yesterdayIdx} AND s.is_7plus = true
  `;

  const current = result.length > 0 ? Number(result[0].count) : 0;

  return { current, target, threshold };
}
