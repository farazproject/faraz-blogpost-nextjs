import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BlogSpace - Share Your Stories",
  description: "A modern blogging platform where stories come to life. Share your thoughts, connect with readers, and build your audience.",
  keywords: "blog, blogging, stories, writing, community, Next.js",
  authors: [{ name: "BlogSpace Team" }],
  creator: "BlogSpace",
  publisher: "BlogSpace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "BlogSpace - Share Your Stories",
    description: "A modern blogging platform where stories come to life. Share your thoughts, connect with readers, and build your audience.",
    url: "/",
    siteName: "BlogSpace",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BlogSpace - Share Your Stories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogSpace - Share Your Stories",
    description: "A modern blogging platform where stories come to life. Share your thoughts, connect with readers, and build your audience.",
    images: ["/og-image.jpg"],
    creator: "@blogspace",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",\
"max,
    generator: 'v0.dev'

