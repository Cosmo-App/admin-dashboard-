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
      <div className="bg-secondary border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 animate-pulse">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
          <div className="h-3 sm:h-4 bg-border rounded w-20 sm:w-24"></div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-border rounded-lg sm:rounded-xl"></div>
        </div>
        <div className="h-6 sm:h-7 md:h-9 bg-border rounded w-20 sm:w-24 md:w-32 mb-1 sm:mb-2"></div>
        <div className="h-2 sm:h-3 bg-border rounded w-16 sm:w-20"></div>
      </div>
    );
  }

  return (
    <div className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-secondary/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 sm:p-3 bg-secondary/30 rounded-lg sm:rounded-xl border border-white/5 group-hover:border-primary/20 group-hover:bg-primary/10 transition-colors duration-300">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-primary transition-colors duration-300" />
          </div>
          
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
              isPositive ? "bg-success/10 text-success border-success/20" : 
              isNegative ? "bg-error/10 text-error border-error/20" : 
              "bg-gray-800 text-gray-400 border-gray-700"
            )}>
              {isPositive && <TrendingUp className="w-3 h-3" />}
              {isNegative && <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-gray-400 text-xs sm:text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {formatValue(value)}
            </h3>
            {suffix && !format.includes("time") && (
              <span className="text-sm text-gray-500 font-medium">{suffix}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
