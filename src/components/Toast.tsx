"use client";

import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
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
  }
> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/50",
    iconClass: "text-green-500",
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/50",
    iconClass: "text-red-500",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgClass: "bg-yellow-500/10",
    borderClass: "border-yellow-500/50",
    iconClass: "text-yellow-500",
  },
  info: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/50",
    iconClass: "text-blue-500",
  },
};

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  const config = toastConfig[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg shadow-black/20 animate-in slide-in-from-right-5 fade-in-0 duration-300",
        config.bgClass,
        config.borderClass
      )}
    >
      <div className={cn("flex-shrink-0 mt-0.5", config.iconClass)}>{config.icon}</div>
      <p className="flex-1 text-sm text-white leading-relaxed">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-gray-400 hover:text-white" />
      </button>
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
