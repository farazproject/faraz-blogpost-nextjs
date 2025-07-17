import { NextResponse } from "next/server"
import connectDB from "../../../lib/mongodb"
import User from "../../../models/User"
import { signToken } from "../../../lib/jwt"

export async function POST(request) {
  try {
    await connectDB()

    const { email, password, role = "user" } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const user = new User({
      email,
      password,
      role,
      name: email.split("@")[0], // Use email prefix as default name
    })

    await user.save()

    // Generate JWT token
    const token = signToken({ userId: user._id, email: user.email, role: user.role })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
