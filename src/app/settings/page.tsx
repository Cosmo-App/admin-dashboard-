"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { User, Lock, Bell, Shield, Moon, Globe, Save } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import { Admin } from "@/types/models";

export default function SettingsPage() {
  const { admin, updateAdmin } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
  });

  // Sync formData when admin changes (after profile updates)
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
      });
    }
  }, [admin]);

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.put<{ admin: Admin }>("/v2/auth/admin/profile", {
        name: formData.name,
      });
      
      if (response?.data?.admin) {
        updateAdmin(response.data.admin);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.upload<{ admin: Admin }>(
        "/v2/auth/admin/profile-picture",
        formData
      );
      
      if (response?.data?.admin) {
        updateAdmin(response.data.admin);
        toast.success("Profile picture updated successfully!");
      }
    } catch (error: any) {
      console.error("Failed to upload image:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] border border-secondary rounded-xl overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors border-l-2 ${
                    activeTab === tab.id
                      ? "bg-secondary/50 text-white border-primary"
                      : "text-gray-400 hover:bg-secondary/30 hover:text-white border-transparent"
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-primary" : ""}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden relative border-2 border-secondary">
                      {admin?.profilePicture ? (
                        <Image
                          src={admin.profilePicture}
                          alt={admin.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                          {admin?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-picture-upload"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="profile-picture-upload"
                        className="inline-block px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                      >
                        {uploadingImage ? "Uploading..." : "Change Photo"}
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, GIF or PNG. Max size of 5MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-4 py-2.5 bg-black border border-secondary rounded-lg text-gray-400 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Role</label>
                      <input
                        type="text"
                        value={typeof admin?.assignedRoleId === 'string' ? admin.assignedRoleId : admin?.assignedRoleId?.name || "Admin"}
                        disabled
                        className="w-full px-4 py-2.5 bg-black/50 border border-secondary rounded-lg text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/30 rounded-lg">
                          <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Language</p>
                          <p className="text-xs text-gray-500">Select your preferred language</p>
                        </div>
                      </div>
                      <select className="bg-black border border-secondary rounded-lg text-white text-sm px-3 py-1.5 focus:outline-none focus:border-primary">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary/30 rounded-lg">
                          <Moon className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Theme</p>
                          <p className="text-xs text-gray-500">Customize interface appearance</p>
                        </div>
                      </div>
                      <select className="bg-black border border-secondary rounded-lg text-white text-sm px-3 py-1.5 focus:outline-none focus:border-primary">
                        <option>Dark Mode</option>
                        <option>Light Mode</option>
                        <option>System</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Two-Factor Authentication</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Two-factor authentication is disabled</p>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg text-sm font-medium transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="bg-[#1a1a1a] border border-secondary rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Email Notifications</h2>
                <div className="space-y-4">
                  {[
                    "New user registrations",
                    "New film uploads",
                    "System updates and maintenance",
                    "Weekly performance reports",
                    "Security alerts"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-secondary/50">
                      <span className="text-gray-300">{item}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
