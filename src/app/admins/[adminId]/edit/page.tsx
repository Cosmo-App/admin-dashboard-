"use client";

export const runtime = 'edge';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/DashboardLayout";
import ImageUpload from "@/components/ImageUpload";
import { api } from "@/lib/api";
import { Admin } from "@/types/models";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const adminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "SUPERADMIN"]),
  profilePicture: z.string().optional(),
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function EditAdminPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const adminId = params.adminId as string;
  const { admin: currentAdmin } = useAuth();

  const isSuperAdmin = currentAdmin?.role === "SUPERADMIN";
  const isOwnProfile = currentAdmin?.adminId === adminId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

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
      const adminData = response.data as Admin;
      setAdmin(adminData);
      setProfilePicture(adminData.profilePicture || "");

      const roleName = adminData.role || (typeof adminData.assignedRoleId === 'string' 
        ? adminData.assignedRoleId 
        : adminData.assignedRoleId?.name) || "ADMIN";

      reset({
        name: adminData.name,
        email: adminData.email,
        role: (roleName === "SUPERADMIN" || roleName === "ADMIN" ? roleName : "ADMIN") as "ADMIN" | "SUPERADMIN",
        profilePicture: adminData.profilePicture || "",
      });
    } catch (error) {
      console.error("Failed to fetch admin:", error);
      router.push("/admins");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AdminFormData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/v2/admin/${adminId}`, {
        name: data.name,
        role: data.role,
        profilePicture: profilePicture || undefined,
      });
      router.push(`/admins/${adminId}`);
    } catch (error: any) {
      console.error("Failed to update admin:", error);
      alert(error.response?.data?.error || "Failed to update admin");
    } finally {
      setIsSubmitting(false);
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

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">
              {isOwnProfile ? "Edit My Profile" : "Edit Admin"}
            </h1>
            <p className="text-gray-400 text-sm">Update administrator details</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Profile Picture</h3>
            <ImageUpload
              value={profilePicture}
              onChange={(url) => {
                setProfilePicture(url);
                setValue("profilePicture", url);
              }}
              onRemove={() => {
                setProfilePicture("");
                setValue("profilePicture", "");
              }}
              label="Upload profile picture"
            />
          </div>

          {/* Admin Information */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Admin Information</h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.name ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.name && (
                  <p className="mt-1.5 text-primary text-xs">{errors.name.message}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  disabled
                  className="w-full px-4 py-3 bg-secondary/20 border border-secondary rounded-lg text-gray-400 cursor-not-allowed"
                />
                <p className="mt-1.5 text-gray-500 text-xs">
                  Email cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Role <span className="text-primary">*</span>
                </label>
                <select
                  {...register("role")}
                  disabled={isOwnProfile}
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    isOwnProfile && "bg-secondary/20 text-gray-400 cursor-not-allowed",
                    errors.role ? "border-primary" : "border-secondary"
                  )}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1.5 text-primary text-xs">{errors.role.message}</p>
                )}
                {isOwnProfile && (
                  <p className="mt-1.5 text-gray-500 text-xs">
                    You cannot change your own role
                  </p>
                )}
                {!isOwnProfile && (
                  <p className="mt-1.5 text-gray-500 text-xs">
                    <strong>Admin:</strong> Standard administrative access. 
                    <strong className="ml-2">Super Admin:</strong> Full system access including admin management.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Change Password Link */}
          {isOwnProfile && (
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-sm font-semibold">Password</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    Last changed: Never
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/profile/password")}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors text-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
