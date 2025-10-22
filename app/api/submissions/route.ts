import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentDayIdx, generateCompletionCode } from "@/lib/date-utils";
import { checkCaptionSimilarity } from "@/lib/similarity";
import { isValidNonWhitespaceLength } from "@/lib/text-utils";

const MIN_LENGTH = 30;
const MAX_LENGTH = 1000;
const SIMILARITY_THRESHOLD = 0.8; // 8割の類似度閾値

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workerId, assignmentId, hitId, captions, rtMs } = body;

    if (assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE") {
      return NextResponse.json(
        { error: "Cannot submit in preview mode" },
        { status: 400 }
      );
    }

    if (!workerId || !captions?.a || !captions?.b) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const captionA = captions.a.trim();
    const captionB = captions.b.trim();

    if (!isValidNonWhitespaceLength(captionA, MIN_LENGTH, MAX_LENGTH)) {
      return NextResponse.json(
        {
          error: `Caption A must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters (excluding spaces)`,
        },
        { status: 400 }
      );
    }

    if (!isValidNonWhitespaceLength(captionB, MIN_LENGTH, MAX_LENGTH)) {
      return NextResponse.json(
        {
          error: `Caption B must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters (excluding spaces)`,
        },
        { status: 400 }
      );
    }

    const currentDayIdx = getCurrentDayIdx();

    // その日の全ての提出済みキャプションを取得して類似度チェック
    const todaySubmissions = await prisma.submission.findMany({
      where: {
        dayIdx: currentDayIdx,
      },
      select: {
        captionA: true,
        captionB: true,
        workerId: true,
      },
    });

    // 新しいキャプションと既存のキャプションの類似度をチェック
    let isSimilar = false;
    for (const existingSubmission of todaySubmissions) {
      const similarity = checkCaptionSimilarity(
        { a: captionA, b: captionB },
        { a: existingSubmission.captionA, b: existingSubmission.captionB }
      );

      if (similarity >= SIMILARITY_THRESHOLD) {
        console.warn(
          `High similarity detected: ${similarity.toFixed(
            3
          )} between ${workerId} and ${existingSubmission.workerId}`
        );
        isSimilar = true;
        break;
      }
    }

    // 類似度が高い場合はworkerIdに"xx_"プレフィックスを付ける
    const finalWorkerId = isSimilar ? `xx_${workerId}` : workerId;

    // participantテーブルに最終的なworkerIdを登録
    await prisma.participant.upsert({
      where: { workerId: finalWorkerId },
      create: { workerId: finalWorkerId },
      update: {},
    });

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        workerId_dayIdx: {
          workerId: finalWorkerId,
          dayIdx: currentDayIdx,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "You have already submitted for today" },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        workerId: finalWorkerId,
        dayIdx: currentDayIdx,
        captionA,
        captionB,
        rtMs: rtMs || null,
      },
    });

    const completionCode = generateCompletionCode();

    // 類似度が高い場合はコンプリーションコードを返さない
    if (isSimilar) {
      return NextResponse.json({
        ok: true,
        submissionId: submission.id,
        warning: "Similar submission detected",
      });
    }

    return NextResponse.json({
      ok: true,
      completionCode,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
