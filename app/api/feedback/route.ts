import { NextRequest, NextResponse } from "next/server";
import {
  getYesterdayHistogram,
  getYesterdayGoalProgress,
} from "@/lib/feedback-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId") || "";

    if (!workerId) {
      return NextResponse.json(
        { error: "workerId is required" },
        { status: 400 }
      );
    }

    const [histogram, goal, participant] = await Promise.all([
      getYesterdayHistogram(workerId),
      getYesterdayGoalProgress(workerId),
      prisma.participant.findUnique({
        where: { workerId },
        select: { cond: true, participantOrder: true },
      }),
    ]);

    const groupInfo = participant
      ? {
          cond: participant.cond || 1, // デフォルト値
          participantOrder: participant.participantOrder || 1,
        }
      : null;

    console.log("API feedback data:", { histogram, goal, groupInfo });

    return NextResponse.json({
      histogram,
      goal,
      groupInfo,
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to load feedback data" },
      { status: 500 }
    );
  }
}
