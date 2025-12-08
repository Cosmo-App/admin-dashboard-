"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCreatorAuth } from "@/context/CreatorAuthContext";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { Film, Plus, Eye, Edit, Trash, LogOut, User, BarChart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface FilmData {
  _id: string;
  filmId: string;
  title: string;
  posterUrl: string;
  genre?: string;
  views?: number;
  isActive?: boolean;
  createdAt: string;
  creatorId?: string;
}

export default function CreatorDashboard() {
  const { creator, logout, isLoading: authLoading, refreshSession } = useCreatorAuth();
  const toast = useToast();
  const [films, setFilms] = useState<FilmData[]>([]);
  const [isLoadingFilms, setIsLoadingFilms] = useState(false);
  const router = useRouter();

  // Debug logs
  useEffect(() => {
    console.log('[CreatorDashboard] Component mounted');
    console.log('[CreatorDashboard] authLoading:', authLoading);
    console.log('[CreatorDashboard] creator:', creator);
  }, [authLoading, creator]);

  const fetchFilms = useCallback(async () => {
    if (!creator) {
      console.log('[CreatorDashboard] No creator, skipping film fetch');
      return;
    }
    
    setIsLoadingFilms(true);
    try {
      // Get creator's films
      console.log('[CreatorDashboard] Fetching films for creator:', creator.email);
      const filmsResponse = await api.get<FilmData[]>(`/v2/films`);
      
      // Handle response structure: { message, data: [...], success }
      const filmsList = filmsResponse.data?.data || filmsResponse.data || [];
      const allFilms = Array.isArray(filmsList) ? filmsList : [];
      
      const myFilms = allFilms.filter((f: any) => f.creatorId === creator.creatorId);
      console.log('[CreatorDashboard] Found films:', myFilms.length);
      setFilms(myFilms);
    } catch (error) {
      console.error("Failed to fetch films:", error);
      toast.error("Failed to load films");
    } finally {
      setIsLoadingFilms(false);
    }
  }, [creator, toast]);

  // Fetch films when creator is available
  useEffect(() => {
    if (creator && !authLoading) {
      console.log('[CreatorDashboard] Creator loaded, fetching films...');
      fetchFilms();
    }
  }, [creator?._id, authLoading, fetchFilms]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const handleDeleteFilm = async (filmId: string) => {
    if (!confirm("Are you sure you want to delete this film?")) return;

    try {
      await api.del(`/v2/films/${filmId}`);
      setFilms(films.filter((f) => f.filmId !== filmId));
      toast.success("Film deleted successfully!");
    } catch (error) {
      console.error("Failed to delete film:", error);
      toast.error("Failed to delete film");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If not loading but no creator, show error
  if (!authLoading && !creator) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <Film className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Session Error</h2>
            <p className="text-gray-400 text-sm mb-4">Unable to load your creator session</p>
            <Link
              href="/creator/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalViews = films.reduce((sum, film) => {
    return sum + (film.views || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-secondary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Film className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-white truncate">Creator Dashboard</h1>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate hidden sm:block">{creator.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/creator/profile"
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Profile"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div className="relative bg-gradient-to-br from-primary/20 via-[#1a1a1a] to-[#0a0a0a] border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-primary to-blue-500 overflow-hidden flex-shrink-0 border-2 sm:border-4 border-primary/20 shadow-xl shadow-primary/20">
                {creator.profilePicture ? (
                  <Image
                    src={creator.profilePicture}
                    alt={creator.name}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {creator.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">{creator.name}</h2>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary/20 text-primary text-[10px] sm:text-xs font-semibold rounded-full border border-primary/30 whitespace-nowrap">Creator</span>
                </div>
                {creator.title && <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-0.5 sm:mb-1 truncate">{creator.title}</p>}
                {creator.bio && <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 sm:line-clamp-2">{creator.bio}</p>}
              </div>
            </div>
            <Link
              href="/creator/profile"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg sm:rounded-xl transition-all font-medium shadow-lg hover:shadow-primary/20 text-center text-sm sm:text-base whitespace-nowrap"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="group bg-gradient-to-br from-primary/10 to-[#1a1a1a] border border-primary/30 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
                <Film className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="text-primary/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Total</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{films.length}</p>
            <p className="text-gray-400 text-xs sm:text-sm">Films Published</p>
          </div>
          <div className="group bg-gradient-to-br from-blue-500/10 to-[#1a1a1a] border border-blue-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <span className="text-blue-400/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Views</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
              {totalViews >= 1000 ? `${Math.floor(totalViews / 1000)}K+` : totalViews}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">Total Impressions</p>
          </div>
          <div className="group bg-gradient-to-br from-green-500/10 to-[#1a1a1a] border border-green-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <span className="text-green-400/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Active</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
              {films.filter((f) => f.isActive !== false).length}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">Live on Platform</p>
          </div>
        </div>

        {/* Films Section */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Your Films</h3>
            <Link
              href="/creator/films/create"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Add New Film
            </Link>
          </div>

          {isLoadingFilms ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#1a1a1a] border border-secondary rounded-lg sm:rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[2/3] bg-secondary"></div>
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-secondary rounded w-3/4"></div>
                    <div className="h-2 sm:h-3 bg-secondary/50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : films.length === 0 ? (
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-secondary/50 rounded-xl sm:rounded-2xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Film className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">No films yet</h4>
                <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto px-4">Start your creative journey by uploading your first film to the platform</p>
                <Link
                  href="/creator/films/create"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white rounded-lg sm:rounded-xl transition-all font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upload Your First Film
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {films.map((film) => (
                <div
                  key={film.filmId}
                  className="group bg-[#1a1a1a] border border-secondary rounded-lg sm:rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
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
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-500/20 text-red-500 text-[10px] sm:text-xs font-bold rounded-full border border-red-500">
                          DISABLED
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-3 lg:p-4">
                    <h4 className="text-white font-semibold text-sm sm:text-base mb-0.5 sm:mb-1 truncate">{film.title}</h4>
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-2 sm:mb-3 truncate">{film.genre || "No genre"}</p>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Link
                        href={`/creator/films/${film.filmId}`}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-secondary hover:bg-secondary/80 text-white rounded-md sm:rounded-lg text-[10px] sm:text-sm transition-colors"
                        title="View/Edit"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteFilm(film.filmId)}
                        className="p-1.5 sm:p-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md sm:rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash className="w-3 h-3 sm:w-4 sm:h-4" />
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
