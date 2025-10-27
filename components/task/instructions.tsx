import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Instructions() {
  return (
    <Card className="mb-6 border-slate-200 bg-slate-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Task Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-slate-700 leading-relaxed">
        <p>
          Please write a <strong>caption</strong> for the image below. In this caption, describe the <strong>positional relationships and detailed situations</strong> logically and carefully so that <strong>visually impaired people</strong> can specifically imagine the content of the image. You cannot submit unless it is <strong>at least 30 characters long</strong>.
        </p>
        <p>
          This experiment will be conducted continuously for <strong>one week</strong>. Tasks will be published daily from <strong>9 AM to 9 PM America time</strong>.
        </p>
        <p><strong>Avoid personal data and offensive language.</strong></p>
      </CardContent>
    </Card>
  );
}
