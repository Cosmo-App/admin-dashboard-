"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import ConfirmDialog from "@/components/ConfirmDialog";
import { api } from "@/lib/api";
import { Admin } from "@/types/models";
import {
  ArrowLeft,
  Edit,
  Trash,
  Mail,
  Calendar,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import { formatDateFull } from "@/lib/date";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function ViewAdminPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const adminId = params.adminId as string;
  const { admin: currentAdmin } = useAuth();

  const isSuperAdmin = currentAdmin?.role === "SUPERADMIN";
  const isOwnProfile = currentAdmin?.adminId === adminId;

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push("/");
      return;
    }
    if (adminId) {
      fetchAdmin();
    }
  }, [adminId, isSuperAdmin]);

  const fetchAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Admin>(`/v2/admin/${adminId}`);
      setAdmin(response.data as Admin);
    } catch (error) {
      console.error("Failed to fetch admin:", error);
      router.push("/admins");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.del(`/v2/admin/${adminId}`);
      router.push("/admins");
    } catch (error: any) {
      console.error("Failed to delete admin:", error);
      alert(error.response?.data?.error || "Failed to delete admin");
      setIsDeleting(false);
      setDeleteDialog(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      await api.put(`/v2/admin/${adminId}`, {
        isActive: !admin?.isActive,
      });
      await fetchAdmin();
      setStatusDialog(false);
    } catch (error: any) {
      console.error("Failed to update admin status:", error);
      alert(error.response?.data?.error || "Failed to update admin status");
    } finally {
      setIsUpdating(false);
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

  if (!admin || !isSuperAdmin) return null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-white text-3xl font-bold">{admin.name}</h1>
              <p className="text-gray-400 text-sm mt-1">
                Joined {formatDateFull(admin.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isOwnProfile && (
              <>
                <button
                  onClick={() => setStatusDialog(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    admin.isActive
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
                  }`}
                >
                  {admin.isActive ? (
                    <>
                      <UserX className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </button>
                <button
                  onClick={() => router.push(`/admins/${adminId}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                >
                  <Trash className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            {isOwnProfile && (
              <button
                onClick={() => router.push(`/admins/${adminId}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile */}
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
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-center mb-4">
                <h3 className="text-white text-xl font-bold mb-1">{admin.name}</h3>
                <p className="text-gray-400 text-sm">{admin.email}</p>
              </div>
              <div
                className={`px-3 py-2 rounded-lg text-center ${
                  admin.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {admin.isActive ? (
                  <span className="flex items-center justify-center gap-2 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Role Badge */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    admin.role === "SUPERADMIN" ? "bg-purple-500/20" : "bg-blue-500/20"
                  }`}
                >
                  <Shield
                    className={`w-6 h-6 ${
                      admin.role === "SUPERADMIN" ? "text-purple-400" : "text-blue-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Role</p>
                  <p
                    className={`text-lg font-semibold uppercase ${
                      admin.role === "SUPERADMIN" ? "text-purple-400" : "text-blue-400"
                    }`}
                  >
                    {admin.role}
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
                <Mail className="w-5 h-5" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Admin ID</span>
                  <span className="text-white text-sm font-mono">{admin.adminId}</span>
                </div>
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
                  <span
                    className={`text-sm font-medium uppercase ${
                      admin.role === "SUPERADMIN" ? "text-purple-400" : "text-blue-400"
                    }`}
                  >
                    {admin.role}
                  </span>
                </div>
                <div className="flex items-start justify-between py-3">
                  <span className="text-gray-400 text-sm">Account Status</span>
                  <span
                    className={`text-sm font-medium ${
                      admin.isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>
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
                <div className="flex items-start justify-between py-3 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Account Created</span>
                  <span className="text-white text-sm font-medium">
                    {formatDateFull(admin.createdAt)}
                  </span>
                </div>
                <div className="flex items-start justify-between py-3">
                  <span className="text-gray-400 text-sm">Last Updated</span>
                  <span className="text-white text-sm font-medium">
                    {admin.updatedAt ? formatDateFull(admin.updatedAt) : "Never"}
                  </span>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Permissions
              </h3>
              <div className="space-y-2">
                {admin.role === "SUPERADMIN" ? (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Full system access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Manage all admins</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Manage all content</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">View all analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">System configuration</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Manage content</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">View analytics</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Moderate users</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-gray-500">Cannot manage admins</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-gray-500">Cannot access system settings</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      {!isOwnProfile && (
        <ConfirmDialog
          isOpen={deleteDialog}
          onClose={() => setDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Admin"
          message={`Are you sure you want to delete "${admin.name}"? This action cannot be undone and will revoke all their administrative access.`}
          confirmText="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      )}

      {/* Status Dialog */}
      {!isOwnProfile && (
        <ConfirmDialog
          isOpen={statusDialog}
          onClose={() => setStatusDialog(false)}
          onConfirm={handleToggleStatus}
          title={admin.isActive ? "Deactivate Admin" : "Activate Admin"}
          message={
            admin.isActive
              ? `Are you sure you want to deactivate "${admin.name}"? They will no longer be able to access the admin dashboard.`
              : `Are you sure you want to activate "${admin.name}"? They will regain access to the admin dashboard.`
          }
          confirmText={admin.isActive ? "Deactivate" : "Activate"}
          variant={admin.isActive ? "danger" : "info"}
          isLoading={isUpdating}
        />
      )}
    </DashboardLayout>
  );
}
