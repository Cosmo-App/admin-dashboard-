"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/DashboardLayout";
import ImageUpload from "@/components/ImageUpload";
import { api } from "@/lib/api";
import { FILM_GENRES } from "@/lib/constants";
import { ArrowLeft, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

const filmSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genre: z.string().min(1, "Genre is required"),
  videoUrl: z.string().min(1, "Video URL is required").refine(
    (url) => {
      // Check if it's a valid Vimeo URL or numeric ID
      const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/|player\.vimeo\.com\/video\/)?(\d+)$/;
      const numericId = /^\d+$/;
      return vimeoRegex.test(url) || numericId.test(url);
    },
    { message: "Must be a valid Vimeo URL or Vimeo video ID (numeric)" }
  ),
  posterUrl: z.string().min(1, "Poster image is required"),
  trailerUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  duration: z.number().min(1, "Duration is required and must be greater than 0"),
  releaseYear: z.number().min(1900, "Invalid year").max(new Date().getFullYear() + 5, "Year cannot be too far in the future"),
  rating: z.string().min(1, "Rating is required"),
  tags: z.string().optional(),
});

type FilmFormData = z.infer<typeof filmSchema>;

export default function CreateFilmPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string>("");
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FilmFormData>({
    resolver: zodResolver(filmSchema),
  });

  const onSubmit = async (data: FilmFormData) => {
    // Additional validation checks
    if (!posterUrl || posterUrl.trim() === "") {
      toast.error("Please upload a poster image before submitting");
      return;
    }

    if (!data.videoUrl || data.videoUrl.trim() === "") {
      toast.error("Video URL is required");
      return;
    }

    if (!data.title || data.title.trim() === "") {
      toast.error("Film title is required");
      return;
    }

    if (!data.genre) {
      toast.error("Please select a genre");
      return;
    }

    if (!data.description || data.description.trim().length < 10) {
      toast.error("Please provide a description (at least 10 characters)");
      return;
    }

    if (!data.duration || data.duration < 1) {
      toast.error("Please enter a valid duration in minutes");
      return;
    }

    if (!data.releaseYear) {
      toast.error("Please enter the release year");
      return;
    }

    if (!data.rating) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const filmData = {
        ...data,
        posterUrl: posterUrl,
        duration: data.duration,
        releaseYear: data.releaseYear,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      };

      console.log("Submitting film data:", filmData);
      await api.post("/v2/films", filmData);
      
      toast.success("🎬 Film created successfully! Redirecting to films...", 3000);
      setTimeout(() => {
        router.push("/films");
      }, 1000);
    } catch (error: any) {
      console.error("Failed to create film:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to create film. Please check all fields and try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">Create Film</h1>
            <p className="text-gray-400 text-sm">Add a new film to the platform</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Poster Upload */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              Poster Image <span className="text-primary">*</span>
            </h3>
            <ImageUpload
              value={posterUrl}
              onChange={(url) => {
                setPosterUrl(url);
                setValue("posterUrl", url);
              }}
              onRemove={() => {
                setPosterUrl("");
                setValue("posterUrl", "");
              }}
              label="Upload poster (16:9 recommended)"
            />
            {!posterUrl && (
              <p className="mt-2 text-gray-400 text-xs">Poster image is required</p>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-white text-sm font-medium mb-2">
                  Title <span className="text-primary">*</span>
                </label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="Enter film title"
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.title ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.title && (
                  <p className="mt-1.5 text-primary text-xs">{errors.title.message}</p>
                )}
              </div>

              {/* Genre */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Genre <span className="text-primary">*</span>
                </label>
                <select
                  {...register("genre")}
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.genre ? "border-primary" : "border-secondary"
                  )}
                >
                  <option value="">Select genre</option>
                  {FILM_GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="mt-1.5 text-primary text-xs">{errors.genre.message}</p>
                )}
              </div>

              {/* Release Year */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Release Year <span className="text-primary">*</span>
                </label>
                <input
                  {...register("releaseYear", { valueAsNumber: true })}
                  type="number"
                  placeholder="2024"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.releaseYear ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.releaseYear && (
                  <p className="mt-1.5 text-primary text-xs">{errors.releaseYear.message}</p>
                )}
              </div>

              {/* Duration */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Duration (minutes) <span className="text-primary">*</span>
                </label>
                <input
                  {...register("duration", { valueAsNumber: true })}
                  type="number"
                  placeholder="120"
                  min="1"
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.duration ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.duration && (
                  <p className="mt-1.5 text-primary text-xs">{errors.duration.message}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Rating <span className="text-primary">*</span>
                </label>
                <select
                  {...register("rating")}
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.rating ? "border-primary" : "border-secondary"
                  )}
                >
                  <option value="">Select rating</option>
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
                {errors.rating && (
                  <p className="mt-1.5 text-primary text-xs">{errors.rating.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-white text-sm font-medium mb-2">
                  Description <span className="text-primary">*</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Enter film description (minimum 10 characters)"
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none",
                    errors.description ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.description && (
                  <p className="mt-1.5 text-primary text-xs">{errors.description.message}</p>
                )}
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-white text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  {...register("tags")}
                  type="text"
                  placeholder="action, thriller, suspense"
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Video URLs */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Video Information</h3>
            <div className="space-y-4">
              {/* Video URL */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Video URL / Vimeo ID <span className="text-primary">*</span>
                </label>
                <input
                  {...register("videoUrl")}
                  type="text"
                  placeholder="1069440843 or https://vimeo.com/1069440843"
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.videoUrl ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.videoUrl && (
                  <p className="mt-1.5 text-primary text-xs">{errors.videoUrl.message}</p>
                )}
                <p className="mt-1.5 text-gray-500 text-xs">
                  Enter Vimeo video ID (numbers only) or full Vimeo URL
                </p>
              </div>

              {/* Trailer URL */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Trailer URL</label>
                <input
                  {...register("trailerUrl")}
                  type="url"
                  placeholder="https://youtube.com/..."
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.trailerUrl ? "border-primary" : "border-secondary"
                  )}
                />
                {errors.trailerUrl && (
                  <p className="mt-1.5 text-primary text-xs">{errors.trailerUrl.message}</p>
                )}
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Film
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
