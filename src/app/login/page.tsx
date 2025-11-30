"use client";

import React, { useState } from "react";
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

export default function LoginPage() {
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
      const errorMessage =
        err.response?.data?.error || err.message || "Invalid email or password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-primary/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md animate-slide-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-2xl sm:text-3xl">C</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-3xl sm:text-4xl tracking-tight">Cosmic</h1>
              <p className="text-gray-400 text-sm font-medium">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-secondary border border-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Sign in to your admin account to continue
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-start gap-3 animate-slide-in-up">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-primary text-sm font-semibold">Login failed</p>
                <p className="text-primary/90 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="admin@cosmic.app"
                className={cn(
                  "w-full px-4 py-3.5 bg-black/50 border rounded-xl text-white placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                  "transition-all duration-200 text-sm sm:text-base",
                  errors.email ? "border-primary/50 bg-primary/5" : "border-border hover:border-gray-600"
                )}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-2 text-primary text-xs font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
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
                    "w-full px-4 py-3.5 pr-12 bg-black/50 border rounded-xl text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 text-sm sm:text-base",
                    errors.password ? "border-primary/50 bg-primary/5" : "border-border hover:border-gray-600"
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-secondary-hover rounded-lg transition-all duration-200"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-primary text-xs font-medium flex items-center gap-1">
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
                "w-full py-3.5 sm:py-4 bg-gradient-to-r from-primary to-primary/90 text-white font-semibold rounded-xl",
                "hover:from-primary-hover hover:to-primary-hover",
                "active:scale-[0.98] shadow-lg shadow-primary/20",
                "transition-all duration-200 text-sm sm:text-base",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary disabled:hover:to-primary/90 disabled:active:scale-100"
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
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Protected by Cosmic Security
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Need help?{" "}
          <span className="text-gray-400 hover:text-white transition-colors font-medium">
            Contact your system administrator
          </span>
        </p>
      </div>
    </div>
  );
}
