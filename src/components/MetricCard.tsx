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
      <div className="bg-secondary border border-border rounded-2xl p-6 sm:p-8 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-border rounded w-24"></div>
          <div className="w-12 h-12 bg-border rounded-xl"></div>
        </div>
        <div className="h-9 bg-border rounded w-32 mb-2"></div>
        <div className="h-3 bg-border rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="group bg-secondary border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 card-hover">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm sm:text-base font-semibold tracking-wide uppercase">{title}</p>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
        </div>
      </div>

      <p className="text-white text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
        {formatValue(value)}
        {suffix && !format.includes("time") && (
          <span className="text-xl sm:text-2xl ml-1 text-gray-400 font-semibold">{suffix}</span>
        )}
      </p>

      {change !== undefined && (
        <div className="flex items-center gap-2">
          {isPositive && <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />}
          {isNegative && <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-error" />}
          <span
            className={cn(
              "text-xs sm:text-sm font-semibold",
              isPositive && "text-success",
              isNegative && "text-error",
              !isPositive && !isNegative && "text-gray-400"
            )}
          >
            {change > 0 && "+"}
            {change}% <span className="text-gray-500 font-normal">from last period</span>
          </span>
        </div>
      )}
    </div>
  );
}
