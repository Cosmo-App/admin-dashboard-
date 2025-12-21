"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig: Record<
  ToastType,
  {
    icon: React.ReactNode;
    bgClass: string;
    borderClass: string;
    iconClass: string;
    progressClass: string;
  }
> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    bgClass: "bg-gradient-to-br from-green-500/10 to-emerald-500/5",
    borderClass: "border-green-500/50",
    iconClass: "text-green-500",
    progressClass: "bg-green-500",
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bgClass: "bg-gradient-to-br from-red-500/10 to-rose-500/5",
    borderClass: "border-red-500/50",
    iconClass: "text-red-500",
    progressClass: "bg-red-500",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgClass: "bg-gradient-to-br from-yellow-500/10 to-amber-500/5",
    borderClass: "border-yellow-500/50",
    iconClass: "text-yellow-500",
    progressClass: "bg-yellow-500",
  },
  info: {
    icon: <Info className="w-5 h-5" />,
    bgClass: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5",
    borderClass: "border-blue-500/50",
    iconClass: "text-blue-500",
    progressClass: "bg-blue-500",
  },
};

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  const config = toastConfig[type];
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      // Progress bar animation
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        
        if (remaining <= 0) {
          clearInterval(progressInterval);
        }
      }, 16); // 60fps

      // Auto close timer
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300); // Wait for exit animation
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 pr-3 rounded-xl border backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden group",
        config.bgClass,
        config.borderClass,
        isExiting ? "animate-out slide-out-to-right-5 fade-out-0 duration-300" : "animate-in slide-in-from-right-5 fade-in-0 duration-300"
      )}
    >
      {/* Animated background glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        type === "success" && "bg-gradient-to-r from-green-500/5 to-transparent",
        type === "error" && "bg-gradient-to-r from-red-500/5 to-transparent",
        type === "warning" && "bg-gradient-to-r from-yellow-500/5 to-transparent",
        type === "info" && "bg-gradient-to-r from-blue-500/5 to-transparent"
      )} />
      
      {/* Icon with animation */}
      <div className={cn(
        "flex-shrink-0 mt-0.5 relative z-10",
        config.iconClass,
        type === "success" && "animate-in zoom-in-50 duration-500"
      )}>
        {type === "success" && (
          <div className="absolute inset-0 animate-ping opacity-75">
            <Sparkles className="w-5 h-5" />
          </div>
        )}
        {config.icon}
      </div>
      
      <div className="flex-1 relative z-10">
        <p className="text-sm text-white font-medium leading-relaxed">{message}</p>
      </div>
      
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 relative z-10"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
      </button>
      
      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div
            className={cn(
              "h-full transition-all duration-75 ease-linear",
              config.progressClass,
              "shadow-lg"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-md w-full pointer-events-none">
      <div className="pointer-events-auto space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
}
