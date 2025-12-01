"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
import { Users, Film, UserCircle, List, Clock, TrendingUp } from "lucide-react";
import { RefreshCw } from "lucide-react";

export default function HomePage() {
  const { metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useMetrics({
    autoFetch: true,
    interval: 60000, // Refresh every minute
  });
  const { data: userGrowthData, isLoading: userGrowthLoading } = useUserGrowth(30);
  const { data: filmUploadsData, isLoading: filmUploadsLoading } = useFilmUploads(6);
  const { data: genreData, isLoading: genreLoading } = useGenreDistribution();
  const { activities, isLoading: activitiesLoading } = useRecentActivities(10);
  const { films: popularFilms, isLoading: popularFilmsLoading } = usePopularFilms(10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-gray-400 text-sm">
              Monitor your platform's performance and user activity
            </p>
          </div>
          <button
            onClick={refetchMetrics}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">User Growth (30 days)</h3>
            <UserGrowthChart data={userGrowthData} isLoading={userGrowthLoading} height={300} />
          </div>

          {/* Film Uploads Chart */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Film Uploads (6 months)</h3>
            <FilmUploadsChart data={filmUploadsData} isLoading={filmUploadsLoading} height={300} />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Genre Distribution */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Genre Distribution</h3>
            <GenreDistributionChart data={genreData} isLoading={genreLoading} height={300} />
          </div>

          {/* Popular Films */}
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Top Films</h3>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <PopularFilmsList films={popularFilms} isLoading={popularFilmsLoading} limit={10} />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
            <ActivityFeed activities={activities} isLoading={activitiesLoading} limit={20} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
