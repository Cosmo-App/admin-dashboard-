/**
 * Theme Constants - Matching Mobile App Design
 */
export const COLORS = {
  background: "#000000",
  foreground: "#FFFFFF",
  primary: "#E50914",
  secondary: "#3D3D3D",
  muted: "#8A8A8A",
  border: "#3a3a3a",
  inputBg: "#3D3D3D",
  cardBg: "#0a0a0a",
  hoverBg: "#1a1a1a",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
} as const;

/**
 * API Configuration
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/v2/auth/admin/login",
  LOGOUT: "/v2/auth/admin/logout",
  SESSION: "/v2/auth/admin/session",

  // Admin
  ADMINS: "/v2/admin",
  ADMIN_SETUP: "/v2/admin/setup",

  // Films
  FILMS: "/v2/films",
  FILM_POSTER: (id: string) => `/v2/films/${id}/poster`,
  FILM_SCENE_IMAGES: (id: string) => `/v2/films/${id}/scene-images`,

  // Creators
  CREATORS: "/v2/creators",
  CREATOR_FILMS: (id: string) => `/v2/creators/${id}/films`,
  CREATOR_PROFILE_PICTURE: (id: string) => `/v2/creators/${id}/profile-picture`,
  CREATOR_COVER_PHOTO: (id: string) => `/v2/creators/${id}/cover-photo`,

  // Users
  USERS: "/v2/users",
  USER_PROFILE_PICTURE: (id: string) => `/v2/users/profile-picture/${id}`,
  USER_COVER_PHOTO: (id: string) => `/v2/users/cover-photo/${id}`,

  // Playlists
  PLAYLISTS: "/v2/playlists",

  // Metrics (to be added to backend)
  METRICS_OVERVIEW: "/v2/admin/metrics/overview",
  METRICS_USERS: "/v2/admin/metrics/users",
  METRICS_FILMS: "/v2/admin/metrics/films",
  METRICS_ACTIVITY: "/v2/admin/metrics/activity",

  // Data (existing)
  DATA_FILMS: "/v2/admin/data/films",
  DATA_CREATORS: "/v2/admin/data/creators",
  DATA_USERS: "/v2/admin/data/users",
} as const;

/**
 * Roles and Permissions
 */
export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  CREATOR: "CREATOR",
} as const;

export const PERMISSIONS = {
  ALL: "all",
  READ: "read",
  WRITE: "write",
  CREATOR: "creator",
} as const;

/**
 * Film Genres
 */
export const FILM_GENRES = [
  "Drama",
  "Comedy",
  "Documentary",
  "Thriller",
  "Sci-Fi",
  "Romance",
  "Horror",
  "Action",
  "Western",
  "Animation",
  "Musical",
  "Crime",
  "Mystery",
  "Fantasy",
  "Adventure",
] as const;

/**
 * Film Ratings
 */
export const FILM_RATINGS = ["G", "PG", "PG-13", "R", "NC-17", "NR"] as const;

/**
 * Pagination
 */
export const ITEMS_PER_PAGE = 20;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_PROFILE_PICTURE_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Image File Types
 */
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

/**
 * Session Configuration
 */
export const SESSION_COOKIE_NAME = "cosmic_admin_token";
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * US States (New Mexico focused)
 */
export const US_STATES = [
  "New Mexico",
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  FULL: "MMMM dd, yyyy",
  SHORT: "MMM dd, yyyy",
  TIME: "hh:mm a",
  DATETIME: "MMM dd, yyyy hh:mm a",
  ISO: "yyyy-MM-dd",
} as const;

/**
 * Chart Colors
 */
export const CHART_COLORS = {
  primary: "#E50914",
  secondary: "#FFFFFF",
  tertiary: "#8A8A8A",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  gradient: ["#E50914", "#FF6B6B", "#FFA500"],
} as const;

/**
 * Activity Types
 */
export const ACTIVITY_TYPES = {
  FILM_CREATED: "film_created",
  FILM_UPDATED: "film_updated",
  FILM_DELETED: "film_deleted",
  USER_JOINED: "user_joined",
  USER_LIKED_FILM: "user_liked_film",
  USER_WATCHED_FILM: "user_watched_film",
  CREATOR_JOINED: "creator_joined",
  PLAYLIST_CREATED: "playlist_created",
} as const;
