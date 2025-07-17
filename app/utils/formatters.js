/**
 * Format date to readable string
 */
export function formatDate(date) {
  if (!date) return ""

  const dateObj = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - dateObj)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`
  } else {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  if (!num) return "0"
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Calculate reading time based on word count
 */
export function calculateReadingTime(content) {
  if (!content) return 0

  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, "")
  const wordCount = text.trim().split(/\s+/).length

  // Average reading speed is 200 words per minute
  const readingTime = Math.ceil(wordCount / 200)
  return readingTime
}

/**
 * Truncate text to specified length
 */
export function truncateText(text, maxLength = 150) {
  if (!text) return ""

  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, "")

  if (cleanText.length <= maxLength) return cleanText
  return cleanText.substr(0, maxLength).trim() + "..."
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  if (!title) return ""

  return title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html) {
  if (!html) return ""

  const tmp = document.createElement("DIV")
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ""
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate random color for avatars
 */
export function getRandomColor() {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
