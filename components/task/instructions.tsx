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
          Write <strong>one descriptive long caption</strong> for the image
          below.
        </p>
        <p>
          The caption must be{" "}
          <strong>at least 30 characters (excluding spaces)</strong>.
        </p>
        <p>Avoid personal data and offensive language.</p>
      </CardContent>
    </Card>
  );
}
