"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatorAuth } from "@/context/CreatorAuthContext";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { ArrowLeft, Upload, Film as FilmIcon, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CreatorCreateFilm() {
  const { creator } = useCreatorAuth();
  const toast = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [posterPreview, setPosterPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    releaseYear: new Date().getFullYear().toString(),
    duration: "",
    trailerUrl: "",
    videoUrl: "",
    posterUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingPoster(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await api.upload<{ imageUrl: string; imagePath: string }>(
        "/v2/upload/image",
        uploadFormData
      );

      const imageUrl = response.data?.imageUrl;
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, posterUrl: imageUrl }));
        setPosterPreview(imageUrl);
        toast.success("Poster uploaded successfully");
      } else {
        throw new Error("No image URL returned");
      }
    } catch (error: any) {
      console.error("Poster upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload poster");
    } finally {
      setIsUploadingPoster(false);
    }
  };

  const handleRemovePoster = () => {
    setFormData((prev) => ({ ...prev, posterUrl: "" }));
    setPosterPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creator) {
      toast.error("You must be logged in to create a film");
      return;
    }

    if (!formData.posterUrl) {
      toast.error("Please upload a poster image");
      return;
    }

    setIsSubmitting(true);

    try {
      const filmData = {
        ...formData,
        creatorId: creator.creatorId,
        releaseYear: parseInt(formData.releaseYear),
        duration: parseInt(formData.duration),
      };

      await api.post("/v2/films", filmData);
      toast.success("Film created successfully!");
      router.push("/creator/dashboard");
    } catch (error: any) {
      console.error("Failed to create film:", error);
      toast.error(error.response?.data?.message || "Failed to create film");
    } finally {
      setIsSubmitting(false);
    }
  };

  const genres = [
    "Action", "Comedy", "Drama", "Horror", "Sci-Fi", 
    "Thriller", "Romance", "Documentary", "Animation", "Other"
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-secondary sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              href="/creator/dashboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <FilmIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h1 className="text-base sm:text-xl font-bold text-white">Create Film</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="bg-[#1a1a1a] border border-secondary rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Film Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter film title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description <span className="text-primary">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Enter film description"
              />
            </div>

            {/* Genre and Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Genre <span className="text-primary">*</span>
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Select genre</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Release Year <span className="text-primary">*</span>
                </label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Duration (minutes) <span className="text-primary">*</span>
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. 120"
              />
            </div>

            {/* Poster Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Poster Image <span className="text-primary">*</span>
              </label>
              {posterPreview ? (
                <div className="relative group">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-secondary border-2 border-secondary">
                    <Image
                      src={posterPreview}
                      alt="Poster preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePoster}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-secondary rounded-lg cursor-pointer bg-black hover:bg-[#0a0a0a] hover:border-primary/50 transition-all">
                  <div className="flex flex-col items-center justify-center py-6">
                    {isUploadingPoster ? (
                      <>
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                        <p className="text-sm text-gray-400">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-400 mb-1">
                          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    disabled={isUploadingPoster}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Trailer URL
              </label>
              <input
                type="url"
                name="trailerUrl"
                value={formData.trailerUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="https://example.com/trailer.mp4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Video URL <span className="text-primary">*</span>
              </label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-primary hover:bg-primary/90 text-white rounded-lg sm:rounded-xl transition-all font-medium shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Create Film
                  </>
                )}
              </button>
              <Link
                href="/creator/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-secondary hover:bg-secondary/80 text-white rounded-lg sm:rounded-xl transition-colors font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
