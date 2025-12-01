"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/DashboardLayout";
import ImageUpload from "@/components/ImageUpload";
import { api } from "@/lib/api";
import { Film } from "@/types/models";
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
  duration: z.number().min(1).optional(),
  releaseYear: z.number().min(1900).max(new Date().getFullYear() + 5).optional(),
  rating: z.string().optional(),
  tags: z.string().optional(),
});

type FilmFormData = z.infer<typeof filmSchema>;

export default function EditFilmPage() {
  const [film, setFilm] = useState<Film | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string>("");
  const router = useRouter();
  const params = useParams();
  const filmId = params.filmId as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FilmFormData>({
    resolver: zodResolver(filmSchema),
  });

  useEffect(() => {
    if (filmId) {
      fetchFilm();
    }
  }, [filmId]);

  const fetchFilm = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Film>(`/v2/films/${filmId}`);
      const filmData = response.data as Film;
      setFilm(filmData);
      setPosterUrl(filmData.posterUrl || "");
      
      reset({
        title: filmData.title,
        description: filmData.description || "",
        genre: filmData.genre,
        videoUrl: filmData.videoUrl,
        posterUrl: filmData.posterUrl || "",
        trailerUrl: filmData.trailerUrl || "",
        duration: filmData.duration || undefined,
        releaseYear: filmData.releaseYear || undefined,
        rating: filmData.rating || "",
        tags: filmData.tags?.join(", ") || "",
      });
    } catch (error) {
      console.error("Failed to fetch film:", error);
      router.push("/films");
    } finally {
      setIsLoading(false);
    }
  };

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

      await api.put(`/v2/films/${filmId}`, filmData);
      router.push(`/films/${filmId}`);
    } catch (error: any) {
      console.error("Failed to update film:", error);
      alert(error.response?.data?.error || "Failed to update film");
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
            <h1 className="text-white text-3xl font-bold mb-2">Edit Film</h1>
            <p className="text-gray-400 text-sm">Update film details</p>
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
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
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
                  {FILM_GENRES.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Release Year */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Release Year</label>
                <input
                  {...register("releaseYear", { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Duration (minutes)
                </label>
                <input
                  {...register("duration", { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
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
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Video URLs */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Video Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Video URL <span className="text-primary">*</span>
                </label>
                <input
                  {...register("videoUrl")}
                  type="url"
                  className={cn(
                    "w-full px-4 py-3 bg-black border rounded-lg text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                    errors.videoUrl ? "border-primary" : "border-secondary"
                  )}
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Trailer URL</label>
                <input
                  {...register("trailerUrl")}
                  type="url"
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
