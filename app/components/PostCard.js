"use client"
import { useState } from "react"

export default function PostCard({ post, isAdmin = false, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const truncateText = (text, maxLength = 150) => {
    const cleanText = stripHtml(text)
    if (cleanText.length <= maxLength) return cleanText
    return cleanText.substr(0, maxLength) + "..."
  }

  return (
    <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {post.featuredImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={post.featuredImage || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-sm">
                {post.author ? post.author.charAt(0).toUpperCase() : "A"}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">{post.author}</span>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{post.createdAt}</span>
                {post.category && (
                  <>
                    <span>•</span>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{post.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(post)}
                className="text-indigo-600 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-50 transition duration-200"
                title="Edit Post"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition duration-200"
                title="Delete Post"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-indigo-600 cursor-pointer transition-colors">
          {post.title}
        </h2>

        <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>

        <div className="border-t border-gray-100 pt-4">
          {isExpanded ? (
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{truncateText(post.content)}</p>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm">{post.likes || Math.floor(Math.random() * 50) + 10}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm">{post.comments || Math.floor(Math.random() * 20) + 5}</span>
            </button>
          </div>
          <div className="text-sm text-gray-500">{Math.floor(stripHtml(post.content).length / 200)} min read</div>
        </div>
      </div>
    </article>
  )
}
