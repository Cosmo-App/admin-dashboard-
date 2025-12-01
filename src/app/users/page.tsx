"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { api } from "@/lib/api";
import { User } from "@/types/models";
import { Eye, Users, CheckCircle, Clock, UserX } from "lucide-react";
import { formatDateShort } from "@/lib/date";
import Image from "next/image";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<User[]>("/v2/users");
      setUsers(response.data as User[] || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeUsers = users.filter((u) => u.isActive);
  const thisMonthUsers = users.filter((u) => {
    const createdDate = new Date(u.createdAt);
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
      render: (user: User) => (
        <div className="w-10 h-10 bg-secondary rounded-full overflow-hidden relative">
          {user.profilePicture ? (
            <Image src={user.profilePicture} alt={user.username} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "username",
      label: "Username",
      sortable: true,
      render: (user: User) => (
        <div>
          <p className="text-white font-medium">{user.username}</p>
          <p className="text-gray-400 text-xs">{user.email}</p>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Joined Date",
      sortable: true,
      render: (user: User) => formatDateShort(new Date(user.createdAt)),
    },
    {
      key: "isActive",
      label: "Status",
      render: (user: User) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/users/${user.userId}`)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">Users</h1>
          <p className="text-gray-400 text-sm">Manage platform users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Users</p>
                <p className="text-white text-2xl font-bold">{users.length}</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Users</p>
                <p className="text-white text-2xl font-bold">{activeUsers.length}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">New This Month</p>
                <p className="text-white text-2xl font-bold">{thisMonthUsers.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Inactive</p>
                <p className="text-white text-2xl font-bold">{users.length - activeUsers.length}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <UserX className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={users}
          columns={columns}
          keyField="userId"
          searchPlaceholder="Search users by username, email..."
          emptyMessage="No users found."
          isLoading={isLoading}
          onRowClick={(user) => router.push(`/users/${user.userId}`)}
        />
      </div>
    </DashboardLayout>
  );
}
