"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants";

interface ChartProps {
  data: any[];
  isLoading?: boolean;
  height?: number;
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 shadow-lg">
        <p className="text-white text-sm font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-400 text-xs">
            {entry.name}: <span className="text-white font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// User Growth Chart (Line)
export function UserGrowthChart({ data, isLoading, height = 300 }: ChartProps) {
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-[#1a1a1a] rounded-lg">
        <div className="animate-pulse text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3D3D3D" />
        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#9CA3AF" }} />
        <Line
          type="monotone"
          dataKey="count"
          name="New Users"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ fill: CHART_COLORS.primary, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Film Uploads Chart (Bar)
export function FilmUploadsChart({ data, isLoading, height = 300 }: ChartProps) {
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-[#1a1a1a] rounded-lg">
        <div className="animate-pulse text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#3D3D3D" />
        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#9CA3AF" }} />
        <Bar dataKey="count" name="Films Uploaded" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Genre Distribution Chart (Pie)
export function GenreDistributionChart({ data, isLoading, height = 300 }: ChartProps) {
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-[#1a1a1a] rounded-lg">
        <div className="animate-pulse text-gray-400">Loading chart...</div>
      </div>
    );
  }

  const COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.info,
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Watch Time Trends Chart (Area)
export function WatchTimeTrendsChart({ data, isLoading, height = 300 }: ChartProps) {
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-[#1a1a1a] rounded-lg">
        <div className="animate-pulse text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorWatchTime" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.8} />
            <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#3D3D3D" />
        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#9CA3AF" }} />
        <Area
          type="monotone"
          dataKey="watchMinutes"
          name="Watch Time (min)"
          stroke={CHART_COLORS.primary}
          fillOpacity={1}
          fill="url(#colorWatchTime)"
        />
        <Area
          type="monotone"
          dataKey="uniqueViewers"
          name="Unique Viewers"
          stroke={CHART_COLORS.secondary}
          fillOpacity={1}
          fill="url(#colorViewers)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
