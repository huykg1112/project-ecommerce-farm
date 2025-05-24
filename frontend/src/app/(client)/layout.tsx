import { Providers } from "@/components/common/providers";
import Footer from "@/layouts/Home/footer";
import Header from "@/layouts/Home/header";
import "@/styles/globals.css";
import type React from "react";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
  
  );
}
