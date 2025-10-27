import { NextRequest, NextResponse } from "next/server";
import {
  getYesterdayHistogram,
  getYesterdayGoalProgress,
} from "@/lib/feedback-data";

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

    const [histogram, goal] = await Promise.all([
      getYesterdayHistogram(workerId),
      getYesterdayGoalProgress(),
    ]);

    // 初日の場合はフィードバックデータなし
    if (!histogram || !goal) {
      return NextResponse.json({
        histogram: null,
        goal: null,
      });
    }

    return NextResponse.json({
      histogram,
      goal,
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to load feedback data" },
      { status: 500 }
    );
  }
}
