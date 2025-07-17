// Application constants
export const APP_NAME = "BlogSpace"
export const APP_DESCRIPTION = "A modern blog platform for writers and readers"
export const APP_VERSION = "1.0.0"

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
  },
  POSTS: {
    BASE: "/api/posts",
    BY_ID: (id) => `/api/posts/${id}`,
  },
  USERS: {
    BASE: "/api/users",
    PROFILE: "/api/users/profile",
  },
}

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  AUTHOR: "author",
  READER: "reader",
}

// Post status
export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
}

// Validation rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  TITLE_MAX_LENGTH: 200,
  EXCERPT_MAX_LENGTH: 500,
}

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  UPLOAD_DIR: "/uploads",
}

// Cache durations (in seconds)
export const CACHE_DURATION = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
}

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_EXISTS: "User with this email already exists",
  USER_NOT_FOUND: "User not found",
  POST_NOT_FOUND: "Post not found",
  VALIDATION_ERROR: "Please check your input and try again",
  SERVER_ERROR: "An unexpected error occurred. Please try again later",
  NETWORK_ERROR: "Network error. Please check your connection",
}

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in",
  REGISTER_SUCCESS: "Account created successfully",
  POST_CREATED: "Post created successfully",
  POST_UPDATED: "Post updated successfully",
  POST_DELETED: "Post deleted successfully",
  PROFILE_UPDATED: "Profile updated successfully",
}

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  THEME: "theme_preference",
  DRAFT_POST: "draft_post",
}

// Theme options
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
}

// Social media platforms
export const SOCIAL_PLATFORMS = {
  TWITTER: "twitter",
  FACEBOOK: "facebook",
  LINKEDIN: "linkedin",
  GITHUB: "github",
}

// Date formats
export const DATE_FORMATS = {
  FULL: "MMMM dd, yyyy 'at' h:mm a",
  SHORT: "MMM dd, yyyy",
  TIME: "h:mm a",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
}

// Regular expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/.+/,
}

// Environment variables
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
}

// Feature flags
export const FEATURES = {
  COMMENTS: true,
  SOCIAL_SHARING: true,
  EMAIL_NOTIFICATIONS: true,
  DARK_MODE: true,
  SEARCH: true,
  ANALYTICS: false,
}
