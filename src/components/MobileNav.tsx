"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Film,
  Users,
  UserCircle,
  List,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  requiredRoles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Films", href: "/films", icon: Film },
  { label: "Creators", href: "/creators", icon: UserCircle },
  { label: "Users", href: "/users", icon: Users },
  { label: "Playlists", href: "/playlists", icon: List },
  { label: "Admins", href: "/admins", icon: Shield, requiredRoles: ["SUPERADMIN"] },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const hasPermission = (item: NavItem): boolean => {
    if (!admin) return false;
    if (item.requiredRoles?.length) {
      // Get role name from admin.role (string) or admin.assignedRoleId (object or string)
      let roleName = admin.role;
      if (!roleName) {
        roleName = typeof admin.assignedRoleId === 'string' 
          ? admin.assignedRoleId 
          : admin.assignedRoleId?.name || '';
      }
      return item.requiredRoles.includes(roleName);
    }
    return true;
  };

  const filteredNavItems = navItems.filter(hasPermission);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getRoleName = () => {
    if (!admin?.assignedRoleId && !admin?.role) return 'Admin';
    if (admin.role) return admin.role;
    return typeof admin.assignedRoleId === 'string' 
      ? admin.assignedRoleId 
      : admin.assignedRoleId.name;
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-xl border-b border-border">
        <div className="flex h-full items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Cosmic</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 hover:bg-secondary rounded-xl transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 bottom-0 z-50 w-80 bg-secondary border-l border-border transition-transform duration-300 ease-out flex flex-col shadow-2xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Admin Info */}
        {admin && (
          <div className="p-6 border-b border-border shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                {admin.profilePicture ? (
                  <Image
                    src={admin.profilePicture}
                    alt={admin.name || "Admin"}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-primary font-bold text-xl">
                    {admin.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-base font-semibold truncate">{admin.name}</p>
                <div className="mt-1 inline-flex items-center px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md">
                  <span className="text-primary text-xs font-medium">
                    {getRoleName()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

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
                  "flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20"
                    : "text-gray-400 hover:bg-secondary-hover hover:text-white"
                )}
              >
                <Icon className={cn(
                  "shrink-0 transition-transform duration-200",
                  isActive ? "w-5 h-5" : "w-5 h-5 group-hover:scale-110"
                )} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
