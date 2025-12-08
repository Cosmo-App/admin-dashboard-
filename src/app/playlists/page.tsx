"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/DataTable";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Playlist } from "@/types/models";
import {
  List,
  Eye,
  EyeOff,
  Trash2,
  User,
  Film,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Share2,
} from "lucide-react";
import { formatDateShort } from "@/lib/date";
import { cn } from "@/lib/utils";
import ConfirmDialog from "@/components/ConfirmDialog";

type PlaylistFilter = "all" | "public" | "private";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<PlaylistFilter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    filterPlaylists();
  }, [playlists, searchQuery, filter]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Playlist[]>("/v2/admin/playlists");
      const playlistsData = response.data as Playlist[];
      setPlaylists(playlistsData);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPlaylists = () => {
    let filtered = [...playlists];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply visibility filter
    if (filter === "public") {
      filtered = filtered.filter((p) => p.isPublic);
    } else if (filter === "private") {
      filtered = filtered.filter((p) => !p.isPublic);
    }

    setFilteredPlaylists(filtered);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await api.del(`/v2/admin/playlists/${deleteId}`);
      setPlaylists(playlists.filter((p) => p._id !== deleteId));
      setDeleteId(null);
      toast.success("Playlist deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete playlist:", error);
      toast.error(error?.message || "Failed to delete playlist");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Playlist>[] = [
    {
      key: "name",
      label: "Playlist Name",
      sortable: true,
      render: (playlist: Playlist) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
            {playlist.coverImage ? (
              <img
                src={playlist.coverImage}
                alt={playlist.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <List className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{playlist.name}</p>
            {playlist.description && (
              <p className="text-gray-400 text-xs truncate mt-0.5">
                {playlist.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "userId",
      label: "Owner",
      sortable: true,
      render: (playlist: Playlist) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">
            {playlist.ownerName || 'Unknown User'}
          </span>
        </div>
      ),
    },
    {
      key: "films",
      label: "Films",
      sortable: true,
      render: (playlist: Playlist) => (
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-gray-400" />
          <span className="text-white font-medium">{playlist.films?.length || 0}</span>
        </div>
      ),
    },
    {
      key: "views",
      label: "Views",
      sortable: true,
      render: (playlist: Playlist) => (
        <span className="text-white">{(playlist.views || 0).toLocaleString()}</span>
      ),
    },
    {
      key: "isPublic",
      label: "Visibility",
      sortable: true,
      render: (playlist: Playlist) => (
        <div className="flex items-center gap-2">
          {playlist.isPublic ? (
            <>
              <Eye className="w-4 h-4 text-green-500" />
              <span className="text-green-500 text-sm font-medium">Public</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm font-medium">Private</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: "shareCode",
      label: "Share Code",
      render: (playlist: Playlist) =>
        playlist.shareCode ? (
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-mono">{playlist.shareCode}</span>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">—</span>
        ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (playlist: Playlist) => formatDateShort(playlist.createdAt),
    },
  ];

  // Actions function for DataTable - returns action buttons for each playlist
  const renderActions = (playlist: Playlist) => (
    <div className="flex gap-2">
      <button
        onClick={() => router.push(`/playlists/${playlist.playlistId}`)}
        className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 text-white rounded transition-colors"
      >
        View Details
      </button>
      <button
        onClick={() => setDeleteId(playlist._id)}
        className="px-3 py-1.5 text-sm hover:bg-primary/10 text-primary rounded transition-colors flex items-center gap-1.5"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );

  // Statistics
  const stats = {
    total: playlists.length,
    public: playlists.filter((p) => p.isPublic).length,
    private: playlists.filter((p) => !p.isPublic).length,
    totalFilms: playlists.reduce((acc, p) => acc + (p.films?.length || 0), 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Playlists Management
            </h1>
            <p className="text-gray-400 text-sm">
              Manage user playlists and watchlists
            </p>
          </div>
          <button
            onClick={fetchPlaylists}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-secondary/50 hover:border-primary/50 text-white rounded-xl transition-all duration-200 shadow-lg shadow-black/20 group disabled:opacity-50"
          >
            <RefreshCw
              className={cn(
                "w-4 h-4 text-primary transition-transform duration-500",
                isLoading && "animate-spin"
              )}
            />
            <span className="font-medium text-sm">Refresh</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                <List className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Playlists</p>
                <p className="text-white text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Public</p>
                <p className="text-white text-2xl font-bold">{stats.public}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500/20 to-gray-500/5 rounded-xl flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Private</p>
                <p className="text-white text-2xl font-bold">{stats.private}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5 shadow-xl shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Films</p>
                <p className="text-white text-2xl font-bold">{stats.totalFilms}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-5 shadow-xl shadow-black/20">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search playlists by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black border border-secondary rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2",
                  filter === "all"
                    ? "bg-primary text-white"
                    : "bg-secondary text-gray-400 hover:text-white"
                )}
              >
                <Filter className="w-4 h-4" />
                All
              </button>
              <button
                onClick={() => setFilter("public")}
                className={cn(
                  "px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2",
                  filter === "public"
                    ? "bg-green-500 text-white"
                    : "bg-secondary text-gray-400 hover:text-white"
                )}
              >
                <Eye className="w-4 h-4" />
                Public
              </button>
              <button
                onClick={() => setFilter("private")}
                className={cn(
                  "px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2",
                  filter === "private"
                    ? "bg-gray-600 text-white"
                    : "bg-secondary text-gray-400 hover:text-white"
                )}
              >
                <EyeOff className="w-4 h-4" />
                Private
              </button>
            </div>
          </div>
        </div>

        {/* Playlists Table */}
        <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
          <DataTable
            data={filteredPlaylists}
            columns={columns}
            keyField="playlistId"
            actions={renderActions}
            isLoading={isLoading}
            emptyMessage="No playlists found"
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Playlist"
        message="Are you sure you want to delete this playlist? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
