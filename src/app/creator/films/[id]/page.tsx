"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreatorAuth } from "@/context/CreatorAuthContext";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { ArrowLeft, Edit, Save, X, Upload as UploadIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FilmData {
  _id: string;
  filmId: string;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  duration: number;
  trailerUrl?: string;
  videoUrl: string;
  posterUrl: string;
  creatorId: string;
  isActive: boolean;
  views: number;
  createdAt: string;
}

export default function CreatorEditFilm() {
  const params = useParams();
  const router = useRouter();
  const { creator } = useCreatorAuth();
  const toast = useToast();
  const [film, setFilm] = useState<FilmData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    releaseYear: "",
    duration: "",
    trailerUrl: "",
    videoUrl: "",
    posterUrl: "",
  });

  useEffect(() => {
    if (params.id) {
      fetchFilm();
    }
  }, [params.id]);

  const fetchFilm = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<FilmData>(`/v2/films/${params.id}`);
      const filmData = response.data;
      
      // Verify ownership
      if (filmData.creatorId !== creator?.creatorId) {
        toast.error("You don't have permission to edit this film");
        router.push("/creator/dashboard");
        return;
      }

      setFilm(filmData);
      setFormData({
        title: filmData.title,
        description: filmData.description,
        genre: filmData.genre,
        releaseYear: filmData.releaseYear.toString(),
        duration: filmData.duration.toString(),
        trailerUrl: filmData.trailerUrl || "",
        videoUrl: filmData.videoUrl,
        posterUrl: filmData.posterUrl,
      });
    } catch (error: any) {
      console.error("Failed to fetch film:", error);
      toast.error("Failed to load film");
      router.push("/creator/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        ...formData,
        releaseYear: parseInt(formData.releaseYear),
        duration: parseInt(formData.duration),
      };

      await api.put(`/v2/films/${params.id}`, updateData);
      toast.success("Film updated successfully");
      setIsEditing(false);
      await fetchFilm();
    } catch (error: any) {
      console.error("Failed to update film:", error);
      toast.error(error.response?.data?.message || "Failed to update film");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (film) {
      setFormData({
        title: film.title,
        description: film.description,
        genre: film.genre,
        releaseYear: film.releaseYear.toString(),
        duration: film.duration.toString(),
        trailerUrl: film.trailerUrl || "",
        videoUrl: film.videoUrl,
        posterUrl: film.posterUrl,
      });
    }
    setIsEditing(false);
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

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

  const genres = [
    "Action", "Comedy", "Drama", "Horror", "Sci-Fi", 
    "Thriller", "Romance", "Documentary", "Animation", "Other"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!film) {
    return null;
  }

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
            <div className="flex items-center gap-2 sm:gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="bg-[#1a1a1a] border border-secondary rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Poster */}
          <div className="relative aspect-video bg-secondary group">
            <Image
              src={formData.posterUrl || "/placeholder-poster.jpg"}
              alt={formData.title}
              fill
              className="object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                    {isUploadingPoster ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Change Poster</span>
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
              </div>
            )}
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Film Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                />
              ) : (
                <p className="text-white text-lg font-semibold">{film.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
                />
              ) : (
                <p className="text-gray-300">{film.description}</p>
              )}
            </div>

            {/* Genre and Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Genre
                </label>
                {isEditing ? (
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-white">{film.genre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Release Year
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear() + 5}
                    className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  />
                ) : (
                  <p className="text-white">{film.releaseYear}</p>
                )}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Duration (minutes)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2.5 sm:py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                />
              ) : (
                <p className="text-white">{film.duration} minutes</p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary">
              <div>
                <p className="text-sm text-gray-400">Views</p>
                <p className="text-xl font-bold text-white">{film.views || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className={`text-xl font-bold ${film.isActive ? 'text-green-500' : 'text-gray-500'}`}>
                  {film.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
