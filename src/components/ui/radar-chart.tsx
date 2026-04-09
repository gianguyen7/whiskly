"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface TasteData {
  dimension: string;
  value: number;
  fullMark: number;
}

interface RadarChartProps {
  tasteProfile: {
    umami: number;
    sweetness: number;
    bitterness: number;
    grassiness: number;
    creaminess: number;
  };
  size?: number;
}

/**
 * Radar/spider chart for visualizing a 5-dimension taste profile.
 * Wraps Recharts RadarChart with Whiskly-specific styling.
 */
export function RadarChart({ tasteProfile, size = 300 }: RadarChartProps) {
  const data: TasteData[] = [
    { dimension: "Umami", value: tasteProfile.umami, fullMark: 5 },
    { dimension: "Sweetness", value: tasteProfile.sweetness, fullMark: 5 },
    { dimension: "Bitterness", value: tasteProfile.bitterness, fullMark: 5 },
    { dimension: "Grassiness", value: tasteProfile.grassiness, fullMark: 5 },
    { dimension: "Creaminess", value: tasteProfile.creaminess, fullMark: 5 },
  ];

  return (
    <ResponsiveContainer width="100%" height={size}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#d1d5db" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "#374151", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tickCount={6}
          tick={{ fill: "#9ca3af", fontSize: 10 }}
        />
        <Radar
          name="Taste Profile"
          dataKey="value"
          stroke="#7fb22e"
          fill="#7fb22e"
          fillOpacity={0.3}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
