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
      const response = await api.get("/v2/admin/metrics/overview");
      if (response.data) {
        setMetrics(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch metrics:", err);
      setError(err.message || "Failed to fetch metrics");
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
      const response = await api.get(`/v2/admin/metrics/user-growth?days=${days}`);
      if (response.data) {
        setData(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch user growth:", err);
      setError(err.message || "Failed to fetch user growth data");
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
      const response = await api.get(`/v2/admin/metrics/film-uploads?months=${months}`);
      if (response.data) {
        setData(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch film uploads:", err);
      setError(err.message || "Failed to fetch film upload data");
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
      const response = await api.get(`/v2/admin/metrics/popular-films?limit=${limit}`);
      if (response.data) {
        setFilms(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch popular films:", err);
      setError(err.message || "Failed to fetch popular films");
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
      const response = await api.get("/v2/admin/metrics/genres");
      if (response.data) {
        setData(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch genre distribution:", err);
      setError(err.message || "Failed to fetch genre distribution");
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
      const response = await api.get(`/v2/admin/metrics/activities?limit=${limit}`);
      if (response.data) {
        setActivities(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch activities:", err);
      setError(err.message || "Failed to fetch activities");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { activities, isLoading, error, refetch: fetchData };
}
