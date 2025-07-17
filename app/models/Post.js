import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
      maxlength: [500, "Comment must be less than 500 characters"],
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: [300, "Reply must be less than 300 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title must be less than 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [300, "Excerpt must be less than 300 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [100, "Content must be at least 100 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Technology",
        "Web Development",
        "JavaScript",
        "React",
        "Next.js",
        "CSS",
        "Design",
        "Tutorial",
        "News",
        "Opinion",
        "AI & Machine Learning",
        "Mobile Development",
        "DevOps",
        "Database",
        "Security",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    featuredImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [CommentSchema],
    readingTime: {
      type: Number,
      default: 0,
    },
    isSticky: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    seoTitle: {
      type: String,
      maxlength: [60, "SEO title must be less than 60 characters"],
    },
    seoDescription: {
      type: String,
      maxlength: [160, "SEO description must be less than 160 characters"],
    },
    seoKeywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Indexes for better query performance
PostSchema.index({ status: 1, publishedAt: -1 })
PostSchema.index({ author: 1, status: 1 })
PostSchema.index({ category: 1, status: 1 })
PostSchema.index({ tags: 1 })
PostSchema.index({ slug: 1 })
PostSchema.index({ title: "text", content: "text", excerpt: "text" })
PostSchema.index({ createdAt: -1 })
PostSchema.index({ views: -1 })
PostSchema.index({ likes: 1 })

// Pre-save middleware to generate slug and calculate reading time
PostSchema.pre("save", function (next) {
  // Generate slug from title if not provided
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified("content")) {
    const wordCount = this.content
      .replace(/<[^>]*>/g, "")
      .trim()
      .split(/\s+/).length
    this.readingTime = Math.ceil(wordCount / 200)
  }

  // Set publishedAt when status changes to published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date()
  }

  next()
})

// Virtual for like count
PostSchema.virtual("likeCount").get(function () {
  return this.likes ? this.likes.length : 0
})

// Virtual for comment count
PostSchema.virtual("commentCount").get(function () {
  return this.comments ? this.comments.filter((comment) => comment.isApproved).length : 0
})

// Virtual for URL
PostSchema.virtual("url").get(function () {
  return `/posts/${this.slug || this._id}`
})

// Instance method to check if user liked the post
PostSchema.methods.isLikedBy = function (userId) {
  return this.likes.includes(userId)
}

// Instance method to toggle like
PostSchema.methods.toggleLike = function (userId) {
  const index = this.likes.indexOf(userId)
  if (index > -1) {
    this.likes.splice(index, 1)
  } else {
    this.likes.push(userId)
  }
  return this.save()
}

// Instance method to add comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({
    user: userId,
    content: content,
  })
  return this.save()
}

// Static method to find published posts
PostSchema.statics.findPublished = function () {
  return this.find({ status: "published" }).sort({ publishedAt: -1 })
}

// Static method to find posts by category
PostSchema.statics.findByCategory = function (category) {
  return this.find({ category, status: "published" }).sort({ publishedAt: -1 })
}

// Static method to search posts
PostSchema.statics.search = function (query) {
  return this.find({
    $and: [
      { status: "published" },
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
          { excerpt: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
        ],
      },
    ],
  }).sort({ publishedAt: -1 })
}

// Static method to find popular posts
PostSchema.statics.findPopular = function (limit = 10) {
  return this.find({ status: "published" }).sort({ views: -1, likeCount: -1 }).limit(limit)
}

// Static method to find recent posts
PostSchema.statics.findRecent = function (limit = 10) {
  return this.find({ status: "published" }).sort({ publishedAt: -1 }).limit(limit)
}

// Static method to find featured posts
PostSchema.statics.findFeatured = function () {
  return this.find({ status: "published", isFeatured: true }).sort({ publishedAt: -1 })
}

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema)

export default Post
