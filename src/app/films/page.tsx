"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import { api } from "@/lib/api";
import { Film } from "@/types/models";
import { Plus, Eye, Edit, Trash, Film as FilmIcon } from "lucide-react";
import { formatDateShort } from "@/lib/date";
import Image from "next/image";

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; film: Film | null }>({
    isOpen: false,
    film: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/v2/films");
      setFilms(response.data || []);
    } catch (error) {
      console.error("Failed to fetch films:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.film) return;

    setIsDeleting(true);
    try {
      await api.del(`/v2/films/${deleteDialog.film.filmId}`);
      setFilms(films.filter((f) => f.filmId !== deleteDialog.film?.filmId));
      setDeleteDialog({ isOpen: false, film: null });
    } catch (error: any) {
      console.error("Failed to delete film:", error);
      alert(error.response?.data?.error || "Failed to delete film");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      key: "posterUrl",
      label: "Poster",
      render: (film: Film) => (
        <div className="w-12 h-16 bg-secondary rounded overflow-hidden relative">
          {film.posterUrl ? (
            <Image src={film.posterUrl} alt={film.title} fill className="object-cover" sizes="48px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FilmIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (film: Film) => (
        <div>
          <p className="font-medium">{film.title}</p>
          {film.genre && <p className="text-xs text-gray-400 mt-0.5">{film.genre}</p>}
        </div>
      ),
    },
    {
      key: "creatorId",
      label: "Creator",
      sortable: true,
      render: (film: Film) => (
        <span className="text-gray-400">{film.creatorId?.name || "Unknown"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Upload Date",
      sortable: true,
      render: (film: Film) => (
        <span className="text-gray-400">{formatDateShort(new Date(film.createdAt))}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (film: Film) => (
        <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
          Active
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">Films</h1>
            <p className="text-gray-400 text-sm">Manage all films on the platform</p>
          </div>
          <button
            onClick={() => router.push("/films/create")}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Film</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Films</p>
            <p className="text-white text-2xl font-bold">{films.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Active</p>
            <p className="text-white text-2xl font-bold">{films.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">This Month</p>
            <p className="text-white text-2xl font-bold">
              {films.filter((f) => {
                const date = new Date(f.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Views</p>
            <p className="text-white text-2xl font-bold">-</p>
          </div>
        </div>

        {/* Films Table */}
        <DataTable
          data={films}
          columns={columns}
          keyField="filmId"
          isLoading={isLoading}
          searchPlaceholder="Search films by title, creator..."
          onRowClick={(film) => router.push(`/films/${film.filmId}`)}
          actions={(film) => (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/films/${film.filmId}`);
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/films/${film.filmId}/edit`);
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4 text-blue-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDialog({ isOpen: true, film });
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Delete"
              >
                <Trash className="w-4 h-4 text-primary" />
              </button>
            </>
          )}
          emptyMessage="No films found. Click 'Add Film' to create one."
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, film: null })}
        onConfirm={handleDelete}
        title="Delete Film"
        message={`Are you sure you want to delete "${deleteDialog.film?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
