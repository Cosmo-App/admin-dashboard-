"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/api";

const CREATOR_COOKIE_NAME = "cosmic_creator_token";

interface Creator {
  _id: string;
  creatorId: string;
  name: string;
  email: string;
  title?: string;
  bio?: string;
  profilePicture?: string;
  coverPhoto?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface CreatorAuthContextType {
  creator: Creator | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  title?: string;
  bio?: string;
}

const CreatorAuthContext = createContext<CreatorAuthContextType | undefined>(undefined);

export function CreatorAuthProvider({ children }: { children: React.ReactNode }) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  // Fetch current session
  const fetchSession = useCallback(async () => {
    try {
      console.log('[CreatorAuth] fetchSession called');
      // Backend cookie is HttpOnly, so we can't check it here
      // Just try to fetch the session and let the backend validate
      
      console.log('[CreatorAuth] Fetching session from backend...');
      const response = await api.get("/v2/auth/creator/session");
      console.log('[CreatorAuth] Session response:', response);
      
      // Backend wraps response in { message, data, success }
      const responseData = response?.data?.data || response?.data;
      
      if (responseData?.creator) {
        console.log('[CreatorAuth] Session found for:', responseData.creator.email);
        setCreator(responseData.creator);
      } else {
        console.log('[CreatorAuth] No session found in response');
        setCreator(null);
      }
    } catch (error: any) {
      console.error("[CreatorAuth] Failed to fetch creator session:", error);
      console.log('[CreatorAuth] Error details:', error.response?.status, error.response?.data);
      setCreator(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('[CreatorAuth] Attempting login for:', email);
      const response = await api.post("/v2/auth/creator/login", { 
        email, 
        password 
      });

      console.log('[CreatorAuth] Full login response:', response);
      
      if (!response || !response.data) {
        throw new Error("No response from server");
      }
      
      // Backend wraps response in { message, data, success }
      const responseData = response.data.data || response.data;
      console.log('[CreatorAuth] Parsed response data:', responseData);
      
      if (responseData?.creator && responseData?.token) {
        console.log('[CreatorAuth] Setting creator:', responseData.creator.email);
        // Backend sets HttpOnly cookie via Set-Cookie header
        // We just update the state here
        setCreator(responseData.creator);
        console.log('[CreatorAuth] Creator authenticated, cookie set by backend');
      } else {
        console.error('[CreatorAuth] Invalid response structure:', responseData);
        throw new Error("Invalid response from server. Please try again.");
      }
    } catch (error: any) {
      console.error("[CreatorAuth] Login failed:", error);
      throw error;
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    try {
      console.log('[CreatorAuth] Attempting registration for:', data.email);
      const response = await api.post("/v2/auth/creator/register", data);

      console.log('[CreatorAuth] Full registration response:', response);
      
      if (!response || !response.data) {
        throw new Error("No response from server");
      }
      
      // Backend wraps response in { message, data, success }
      const responseData = response.data.data || response.data;
      console.log('[CreatorAuth] Parsed response data:', responseData);
      
      if (responseData?.creator && responseData?.token) {
        console.log('[CreatorAuth] Setting creator:', responseData.creator.email);
        // Backend sets HttpOnly cookie via Set-Cookie header
        // We just update the state here
        setCreator(responseData.creator);
        console.log('[CreatorAuth] Creator registered and authenticated, cookie set by backend');
      } else {
        console.error('[CreatorAuth] Invalid response structure:', responseData);
        throw new Error("Invalid response from server. Please try again.");
      }
    } catch (error: any) {
      console.error("[CreatorAuth] Registration failed:", error);
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await api.post("/v2/auth/creator/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Backend clears the HttpOnly cookie
      setCreator(null);
      router.push("/creator/login");
    }
  }, [router]);

  // Refresh session (manual)
  const refreshSession = useCallback(async () => {
    await fetchSession();
  }, [fetchSession]);

  // Initialize session on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const value: CreatorAuthContextType = {
    creator,
    isLoading,
    isAuthenticated: !!creator,
    login,
    register,
    logout,
    refreshSession,
  };

  return <CreatorAuthContext.Provider value={value}>{children}</CreatorAuthContext.Provider>;
}

export function useCreatorAuth() {
  const context = useContext(CreatorAuthContext);
  if (context === undefined) {
    throw new Error("useCreatorAuth must be used within a CreatorAuthProvider");
  }
  return context;
}
