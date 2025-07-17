"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import Navbar from "../components/Navbar"
import RichTextEditor from "../components/RichTextEditor"
import ImageUpload from "../components/ImageUpload"
import PostCard from "../components/PostCard"
import { postsAPI } from "../lib/api"
import { postSchema } from "../utils/validation"
import { CATEGORIES } from "../utils/constants"
import { formatDate, formatNumber } from "../utils/formatters"
import { debounce } from "../utils/debounce"

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
  })

  // Debounced search function
  const debouncedSearch = debounce((term) => {
    setSearchTerm(term)
  }, 500)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError("")

      const params = {}
      if (searchTerm) params.search = searchTerm
      if (selectedCategory) params.category = selectedCategory

      const response = await postsAPI.getAll(params)
      const postsData = response.data.posts.map((post) => ({
        ...post,
        id: post._id,
        author: post.author?.name || post.author?.email || "Unknown Author",
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        views: post.views || 0,
        createdAt: formatDate(post.createdAt),
      }))

      setPosts(postsData)

      // Calculate stats
      const totalLikes = postsData.reduce((sum, post) => sum + (post.likes || 0), 0)
      const totalComments = postsData.reduce((sum, post) => sum + (post.comments || 0), 0)
      const totalViews = postsData.reduce((sum, post) => sum + (post.views || 0), 0)

      setStats({
        totalPosts: postsData.length,
        totalLikes,
        totalComments,
        totalViews,
      })
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to load posts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    fetchPosts()
  }, [user, router, searchTerm, selectedCategory])

  const handleCreatePost = async (values, { setSubmitting, resetForm }) => {
    try {
      setError("")
      setSuccess("")

      const response = await postsAPI.create(values)

      const newPost = {
        ...response.data.post,
        id: response.data.post._id,
        author: response.data.post.author?.name || user.email,
        likes: 0,
        comments: 0,
        views: 0,
        createdAt: formatDate(new Date()),
      }

      setPosts([newPost, ...posts])
      setShowCreateForm(false)
      resetForm()
      setSuccess("Post created successfully!")

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalPosts: prev.totalPosts + 1,
      }))

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error creating post:", error)
      setError(error.response?.data?.error || "Failed to create post")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditPost = async (values, { setSubmitting }) => {
    try {
      setError("")
      setSuccess("")

      const response = await postsAPI.update(editingPost.id, values)

      const updatedPost = {
        ...response.data.post,
        id: response.data.post._id,
        author: response.data.post.author?.name || user.email,
        likes: editingPost.likes,
        comments: editingPost.comments,
        views: editingPost.views,
        createdAt: editingPost.createdAt,
      }

      setPosts(posts.map((post) => (post.id === editingPost.id ? updatedPost : post)))
      setEditingPost(null)
      setSuccess("Post updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error updating post:", error)
      setError(error.response?.data?.error || "Failed to update post")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        setError("")
        await postsAPI.delete(postId)

        const deletedPost = posts.find((post) => post.id === postId)
        setPosts(posts.filter((post) => post.id !== postId))
        setSuccess("Post deleted successfully!")

        // Update stats
        setStats((prev) => ({
          totalPosts: prev.totalPosts - 1,
          totalLikes: prev.totalLikes - (deletedPost?.likes || 0),
          totalComments: prev.totalComments - (deletedPost?.comments || 0),
          totalViews: prev.totalViews - (deletedPost?.views || 0),
        }))

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } catch (error) {
        console.error("Error deleting post:", error)
        setError(error.response?.data?.error || "Failed to delete post")
      }
    }
  }

  const clearMessages = () => {
    setError("")
    setSuccess("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your blog posts and content with advanced editing tools.</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true)
              clearMessages()
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Post</span>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearMessages} className="text-red-800 hover:text-red-900 ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{success}</span>
            <button onClick={clearMessages} className="text-green-800 hover:text-green-900 ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Posts</label>
              <input
                type="text"
                placeholder="Search by title or content..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Create Post Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  clearMessages()
                }}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Formik
              initialValues={{ title: "", content: "", excerpt: "", category: "", featuredImage: null }}
              validationSchema={postSchema}
              onSubmit={handleCreatePost}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <Field
                        name="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="Enter post title"
                      />
                      <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <Field
                        as="select"
                        name="category"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                    <Field
                      name="excerpt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      placeholder="Brief description of the post"
                    />
                    <ErrorMessage name="excerpt" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <ImageUpload
                    onImageSelect={(imageUrl) => setFieldValue("featuredImage", imageUrl)}
                    currentImage={values.featuredImage}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <RichTextEditor
                      value={values.content}
                      onChange={(content) => setFieldValue("content", content)}
                      placeholder="Write your post content here..."
                    />
                    <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Creating..." : "Create Post"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        clearMessages()
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Edit Post Form */}
        {editingPost && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
              <button
                onClick={() => {
                  setEditingPost(null)
                  clearMessages()
                }}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Formik
              initialValues={{
                title: editingPost.title,
                content: editingPost.content,
                excerpt: editingPost.excerpt,
                category: editingPost.category || "",
                featuredImage: editingPost.featuredImage || null,
              }}
              validationSchema={postSchema}
              onSubmit={handleEditPost}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <Field
                        name="title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      />
                      <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <Field
                        as="select"
                        name="category"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                    <Field
                      name="excerpt"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                    <ErrorMessage name="excerpt" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <ImageUpload
                    onImageSelect={(imageUrl) => setFieldValue("featuredImage", imageUrl)}
                    currentImage={values.featuredImage}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <RichTextEditor
                      value={values.content}
                      onChange={(content) => setFieldValue("content", content)}
                      placeholder="Write your post content here..."
                    />
                    <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Updating..." : "Update Post"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPost(null)
                        clearMessages()
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* Posts Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalPosts)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalLikes)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalComments)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition duration-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">
            {posts.length} Post{posts.length !== 1 ? "s" : ""} Found
          </h3>

          {posts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first blog post."}
              </p>
              {!searchTerm && !selectedCategory && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} isAdmin={true} onEdit={setEditingPost} onDelete={handleDeletePost} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
