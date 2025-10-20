import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentDayIdx, generateCompletionCode } from '@/lib/date-utils';

const MIN_LENGTH = 30;
const MAX_LENGTH = 1000;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workerId, assignmentId, hitId, captions, rtMs } = body;

    if (assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE') {
      return NextResponse.json(
        { error: 'Cannot submit in preview mode' },
        { status: 400 }
      );
    }

    if (!workerId || !captions?.a || !captions?.b) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const captionA = captions.a.trim();
    const captionB = captions.b.trim();

    if (captionA.length < MIN_LENGTH || captionA.length > MAX_LENGTH) {
      return NextResponse.json(
        { error: `Caption A must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (captionB.length < MIN_LENGTH || captionB.length > MAX_LENGTH) {
      return NextResponse.json(
        { error: `Caption B must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters` },
        { status: 400 }
      );
    }

    const currentDayIdx = getCurrentDayIdx();

    await prisma.participant.upsert({
      where: { workerId },
      create: { workerId },
      update: {},
    });

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        workerId_dayIdx: {
          workerId,
          dayIdx: currentDayIdx,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted for today' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        workerId,
        dayIdx: currentDayIdx,
        captionA,
        captionB,
        rtMs: rtMs || null,
      },
    });

    const completionCode = generateCompletionCode();

    return NextResponse.json({
      ok: true,
      completionCode,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
