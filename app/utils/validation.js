import { VALIDATION_RULES, REGEX_PATTERNS, FILE_UPLOAD } from "./constants.js"

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} - Validation result
 */
export function validateEmail(email) {
  if (!email) {
    return { isValid: false, error: "Email is required" }
  }

  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" }
  }

  return { isValid: true }
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
export function validatePassword(password) {
  if (!password) {
    return { isValid: false, error: "Password is required" }
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`,
    }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    }
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    }
  }

  return { isValid: true }
}

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result
 */
export function validateUsername(username) {
  if (!username) {
    return { isValid: false, error: "Username is required" }
  }

  if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters long`,
    }
  }

  if (username.length > VALIDATION_RULES.USERNAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Username must be no more than ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters long`,
    }
  }

  if (!REGEX_PATTERNS.USERNAME.test(username)) {
    return {
      isValid: false,
      error: "Username can only contain letters, numbers, and underscores",
    }
  }

  return { isValid: true }
}

/**
 * Validate post title
 * @param {string} title - Title to validate
 * @returns {Object} - Validation result
 */
export function validatePostTitle(title) {
  if (!title) {
    return { isValid: false, error: "Title is required" }
  }

  if (title.trim().length === 0) {
    return { isValid: false, error: "Title cannot be empty" }
  }

  if (title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Title must be no more than ${VALIDATION_RULES.TITLE_MAX_LENGTH} characters long`,
    }
  }

  return { isValid: true }
}

/**
 * Validate post content
 * @param {string} content - Content to validate
 * @returns {Object} - Validation result
 */
export function validatePostContent(content) {
  if (!content) {
    return { isValid: false, error: "Content is required" }
  }

  if (content.trim().length === 0) {
    return { isValid: false, error: "Content cannot be empty" }
  }

  return { isValid: true }
}

/**
 * Validate post excerpt
 * @param {string} excerpt - Excerpt to validate
 * @returns {Object} - Validation result
 */
export function validatePostExcerpt(excerpt) {
  if (excerpt && excerpt.length > VALIDATION_RULES.EXCERPT_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Excerpt must be no more than ${VALIDATION_RULES.EXCERPT_MAX_LENGTH} characters long`,
    }
  }

  return { isValid: true }
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {Object} - Validation result
 */
export function validateUrl(url) {
  if (!url) {
    return { isValid: true } // URL is optional
  }

  if (!REGEX_PATTERNS.URL.test(url)) {
    return { isValid: false, error: "Please enter a valid URL" }
  }

  return { isValid: true }
}

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @returns {Object} - Validation result
 */
export function validateFileUpload(file) {
  if (!file) {
    return { isValid: false, error: "File is required" }
  }

  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${FILE_UPLOAD.MAX_SIZE / (1024 * 1024)}MB`,
    }
  }

  // Check file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "File type not supported. Please upload an image file.",
    }
  }

  return { isValid: true }
}

/**
 * Validate registration form
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result
 */
export function validateRegistrationForm(formData) {
  const errors = {}

  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  const usernameValidation = validateUsername(formData.username)
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error
  }

  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate login form
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result
 */
export function validateLoginForm(formData) {
  const errors = {}

  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error
  }

  if (!formData.password) {
    errors.password = "Password is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate post form
 * @param {Object} formData - Form data to validate
 * @returns {Object} - Validation result
 */
export function validatePostForm(formData) {
  const errors = {}

  const titleValidation = validatePostTitle(formData.title)
  if (!titleValidation.isValid) {
    errors.title = titleValidation.error
  }

  const contentValidation = validatePostContent(formData.content)
  if (!contentValidation.isValid) {
    errors.content = contentValidation.error
  }

  const excerptValidation = validatePostExcerpt(formData.excerpt)
  if (!excerptValidation.isValid) {
    errors.excerpt = excerptValidation.error
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Sanitize HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html) {
  if (!html) return ""

  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
}

/**
 * Generate slug from title
 * @param {string} title - Title to convert to slug
 * @returns {string} - Generated slug
 */
export function generateSlug(title) {
  if (!title) return ""

  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

/**
 * Validate slug
 * @param {string} slug - Slug to validate
 * @returns {Object} - Validation result
 */
export function validateSlug(slug) {
  if (!slug) {
    return { isValid: false, error: "Slug is required" }
  }

  if (!REGEX_PATTERNS.SLUG.test(slug)) {
    return {
      isValid: false,
      error: "Slug can only contain lowercase letters, numbers, and hyphens",
    }
  }

  return { isValid: true }
}
