"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import { Admin } from "@/types/models";
import { Eye, Edit, Trash, Plus, Shield, Users, CheckCircle, XCircle } from "lucide-react";
import { formatDateShort } from "@/lib/date";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function AdminsPage() {
  return (
    <ProtectedRoute>
      <AdminsPageContent />
    </ProtectedRoute>
  );
}

function AdminsPageContent() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { admin: currentAdmin } = useAuth();

  // Check if current user is SUPERADMIN
  const isSuperAdmin = currentAdmin?.role === "SUPERADMIN";

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push("/");
      return;
    }
    fetchAdmins();
  }, [isSuperAdmin]);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Admin[]>("/v2/admin");
      setAdmins(response.data as Admin[]);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    
    setIsDeleting(true);
    try {
      await api.del(`/v2/admin/${selectedAdmin.adminId}`);
      await fetchAdmins();
      setDeleteDialog(false);
      setSelectedAdmin(null);
    } catch (error: any) {
      console.error("Failed to delete admin:", error);
      alert(error.response?.data?.error || "Failed to delete admin");
    } finally {
      setIsDeleting(false);
    }
  };

  const activeAdmins = admins.filter((a) => a.isActive);
  const superAdmins = admins.filter((a) => a.role === "SUPERADMIN");
  const regularAdmins = admins.filter((a) => a.role === "ADMIN");

  const columns = [
    {
      key: "avatar",
      label: "Avatar",
      render: (admin: Admin) => (
        <div className="w-10 h-10 bg-secondary rounded-full overflow-hidden relative">
          {admin.profilePicture ? (
            <Image src={admin.profilePicture} alt={admin.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-semibold">
              {admin.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (admin: Admin) => (
        <div>
          <p className="text-white font-medium">{admin.name}</p>
          <p className="text-gray-400 text-xs">{admin.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (admin: Admin) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            admin.role === "SUPERADMIN"
              ? "bg-purple-500/20 text-purple-400"
              : admin.role === "ADMIN"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {admin.role}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created Date",
      sortable: true,
      render: (admin: Admin) => formatDateShort(admin.createdAt),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      sortable: true,
      render: (admin: Admin) =>
        admin.lastLogin ? formatDateShort(admin.lastLogin) : "Never",
    },
    {
      key: "isActive",
      label: "Status",
      render: (admin: Admin) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            admin.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {admin.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (admin: Admin) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admins/${admin.adminId}`);
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admins/${admin.adminId}/edit`);
            }}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-blue-400" />
          </button>
          {admin.adminId !== currentAdmin?.adminId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAdmin(admin);
                setDeleteDialog(true);
              }}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              title="Delete"
            >
              <Trash className="w-4 h-4 text-primary" />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1">Admin Management</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Manage administrator accounts and permissions</p>
          </div>
          <button
            onClick={() => router.push("/admins/create")}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Admin
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Admins</p>
                <p className="text-white text-xl sm:text-2xl font-bold">{admins.length}</p>
              </div>
              <div className="p-2 md:p-3 bg-primary/20 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Super Admins</p>
                <p className="text-white text-xl sm:text-2xl font-bold">{superAdmins.length}</p>
              </div>
              <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Regular Admins</p>
                <p className="text-white text-xl sm:text-2xl font-bold">{regularAdmins.length}</p>
              </div>
              <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-secondary rounded-lg p-3 md:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Active</p>
                <p className="text-white text-xl sm:text-2xl font-bold">{activeAdmins.length}</p>
              </div>
              <div className="p-2 md:p-3 bg-green-500/20 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={admins}
          columns={columns}
          keyField="adminId"
          searchPlaceholder="Search admins by name, email..."
          emptyMessage="No admins found. Click 'Add Admin' to create one."
          isLoading={isLoading}
          onRowClick={(admin) => router.push(`/admins/${admin.adminId}`)}
        />
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => {
          setDeleteDialog(false);
          setSelectedAdmin(null);
        }}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete "${selectedAdmin?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </DashboardLayout>
  );
}
