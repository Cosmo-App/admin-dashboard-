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
      <div className="bg-[#0a0a0a]/95 backdrop-blur-sm border border-secondary/50 rounded-lg p-3 shadow-xl">
        <p className="text-gray-400 text-xs font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="text-white font-bold">{entry.value}</span>
          </div>
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
      <div style={{ height }} className="flex items-center justify-center bg-[#1a1a1a]/50 rounded-lg border border-dashed border-secondary/50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-xs">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#666" 
          fontSize={10} 
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#666" 
          fontSize={10} 
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="count"
          name="New Users"
          stroke={CHART_COLORS.primary}
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: CHART_COLORS.primary, stroke: '#000', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Film Uploads Chart (Bar)
export function FilmUploadsChart({ data, isLoading, height = 300 }: ChartProps) {
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-[#1a1a1a]/50 rounded-lg border border-dashed border-secondary/50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-xs">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis 
          dataKey="month" 
          stroke="#666" 
          fontSize={10} 
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="#666" 
          fontSize={10} 
          tickLine={false}
          axisLine={false}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
        <Bar 
          dataKey="count" 
          name="Films Uploaded" 
          fill={CHART_COLORS.primary} 
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? CHART_COLORS.primary : '#ff4d4d'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Genre Distribution Chart (Pie)
export function GenreDistributionChart({ data, isLoading, height = 300 }: ChartProps) {
  if (isLoading) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-[#1a1a1a] rounded-lg">
        <div className="animate-pulse text-gray-400 text-xs sm:text-sm">Loading chart...</div>
      </div>
    );
  }

  const COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.success,
    CHART_COLORS.warning,
    CHART_COLORS.tertiary,
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
          label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={height < 300 ? 60 : 80}
          fill="#8884d8"
          dataKey="count"
          style={{ fontSize: "10px" }}
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
        <div className="animate-pulse text-gray-400 text-xs sm:text-sm">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tick={{ fontSize: 10 }} />
        <YAxis stroke="#9CA3AF" fontSize={10} tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: "#9CA3AF", fontSize: "12px" }} />
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
