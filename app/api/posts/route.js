import { NextResponse } from "next/server"
import connectDB from "../../lib/mongodb"
import Post from "../../models/Post"
import User from "../../models/User"
import { verifyToken, getTokenFromRequest } from "../../lib/jwt"

// GET all posts
export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10

    // Build query
    const query = { status: "published" }

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ]
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get posts with author information
    const posts = await Post.find(query)
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Post.countDocuments(query)

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// CREATE new post (Admin only)
export async function POST(request) {
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

    // Validate required fields
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json({ error: "Title, content, excerpt, and category are required" }, { status: 400 })
    }

    // Create new post
    const post = new Post({
      title,
      content,
      excerpt,
      category,
      featuredImage,
      tags: tags || [],
      author: user._id,
    })

    await post.save()
    await post.populate("author", "name email avatar")

    return NextResponse.json(
      {
        message: "Post created successfully",
        post,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
