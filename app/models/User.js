import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [200, "Bio must be less than 200 characters"],
      default: "",
    },
    website: {
      type: String,
      validate: {
        validator: (v) => {
          if (!v) return true // Allow empty string
          return /^https?:\/\/.+/.test(v)
        },
        message: "Please enter a valid URL",
      },
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password
        delete ret.emailVerificationToken
        delete ret.passwordResetToken
        delete ret.passwordResetExpires
        return ret
      },
    },
  },
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ isActive: 1 })
UserSchema.index({ createdAt: -1 })

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next()

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Instance method to check password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw new Error("Password comparison failed")
  }
}

// Instance method to generate password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = require("crypto").randomBytes(32).toString("hex")

  this.passwordResetToken = require("crypto").createHash("sha256").update(resetToken).digest("hex")

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken
}

// Instance method to generate email verification token
UserSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = require("crypto").randomBytes(32).toString("hex")

  this.emailVerificationToken = require("crypto").createHash("sha256").update(verificationToken).digest("hex")

  return verificationToken
}

// Static method to find user by email
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Static method to find active users
UserSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true })
}

// Static method to find admins
UserSchema.statics.findAdmins = function () {
  return this.find({ role: "admin", isActive: true })
}

// Virtual for full name (if you want to split first/last name later)
UserSchema.virtual("displayName").get(function () {
  return this.name || this.email
})

// Virtual for user stats (to be populated with aggregation)
UserSchema.virtual("stats", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  count: true,
})

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User
