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
      const response = await api.get<{ creator: Creator }>("/v2/auth/creator/session");
      const responseData = response.data;
      
      if (responseData?.creator) {
        setCreator(responseData.creator);
      } else {
        setCreator(null);
      }
    } catch (error: any) {
      // Only log error if it's not a 401 (expected when not logged in)
      if (error.response?.status !== 401) {
        console.error("[CreatorAuth] Session fetch error:", error.response?.status);
      }
      setCreator(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post<{ creator: Creator; token: string }>("/v2/auth/creator/login", { 
        email, 
        password 
      });
      
      if (!response || !response.data) {
        throw new Error("No response from server");
      }
      
      const responseData = response.data;
      
      if (responseData?.creator && responseData?.token) {
        setCreator(responseData.creator);
      } else {
        throw new Error("Invalid response from server. Please try again.");
      }
    } catch (error: any) {
      console.error("[CreatorAuth] Login failed:", error.response?.data?.message || error.message);
      throw error;
    }
  }, []);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await api.post<{ creator: Creator; token: string }>("/v2/auth/creator/register", data);
      
      if (!response || !response.data) {
        throw new Error("No response from server");
      }
      
      const responseData = response.data;
      
      if (responseData?.creator && responseData?.token) {
        setCreator(responseData.creator);
      } else {
        throw new Error("Invalid response from server. Please try again.");
      }
    } catch (error: any) {
      console.error("[CreatorAuth] Registration failed:", error.response?.data?.message || error.message);
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
