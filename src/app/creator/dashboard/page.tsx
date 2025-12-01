"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Film, Plus, Eye, Edit, Trash, LogOut, User, BarChart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Creator {
  _id: string;
  creatorId: string;
  name: string;
  email: string;
  title?: string;
  bio?: string;
  profilePicture?: string;
  isActive: boolean;
}

interface FilmData {
  _id: string;
  filmId: string;
  title: string;
  posterUrl: string;
  genre?: string;
  views?: string;
  isActive?: boolean;
  createdAt: string;
}

export default function CreatorDashboard() {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [films, setFilms] = useState<FilmData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCreatorData();
  }, []);

  const fetchCreatorData = async () => {
    setIsLoading(true);
    try {
      // Get creator session
      const sessionResponse = await api.get<{ creator: Creator }>("/v2/auth/creator/session");
      const creatorData = sessionResponse.data.creator;
      setCreator(creatorData);

      // Get creator's films
      const filmsResponse = await api.get<FilmData[]>(`/v2/films`);
      const allFilms = filmsResponse.data as FilmData[] || [];
      const myFilms = allFilms.filter((f: any) => f.creatorId === creatorData.creatorId);
      setFilms(myFilms);
    } catch (error) {
      console.error("Failed to fetch creator data:", error);
      router.push("/creator/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/v2/auth/creator/logout");
      router.push("/creator/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteFilm = async (filmId: string) => {
    if (!confirm("Are you sure you want to delete this film?")) return;

    try {
      await api.del(`/v2/films/${filmId}`);
      setFilms(films.filter((f) => f.filmId !== filmId));
      alert("Film deleted successfully!");
    } catch (error) {
      console.error("Failed to delete film:", error);
      alert("Failed to delete film");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!creator) {
    return null;
  }

  const totalViews = films.reduce((sum, film) => {
    const views = parseInt(film.views?.replace(/[<>K]/g, "") || "0");
    return sum + views;
  }, 0);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-secondary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Creator Dashboard</h1>
                <p className="text-xs text-gray-400">{creator.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/creator/profile"
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-gray-400" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border border-secondary/30 rounded-2xl p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-secondary overflow-hidden flex-shrink-0">
              {creator.profilePicture ? (
                <Image
                  src={creator.profilePicture}
                  alt={creator.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                  {creator.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{creator.name}</h2>
              {creator.title && <p className="text-gray-400">{creator.title}</p>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Film className="w-5 h-5 text-primary" />
              <p className="text-gray-400 text-sm">Total Films</p>
            </div>
            <p className="text-3xl font-bold text-white">{films.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <p className="text-gray-400 text-sm">Total Views</p>
            </div>
            <p className="text-3xl font-bold text-white">{totalViews}K+</p>
          </div>
          <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart className="w-5 h-5 text-green-400" />
              <p className="text-gray-400 text-sm">Active Films</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {films.filter((f) => f.isActive !== false).length}
            </p>
          </div>
        </div>

        {/* Films Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Your Films</h3>
            <Link
              href="/films/create"
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Film
            </Link>
          </div>

          {films.length === 0 ? (
            <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-12 text-center">
              <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">No films yet</h4>
              <p className="text-gray-400 mb-6">Start by uploading your first film</p>
              <Link
                href="/films/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Upload Film
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {films.map((film) => (
                <div
                  key={film.filmId}
                  className="bg-[#1a1a1a] border border-secondary rounded-xl overflow-hidden hover:border-primary/50 transition-all"
                >
                  <div className="aspect-[2/3] relative bg-secondary">
                    {film.posterUrl && (
                      <Image
                        src={film.posterUrl}
                        alt={film.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {film.isActive === false && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-full border border-red-500">
                          DISABLED
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-white font-semibold mb-1 truncate">{film.title}</h4>
                    <p className="text-gray-400 text-xs mb-3">{film.genre || "No genre"}</p>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/films/${film.filmId}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <Link
                        href={`/films/${film.filmId}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteFilm(film.filmId)}
                        className="p-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
