"use client";

import { HistogramData } from "@/lib/feedback-data";

interface TestHistogramProps {
  data: HistogramData;
}

export function TestHistogram({ data }: TestHistogramProps) {
  console.log("TestHistogram received data:", data);

  return (
    <div className="border-2 border-red-500 p-4 bg-yellow-50">
      <h3 className="text-lg font-bold mb-4">Test Histogram Component</h3>
      <div className="text-sm mb-2">Worker Score: {data.workerScore}</div>
      <div className="text-sm mb-4">Bins Count: {data.bins.length}</div>

      <div className="space-y-1">
        {data.bins.map((bin) => (
          <div key={bin.score} className="flex items-center gap-2 text-xs">
            <span className="w-8">Score {bin.score}:</span>
            <span className="w-12">Count {bin.count}</span>
            {bin.isOwnBin && (
              <span className="text-red-600 font-bold">(YOU)</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
