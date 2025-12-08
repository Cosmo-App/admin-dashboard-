"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { useCreatorAuth } from "@/context/CreatorAuthContext";
import { ArrowLeft, Upload, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  bio: z.string().optional(),
  instagram: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface Creator {
  _id: string;
  creatorId: string;
  name: string;
  email: string;
  title?: string;
  bio?: string;
  instagram?: string;
  profilePicture?: string;
}

export default function CreatorProfile() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { refreshSession } = useCreatorAuth();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const fetchCreatorData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ creator: Creator }>("/v2/auth/creator/session");
      const creatorData = response.data.creator;
      setCreator(creatorData);
      resetProfile({
        name: creatorData.name,
        title: creatorData.title || "",
        bio: creatorData.bio || "",
        instagram: creatorData.instagram || "",
      });
    } catch (error) {
      console.error("Failed to fetch creator data:", error);
      router.push("/creator/login");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitProfile = async (data: ProfileFormData) => {
    try {
      const response = await api.put<{ creator: Creator }>("/v2/auth/creator/profile", data);
      setCreator(response.data.creator);
      await refreshSession(); // Refresh the auth context
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      await api.put("/v2/auth/creator/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      resetPassword();
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.upload<{ creator: Creator }>(
        "/v2/auth/creator/profile-picture",
        formData
      );
      setCreator(response.data.creator);
      await refreshSession(); // Refresh the auth context
      toast.success("Profile picture updated successfully!");
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!creator) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-secondary sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Link
              href="/creator/dashboard"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <h1 className="text-xl font-bold text-white">Profile Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-secondary">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`pb-4 px-2 text-sm font-medium transition-colors ${
              activeTab === "password"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Profile Picture */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                  {creator.profilePicture ? (
                    <Image
                      src={creator.profilePicture}
                      alt={creator.name}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">
                      {creator.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? "Uploading..." : "Change Photo"}
                    </div>
                  </label>
                  <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
              <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={creator.email}
                    disabled
                    className="w-full px-4 py-2 bg-secondary/50 border border-secondary text-gray-500 rounded-lg cursor-not-allowed"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    {...registerProfile("name")}
                    className="w-full px-4 py-2 bg-secondary border border-secondary text-white rounded-lg focus:border-primary focus:outline-none"
                  />
                  {profileErrors.name && (
                    <p className="text-primary text-sm mt-1">{profileErrors.name.message}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Film Director, Cinematographer"
                    {...registerProfile("title")}
                    className="w-full px-4 py-2 bg-secondary border border-secondary text-white rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about yourself..."
                    {...registerProfile("bio")}
                    className="w-full px-4 py-2 bg-secondary border border-secondary text-white rounded-lg focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    {...registerProfile("instagram")}
                    className="w-full px-4 py-2 bg-secondary border border-secondary text-white rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingProfile}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmittingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">Change Password</h3>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  {...registerPassword("currentPassword")}
                  className="w-full px-4 py-2 bg-secondary border border-secondary text-white rounded-lg focus:border-primary focus:outline-none"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-primary text-sm mt-1">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  {...registerPassword("newPassword")}
                  className="w-full px-4 py-2 bg-secondary border border-secondary text-white rounded-lg focus:border-primary focus:outline-none"
                />
                {passwordErrors.newPassword && (
                  <p className="text-primary text-sm mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  {...registerPassword("confirmPassword")}
                  className="w-full px-4 py-2 bg-secondary border border-secondary text-white rounded-lg focus:border-primary focus:outline-none"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-primary text-sm mt-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingPassword}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmittingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
