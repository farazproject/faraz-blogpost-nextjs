import mongoose from "mongoose"

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: 300,
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
      ],
    },
    featuredImage: {
      type: String,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: 1000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    readTime: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Generate slug before saving
PostSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  // Calculate read time (average 200 words per minute)
  const wordCount = this.content.replace(/<[^>]*>/g, "").split(/\s+/).length
  this.readTime = Math.ceil(wordCount / 200)

  next()
})

// Virtual for like count
PostSchema.virtual("likeCount").get(function () {
  return this.likes.length
})

// Virtual for comment count
PostSchema.virtual("commentCount").get(function () {
  return this.comments.length
})

// Ensure virtuals are included in JSON
PostSchema.set("toJSON", { virtuals: true })

export default mongoose.models.Post || mongoose.model("Post", PostSchema)
