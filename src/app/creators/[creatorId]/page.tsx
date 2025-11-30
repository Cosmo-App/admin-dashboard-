"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { api } from "@/lib/api";
import { Creator, Film } from "@/types/models";
import { ArrowLeft, Edit, Film as FilmIcon, Eye, Heart, ExternalLink } from "lucide-react";
import { formatDateFull, formatDateShort } from "@/lib/date";
import Image from "next/image";

export default function ViewCreatorPage() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const creatorId = params.creatorId as string;

  useEffect(() => {
    if (creatorId) {
      fetchCreator();
      fetchCreatorFilms();
    }
  }, [creatorId]);

  const fetchCreator = async () => {
    try {
      const response = await api.get(`/v2/creators/${creatorId}`);
      setCreator(response.data);
    } catch (error) {
      console.error("Failed to fetch creator:", error);
      router.push("/creators");
    }
  };

  const fetchCreatorFilms = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/v2/films?creatorId=${creatorId}`);
      setFilms(response.data);
    } catch (error) {
      console.error("Failed to fetch films:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!creator) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  const filmColumns = [
    {
      key: "poster",
      label: "Poster",
      render: (film: Film) => (
        <div className="w-12 h-16 bg-secondary rounded overflow-hidden relative">
          {film.posterUrl ? (
            <Image src={film.posterUrl} alt={film.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FilmIcon className="w-4 h-4 text-gray-500" />
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
          <p className="text-white font-medium">{film.title}</p>
          <p className="text-gray-400 text-xs">{film.genre}</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Upload Date",
      sortable: true,
      render: (film: Film) => formatDateShort(new Date(film.createdAt)),
    },
    {
      key: "actions",
      label: "Actions",
      render: (film: Film) => (
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
      ),
    },
  ];

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
              <h1 className="text-white text-3xl font-bold">{creator.name}</h1>
              <p className="text-gray-400 text-sm mt-1">
                Joined {formatDateFull(new Date(creator.createdAt))}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(`/creators/${creatorId}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Creator
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile */}
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <div className="aspect-square w-full bg-secondary rounded-lg overflow-hidden relative mb-4">
                {creator.profilePicture ? (
                  <Image
                    src={creator.profilePicture}
                    alt={creator.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold">
                    {creator.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-bold mb-2">{creator.name}</h3>
                {creator.donateLink && (
                  <a
                    href={creator.donateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
                  >
                    <Heart className="w-4 h-4" />
                    Support Creator
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <FilmIcon className="w-4 h-4" />
                    Total Films
                  </span>
                  <span className="text-white font-semibold">{films.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Total Views
                  </span>
                  <span className="text-white font-semibold">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Total Likes
                  </span>
                  <span className="text-white font-semibold">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details & Films */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {creator.bio && (
              <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
                <h3 className="text-white text-lg font-semibold mb-3">Bio</h3>
                <p className="text-gray-300 leading-relaxed">{creator.bio}</p>
              </div>
            )}

            {/* Account Info */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Creator ID</span>
                  <span className="text-white text-sm font-mono">{creator.creatorId}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Name</span>
                  <span className="text-white text-sm font-medium">{creator.name}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Joined Date</span>
                  <span className="text-white text-sm font-medium">
                    {formatDateFull(new Date(creator.createdAt))}
                  </span>
                </div>
                <div className="flex items-start justify-between py-2">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span
                    className={`text-sm font-medium ${
                      creator.isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {creator.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Films */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <FilmIcon className="w-5 h-5 text-primary" />
                Films ({films.length})
              </h3>
              <DataTable
                data={films}
                columns={filmColumns}
                searchPlaceholder="Search films..."
                emptyMessage="No films found."
                isLoading={isLoading}
                onRowClick={(film) => router.push(`/films/${film.filmId}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
