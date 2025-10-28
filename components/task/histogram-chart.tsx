"use client";

import { HistogramData } from "@/lib/feedback-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HistogramChartProps {
  data: HistogramData;
}

export function HistogramChart({ data }: HistogramChartProps) {
  // Rechartsで使用するデータ形式に変換
  const chartData =
    data?.bins.map((bin) => ({
      score: bin.score,
      count: bin.count,
      fill: bin.isOwnBin ? "#475569" : "#cbd5e1",
    })) || [];

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs rounded py-1 px-2 shadow-lg">
          <p>Score: {label}</p>
          <p>Workers: {data.count}</p>
          {data.fill === "#475569" && <p className="text-yellow-300">(you)</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="score" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            domain={[0, "dataMax + 1"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#cbd5e1" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center text-xs text-slate-500">
        Score Distribution (0-10)
      </div>
    </div>
  );
}
