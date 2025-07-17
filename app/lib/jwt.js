import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

/**
 * Generate JWT token
 * @param {Object} payload - The payload to encode in the token
 * @returns {string} - The generated JWT token
 */
export function generateToken(payload) {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "blogspace",
      audience: "blogspace-users",
    })
  } catch (error) {
    console.error("Error generating JWT token:", error)
    throw new Error("Failed to generate authentication token")
  }
}

/**
 * Verify JWT token
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} - The decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    if (!token) return null

    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "blogspace",
      audience: "blogspace-users",
    })

    return decoded
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("JWT token expired")
    } else if (error.name === "JsonWebTokenError") {
      console.log("Invalid JWT token")
    } else {
      console.error("JWT verification error:", error)
    }
    return null
  }
}

/**
 * Extract token from request headers
 * @param {Request} request - The Next.js request object
 * @returns {string|null} - The extracted token or null
 */
export function getTokenFromRequest(request) {
  try {
    // Check Authorization header
    const authHeader = request.headers.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7)
    }

    // Check cookies as fallback
    const cookieHeader = request.headers.get("cookie")
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        acc[key] = value
        return acc
      }, {})

      return cookies.token || null
    }

    return null
  } catch (error) {
    console.error("Error extracting token from request:", error)
    return null
  }
}

/**
 * Decode JWT token without verification (for client-side use)
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} - The decoded payload or null if invalid
 */
export function decodeToken(token) {
  try {
    if (!token) return null

    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Error decoding JWT token:", error)
    return null
  }
}

/**
 * Check if token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - True if expired, false otherwise
 */
export function isTokenExpired(token) {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    console.error("Error checking token expiration:", error)
    return true
  }
}

/**
 * Get token expiration time
 * @param {string} token - The JWT token
 * @returns {Date|null} - The expiration date or null if invalid
 */
export function getTokenExpiration(token) {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return null

    return new Date(decoded.exp * 1000)
  } catch (error) {
    console.error("Error getting token expiration:", error)
    return null
  }
}

/**
 * Refresh token if it's about to expire
 * @param {string} token - The current JWT token
 * @param {Object} payload - The payload for the new token
 * @returns {string|null} - New token if refreshed, original token if not needed, null if error
 */
export function refreshTokenIfNeeded(token, payload) {
  try {
    if (!token || isTokenExpired(token)) {
      return generateToken(payload)
    }

    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return generateToken(payload)

    const currentTime = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = decoded.exp - currentTime

    // Refresh if token expires in less than 1 hour
    if (timeUntilExpiry < 3600) {
      return generateToken(payload)
    }

    return token
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

// Add this export at the end of the file
export const signToken = generateToken
