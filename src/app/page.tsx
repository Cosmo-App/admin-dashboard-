import React from "react";
import Link from "next/link";
import { Shield, UserCircle, ArrowRight, Film } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Cosmic</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Welcome to Cosmic
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The ultimate streaming platform management suite. Access your dashboard to manage content, analyze performance, and grow your audience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          {/* Admin Portal Card */}
          <Link 
            href="/login"
            className="group relative overflow-hidden rounded-3xl bg-secondary/40 border border-white/5 p-8 hover:bg-secondary/60 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Admin Portal</h2>
              <p className="text-gray-400 mb-8 flex-1">
                Access the master control panel. Manage users, films, playlists, and system-wide settings.
              </p>
              
              <div className="flex items-center text-sm font-semibold text-white group-hover:translate-x-2 transition-transform">
                Login as Admin <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>

          {/* Creator Studio Card */}
          <Link 
            href="/creator/login"
            className="group relative overflow-hidden rounded-3xl bg-secondary/40 border border-white/5 p-8 hover:bg-secondary/60 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserCircle className="w-7 h-7 text-blue-500" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors">Creator Studio</h2>
              <p className="text-gray-400 mb-8 flex-1">
                Manage your film portfolio. Upload content, track performance metrics, and engage with your audience.
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center text-sm font-semibold text-white group-hover:translate-x-2 transition-transform">
                  Login as Creator <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            New Creator?{" "}
            <Link href="/creator/register" className="text-white hover:text-primary transition-colors font-medium">
              Apply for an account
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Cosmic Streaming. All rights reserved.</p>
      </footer>
    </div>
  );
}
