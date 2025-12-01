"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Playlist, Film } from "@/types/models";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Film as FilmIcon,
  User,
  Calendar,
  Share2,
  Copy,
  ExternalLink,
  RefreshCw,
  Save,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { formatDateFull, formatDateShort } from "@/lib/date";
import { cn } from "@/lib/utils";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const playlistId = params.playlistId as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    isPublic: false,
    coverImage: "",
  });

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const fetchPlaylist = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Playlist>(`/v2/admin/playlists/${playlistId}`);
      const playlistData = response.data as Playlist;
      setPlaylist(playlistData);
      setEditForm({
        name: playlistData.name,
        description: playlistData.description || "",
        isPublic: playlistData.isPublic,
        coverImage: playlistData.coverImage || "",
      });

      // Fetch film details
      if (playlistData.films && playlistData.films.length > 0) {
        fetchFilms(playlistData.films);
      } else {
        setFilms([]);
      }
    } catch (error) {
      console.error("Failed to fetch playlist:", error);
      toast.error("Failed to load playlist");
      router.push("/playlists");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilms = async (filmIds: string[]) => {
    try {
      // Fetch each film individually
      const filmPromises = filmIds.map((filmId) =>
        api.get<Film>(`/v2/admin/films/${filmId}`).catch(() => null)
      );
      const filmResponses = await Promise.all(filmPromises);
      const filmsData = filmResponses
        .filter((res) => res !== null)
        .map((res) => res!.data as Film);
      setFilms(filmsData);
    } catch (error) {
      console.error("Failed to fetch films:", error);
      setFilms([]);
    }
  };

  const handleSave = async () => {
    if (!playlist) return;

    setIsSaving(true);
    try {
      const response = await api.put<Playlist>(
        `/v2/admin/playlists/${playlistId}`,
        editForm
      );
      setPlaylist(response.data as Playlist);
      setIsEditing(false);
      toast.success("Playlist updated successfully!");
    } catch (error: any) {
      console.error("Failed to update playlist:", error);
      toast.error(error?.message || "Failed to update playlist");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.del(`/v2/admin/playlists/${playlistId}`);
      router.push("/playlists");
    } catch (error: any) {
      console.error("Failed to delete playlist:", error);
      toast.error(error?.message || "Failed to delete playlist");
      setIsDeleting(false);
    }
  };

  const handleGenerateShareCode = async () => {
    try {
      const response = await api.post<Playlist>(
        `/v2/admin/playlists/${playlistId}/share`
      );
      setPlaylist(response.data as Playlist);
    } catch (error: any) {
      console.error("Failed to generate share code:", error);
      toast.error(error?.message || "Failed to generate share code");
    }
  };

  const copyShareCode = () => {
    if (playlist?.shareCode) {
      navigator.clipboard.writeText(playlist.shareCode);
      toast.success("Share code copied to clipboard!");
    }
  };

  const handleRemoveFilm = async (filmId: string) => {
    if (!confirm("Remove this film from the playlist?")) return;

    try {
      await api.del(`/v2/admin/playlists/${playlistId}/films/${filmId}`);
      setFilms(films.filter((f) => f.filmId !== filmId));
      if (playlist) {
        setPlaylist({
          ...playlist,
          films: playlist.films.filter((id) => id !== filmId),
        });
      }
    } catch (error: any) {
      console.error("Failed to remove film:", error);
      alert(error?.message || "Failed to remove film");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!playlist) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => router.push("/playlists")}
              className="p-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-secondary/50 hover:border-primary/50 text-white rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {playlist.name}
              </h1>
              <p className="text-gray-400 text-sm">
                Playlist ID: <span className="font-mono">{playlist.playlistId}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-secondary/50 hover:border-primary/50 text-white rounded-xl transition-all duration-200"
                >
                  <Edit className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-primary/10 border border-secondary/50 hover:border-primary/50 text-primary rounded-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium text-sm">Delete</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/80 text-white rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {isSaving ? "Saving..." : "Save"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: playlist.name,
                      description: playlist.description || "",
                      isPublic: playlist.isPublic,
                      coverImage: playlist.coverImage || "",
                    });
                  }}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-white rounded-xl transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  <span className="font-medium text-sm">Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                <FilmIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Films</p>
                <p className="text-white text-2xl font-bold">
                  {playlist.films?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  playlist.isPublic
                    ? "bg-gradient-to-br from-green-500/20 to-green-500/5"
                    : "bg-gradient-to-br from-gray-500/20 to-gray-500/5"
                )}
              >
                {playlist.isPublic ? (
                  <Eye className="w-6 h-6 text-green-500" />
                ) : (
                  <EyeOff className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-gray-400 text-xs">Visibility</p>
                <p className="text-white text-lg font-bold">
                  {playlist.isPublic ? "Public" : "Private"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Views</p>
                <p className="text-white text-2xl font-bold">
                  {playlist.views?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Created</p>
                <p className="text-white text-sm font-medium">
                  {formatDateShort(playlist.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Details */}
        <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-6">
          {isEditing ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={editForm.coverImage}
                  onChange={(e) =>
                    setEditForm({ ...editForm, coverImage: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={editForm.isPublic}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isPublic: e.target.checked })
                  }
                  className="w-5 h-5 bg-black border-secondary rounded focus:ring-2 focus:ring-primary"
                />
                <label htmlFor="isPublic" className="text-white font-medium">
                  Make playlist public
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Owner</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="text-white font-mono">{playlist.userId}</p>
                </div>
              </div>

              {playlist.description && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Description</p>
                  <p className="text-white">{playlist.description}</p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm mb-1">Created At</p>
                <p className="text-white">{formatDateFull(playlist.createdAt)}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                <p className="text-white">{formatDateFull(playlist.updatedAt)}</p>
              </div>

              {playlist.shareCode ? (
                <div>
                  <p className="text-gray-400 text-sm mb-2">Share Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-2 bg-black border border-secondary rounded-lg text-primary font-mono">
                      {playlist.shareCode}
                    </code>
                    <button
                      onClick={copyShareCode}
                      className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                    >
                      <Copy className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerateShareCode}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Generate Share Code
                </button>
              )}
            </div>
          )}
        </div>

        {/* Films List */}
        <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Films ({films.length})
          </h2>

          {films.length === 0 ? (
            <div className="text-center py-12">
              <FilmIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No films in this playlist</p>
            </div>
          ) : (
            <div className="space-y-3">
              {films.map((film) => (
                <div
                  key={film.filmId}
                  className="flex items-center gap-4 p-4 bg-black border border-secondary/50 rounded-xl hover:border-primary/50 transition-all duration-200 group"
                >
                  <div className="w-16 h-24 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                    {film.posterUrl ? (
                      <img
                        src={film.posterUrl}
                        alt={film.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {film.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{film.releaseYear}</p>
                    <p className="text-gray-500 text-xs font-mono mt-1">
                      {film.filmId}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/films/${film.filmId}`)}
                      className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleRemoveFilm(film.filmId)}
                      className="p-2 bg-secondary hover:bg-primary/10 rounded-lg transition-colors group-hover:opacity-100 opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Playlist"
        message="Are you sure you want to delete this playlist? This action cannot be undone and will remove all associated data."
        confirmText="Delete Playlist"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
