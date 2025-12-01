"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/DashboardLayout";
import ImageUpload from "@/components/ImageUpload";
import { api } from "@/lib/api";
import { Creator } from "@/types/models";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const creatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  profilePicture: z.string().optional(),
  donateLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CreatorFormData = z.infer<typeof creatorSchema>;

export default function EditCreatorPage() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const creatorId = params.creatorId as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreatorFormData>({
    resolver: zodResolver(creatorSchema),
  });

  useEffect(() => {
    if (creatorId) {
      fetchCreator();
    }
  }, [creatorId]);

  const fetchCreator = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Creator>(`/v2/creators/${creatorId}`);
      const creatorData = response.data as Creator;
      setCreator(creatorData);
      setProfilePicture(creatorData.profilePicture || "");

      reset({
        name: creatorData.name,
        bio: creatorData.bio || "",
        profilePicture: creatorData.profilePicture || "",
        donateLink: creatorData.donateLink || "",
      });
    } catch (error) {
      console.error("Failed to fetch creator:", error);
      router.push("/creators");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreatorFormData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/v2/creators/${creatorId}`, {
        ...data,
        profilePicture: profilePicture || undefined,
      });
      router.push(`/creators/${creatorId}`);
    } catch (error: any) {
      console.error("Failed to update creator:", error);
      alert(error.response?.data?.error || "Failed to update creator");
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
            <h1 className="text-white text-3xl font-bold mb-2">Edit Creator</h1>
            <p className="text-gray-400 text-sm">Update creator details</p>
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

          {/* Creator Information */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Creator Information</h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Name <span className="text-primary">*</span>
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

              {/* Bio */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Bio</label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Donate Link */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Donate Link</label>
                <input
                  {...register("donateLink")}
                  type="url"
                  placeholder="https://..."
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.donateLink ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.donateLink && (
                  <p className="mt-1.5 text-primary text-xs">{errors.donateLink.message}</p>
                )}
                <p className="mt-1.5 text-gray-500 text-xs">
                  Provide a link where fans can support this creator (e.g., PayPal, Patreon)
                </p>
              </div>
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
