"use client"
import { useState } from "react"
import { formatDate, truncateText, calculateReadingTime } from "../utils/formatters"

export default function PostCard({ post, isAdmin = false, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const readingTime = calculateReadingTime(post.content)
  const truncatedContent = truncateText(post.content, 200)

  return (
    <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Featured Image */}
      {post.featuredImage && !imageError && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featuredImage || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                {post.category}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors duration-200">
              {post.title}
            </h2>

            {/* Meta Information */}
            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {post.author ? post.author.charAt(0).toUpperCase() : "A"}
                  </span>
                </div>
                <span>{post.author || "Anonymous"}</span>
              </div>

              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>

              {readingTime > 0 && (
                <>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                </>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(post)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                title="Edit post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>

              <button
                onClick={() => onDelete(post.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Delete post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>}

        {/* Content Preview */}
        <div className="text-gray-700 mb-4">
          <div
            className={`prose prose-sm max-w-none ${isExpanded ? "" : "line-clamp-3"}`}
            dangerouslySetInnerHTML={{
              __html: isExpanded ? post.content : truncatedContent,
            }}
          />

          {post.content && post.content.length > 200 && (
            <button
              onClick={toggleExpanded}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 transition-colors duration-200"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && <span className="text-gray-500 text-xs">+{post.tags.length - 3} more</span>}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{post.likes || 0}</span>
            </div>

            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.comments || 0}</span>
            </div>

            {post.views && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{post.views}</span>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: post.title,
                  text: post.excerpt,
                  url: window.location.href,
                })
              } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href)
                // You could show a toast notification here
              }
            }}
            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </article>
  )
}
