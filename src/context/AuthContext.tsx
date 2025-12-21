"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/api";
import { Admin } from "@/types/models";
import { SESSION_COOKIE_NAME } from "@/lib/constants";

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateAdmin: (admin: Admin) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const fetchingRef = useRef(false); // Prevent concurrent fetches
  const lastFetchRef = useRef<number>(0); // Track last fetch time

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }, []);

  // Fetch current session with caching
  const fetchSession = useCallback(async (force: boolean = false) => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return;
    
    // Cache for 30 seconds unless forced
    const now = Date.now();
    if (!force && now - lastFetchRef.current < 30000) {
      setIsLoading(false);
      return;
    }

    fetchingRef.current = true;
    
    try {
      const token = Cookies.get(SESSION_COOKIE_NAME);
      
      if (!token) {
        setAdmin(null);
        setIsLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        // Try to refresh token
        await refreshToken();
        return;
      }

      const response = await api.get<{ admin: Admin }>("/v2/auth/admin/session");
      if (response?.data?.admin) {
        setAdmin(response.data.admin);
        lastFetchRef.current = now;
      } else {
        setAdmin(null);
        Cookies.remove(SESSION_COOKIE_NAME);
      }
    } catch (error: any) {
      console.error("Failed to fetch session:", error);
      setAdmin(null);
      Cookies.remove(SESSION_COOKIE_NAME);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, [isTokenExpired]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post<{ admin: Admin; token: string }>("/v2/auth/admin/refresh");
      if (response?.data?.admin) {
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      setAdmin(null);
      Cookies.remove(SESSION_COOKIE_NAME);
      router.push("/login");
    }
  }, [router]);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Attempting login for:', email);
      const response = await api.post<{ admin: Admin; token: string }>("/v2/auth/admin/login", { email, password });
      
      console.log('[AuthContext] Login response:', response);
      console.log('[AuthContext] Response structure:', {
        hasResponse: !!response,
        hasData: !!response?.data,
        hasAdmin: !!response?.data?.admin,
        hasToken: !!response?.data?.token,
        dataKeys: response?.data ? Object.keys(response.data) : [],
      });

      if (response?.data?.admin && response?.data?.token) {
        console.log('[AuthContext] Setting admin:', response.data.admin.email);
        setAdmin(response.data.admin);
        // Cookie is set by backend, but we can also set it client-side for immediate access
        Cookies.set(SESSION_COOKIE_NAME, response.data.token, {
          expires: 1, // 1 day
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
        console.log('[AuthContext] Login successful, redirecting to dashboard');
        router.push("/");
      } else {
        console.error('[AuthContext] Invalid response structure:', response);
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("[AuthContext] Login failed:", error);
      console.error("[AuthContext] Error details:", {
        message: error?.message,
        response: error?.response,
        data: error?.response?.data,
        hasDetails: !!error?.details,
      });
      throw error;
    }
  }, [router]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post("/v2/auth/admin/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setAdmin(null);
      Cookies.remove(SESSION_COOKIE_NAME);
      router.push("/login");
    }
  }, [router]);

  // Refresh session (manual) - force refetch
  const refreshSession = useCallback(async () => {
    await fetchSession(true);
  }, [fetchSession]);

  // Update admin data (for profile updates)
  const updateAdmin = useCallback((updatedAdmin: Admin) => {
    setAdmin(updatedAdmin);
  }, []);

  // Initialize session on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!admin) return;

    const token = Cookies.get(SESSION_COOKIE_NAME);
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const expiresIn = decoded.exp * 1000 - Date.now();
      
      // Refresh 5 minutes before expiration
      const refreshTime = expiresIn - 5 * 60 * 1000;
      
      if (refreshTime > 0) {
        const timer = setTimeout(() => {
          refreshToken();
        }, refreshTime);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }, [admin, refreshToken]);

  const value: AuthContextType = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
    refreshSession,
    updateAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
