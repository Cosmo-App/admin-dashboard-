"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Admin } from "@/types/models";
import { Edit, Calendar, Shield, Mail, User, Activity } from "lucide-react";
import { formatDateFull } from "@/lib/date";
import Image from "next/image";

export default function ProfilePage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/v2/auth/admin/session");
      // Handle both response.data and response.data.admin structures
      const adminData = response.data?.admin || response.data;
      setAdmin(adminData as Admin);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!admin) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400 text-sm">Manage your account information</p>
          </div>
          <button
            onClick={() => router.push("/profile/edit")}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Picture */}
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <div className="aspect-square w-full bg-secondary rounded-lg overflow-hidden relative mb-4">
                {admin.profilePicture ? (
                  <Image
                    src={admin.profilePicture}
                    alt={admin.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-bold mb-1">{admin.name}</h3>
                <p className="text-gray-400 text-sm">{admin.email}</p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Role</p>
                  <p className="text-white text-lg font-semibold uppercase">
                    {admin.role || (typeof admin.assignedRoleId === 'string' 
                      ? admin.assignedRoleId 
                      : admin.assignedRoleId?.name || "Admin")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Full Name</span>
                  <span className="text-white text-sm font-medium">{admin.name}</span>
                </div>
                <div className="flex items-start justify-between py-3 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Email Address</span>
                  <span className="text-white text-sm font-medium">{admin.email}</span>
                </div>
                <div className="flex items-start justify-between py-3 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Role</span>
                  <span className="text-white text-sm font-medium uppercase">
                    {admin.role || (typeof admin.assignedRoleId === 'string' 
                      ? admin.assignedRoleId 
                      : admin.assignedRoleId?.name || "Admin")}
                  </span>
                </div>
                <div className="flex items-start justify-between py-3">
                  <span className="text-gray-400 text-sm">Admin ID</span>
                  <span className="text-white text-sm font-mono">{admin.adminId}</span>
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Last Login</span>
                  <span className="text-white text-sm font-medium">
                    {admin.lastLogin ? formatDateFull(admin.lastLogin) : "Never"}
                  </span>
                </div>
                <div className="flex items-start justify-between py-3">
                  <span className="text-gray-400 text-sm">Account Created</span>
                  <span className="text-white text-sm font-medium">
                    {admin.createdAt ? formatDateFull(admin.createdAt) : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </h3>
              <button
                onClick={() => router.push("/profile/password")}
                className="w-full px-4 py-3 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors text-left"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
