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

export function isFirstDay(): boolean {
  // 実験開始日のday_idxを設定
  // この値は test-day-idx.js を実行して、実験開始日の day_idx に更新してください
  // const EXPERIMENT_START_DAY_IDX = 19997; // TODO: 実際の実験開始日に合わせて調整
  // const currentDayIdx = getCurrentDayIdx();
  // return currentDayIdx === EXPERIMENT_START_DAY_IDX;

  // とりあえず初日判定を無効化（常にfalseを返す）
  return false;
}

export async function getYesterdayHistogram(
  workerId: string
): Promise<HistogramData | null> {
  // 初日の場合はnullを返す
  if (isFirstDay()) {
    return null;
  }

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

export async function getYesterdayGoalProgress(): Promise<GoalData | null> {
  // 初日の場合はnullを返す
  if (isFirstDay()) {
    return null;
  }

  const todayIdx = getCurrentDayIdx();
  const target = parseInt(process.env.GOAL_TARGET || "50", 10);
  const threshold = parseInt(process.env.GOAL_THRESHOLD || "7", 10);

  // submissionsテーブルから前日まで（当日は含まない）のscoreをカウント
  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count
    FROM submissions sub
    WHERE sub.day_idx < ${todayIdx} 
      AND sub.score IS NOT NULL 
      AND sub.score >= ${threshold}
  `;

  const current = result.length > 0 ? Number(result[0].count) : 0;

  return { current, target, threshold };
}
