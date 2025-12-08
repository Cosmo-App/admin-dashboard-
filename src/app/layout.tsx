import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CreatorAuthProvider } from "@/context/CreatorAuthContext";
import { ToastProvider } from "@/context/ToastContext";

const sora = Sora({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cosmic Admin Dashboard",
  description: "Admin dashboard for Cosmic streaming platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.className}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <CreatorAuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </CreatorAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
