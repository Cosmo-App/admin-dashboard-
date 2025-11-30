"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/v2/auth/admin/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      alert("Password changed successfully");
      reset();
      router.push("/profile");
    } catch (error: any) {
      console.error("Failed to change password:", error);
      alert(error.response?.data?.error || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-white text-3xl font-bold mb-2">Change Password</h1>
            <p className="text-gray-400 text-sm">Update your account password</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Password Requirements</h3>
            <ul className="space-y-2 text-gray-400 text-sm mb-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Mix of uppercase and lowercase letters recommended
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                Include numbers and special characters for better security
              </li>
            </ul>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Current Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("currentPassword")}
                    type={showCurrent ? "text" : "password"}
                    className={cn(
                      "w-full px-4 py-3 pr-12 bg-black border rounded-lg text-white",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.currentPassword ? "border-primary" : "border-secondary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1.5 text-primary text-xs">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  New Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("newPassword")}
                    type={showNew ? "text" : "password"}
                    className={cn(
                      "w-full px-4 py-3 pr-12 bg-black border rounded-lg text-white",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.newPassword ? "border-primary" : "border-secondary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1.5 text-primary text-xs">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Confirm New Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    className={cn(
                      "w-full px-4 py-3 pr-12 bg-black border rounded-lg text-white",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                      errors.confirmPassword ? "border-primary" : "border-secondary"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-primary text-xs">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-gray-300 text-sm">
              <strong className="text-white">Security Notice:</strong> After changing your
              password, you'll remain logged in on this device. You may be logged out of other
              devices for security.
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
                  Changing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
