"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatNumber, formatCompactNumber } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ElementType;
  format?: "number" | "compact" | "currency" | "percent" | "time";
  isLoading?: boolean;
  suffix?: string;
}

export default function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  format = "number",
  isLoading = false,
  suffix,
}: MetricCardProps) {
  const formatValue = (val: number | string): string => {
    if (typeof val === "string") return val;

    switch (format) {
      case "compact":
        return formatCompactNumber(val);
      case "currency":
        return `$${formatNumber(val)}`;
      case "percent":
        return `${val}%`;
      case "time":
        return `${val}${suffix || "h"}`;
      default:
        return formatNumber(val);
    }
  };

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-secondary rounded w-24"></div>
          <div className="w-10 h-10 bg-secondary rounded-lg"></div>
        </div>
        <div className="h-8 bg-secondary rounded w-32 mb-2"></div>
        <div className="h-3 bg-secondary rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6 hover:border-primary/50 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>

      <p className="text-white text-3xl font-bold mb-2">
        {formatValue(value)}
        {suffix && !format.includes("time") && (
          <span className="text-lg ml-1 text-gray-400">{suffix}</span>
        )}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive && <TrendingUp className="w-4 h-4 text-green-500" />}
          {isNegative && <TrendingDown className="w-4 h-4 text-red-500" />}
          <span
            className={cn(
              "text-sm font-medium",
              isPositive && "text-green-500",
              isNegative && "text-red-500",
              !isPositive && !isNegative && "text-gray-400"
            )}
          >
            {change > 0 && "+"}
            {change}% from last period
          </span>
        </div>
      )}
    </div>
  );
}
