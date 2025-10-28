import { NextRequest, NextResponse } from "next/server";
import {
  getYesterdayHistogram,
  getYesterdayGoalProgress,
} from "@/lib/feedback-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  console.log("API /feedback called");
  
  try {
    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId") || "";

    console.log("Requested workerId:", workerId);

    if (!workerId) {
      console.log("No workerId provided");
      return NextResponse.json(
        { error: "workerId is required" },
        { status: 400 }
      );
    }

    console.log("Fetching histogram and goal data...");
    
    const [histogram, goal] = await Promise.all([
      getYesterdayHistogram(workerId),
      getYesterdayGoalProgress(workerId),
    ]);

    console.log("API feedback data:", { histogram, goal });

    return NextResponse.json({
      histogram,
      goal,
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'Unknown error');
    
    return NextResponse.json(
      { 
        error: "Failed to load feedback data",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
