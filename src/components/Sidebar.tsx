"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Users,
  UserCircle,
  List,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Films",
    href: "/films",
    icon: Film,
  },
  {
    label: "Creators",
    href: "/creators",
    icon: UserCircle,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
  },
  {
    label: "Playlists",
    href: "/playlists",
    icon: List,
  },
  {
    label: "Admins",
    href: "/admins",
    icon: Shield,
    requiredRoles: ["SUPERADMIN"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { admin } = useAuth();

  const hasPermission = (item: NavItem): boolean => {
    if (!admin) return false;

    // Check role requirements
    if (item.requiredRoles?.length) {
      const roleName = typeof admin.assignedRoleId === 'string' 
        ? admin.assignedRoleId 
        : admin.assignedRoleId?.name || "";
      const hasRole = item.requiredRoles.includes(roleName);
      if (!hasRole) return false;
    }

    // Check permission requirements
    if (item.requiredPermissions?.length) {
      const adminPermissions = typeof admin.assignedRoleId === 'string' 
        ? [] 
        : admin.assignedRoleId?.permissions || [];
      const hasAllPermission = adminPermissions.includes("all");
      const hasRequiredPermission = item.requiredPermissions.some((perm) =>
        adminPermissions.includes(perm)
      );
      if (!hasAllPermission && !hasRequiredPermission) return false;
    }

    return true;
  };

  const filteredNavItems = navItems.filter(hasPermission);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-black border-r border-border transition-all duration-300 ease-in-out",
        "flex flex-col",
        isCollapsed ? "w-20" : "w-72",
        "hidden lg:flex"
      )}
    >
      {/* Logo & Toggle */}
      <div className="flex h-20 items-center justify-between px-5 border-b border-border shrink-0">
        <Link 
          href="/" 
          className={cn(
            "flex items-center gap-3 transition-opacity duration-200",
            isCollapsed && "opacity-0 w-0"
          )}
        >
          <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          {!isCollapsed && (
            <span className="text-white font-bold text-2xl tracking-tight">Cosmic</span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className={cn(
            "p-2.5 hover:bg-secondary rounded-xl transition-all duration-200 group",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-linear-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20"
                  : "text-gray-400 hover:bg-secondary hover:text-white",
                isCollapsed && "justify-center px-0"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn(
                "shrink-0 transition-transform duration-200",
                isActive ? "w-5 h-5" : "w-5 h-5 group-hover:scale-110"
              )} />
              {!isCollapsed && (
                <span className="font-semibold text-sm tracking-wide">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info */}
      {admin && (
        <div className={cn(
          "border-t border-border p-4 shrink-0",
          isCollapsed && "px-2"
        )}>
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-200",
            isCollapsed && "justify-center p-2"
          )}>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              {admin.name?.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{admin.name}</p>
                <p className="text-gray-400 text-xs truncate mt-0.5">
                  {typeof admin.assignedRoleId === 'string' 
                    ? admin.assignedRoleId 
                    : admin.assignedRoleId?.name || "Admin"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
