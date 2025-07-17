import { STORAGE_KEYS } from "./constants.js"

/**
 * Check if localStorage is available
 * @returns {boolean} - True if localStorage is available
 */
function isLocalStorageAvailable() {
  try {
    const test = "__localStorage_test__"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} - Stored value or default value
 */
export function getStorageItem(key, defaultValue = null) {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available")
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error)
    return defaultValue
  }
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} - True if successful
 */
export function setStorageItem(key, value) {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available")
    return false
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error)
    return false
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} - True if successful
 */
export function removeStorageItem(key) {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available")
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing storage item ${key}:`, error)
    return false
  }
}

/**
 * Clear all items from localStorage
 * @returns {boolean} - True if successful
 */
export function clearStorage() {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage is not available")
    return false
  }

  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error("Error clearing storage:", error)
    return false
  }
}

/**
 * Get auth token from storage
 * @returns {string|null} - Auth token or null
 */
export function getAuthToken() {
  return getStorageItem(STORAGE_KEYS.AUTH_TOKEN)
}

/**
 * Set auth token in storage
 * @param {string} token - Auth token
 * @returns {boolean} - True if successful
 */
export function setAuthToken(token) {
  return setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

/**
 * Remove auth token from storage
 * @returns {boolean} - True if successful
 */
export function removeAuthToken() {
  return removeStorageItem(STORAGE_KEYS.AUTH_TOKEN)
}

/**
 * Get user data from storage
 * @returns {Object|null} - User data or null
 */
export function getUserData() {
  return getStorageItem(STORAGE_KEYS.USER_DATA)
}

/**
 * Set user data in storage
 * @param {Object} userData - User data
 * @returns {boolean} - True if successful
 */
export function setUserData(userData) {
  return setStorageItem(STORAGE_KEYS.USER_DATA, userData)
}

/**
 * Remove user data from storage
 * @returns {boolean} - True if successful
 */
export function removeUserData() {
  return removeStorageItem(STORAGE_KEYS.USER_DATA)
}

/**
 * Get theme preference from storage
 * @returns {string} - Theme preference
 */
export function getThemePreference() {
  return getStorageItem(STORAGE_KEYS.THEME, "system")
}

/**
 * Set theme preference in storage
 * @param {string} theme - Theme preference
 * @returns {boolean} - True if successful
 */
export function setThemePreference(theme) {
  return setStorageItem(STORAGE_KEYS.THEME, theme)
}

/**
 * Get draft post from storage
 * @returns {Object|null} - Draft post or null
 */
export function getDraftPost() {
  return getStorageItem(STORAGE_KEYS.DRAFT_POST)
}

/**
 * Set draft post in storage
 * @param {Object} draftPost - Draft post data
 * @returns {boolean} - True if successful
 */
export function setDraftPost(draftPost) {
  return setStorageItem(STORAGE_KEYS.DRAFT_POST, draftPost)
}

/**
 * Remove draft post from storage
 * @returns {boolean} - True if successful
 */
export function removeDraftPost() {
  return removeStorageItem(STORAGE_KEYS.DRAFT_POST)
}

/**
 * Check if user is authenticated (has valid token)
 * @returns {boolean} - True if authenticated
 */
export function isAuthenticated() {
  const token = getAuthToken()
  return !!token
}

/**
 * Clear all auth-related data from storage
 * @returns {boolean} - True if successful
 */
export function clearAuthData() {
  const tokenRemoved = removeAuthToken()
  const userDataRemoved = removeUserData()
  return tokenRemoved && userDataRemoved
}

/**
 * Get storage usage information
 * @returns {Object} - Storage usage info
 */
export function getStorageInfo() {
  if (!isLocalStorageAvailable()) {
    return { available: false, used: 0, total: 0 }
  }

  try {
    let used = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }

    // Estimate total available space (usually around 5-10MB)
    const total = 5 * 1024 * 1024 // 5MB estimate

    return {
      available: true,
      used,
      total,
      percentage: (used / total) * 100,
    }
  } catch (error) {
    console.error("Error getting storage info:", error)
    return { available: false, used: 0, total: 0 }
  }
}

/**
 * Export storage data for backup
 * @returns {Object} - All storage data
 */
export function exportStorageData() {
  if (!isLocalStorageAvailable()) {
    return {}
  }

  try {
    const data = {}
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        data[key] = localStorage[key]
      }
    }
    return data
  } catch (error) {
    console.error("Error exporting storage data:", error)
    return {}
  }
}

/**
 * Import storage data from backup
 * @param {Object} data - Storage data to import
 * @returns {boolean} - True if successful
 */
export function importStorageData(data) {
  if (!isLocalStorageAvailable() || !data) {
    return false
  }

  try {
    for (const key in data) {
      localStorage.setItem(key, data[key])
    }
    return true
  } catch (error) {
    console.error("Error importing storage data:", error)
    return false
  }
}
