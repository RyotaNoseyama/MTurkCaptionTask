import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HistogramChart } from "./histogram-chart";
import { HistogramData, GoalData } from "@/lib/feedback-data";
import {
  shouldShowGroupGoals,
  shouldShowIndividualRanking,
} from "@/lib/group-utils";

interface FeedbackPanelProps {
  histogram: HistogramData | null;
  goal: GoalData | null;
  cond: number; // グループ条件を追加
}

export function FeedbackPanel({ histogram, goal, cond }: FeedbackPanelProps) {
  const progressPercent = goal
    ? Math.min((goal.current / goal.target) * 100, 100)
    : 0;

  console.log("FeedbackPanel - cond:", cond);
  console.log("FeedbackPanel - histogram:", histogram);
  console.log("FeedbackPanel - goal:", goal);

  // グループ条件に基づいて表示・非表示を制御
  const showGroupGoals = shouldShowGroupGoals(cond);
  const showIndividualRanking = shouldShowIndividualRanking(cond);

  console.log("FeedbackPanel - showGroupGoals:", showGroupGoals);
  console.log("FeedbackPanel - showIndividualRanking:", showIndividualRanking);

  return (
    <div className="space-y-6">
      {/* グループ目標の表示・非表示 */}
      {goal && showGroupGoals && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Group Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-slate-700 leading-relaxed">
              Goal: ≥{goal.threshold} points <strong>{goal.target}</strong>{" "}
              items / Current: <strong>{goal.current}</strong>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-slate-700 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 text-right">
              {goal.current} / {goal.target}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 個人ランキング（ヒストグラム）の表示・非表示 */}
      {histogram && showIndividualRanking && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Yesterday&apos;s Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HistogramChart data={histogram} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
