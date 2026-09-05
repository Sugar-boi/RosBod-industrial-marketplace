"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = {
  day: string;
  views: number;
  date?: string;
};

export default function ListingPerformanceChart({
  data = [],
}: {
  data?: Point[];
}) {
  const chartData =
    data.length > 0
      ? data
      : Array.from({ length: 30 }, (_, i) => ({
        day: String(i + 1),
        views: 0,
      }));

  return (
    // important: explicit height on the wrapper Recharts measures
    <div className="h-full min-h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="listingViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9900" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#ff9900" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            interval="preserveStartEnd"
            tickFormatter={(v) => `${v}`}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            allowDecimals={false}
            domain={[0, (max: number) => (max < 1 ? 1 : max)]}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
            formatter={(value: any) => [
              `${Number(value ?? 0)} views`,
              "Views",
            ]}
          />

          <Area
            type="monotone"
            dataKey="views"
            stroke="#ff9900"
            strokeWidth={2.5}
            fill="url(#listingViews)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}