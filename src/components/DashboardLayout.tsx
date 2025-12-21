"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-black">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-20 h-20 border-4 border-primary/20 rounded-full animate-ping"></div>
            {/* Main spinner */}
            <div className="relative w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/50"></div>
            {/* Inner dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-primary to-red-700 rounded-full animate-pulse"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-white text-xl font-bold tracking-tight">Loading Dashboard</p>
            <p className="text-gray-400 text-sm">Preparing your workspace...</p>
            <div className="flex items-center justify-center gap-1 mt-4">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: "0.2s"}}></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: "0.4s"}}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-20" : "lg:ml-72"
        )}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8 max-w-[1920px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
