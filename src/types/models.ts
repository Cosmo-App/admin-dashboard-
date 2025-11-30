/**
 * Type Definitions for Cosmic Admin Dashboard
 * Based on backend MongoDB models
 */

// ============================================
// User Models
// ============================================

export interface User {
  _id: string;
  userId: string;
  username: string;
  email?: string;
  state?: string;
  profilePicture?: string;
  coverPhoto?: string;
  bio?: string;
  instagram?: string;
  likedFilms: string[];
  watchedFilms: WatchedFilm[];
  createdAt: string;
  updatedAt: string;
}

export interface WatchedFilm {
  filmId: string;
  lastWatchedSecond: number;
  lastWatchedAt: string;
}

// ============================================
// Creator Models
// ============================================

export interface Creator {
  _id: string;
  creatorId: string;
  name: string;
  title?: string;
  bio?: string;
  instagram?: string;
  profilePicture?: string;
  coverPhoto?: string;
  donateLink?: string;
  handle?: string;
  description?: string;
  yearsOfExperience?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Film Models
// ============================================

export interface Film {
  _id: string;
  filmId: string;
  title: string;
  posterUrl: string;
  director?: string;
  logline?: string;
  production?: string;
  starring?: string[];
  creatorId?: string;
  genre?: string;
  rating?: string;
  views?: string;
  sceneImages?: string[];
  videoUrl?: string;
  // Legacy fields
  name?: string;
  description?: string;
  rated?: string;
  yearCreated?: number;
  thumbnail?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FilmFormData {
  title: string;
  director?: string;
  logline?: string;
  production?: string;
  starring?: string[];
  creatorId?: string;
  genre?: string;
  rating?: string;
  videoUrl?: string;
  posterFile?: File;
  sceneImageFiles?: File[];
}

// ============================================
// Admin Models
// ============================================

export interface Admin {
  _id: string;
  adminId?: string;
  name: string;
  email: string;
  profilePicture?: string;
  assignedRoleId: string | Role;
  isActive?: boolean;
  lastLogin?: string;
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  _id: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  admin: Admin;
  role: Role;
  token: string;
}

// ============================================
// Playlist Models
// ============================================

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  films: string[];
  shareCode: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Metrics & Analytics
// ============================================

export interface DashboardMetrics {
  totalUsers: number;
  totalCreators: number;
  totalFilms: number;
  totalPlaylists: number;
  totalWatchTimeHours: number;
  avgWatchTimePerUser: number;
  userGrowth: number; // Percentage
  filmGrowth: number; // Percentage
  activeUsersLast30Days: number;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

export interface FilmStatsData {
  filmId: string;
  title: string;
  views: number;
  likes: number;
  watchTime: number;
}

export interface GenreDistribution {
  genre: string;
  count: number;
}

export interface Activity {
  _id: string;
  activityId?: string;
  adminId?: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, any>;
  timestamp: string;
}

// ============================================
// Form Types
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface CreateAdminFormData {
  name: string;
  email: string;
  password: string;
  roleId: string;
  creatorId?: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  bio?: string;
  profilePictureFile?: File;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// ============================================
// UI State Types
// ============================================

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

export interface TableState {
  page: number;
  limit: number;
  search: string;
  filters: Record<string, string>;
  sort: SortOption;
}

// ============================================
// Navigation Types
// ============================================

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  permission?: string[];
}

// ============================================
// Utility Types
// ============================================

export type ValueOf<T> = T[keyof T];

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
