import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function LoadingSkeleton({ className = "", variant = "rectangular" }: LoadingSkeletonProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-secondary/50 via-secondary/70 to-secondary/50 bg-[length:200%_100%]";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        animation: "shimmer 2s ease-in-out infinite",
      }}
    />
  );
}

interface StatsCardSkeletonProps {
  count?: number;
}

export function StatsCardSkeleton({ count = 4 }: StatsCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-secondary border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <LoadingSkeleton className="w-12 h-12 rounded-xl" variant="rectangular" />
            <LoadingSkeleton className="w-16 h-6" variant="text" />
          </div>
          <LoadingSkeleton className="w-32 h-8 mb-2" variant="text" />
          <LoadingSkeleton className="w-24 h-4" variant="text" />
        </div>
      ))}
    </>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="bg-secondary border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <LoadingSkeleton className="w-48 h-6" variant="text" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4 text-left">
                  <LoadingSkeleton className="w-24 h-4" variant="text" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border last:border-0">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <LoadingSkeleton className="w-full h-4" variant="text" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
