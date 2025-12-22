"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { DashboardMetrics } from "@/types/models";

interface UseMetricsOptions {
  autoFetch?: boolean;
  interval?: number; // Auto-refresh interval in milliseconds
}

export function useMetrics(options: UseMetricsOptions = {}) {
  const { autoFetch = true, interval } = options;
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("[useMetrics] Fetching metrics from:", "/v2/admin/metrics/overview");
      const response = await api.get<DashboardMetrics>("/v2/admin/metrics/overview");
      console.log("[useMetrics] Response:", response);
      
      if (response?.data) {
        console.log("[useMetrics] Setting metrics:", response.data);
        setMetrics(response.data as DashboardMetrics);
      } else {
        console.warn("[useMetrics] No data in response, using defaults");
        // Set default empty metrics if no data
        setMetrics({
          totalUsers: 0,
          totalCreators: 0,
          totalFilms: 0,
          totalPlaylists: 0,
          totalWatchTimeHours: 0,
          avgWatchTimePerUser: 0,
          userGrowth: 0,
          filmGrowth: 0,
          activeUsersLast30Days: 0,
        });
      }
    } catch (err: any) {
      console.error("[useMetrics] Failed to fetch metrics:", err);
      console.error("[useMetrics] Error details:", {
        message: err.message,
        code: err.code,
        details: err.details,
      });
      setError(err.message || "Failed to fetch metrics");
      // Set default empty metrics on error to prevent breaking the UI
      setMetrics({
        totalUsers: 0,
        totalCreators: 0,
        totalFilms: 0,
        totalPlaylists: 0,
        totalWatchTimeHours: 0,
        avgWatchTimePerUser: 0,
        userGrowth: 0,
        filmGrowth: 0,
        activeUsersLast30Days: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchMetrics();
    }
  }, [autoFetch, fetchMetrics]);

  useEffect(() => {
    if (interval && interval > 0) {
      const timer = setInterval(fetchMetrics, interval);
      return () => clearInterval(timer);
    }
  }, [interval, fetchMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
}

export function useUserGrowth(days: number = 30) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<any[]>(`/v2/admin/metrics/user-growth?days=${days}`);
      if (response.data) {
        setData(response.data as any[]);
      }
    } catch (err: any) {
      console.error("Failed to fetch user growth:", err);
      setError(err.message || "Failed to fetch user growth data");
      // Set empty array to prevent UI breakage
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useFilmUploads(months: number = 6) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<any[]>(`/v2/admin/metrics/film-uploads?months=${months}`);
      if (response.data) {
        setData(response.data as any[]);
      }
    } catch (err: any) {
      console.error("Failed to fetch film uploads:", err);
      setError(err.message || "Failed to fetch film upload data");
      // Set empty array to prevent UI breakage
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [months]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function usePopularFilms(limit: number = 10) {
  const [films, setFilms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<any[]>(`/v2/admin/metrics/popular-films?limit=${limit}`);
      if (response.data) {
        setFilms(response.data as any[]);
      }
    } catch (err: any) {
      console.error("Failed to fetch popular films:", err);
      setError(err.message || "Failed to fetch popular films");
      // Return empty array on error to prevent UI breakage
      setFilms([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { films, isLoading, error, refetch: fetchData };
}

export function useGenreDistribution() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<any[]>("/v2/admin/metrics/genres");
      if (response.data) {
        setData(response.data as any[]);
      }
    } catch (err: any) {
      console.error("Failed to fetch genre distribution:", err);
      setError(err.message || "Failed to fetch genre distribution");
      // Set empty array to prevent UI breakage
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useRecentActivities(limit: number = 10) {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<any[]>(`/v2/admin/metrics/activities?limit=${limit}`);
      if (response.data) {
        setActivities(response.data as any[]);
      }
    } catch (err: any) {
      console.error("Failed to fetch activities:", err);
      setError(err.message || "Failed to fetch activities");
      // Set empty array to prevent UI breakage
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { activities, isLoading, error, refetch: fetchData };
}
