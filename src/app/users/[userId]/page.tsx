"use client";

export const runtime = 'edge';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import { api } from "@/lib/api";
import { User } from "@/types/models";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Heart,
  Eye,
  List,
  CheckCircle,
  XCircle,
  UserX,
  UserCheck,
} from "lucide-react";
import { formatDateFull, formatDateShort } from "@/lib/date";
import Image from "next/image";

export default function ViewUserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusDialog, setStatusDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<User>(`/v2/users/${userId}`);
      setUser(response.data as User);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      router.push("/users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      await api.put(`/v2/users/${userId}`, {
        isActive: !user?.isActive,
      });
      await fetchUser();
      setStatusDialog(false);
    } catch (error: any) {
      console.error("Failed to update user status:", error);
      alert(error.response?.data?.error || "Failed to update user status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  // Mock data for liked films, watchlist (replace with actual API calls)
  const likedFilms: any[] = [];
  const watchlist: any[] = [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-white text-3xl font-bold">{user.username}</h1>
              <p className="text-gray-400 text-sm mt-1">
                Joined {formatDateFull(user.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusDialog(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              user.isActive
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                : "bg-green-500/20 hover:bg-green-500/30 text-green-400"
            }`}
          >
            {user.isActive ? (
              <>
                <UserX className="w-4 h-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Activate
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile */}
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <div className="aspect-square w-full bg-secondary rounded-lg overflow-hidden relative mb-4">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-center mb-4">
                <h3 className="text-white text-xl font-bold mb-1">{user.username}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              <div
                className={`px-3 py-2 rounded-lg text-center ${
                  user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {user.isActive ? (
                  <span className="flex items-center justify-center gap-2 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Activity Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Liked Films
                  </span>
                  <span className="text-white font-semibold">{likedFilms.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Watchlist
                  </span>
                  <span className="text-white font-semibold">{watchlist.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Watch History
                  </span>
                  <span className="text-white font-semibold">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Info */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">User ID</span>
                  <span className="text-white text-sm font-mono">{user.userId}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Username</span>
                  <span className="text-white text-sm font-medium">{user.username}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Email</span>
                  <span className="text-white text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-start justify-between py-2 border-b border-secondary">
                  <span className="text-gray-400 text-sm">Joined Date</span>
                  <span className="text-white text-sm font-medium">
                    {formatDateFull(user.createdAt)}
                  </span>
                </div>
                <div className="flex items-start justify-between py-2">
                  <span className="text-gray-400 text-sm">Account Status</span>
                  <span
                    className={`text-sm font-medium ${
                      user.isActive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Liked Films */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Liked Films
              </h3>
              {likedFilms.length === 0 ? (
                <p className="text-gray-400 text-sm">No liked films yet.</p>
              ) : (
                <DataTable
                  data={likedFilms}
                  columns={[]}
                  keyField="_id"
                  searchPlaceholder="Search liked films..."
                  emptyMessage="No liked films."
                />
              )}
            </div>

            {/* Watchlist */}
            <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                Watchlist
              </h3>
              {watchlist.length === 0 ? (
                <p className="text-gray-400 text-sm">No films in watchlist yet.</p>
              ) : (
                <DataTable
                  data={watchlist}
                  columns={[]}
                  keyField="_id"
                  searchPlaceholder="Search watchlist..."
                  emptyMessage="No films in watchlist."
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Dialog */}
      <ConfirmDialog
        isOpen={statusDialog}
        onClose={() => setStatusDialog(false)}
        onConfirm={handleToggleStatus}
        title={user.isActive ? "Deactivate User" : "Activate User"}
        message={
          user.isActive
            ? `Are you sure you want to deactivate "${user.username}"? They will no longer be able to access the platform.`
            : `Are you sure you want to activate "${user.username}"? They will regain access to the platform.`
        }
        confirmText={user.isActive ? "Deactivate" : "Activate"}
        variant={user.isActive ? "danger" : "info"}
        isLoading={isUpdating}
      />
    </DashboardLayout>
  );
}
