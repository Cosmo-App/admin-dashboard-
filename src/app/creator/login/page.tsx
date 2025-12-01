"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Film, LogIn, ArrowRight } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function CreatorLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await api.post("/v2/auth/creator/login", {
        email: data.email,
        password: data.password,
      });
      
      router.push("/creator/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Film className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Cosmic</h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Creator Sign In</h2>
          <p className="text-gray-400">Welcome back! Sign in to manage your films</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1a1a1a] border border-secondary rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email Address</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-primary text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-primary text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/creator/register" className="text-primary hover:text-primary/80 font-medium">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        {/* Back Links */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-400 inline-flex items-center gap-1">
            Back to home
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link href="/login" className="text-gray-500 hover:text-gray-400">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
