"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import { api } from "@/lib/api";
import { Film } from "@/types/models";
import { Plus, Eye, Edit, Trash, Film as FilmIcon, Power } from "lucide-react";
import { formatDateShort } from "@/lib/date";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function FilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; film: Film | null }>({
    isOpen: false,
    film: null,
  });
  const [toggleDialog, setToggleDialog] = useState<{ isOpen: boolean; film: Film | null }>({
    isOpen: false,
    film: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();
  const { admin } = useAuth();

  const roleName = admin?.role || (typeof admin?.assignedRoleId === 'string' 
    ? admin.assignedRoleId 
    : admin?.assignedRoleId?.name) || "";
  const isCreator = roleName === "CREATOR";

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Film[]>("/v2/films");
      setFilms(response.data as Film[] || []);
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

  const handleToggleStatus = async () => {
    if (!toggleDialog.film) return;

    setIsToggling(true);
    try {
      const response = await api.patch<Film>(`/v2/films/${toggleDialog.film.filmId}/toggle-status`);
      // Update the film in the list
      setFilms(films.map((f) => 
        f.filmId === toggleDialog.film?.filmId 
          ? { ...f, isActive: response.data?.isActive ?? !f.isActive }
          : f
      ));
      setToggleDialog({ isOpen: false, film: null });
    } catch (error: any) {
      console.error("Failed to toggle film status:", error);
      alert(error.response?.data?.error || "Failed to toggle film status");
    } finally {
      setIsToggling(false);
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
      key: "creator",
      label: "Creator",
      sortable: true,
      render: (film: Film) => (
        <div className="flex items-center gap-2">
          {film.creator?.profilePicture ? (
            <div className="w-6 h-6 rounded-full overflow-hidden relative">
              <Image 
                src={film.creator.profilePicture} 
                alt={film.creator.name} 
                fill 
                className="object-cover" 
              />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-gray-400">
              {film.creator?.name?.charAt(0) || "?"}
            </div>
          )}
          <span className="text-gray-300 font-medium">
            {film.creator?.name || "Unknown Creator"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Upload Date",
      sortable: true,
      render: (film: Film) => (
        <span className="text-gray-400">{formatDateShort(film.createdAt)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (film: Film) => (
        <span className={`px-2 py-1 ${
          film.isActive !== false ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
        } text-xs rounded-full`}>
          {film.isActive !== false ? 'Active' : 'Disabled'}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1">Films</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Manage all films on the platform</p>
          </div>
          <button
            onClick={() => router.push("/films/create")}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">Add Film</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Films</p>
            <p className="text-white text-xl sm:text-2xl font-bold">{films.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Active</p>
            <p className="text-white text-xl sm:text-2xl font-bold">{films.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">This Month</p>
            <p className="text-white text-xl sm:text-2xl font-bold">
              {films.filter((f) => {
                const date = new Date(f.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Views</p>
            <p className="text-white text-xl sm:text-2xl font-bold">-</p>
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
              
              {isCreator ? (
                // Creators can edit their films
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
              ) : (
                // Admins can only disable/enable films
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setToggleDialog({ isOpen: true, film });
                  }}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  title={film.isActive !== false ? "Disable Film" : "Enable Film"}
                >
                  <Power className={`w-4 h-4 ${film.isActive !== false ? 'text-yellow-400' : 'text-green-400'}`} />
                </button>
              )}
              
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

      {/* Toggle Status Confirmation */}
      <ConfirmDialog
        isOpen={toggleDialog.isOpen}
        onClose={() => setToggleDialog({ isOpen: false, film: null })}
        onConfirm={handleToggleStatus}
        title={toggleDialog.film?.isActive !== false ? "Disable Film" : "Enable Film"}
        message={`Are you sure you want to ${
          toggleDialog.film?.isActive !== false ? 'disable' : 'enable'
        } "${toggleDialog.film?.title}"?`}
        confirmText={toggleDialog.film?.isActive !== false ? "Disable" : "Enable"}
        variant={toggleDialog.film?.isActive !== false ? "warning" : "info"}
        isLoading={isToggling}
      />
    </DashboardLayout>
  );
}
