"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { Film } from "@/types/models";
import { ArrowLeft, Edit, Trash, Play, Calendar, Clock, Star } from "lucide-react";
import { formatDateFull } from "@/lib/date";
import Image from "next/image";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ViewFilmPage() {
  const [film, setFilm] = useState<Film | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const filmId = params.filmId as string;

  useEffect(() => {
    if (filmId) {
      fetchFilm();
    }
  }, [filmId]);

  const fetchFilm = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Film>(`/v2/films/${filmId}`);
      setFilm(response.data as Film);
    } catch (error) {
      console.error("Failed to fetch film:", error);
      router.push("/films");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.del(`/v2/films/${filmId}`);
      router.push("/films");
    } catch (error: any) {
      console.error("Failed to delete film:", error);
      alert(error.response?.data?.error || "Failed to delete film");
      setIsDeleting(false);
      setDeleteDialog(false);
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

  if (!film) return null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-white text-3xl font-bold">{film.title}</h1>
              <p className="text-gray-400 text-sm mt-1">
                {film.genre} • {formatDateFull(film.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/films/${filmId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setDeleteDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
            >
              <Trash className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Poster & Actions */}
          <div className="space-y-4">
            <div className="aspect-[2/3] w-full bg-secondary rounded-lg overflow-hidden relative">
              {film.posterUrl ? (
                <Image src={film.posterUrl} alt={film.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="w-16 h-16 text-gray-500" />
                </div>
              )}
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
              <Play className="w-5 h-5" />
              Watch Now
            </button>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Year</span>
                </div>
                <p className="text-white text-lg font-semibold">
                  {film.releaseYear || "-"}
                </p>
              </div>
              <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">Duration</span>
                </div>
                <p className="text-white text-lg font-semibold">
                  {film.duration ? `${film.duration}m` : "-"}
                </p>
              </div>
              <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Star className="w-4 h-4" />
                  <span className="text-xs">Rating</span>
                </div>
                <p className="text-white text-lg font-semibold">{film.rating || "-"}</p>
              </div>
              <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Play className="w-4 h-4" />
                  <span className="text-xs">Views</span>
                </div>
                <p className="text-white text-lg font-semibold">-</p>
              </div>
            </div>

            {/* Description */}
            {film.description && (
              <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{film.description}</p>
              </div>
            )}

            {/* Details */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Creator</span>
                  <div className="flex items-center gap-2">
                    {film.creator?.profilePicture && (
                      <div className="w-5 h-5 rounded-full overflow-hidden relative">
                        <Image 
                          src={film.creator.profilePicture} 
                          alt={film.creator.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                    )}
                    <span className="text-white text-sm font-medium">
                      {film.creator?.name || "Unknown Creator"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Genre</span>
                  <span className="text-white text-sm font-medium">{film.genre}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Upload Date</span>
                  <span className="text-white text-sm font-medium">
                    {formatDateFull(film.createdAt)}
                  </span>
                </div>
                <div className="flex items-start justify-between py-2">
                  <span className="text-gray-400 text-sm">Video URL</span>
                  <a
                    href={film.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
            {film.tags && film.tags.length > 0 && (
              <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {film.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-gray-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Film"
        message={`Are you sure you want to delete "${film.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
