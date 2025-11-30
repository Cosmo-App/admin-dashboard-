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
    <header className="sticky top-0 z-30 h-16 bg-black border-b border-secondary">
      <div className="flex h-full items-center justify-between px-6">
        {/* Search or breadcrumb can go here */}
        <div className="flex-1">
          <h1 className="text-white text-lg font-semibold">
            Welcome back, {admin?.name?.split(" ")[0] || "Admin"}
          </h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-medium">
                {admin?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-white text-sm font-medium">{admin?.name}</p>
                <p className="text-gray-400 text-xs">
                  {admin?.assignedRoleId?.name || "Admin"}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  showDropdown && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-secondary rounded-lg shadow-lg py-2">
                <div className="px-4 py-3 border-b border-secondary">
                  <p className="text-white text-sm font-medium">{admin?.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{admin?.email}</p>
                </div>

                <button
                  onClick={() => {
                    router.push("/profile");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-secondary hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>

                <button
                  onClick={() => {
                    router.push("/settings");
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-secondary hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>

                <div className="border-t border-secondary my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-primary hover:bg-secondary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
