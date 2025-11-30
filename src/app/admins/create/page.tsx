"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/DashboardLayout";
import ImageUpload from "@/components/ImageUpload";
import { api } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const adminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "SUPERADMIN"]),
  profilePicture: z.string().optional(),
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function CreateAdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const router = useRouter();
  const { admin: currentAdmin } = useAuth();

  const isSuperAdmin = currentAdmin?.role === "SUPERADMIN";

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push("/");
    }
  }, [isSuperAdmin]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      role: "ADMIN",
    },
  });

  const onSubmit = async (data: AdminFormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/v2/admin", {
        ...data,
        profilePicture: profilePicture || undefined,
      });
      router.push("/admins");
    } catch (error: any) {
      console.error("Failed to create admin:", error);
      alert(error.response?.data?.error || "Failed to create admin");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-white text-3xl font-bold mb-2">Create Admin</h1>
            <p className="text-gray-400 text-sm">Add a new administrator to the system</p>
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

              {/* Email */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.email ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.email && (
                  <p className="mt-1.5 text-primary text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Password <span className="text-primary">*</span>
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.password ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.password && (
                  <p className="mt-1.5 text-primary text-xs">{errors.password.message}</p>
                )}
                <p className="mt-1.5 text-gray-500 text-xs">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Role <span className="text-primary">*</span>
                </label>
                <select
                  {...register("role")}
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.role ? "border-primary" : "border-secondary"
                  )}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1.5 text-primary text-xs">{errors.role.message}</p>
                )}
                <p className="mt-1.5 text-gray-500 text-xs">
                  <strong>Admin:</strong> Standard administrative access. 
                  <strong className="ml-2">Super Admin:</strong> Full system access including admin management.
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              <strong className="text-yellow-400">Security Notice:</strong> The admin will receive
              their login credentials via email. Make sure to use a secure password and inform them
              to change it after first login.
            </p>
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Admin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
