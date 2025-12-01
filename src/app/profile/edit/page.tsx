"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/DashboardLayout";
import ImageUpload from "@/components/ImageUpload";
import { api } from "@/lib/api";
import { Admin } from "@/types/models";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  profilePicture: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Admin>("/v2/auth/admin/me");
      const adminData = response.data as Admin;
      setAdmin(adminData);
      setProfilePicture(adminData.profilePicture || "");

      reset({
        name: adminData.name,
        email: adminData.email,
        profilePicture: adminData.profilePicture || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      router.push("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/v2/admin/${admin?.adminId}`, {
        name: data.name,
        profilePicture: profilePicture || undefined,
      });
      router.push("/profile");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      alert(error.response?.data?.error || "Failed to update profile");
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
            <h1 className="text-white text-3xl font-bold mb-2">Edit Profile</h1>
            <p className="text-gray-400 text-sm">Update your account information</p>
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

          {/* Personal Information */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Personal Information</h3>
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

              {/* Role (Display only) */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  value={(admin?.role || (typeof admin?.assignedRoleId === 'string' 
                    ? admin.assignedRoleId 
                    : admin?.assignedRoleId?.name) || "").toUpperCase()}
                  disabled
                  className="w-full px-4 py-3 bg-secondary/20 border border-secondary rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Change Password Link */}
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
