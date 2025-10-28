import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GroupInfo,
  shouldShowGroupGoals,
  shouldShowIndividualRanking,
} from "@/lib/group-utils";

interface InstructionsProps {
  groupInfo?: GroupInfo | null;
}

export function Instructions({ groupInfo }: InstructionsProps) {
  return (
    <Card className="mb-6 border-slate-200 bg-slate-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Task Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-slate-700 leading-relaxed">
        <p>
          Please write a <strong>caption</strong> for the image below. In this
          caption, describe the{" "}
          <strong>positional relationships and detailed situations</strong>{" "}
          logically and carefully so that{" "}
          <strong>visually impaired people</strong> can specifically imagine the
          content of the image. You cannot submit unless it is{" "}
          <strong>at least 30 characters long</strong>.
        </p>
        <p>
          This experiment will be conducted continuously for{" "}
          <strong>one week</strong>. Tasks will be published daily from{" "}
          <strong>9 AM to 9 PM America time</strong>.
        </p>

        {/* Group-specific goal display */}
        {groupInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Experiment Goal
            </h4>
            {shouldShowGroupGoals(groupInfo.cond) &&
              shouldShowIndividualRanking(groupInfo.cond) && (
                <p className="text-blue-800 text-sm">
                  <strong>
                    Group Goal: Collect 80+ responses with 8+ points within one
                    week.
                  </strong>{" "}
                  Your individual position will also be displayed, so please
                  participate actively!
                </p>
              )}
            {shouldShowGroupGoals(groupInfo.cond) &&
              !shouldShowIndividualRanking(groupInfo.cond) && (
                <p className="text-blue-800 text-sm">
                  <strong>
                    Group Goal: Collect 80+ responses with 8+ points within one
                    week.
                  </strong>{" "}
                  Let&apos;s work together as a team to achieve this goal!
                </p>
              )}
            {!shouldShowGroupGoals(groupInfo.cond) &&
              shouldShowIndividualRanking(groupInfo.cond) && (
                <p className="text-blue-800 text-sm">
                  <strong>Your individual position</strong> will be displayed.{" "}
                  Please use the comparison with other participants as a
                  reference to create high-quality captions!
                </p>
              )}
          </div>
        )}

        <p>
          <strong>Avoid personal data and offensive language.</strong>
        </p>
      </CardContent>
    </Card>
  );
}
