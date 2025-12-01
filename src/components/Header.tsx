"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const { admin, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 lg:h-20 bg-black/80 backdrop-blur-xl border-b border-border">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo (Mobile) */}
        <div className="flex items-center gap-4 lg:hidden">
          <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Cosmic</span>
        </div>

        {/* Welcome Message (Desktop) */}
        <div className="hidden lg:block flex-1">
          <h1 className="text-white text-xl font-bold">
            Welcome back, <span className="text-primary">{admin?.name?.split(" ")[0] || "Admin"}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Here's what's happening today</p>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button
            className="relative p-2.5 hover:bg-secondary rounded-xl transition-all duration-200 group"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse-soft"></span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:px-3 sm:py-2 hover:bg-secondary rounded-xl transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base">
                {admin?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-white text-sm font-semibold">{admin?.name}</p>
                <p className="text-gray-400 text-xs">
                  {typeof admin?.assignedRoleId === 'string' ? admin.assignedRoleId : admin?.assignedRoleId?.name || "Admin"}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 group-hover:text-white transition-all duration-200 hidden sm:block",
                  showDropdown && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-secondary border border-border rounded-xl shadow-2xl py-2 animate-slide-in-up">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-white text-sm font-semibold">{admin?.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{admin?.email}</p>
                  <div className="mt-2 inline-flex items-center px-2 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                    <span className="text-primary text-xs font-medium">
                      {typeof admin?.assignedRoleId === 'string' ? admin.assignedRoleId : admin?.assignedRoleId?.name || "Admin"}
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-secondary-hover hover:text-white transition-all duration-200 group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Profile Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push("/settings");
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-secondary-hover hover:text-white transition-all duration-200 group"
                  >
                    <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                </div>

                <div className="border-t border-border mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-primary hover:bg-primary/10 transition-all duration-200 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
