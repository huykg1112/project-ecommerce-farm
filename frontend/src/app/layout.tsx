import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Providers } from "@/components/providers"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Nông Sàn - Sàn Thương Mại Điện Tử Nông Nghiệp",
  description:
    "Sàn thương mại điện tử chuyên về nông nghiệp, tập trung vào việc mua bán các sản phẩm nông nghiệp như rau củ, trái cây, hạt giống, vật tư nông nghiệp, và các sản phẩm chế biến từ nông nghiệp.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}



import './globals.css'