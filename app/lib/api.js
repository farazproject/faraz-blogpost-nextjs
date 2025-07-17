import axios from "axios"
import Cookies from "js-cookie"
import { API_ENDPOINTS } from "../utils/constants"

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("token")
      Cookies.remove("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => {
    Cookies.remove("token")
    Cookies.remove("user")
    return Promise.resolve()
  },
}

// Posts API
export const postsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`${API_ENDPOINTS.POSTS.BASE}${queryString ? `?${queryString}` : ""}`)
  },

  getById: (id) => api.get(API_ENDPOINTS.POSTS.BY_ID(id)),

  create: (postData) => api.post(API_ENDPOINTS.POSTS.BASE, postData),

  update: (id, postData) => api.put(API_ENDPOINTS.POSTS.BY_ID(id), postData),

  delete: (id) => api.delete(API_ENDPOINTS.POSTS.BY_ID(id)),

  search: (query, filters = {}) => {
    const params = { search: query, ...filters }
    return postsAPI.getAll(params)
  },

  getByCategory: (category, params = {}) => {
    return postsAPI.getAll({ category, ...params })
  },
}

// Users API (for future use)
export const usersAPI = {
  getProfile: () => api.get("/api/users/profile"),
  updateProfile: (userData) => api.put("/api/users/profile", userData),
  changePassword: (passwordData) => api.put("/api/users/change-password", passwordData),
}

// Comments API (for future use)
export const commentsAPI = {
  getByPost: (postId) => api.get(`/api/posts/${postId}/comments`),
  create: (postId, commentData) => api.post(`/api/posts/${postId}/comments`, commentData),
  update: (commentId, commentData) => api.put(`/api/comments/${commentId}`, commentData),
  delete: (commentId) => api.delete(`/api/comments/${commentId}`),
}

// Analytics API (for future use)
export const analyticsAPI = {
  getPostStats: (postId) => api.get(`/api/analytics/posts/${postId}`),
  getDashboardStats: () => api.get("/api/analytics/dashboard"),
  getPopularPosts: (limit = 10) => api.get(`/api/analytics/popular-posts?limit=${limit}`),
}

export default api
