"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.email, data.password);
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } catch (err: any) {
      console.error("Login error:", err);
      // Error structure from API interceptor: { message, code, details }
      const errorMessage =
        err?.message || err?.response?.data?.message || "Invalid email or password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md animate-slide-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-primary via-primary to-red-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 ring-2 ring-primary/20">
              <span className="text-white font-bold text-3xl sm:text-4xl">C</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-4xl sm:text-5xl tracking-tight">Cosmic</h1>
              <p className="text-zinc-400 text-sm font-medium tracking-wide">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl ring-1 ring-white/5">
          <div className="mb-8">
            <h2 className="text-white text-3xl sm:text-4xl font-bold mb-3">Welcome back</h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              Sign in to your admin account to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/15 border border-red-500/40 rounded-xl flex items-start gap-3 animate-slide-in-up">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 text-sm font-semibold">Login failed</p>
                <p className="text-red-300/90 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white text-sm font-semibold mb-3">
                Email Address
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@cosmic.app"
                className={cn(
                  "w-full px-5 py-4 bg-zinc-950/50 border rounded-xl text-white placeholder-zinc-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                  "transition-all duration-200 text-base",
                  errors.email ? "border-red-500/50 bg-red-500/5" : "border-zinc-700 hover:border-zinc-600"
                )}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-red-400 text-xs font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-white text-sm font-semibold mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-5 py-4 pr-14 bg-zinc-950/50 border rounded-xl text-white placeholder-zinc-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                    "transition-all duration-200 text-base",
                    errors.password ? "border-red-500/50 bg-red-500/5" : "border-zinc-700 hover:border-zinc-600"
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-800 rounded-lg transition-all duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-red-400 text-xs font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-4 bg-linear-to-r from-primary via-primary to-red-700 text-white font-bold rounded-xl",
                "hover:from-red-700 hover:via-primary hover:to-primary",
                "active:scale-[0.98] shadow-xl shadow-primary/30",
                "transition-all duration-300 text-base",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary disabled:hover:to-red-700 disabled:active:scale-100"
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </span>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Protected by Cosmic Security
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="mt-8 text-center text-zinc-500 text-sm">
          Need help?{" "}
          <span className="text-zinc-400 hover:text-white transition-colors font-medium cursor-pointer">
            Contact your system administrator
          </span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
