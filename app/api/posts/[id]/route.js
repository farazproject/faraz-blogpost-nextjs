import { NextResponse } from "next/server"
import connectDB from "../../../lib/mongodb"
import Post from "../../../models/Post"
import User from "../../../models/User"
import { verifyToken, getTokenFromRequest } from "../../../lib/jwt"

// GET single post
export async function GET(request, { params }) {
  try {
    await connectDB()

    const post = await Post.findById(params.id)
      .populate("author", "name email avatar")
      .populate("comments.user", "name email avatar")

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment view count
    post.views += 1
    await post.save()

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// UPDATE post (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if user is admin
    const user = await User.findById(decoded.userId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { title, content, excerpt, category, featuredImage, tags } = await request.json()

    const post = await Post.findByIdAndUpdate(
      params.id,
      {
        title,
        content,
        excerpt,
        category,
        featuredImage,
        tags: tags || [],
      },
      { new: true, runValidators: true },
    ).populate("author", "name email avatar")

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Post updated successfully",
      post,
    })
  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE post (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if user is admin
    const user = await User.findById(decoded.userId)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const post = await Post.findByIdAndDelete(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Post deleted successfully",
    })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
