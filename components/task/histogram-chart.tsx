'use client';

import { HistogramData } from '@/lib/feedback-data';

interface HistogramChartProps {
  data: HistogramData;
}

export function HistogramChart({ data }: HistogramChartProps) {
  const maxCount = Math.max(...data.bins.map(b => b.count), 1);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between h-48 gap-1">
        {data.bins.map((bin) => {
          const heightPercent = (bin.count / maxCount) * 100;
          return (
            <div key={bin.score} className="flex-1 flex flex-col items-center justify-end">
              <div
                className={`w-full rounded-t transition-all ${
                  bin.isOwnBin ? 'bg-slate-600' : 'bg-slate-300'
                } hover:opacity-80 relative group`}
                style={{ height: `${heightPercent}%` }}
              >
                {bin.count > 0 && (
                  <div className="absolute invisible group-hover:visible bg-slate-900 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10">
                    Score: {bin.score} - Workers: {bin.count}
                    {bin.isOwnBin && ' (you)'}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-600 mt-1">{bin.score}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center text-xs text-slate-500">
        Score Distribution (0-10)
      </div>
    </div>
  );
}
