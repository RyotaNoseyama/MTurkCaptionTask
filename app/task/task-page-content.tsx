"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Instructions } from "@/components/task/instructions";
import { CaptionForm } from "@/components/task/caption-form";
import { FeedbackPanel } from "@/components/task/feedback-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { HistogramData, GoalData } from "@/lib/feedback-data";
import {
  GroupInfo,
  getGroupMessage,
  shouldShowAnyFeedback,
} from "@/lib/group-utils";

interface FeedbackDataResponse {
  histogram: HistogramData | null;
  goal: GoalData | null;
  groupInfo: GroupInfo | null;
}

export function TaskPageContent() {
  const searchParams = useSearchParams();
  const [feedbackData, setFeedbackData] = useState<FeedbackDataResponse | null>(
    null
  );
  const [completionCode, setCompletionCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);

  const workerId = searchParams.get("workerId") || "";
  const assignmentId = searchParams.get("assignmentId") || "";
  const hitId = searchParams.get("hitId") || "";
  const turkSubmitTo = searchParams.get("turkSubmitTo") || "";
  const isPreview = assignmentId === "ASSIGNMENT_ID_NOT_AVAILABLE";
  const imageUrl = process.env.NEXT_PUBLIC_TODAY_IMAGE_URL_A || "";

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`/api/feedback?workerId=${workerId}`);
        const data = await response.json();
        console.log("Frontend received feedback data:", data);
        setFeedbackData(data);

        // フィードバックAPIからgroupInfoを取得
        if (data.groupInfo) {
          setGroupInfo(data.groupInfo);
        }
      } catch (err) {
        console.error("Failed to load feedback:", err);
      }
    };

    if (workerId) {
      fetchFeedback();
    }
  }, [workerId]);

  const handleSubmit = async (caption: string, rtMs: number) => {
    setError(null);
    setWarning(null);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId,
          assignmentId,
          hitId,
          caption,
          rtMs,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Submission failed");
        return;
      }

      // グループ情報を設定
      if (data.groupInfo) {
        setGroupInfo(data.groupInfo);
      }

      // 警告がある場合（類似度が高い場合）の処理
      if (data.warning) {
        setWarning(
          "Your submission has been saved, but it was flagged as similar to existing submissions. No completion code will be provided."
        );
        setHasSubmitted(true);
        return;
      }

      setCompletionCode(data.completionCode);
      setHasSubmitted(true);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  if (!workerId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Alert className="max-w-md border-amber-200 bg-amber-50">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-900">
            Invalid task URL. Please access this task from Amazon Mechanical
            Turk.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (hasSubmitted && warning) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md border-amber-200 bg-amber-50">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="mx-auto h-16 w-16 text-amber-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Submission Flagged
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Your submission has been saved but was flagged as similar to
              existing submissions.
            </p>
            <div className="bg-white border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700">
                No completion code will be provided for this submission.
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Please ensure your caption is original and unique.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasSubmitted && completionCode) {
    const groupMessage = groupInfo ? getGroupMessage(groupInfo) : null;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Thank You!
            </h2>
            <p className="text-slate-700 leading-relaxed">
              Your caption has been submitted successfully.
            </p>

            {/* グループメッセージ */}
            {groupMessage && (
              <div
                className={`border rounded-lg p-4 ${
                  groupMessage.color === "blue"
                    ? "bg-blue-50 border-blue-200"
                    : groupMessage.color === "green"
                    ? "bg-green-50 border-green-200"
                    : groupMessage.color === "purple"
                    ? "bg-purple-50 border-purple-200"
                    : groupMessage.color === "orange"
                    ? "bg-orange-50 border-orange-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h3 className="font-semibold text-slate-900 mb-2">
                  {groupMessage.title}
                </h3>
                <p className="text-sm text-slate-700">{groupMessage.message}</p>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">
                Your completion code:
              </p>
              <p className="text-xl font-mono font-bold text-slate-900">
                {completionCode}
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Return to MTurk and press <strong>Submit</strong> to complete this
              HIT.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Image Caption Task
          </h1>
          <p className="text-slate-600">
            Write a detailed caption for the image below
          </p>
        </div>

        {isPreview && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-900">
              Preview mode. Accept this HIT on MTurk to start the task.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-900">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Instructions groupInfo={groupInfo} />
            <CaptionForm
              onSubmit={handleSubmit}
              disabled={isPreview}
              imageUrl={imageUrl}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {(() => {
                console.log("TaskPageContent - feedbackData:", feedbackData);
                console.log("TaskPageContent - groupInfo:", groupInfo);
                console.log(
                  "TaskPageContent - shouldShowAnyFeedback:",
                  groupInfo
                    ? shouldShowAnyFeedback(groupInfo.cond)
                    : "no groupInfo"
                );

                return (
                  feedbackData &&
                  (feedbackData.histogram || feedbackData.goal) &&
                  groupInfo &&
                  shouldShowAnyFeedback(groupInfo.cond) && (
                    <FeedbackPanel
                      histogram={feedbackData.histogram}
                      goal={feedbackData.goal}
                      cond={groupInfo.cond}
                    />
                  )
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
