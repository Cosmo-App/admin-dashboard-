"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import MetricCard from "@/components/MetricCard";
import {
  UserGrowthChart,
  FilmUploadsChart,
  GenreDistributionChart,
} from "@/components/Charts";
import ActivityFeed from "@/components/ActivityFeed";
import PopularFilmsList from "@/components/PopularFilmsList";
import {
  useMetrics,
  useUserGrowth,
  useFilmUploads,
  useGenreDistribution,
  useRecentActivities,
  usePopularFilms,
} from "@/hooks/useMetrics";
import { Users, Film, UserCircle, List, Clock, TrendingUp, RefreshCw, ArrowRight, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const { admin } = useAuth();
  const { metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useMetrics({
    autoFetch: true,
    interval: 120000, // Refresh every 2 minutes (reduced frequency)
  });
  const { data: userGrowthData, isLoading: userGrowthLoading } = useUserGrowth(30);
  const { data: filmUploadsData, isLoading: filmUploadsLoading } = useFilmUploads(6);
  const { data: genreData, isLoading: genreLoading } = useGenreDistribution();
  const { activities, isLoading: activitiesLoading } = useRecentActivities(10);
  const { films: popularFilms, isLoading: popularFilmsLoading } = usePopularFilms(10);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="space-y-8 pb-8">{/* Welcome Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a] border border-secondary/30 p-8 md:p-10 shadow-2xl shadow-black/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none animate-pulse" style={{animationDelay: "1s"}}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider border border-primary/20">
                  Admin Dashboard
                </span>
                <span className="text-gray-500 text-xs font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
                {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{admin?.name?.split(' ')[0] || 'Admin'}</span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg max-w-xl">
                Here's what's happening on Cosmic today. You have <span className="text-white font-semibold">{metrics?.activeUsersLast30Days || 0} active users</span> in the last 30 days.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/films/create"
                className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 font-medium"
              >
                <Plus className="w-5 h-5" />
                Add New Film
              </Link>
              <button
                onClick={refetchMetrics}
                className="flex items-center gap-2 px-5 py-3 bg-[#252525] hover:bg-[#303030] text-white rounded-xl transition-all duration-200 border border-white/5 hover:border-white/10 font-medium group"
              >
                <RefreshCw className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <MetricCard
            title="Total Users"
            value={metrics?.totalUsers || 0}
            change={metrics?.userGrowth}
            icon={Users}
            format="compact"
            isLoading={metricsLoading}
          />
          <MetricCard
            title="Total Films"
            value={metrics?.totalFilms || 0}
            change={metrics?.filmGrowth}
            icon={Film}
            format="compact"
            isLoading={metricsLoading}
          />
          <MetricCard
            title="Total Creators"
            value={metrics?.totalCreators || 0}
            change={0}
            icon={UserCircle}
            format="compact"
            isLoading={metricsLoading}
          />
          <MetricCard
            title="Total Playlists"
            value={metrics?.totalPlaylists || 0}
            change={0}
            icon={List}
            format="compact"
            isLoading={metricsLoading}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <MetricCard
            title="Total Watch Time"
            value={metrics?.totalWatchTimeHours || 0}
            icon={Clock}
            format="time"
            suffix="hrs"
            isLoading={metricsLoading}
          />
          <MetricCard
            title="Avg. Watch Time/User"
            value={metrics?.avgWatchTimePerUser || 0}
            icon={TrendingUp}
            format="time"
            suffix="min"
            isLoading={metricsLoading}
          />
          <MetricCard
            title="Active Users (30d)"
            value={metrics?.activeUsersLast30Days || 0}
            icon={Users}
            format="compact"
            isLoading={metricsLoading}
          />
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-primary rounded-full" />
                  User Growth
                </h3>
                <span className="text-xs font-medium text-gray-500 bg-secondary/30 px-3 py-1 rounded-full border border-white/5">Last 30 Days</span>
              </div>
              <UserGrowthChart data={userGrowthData} isLoading={userGrowthLoading} height={300} />
            </div>
          </div>

          {/* Film Uploads */}
          <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-6 shadow-xl shadow-black/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-500 rounded-full" />
                  Film Uploads
                </h3>
                <span className="text-xs font-medium text-gray-500 bg-secondary/30 px-3 py-1 rounded-full border border-white/5">Last 6 Months</span>
              </div>
              <FilmUploadsChart data={filmUploadsData} isLoading={filmUploadsLoading} height={300} />
            </div>
          </div>
        </div>

        {/* Content & Activity Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column: Genre & Popular Films */}
          <div className="xl:col-span-2 space-y-6">
            {/* Genre Distribution */}
            <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-6 shadow-xl shadow-black/20">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded-full" />
                Genre Distribution
              </h3>
              <GenreDistributionChart data={genreData} isLoading={genreLoading} height={300} />
            </div>

            {/* Popular Films */}
            <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-6 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-yellow-500 rounded-full" />
                  Top Performing Films
                </h3>
                <Link href="/films" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium group">
                  View All Films
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <div className="min-h-[300px]">
                <PopularFilmsList films={popularFilms} isLoading={popularFilmsLoading} limit={5} />
              </div>
            </div>
          </div>

          {/* Right Column: Activity Feed */}
          <div className="xl:col-span-1">
            <div className="bg-[#0f0f0f] border border-secondary/30 rounded-2xl p-6 shadow-xl shadow-black/20 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-green-500 rounded-full" />
                  Recent Activity
                </h3>
                <button className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <ActivityFeed activities={activities} isLoading={activitiesLoading} limit={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
}
