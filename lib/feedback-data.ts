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
  console.log("Getting histogram for workerId:", workerId);

  // 初日の場合はnullを返す
  if (isFirstDay()) {
    console.log("First day detected, returning null for histogram");
    return null;
  }

  const yesterdayIdx = getCurrentDayIdx() - 1;
  console.log("Yesterday idx:", yesterdayIdx);

  // まず、このworkerのcondを取得
  const workerResult = await prisma.$queryRaw<{ cond: number | null }[]>`
    SELECT cond
    FROM participants
    WHERE worker_id = ${workerId}
    LIMIT 1
  `;

  console.log("Worker result for histogram:", workerResult);

  if (workerResult.length === 0 || workerResult[0].cond === null) {
    console.log("No worker found or cond is null for histogram");
    return null;
  }

  const workerCond = workerResult[0].cond;

  // 同じcondのparticipantsのスコア分布を取得
  const scoresRaw = await prisma.$queryRaw<{ score: number; count: bigint }[]>`
    SELECT sub.score_a as score, COUNT(*) as count
    FROM submissions sub
    INNER JOIN participants p ON sub.worker_id = p.worker_id
    WHERE sub.day_idx = ${yesterdayIdx} 
      AND sub.score_a IS NOT NULL 
      AND p.cond = ${workerCond}
    GROUP BY sub.score_a
    ORDER BY sub.score_a
  `;

  console.log("Scores raw result (group-specific):", scoresRaw);

  const workerScoreResult = await prisma.$queryRaw<{ score: number }[]>`
    SELECT sub.score_a as score
    FROM submissions sub
    WHERE sub.worker_id = ${workerId} AND sub.day_idx = ${yesterdayIdx} AND sub.score_a IS NOT NULL
    LIMIT 1
  `;

  const workerScore =
    workerScoreResult.length > 0 ? workerScoreResult[0].score : null;

  console.log("Worker score result:", workerScoreResult);
  console.log("Worker score:", workerScore);

  const bins = Array.from({ length: 11 }, (_, i) => {
    const scoreData = scoresRaw.find((s) => s.score === i);
    return {
      score: i,
      count: scoreData ? Number(scoreData.count) : 0,
      isOwnBin: workerScore === i,
    };
  });

  console.log("Final bins:", bins);

  return { bins, workerScore };
}

export async function getYesterdayGoalProgress(
  workerId: string
): Promise<GoalData | null> {
  // 初日の場合はnullを返す
  if (isFirstDay()) {
    console.log("First day detected, returning null");
    return null;
  }

  console.log("Getting goal progress for workerId:", workerId);

  // まず、このworkerのcondを取得
  const workerResult = await prisma.$queryRaw<{ cond: number | null }[]>`
    SELECT cond
    FROM participants
    WHERE worker_id = ${workerId}
    LIMIT 1
  `;

  console.log("Worker result:", workerResult);

  if (workerResult.length === 0 || workerResult[0].cond === null) {
    console.log("No worker found or cond is null");
    return null;
  }

  const workerCond = workerResult[0].cond;
  const todayIdx = getCurrentDayIdx();
  const target = parseInt(process.env.GOAL_TARGET || "80", 10);
  const threshold = parseInt(process.env.GOAL_THRESHOLD || "7", 10);

  console.log(
    "Worker cond:",
    workerCond,
    "todayIdx:",
    todayIdx,
    "target:",
    target,
    "threshold:",
    threshold
  );

  // submissionsテーブルから前日まで（当日は含まない）で、同じcondのparticipantsのscore_aをカウント
  const result = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count
    FROM submissions sub
    INNER JOIN participants p ON sub.worker_id = p.worker_id
    WHERE sub.day_idx < ${todayIdx} 
      AND sub.score_a IS NOT NULL 
      AND sub.score_a >= ${threshold}
      AND p.cond = ${workerCond}
  `;

  console.log("Query result:", result);

  const current = result.length > 0 ? Number(result[0].count) : 0;

  console.log("Final goal data:", { current, target, threshold });

  return { current, target, threshold };
}
