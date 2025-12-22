"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import { Creator } from "@/types/models";
import { Eye, Edit, Users, CheckCircle, Clock, Film } from "lucide-react";
import { formatDateShort } from "@/lib/date";
import Image from "next/image";

export default function CreatorsPage() {
  return (
    <ProtectedRoute>
      <CreatorsPageContent />
    </ProtectedRoute>
  );
}

function CreatorsPageContent() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Creator[]>("/v2/creators");
      setCreators(response.data as Creator[]);
    } catch (error) {
      console.error("Failed to fetch creators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeCreators = creators.filter((c) => c.isActive);
  const thisMonthCreators = creators.filter((c) => {
    const createdDate = new Date(c.createdAt);
    const now = new Date();
    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  });

  const columns = [
    {
      key: "avatar",
      label: "Avatar",
      render: (creator: Creator) => (
        <div className="w-10 h-10 bg-secondary rounded-full overflow-hidden relative">
          {creator.profilePicture ? (
            <Image
              src={creator.profilePicture}
              alt={creator.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold">
              {creator.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (creator: Creator) => (
        <div>
          <p className="text-white font-medium">{creator.name}</p>
          {creator.bio && (
            <p className="text-gray-400 text-xs truncate max-w-[200px]">{creator.bio}</p>
          )}
        </div>
      ),
    },
    {
      key: "filmsCount",
      label: "Films",
      sortable: true,
      render: (creator: Creator) => (
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-gray-400" />
          <span className="text-white font-medium">{creator.filmsCount || 0}</span>
        </div>
      ),
    },
    {
      key: "totalViews",
      label: "Total Views",
      sortable: true,
      render: (creator: Creator) => (
        <span className="text-white">{(creator.totalViews || 0).toLocaleString()}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined Date",
      sortable: true,
      render: (creator: Creator) => formatDateShort(creator.createdAt),
    },
    {
      key: "isActive",
      label: "Status",
      render: (creator: Creator) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            creator.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {creator.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (creator: Creator) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/creators/${creator.creatorId}`);
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/creators/${creator.creatorId}/edit`);
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1">Creators</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage content creators</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Creators</p>
                <p className="text-white text-xl sm:text-2xl font-bold">{creators.length}</p>
              </div>
              <div className="p-2 md:p-3 bg-primary/20 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Active Creators</p>
                <p className="text-white text-xl sm:text-2xl font-bold">{activeCreators.length}</p>
              </div>
              <div className="p-2 md:p-3 bg-green-500/20 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">New This Month</p>
                <p className="text-white text-xl sm:text-2xl font-bold">{thisMonthCreators.length}</p>
              </div>
              <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={creators}
          columns={columns}
          keyField="creatorId"
          searchPlaceholder="Search creators by name..."
          emptyMessage="No creators found."
          isLoading={isLoading}
          onRowClick={(creator) => router.push(`/creators/${creator.creatorId}`)}
        />
      </div>
    </DashboardLayout>
  );
}
