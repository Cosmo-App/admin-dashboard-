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
      const response = await api.get<{ admin: Admin }>("/v2/auth/admin/session");
      
      if (response?.data?.admin) {
        setAdmin(response.data.admin);
        lastFetchRef.current = now;
      } else {
        setAdmin(null);
      }
    } catch (error: any) {
      setAdmin(null);
      Cookies.remove(SESSION_COOKIE_NAME);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, []);

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
      const response = await api.post<{ admin: Admin; token: string }>("/v2/auth/admin/login", { email, password });

      if (response?.data?.admin && response?.data?.token) {
        setAdmin(response.data.admin);
        
        // Backend sets httpOnly cookie - browser automatically includes it with withCredentials: true
        
        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/dashboard';
        
        router.push(redirectTo);
      } else {
        console.error('[AuthContext] Invalid response structure:', response);
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      throw error;
    }
  }, [router]);

  // Logout
  const logout = useCallback(async () => {
    // Clear client-side state and cookies FIRST
    setAdmin(null);
    
    // Clear cookie with all possible configurations to ensure removal
    Cookies.remove(SESSION_COOKIE_NAME);
    Cookies.remove(SESSION_COOKIE_NAME, { path: '/' });
    Cookies.remove(SESSION_COOKIE_NAME, { path: '/', domain: window.location.hostname });
    
    // Also clear from document.cookie as fallback
    document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    try {
      // Call backend logout to clear server-side cookie (non-blocking)
      await api.post("/v2/auth/admin/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    }
    
    // Small delay to ensure cookies are cleared before redirect
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  }, []);

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
