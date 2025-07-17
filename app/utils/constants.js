export const CATEGORIES = [
  "Technology",
  "Web Development",
  "JavaScript",
  "React",
  "Next.js",
  "CSS",
  "Design",
  "Tutorial",
  "News",
  "Opinion",
]

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
}

export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
  },
  POSTS: {
    GET_ALL: "/api/posts",
    GET_BY_ID: (id) => `/api/posts/${id}`,
    CREATE: "/api/posts",
    UPDATE: (id) => `/api/posts/${id}`,
    DELETE: (id) => `/api/posts/${id}`,
  },
  USERS: {
    PROFILE: "/api/users/profile",
    UPDATE_PROFILE: "/api/users/profile",
  },
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
}

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  TITLE_MAX_LENGTH: 200,
  EXCERPT_MAX_LENGTH: 300,
  BIO_MAX_LENGTH: 500,
  COMMENT_MAX_LENGTH: 1000,
}
