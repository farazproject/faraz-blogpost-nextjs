import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BlogSpace - Your Digital Stories",
  description: "A modern blog platform for sharing your thoughts and ideas",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
