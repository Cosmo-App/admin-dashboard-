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
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-white text-lg font-semibold">Loading Dashboard</p>
            <p className="text-gray-400 text-sm mt-1">Please wait...</p>
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
