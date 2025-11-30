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

const filmSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  genre: z.string().min(1, "Genre is required"),
  videoUrl: z.string().url("Must be a valid URL"),
  posterUrl: z.string().optional(),
  trailerUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  duration: z.number().min(1, "Duration must be greater than 0").optional(),
  releaseYear: z.number().min(1900).max(new Date().getFullYear() + 5).optional(),
  rating: z.string().optional(),
  tags: z.string().optional(),
});

type FilmFormData = z.infer<typeof filmSchema>;

export default function CreateFilmPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FilmFormData>({
    resolver: zodResolver(filmSchema),
  });

  const onSubmit = async (data: FilmFormData) => {
    setIsSubmitting(true);
    try {
      const filmData = {
        ...data,
        posterUrl: posterUrl || undefined,
        duration: data.duration || undefined,
        releaseYear: data.releaseYear || undefined,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      };

      await api.post("/v2/films", filmData);
      router.push("/films");
    } catch (error: any) {
      console.error("Failed to create film:", error);
      alert(error.response?.data?.error || "Failed to create film");
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
            <h3 className="text-white text-lg font-semibold mb-4">Poster Image</h3>
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
                <label className="block text-white text-sm font-medium mb-2">Release Year</label>
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
                  Duration (minutes)
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
                <label className="block text-white text-sm font-medium mb-2">Rating</label>
                <select
                  {...register("rating")}
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select rating</option>
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-white text-sm font-medium mb-2">Description</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Enter film description"
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
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
                  Video URL <span className="text-primary">*</span>
                </label>
                <input
                  {...register("videoUrl")}
                  type="url"
                  placeholder="https://vimeo.com/..."
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
                  Vimeo, YouTube, or direct video URL
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
