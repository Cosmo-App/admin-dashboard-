import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import RouteLoadingIndicator from "@/components/RouteLoadingIndicator";

const sora = Sora({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Cosmic Admin Dashboard",
  description: "Admin dashboard for Cosmic streaming platform",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E50914",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.className}>
      <body className="antialiased font-sans">
        <RouteLoadingIndicator />
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
