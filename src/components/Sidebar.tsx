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
      const hasRole = item.requiredRoles.includes(admin.assignedRoleId?.name || "");
      if (!hasRole) return false;
    }

    // Check permission requirements
    if (item.requiredPermissions?.length) {
      const adminPermissions = admin.assignedRoleId?.permissions || [];
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
        "fixed left-0 top-0 z-40 h-screen bg-black border-r border-secondary transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-secondary">
        {!isCollapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white font-bold text-xl">Cosmic</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-white" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 mt-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-secondary hover:text-white",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0")} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info */}
      {!isCollapsed && admin && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-medium">
              {admin.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{admin.name}</p>
              <p className="text-gray-400 text-xs truncate">
                {admin.assignedRoleId?.name || "Admin"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
