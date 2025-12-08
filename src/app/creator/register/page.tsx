"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useCreatorAuth } from "@/context/CreatorAuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Film, Clapperboard, ArrowRight } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  title: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function CreatorRegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { register: registerCreator } = useCreatorAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      console.log('[CreatorRegister] Submitting registration...');
      await registerCreator({
        name: data.name,
        email: data.email,
        password: data.password,
        title: data.title,
        bio: data.bio,
      });
      
      console.log('[CreatorRegister] Registration successful, redirecting...');
      toast.success("Registration successful! Welcome to Cosmic.");
      
      // Small delay to ensure cookie is set and context updates
      setTimeout(() => {
        router.push("/creator/dashboard");
      }, 100);
    } catch (error: any) {
      console.error("[CreatorRegister] Registration failed:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      // Always reset loading state unless we're redirecting
      setTimeout(() => setIsSubmitting(false), 150);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Film className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Cosmic</h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Creator Account</h2>
          <p className="text-gray-400">Join our community of filmmakers and start sharing your work</p>
        </div>

        {/* Registration Form */}
        <div className="bg-[#1a1a1a] border border-secondary rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-primary text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-primary text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Title (Optional)
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="Director, Producer, Cinematographer..."
              />
              {errors.title && (
                <p className="text-primary text-xs">{errors.title.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Bio (Optional)
              </label>
              <textarea
                {...register("bio")}
                rows={3}
                className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Tell us about yourself and your work..."
              />
              {errors.bio && (
                <p className="text-primary text-xs">{errors.bio.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Password <span className="text-primary">*</span>
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Min. 8 characters"
                />
                {errors.password && (
                  <p className="text-primary text-xs">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Confirm Password <span className="text-primary">*</span>
                </label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  className="w-full px-4 py-3 bg-black border border-secondary rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && (
                  <p className="text-primary text-xs">{errors.confirmPassword.message}</p>
                )}
              </div>
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
                  <Clapperboard className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/creator/login" className="text-primary hover:text-primary/80 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm inline-flex items-center gap-1">
            Back to home
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
