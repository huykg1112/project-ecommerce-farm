import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

export const metadata: Metadata = {
  title: "FarmE - Nền tảng Nông nghiệp",
  description: "Hệ thống quản lý thuốc bảo vệ thực vật cho nông dân và nhà phân phối",
  keywords: "nông nghiệp, thuốc bảo vệ thực vật, phân phối, nông dân",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={inter.className}>
      <body className="min-h-screen bg-gradient-to-br from-primary-light/20 to-white antialiased">{children}</body>
    </html>
  )
}
