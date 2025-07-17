/**
 * Local storage utilities with error handling
 */

export const storage = {
  get: (key) => {
    try {
      if (typeof window === "undefined") return null
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item from localStorage:`, error)
      return null
    }
  },

  set: (key, value) => {
    try {
      if (typeof window === "undefined") return false
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting item in localStorage:`, error)
      return false
    }
  },

  remove: (key) => {
    try {
      if (typeof window === "undefined") return false
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing item from localStorage:`, error)
      return false
    }
  },

  clear: () => {
    try {
      if (typeof window === "undefined") return false
      localStorage.clear()
      return true
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
      return false
    }
  },
}

/**
 * Session storage utilities
 */
export const sessionStorage = {
  get: (key) => {
    try {
      if (typeof window === "undefined") return null
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting item from sessionStorage:`, error)
      return null
    }
  },

  set: (key, value) => {
    try {
      if (typeof window === "undefined") return false
      window.sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting item in sessionStorage:`, error)
      return false
    }
  },

  remove: (key) => {
    try {
      if (typeof window === "undefined") return false
      window.sessionStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing item from sessionStorage:`, error)
      return false
    }
  },
}
