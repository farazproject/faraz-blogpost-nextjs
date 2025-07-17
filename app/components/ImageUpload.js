"use client"
import { useState, useRef } from "react"
import { UPLOAD_CONSTRAINTS } from "../utils/constants"

export default function ImageUpload({ onImageSelect, currentImage = null }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    // Check file size
    if (file.size > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
      return "File size must be less than 5MB"
    }

    // Check file type
    if (!UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPEG, PNG, GIF, and WebP images are allowed"
    }

    return null
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setError("")

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // In a real application, you would upload to a cloud service like:
      // - Cloudinary
      // - AWS S3
      // - Vercel Blob
      // - Supabase Storage

      // For demo purposes, we'll use the base64 data URL
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onImageSelect(base64)
    } catch (error) {
      console.error("Upload error:", error)
      setError("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Featured Image</label>

      {/* Upload Area */}
      <div className="relative">
        {preview ? (
          // Image Preview
          <div className="relative group">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={uploading}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-200 disabled:opacity-50"
              >
                Change
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={uploading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition duration-200 disabled:opacity-50"
              >
                Remove
              </button>
            </div>

            {/* Upload progress */}
            {uploading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Upload Dropzone
          <div
            onClick={triggerFileInput}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition duration-200 cursor-pointer"
          >
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="text-gray-600">
              <p className="text-lg font-medium mb-2">{uploading ? "Uploading..." : "Click to upload an image"}</p>
              <p className="text-sm">PNG, JPG, GIF, WebP up to 5MB</p>
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Upload guidelines */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Recommended size: 1200x630px for best results</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
      </div>
    </div>
  )
}
