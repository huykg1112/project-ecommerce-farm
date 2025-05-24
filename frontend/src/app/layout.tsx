import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Farme - Sàn Thương Mại Điện Tử Nông Nghiệp",
  description:
    "Sàn thương mại điện tử chuyên về nông nghiệp, tập trung vào việc mua bán các sản phẩm nông nghiệp như rau củ, trái cây, hạt giống, vật tư nông nghiệp, và các sản phẩm chế biến từ nông nghiệp.",
  generator: "Huy Trần",
  icons: {
    icon: "logoFarme2.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
                 {children}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
      </body>
    </html>
  );
}
