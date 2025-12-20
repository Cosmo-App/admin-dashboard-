"use client";

import React from "react";
import { Shield, Lock, Eye, Database, FileText, Mail, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Public Header */}
      <header className="border-b border-secondary/30 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Phintch</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/users/support" className="text-gray-400 hover:text-white transition-colors text-sm">
              Support
            </Link>
            <Link href="/login" className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </header>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-12">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a] border border-secondary/30 p-8 md:p-10 shadow-2xl shadow-black/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
              <p className="text-gray-400 text-sm">Last Updated: November 30, 2025</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-secondary/50 border border-secondary rounded-2xl p-8">
          <p className="text-gray-300 leading-relaxed">
            Cosmic Distributors LLC ("Phintch," "we," "our," or "us") is committed to protecting your privacy. 
            Phintch is a streaming platform dedicated to independent filmmakers, providing a curated space for 
            creators to showcase their films, documentaries, and creative content to audiences worldwide. This 
            Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
            our mobile application and web platform (the "Service"). Please read this privacy policy carefully.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
          </div>

          {/* 1.1 Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-primary">1.1</span> Personal Information
            </h3>
            <p className="text-gray-300 leading-relaxed">When you create an account as a viewer, we collect:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Username (required for account identification)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Password (encrypted and securely stored)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Email address (optional for users, required for email verification when provided)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>State/Location (optional - primarily for users in New Mexico and surrounding regions)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Profile information (bio, profile picture, cover photo - optional)</span>
              </li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">For independent filmmakers and content creators who register as creators, we additionally collect:</p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Creator name and professional title</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Email address (required for creator accounts)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Professional bio and social media links (Instagram, etc.)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Film metadata (titles, directors, cast, genres, ratings, loglines)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Donation and support links (optional)</span>
              </li>
            </ul>
          </div>

          {/* 1.2 Usage Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-primary">1.2</span> Usage Information
            </h3>
            <p className="text-gray-300 leading-relaxed">
              We automatically collect information about your interaction with the Service to enhance your viewing 
              experience and provide creators with valuable insights:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Films you watch and your watch progress (to resume viewing where you left off)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Films you like or add to your watchlist (to personalize recommendations)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Custom playlists you create and films added to them</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Playlist share codes you generate or use to access shared playlists</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Search queries and browsing patterns within the platform</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Creator profiles you follow and films you engage with</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Device information (device type, operating system, unique device identifiers)</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>App usage data, performance metrics, and viewing quality preferences</span>
              </li>
            </ul>
          </div>

          {/* 1.3 Technical Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-primary">1.3</span> Technical Information
            </h3>
            <p className="text-gray-300 leading-relaxed">
              We collect technical information to provide and improve our Service:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>IP address and general location data</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Browser type and version</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Time zone settings</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Network connection type</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">We use the collected information to create a better platform for both viewers and independent filmmakers:</p>
          <ul className="space-y-3 ml-6">
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To provide, maintain, and continuously improve the Phintch platform and viewing experience</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To personalize film recommendations based on your viewing history and preferences</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To manage your user or creator account and authenticate your identity securely</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To enable features like watchlists, playlists, likes, and playlist sharing via share codes</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To remember your watch progress so you can resume films where you left off</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To verify email addresses when provided for enhanced account security</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To provide creators with anonymized viewing analytics and audience insights</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To communicate with you about platform updates, new films, features, and support</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To analyze viewing patterns and improve our content curation for independent films</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To detect, prevent, and address technical issues, security threats, and unauthorized access</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <span>To comply with legal obligations and enforce our Terms of Service</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Information Sharing and Disclosure */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">3. Information Sharing and Disclosure</h2>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">
              <strong>We do not sell your personal information.</strong> We may share your information only in the following circumstances:
            </p>
          </div>

          {/* 3.1 Service Providers */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-primary">3.1</span> Service Providers
            </h3>
            <p className="text-gray-300 leading-relaxed">
              We may share information with third-party service providers who perform services on our behalf, such as:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>Cloud hosting and storage services</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>Content delivery networks</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>Analytics providers</span>
              </li>
              <li className="text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <span>Payment processors (for paid features)</span>
              </li>
            </ul>
          </div>

          {/* 3.2 Content Creators and Independent Filmmakers */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-primary">3.2</span> Content Creators and Independent Filmmakers
            </h3>
            <p className="text-gray-300 leading-relaxed">
              As a platform dedicated to supporting independent filmmakers, we provide creators with aggregated, 
              anonymized viewing statistics and analytics for their films. This includes metrics such as total views, 
              watch completion rates, and general audience demographics. This information cannot be used to identify 
              individual users and helps filmmakers understand their audience and improve their craft.
            </p>
          </div>

          {/* 3.3 Legal Requirements */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-primary">3.3</span> Legal Requirements
            </h3>
            <p className="text-gray-300 leading-relaxed">
              We may disclose your information if required to do so by law or in response to valid requests by public 
              authorities (e.g., court orders, subpoenas, or government agencies).
            </p>
          </div>

          {/* 3.4 Business Transfers */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-primary">3.4</span> Business Transfers
            </h3>
            <p className="text-gray-300 leading-relaxed">
              If Phintch is involved in a merger, acquisition, or sale of assets, your information may be transferred as part 
              of that transaction. We will provide notice before your information becomes subject to a different privacy policy.
            </p>
          </div>
        </section>

        {/* Section 4: Data Security */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your information against 
            unauthorized access, alteration, disclosure, or destruction. These measures include:
          </p>
          <ul className="space-y-3 ml-6">
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Encryption of data in transit using SSL/TLS protocols</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Encrypted password storage using industry-standard hashing</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Secure authentication and access controls</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <span>Regular security assessments and updates</span>
            </li>
          </ul>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-200 text-sm leading-relaxed">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to 
              protect your information, we cannot guarantee absolute security.
            </p>
          </div>
        </section>

        {/* Section 5: Data Retention */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">5. Data Retention</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">
            We retain your information for as long as your account is active or as needed to provide you with the Service. 
            If you delete your account, we will delete or anonymize your personal information within 30 days, except where 
            we are required to retain it for legal, regulatory, or legitimate business purposes.
          </p>
        </section>

        {/* Section 6: Your Rights and Choices */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">6. Your Rights and Choices</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">
            You have several rights and control options on Phintch:
          </p>
          <div className="space-y-4">
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Access and Update</h4>
              <p className="text-gray-300 text-sm">You can view and update your account information, profile, bio, profile picture, and cover photo through the app's profile and settings sections</p>
            </div>
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Email Verification</h4>
              <p className="text-gray-300 text-sm">If you provide an email address, you can choose to verify it for enhanced account security and communication</p>
            </div>
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Correction</h4>
              <p className="text-gray-300 text-sm">You can correct inaccurate information through your profile settings at any time</p>
            </div>
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Content Management</h4>
              <p className="text-gray-300 text-sm">You can manage your watchlists, playlists, liked films, and viewing history directly in the app</p>
            </div>
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Account Deletion</h4>
              <p className="text-gray-300 text-sm">You can delete your account at any time through the app settings. This will remove your personal information within 30 days</p>
            </div>
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Data Portability</h4>
              <p className="text-gray-300 text-sm">You can request a copy of your viewing data, playlists, and profile information by contacting us</p>
            </div>
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Opt-out</h4>
              <p className="text-gray-300 text-sm">You can opt out of certain data collection by adjusting your device settings or contacting us.</p>
            </div>
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4">
              <h4 className="text-white font-semibold mb-2">Deletion</h4>
              <p className="text-gray-300 text-sm">You can delete your account at any time through the app settings.</p>
            </div>
          </div>
        </section>

        {/* Section 7: Children's Privacy */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">7. Children's Privacy</h2>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-200 text-sm leading-relaxed">
              The Service is not intended for children under the age of 13. We do not knowingly collect personal information 
              from children under 13. If we become aware that we have collected personal information from a child under 13, 
              we will take steps to delete such information promptly.
            </p>
          </div>
        </section>

        {/* Section 8: International Data Transfers */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">8. International Data Transfers</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">
            Your information may be transferred to and maintained on servers located outside of your state, province, or 
            country where data protection laws may differ. By using the Service, you consent to the transfer of your 
            information to the United States and other countries where we operate.
          </p>
        </section>

        {/* Section 9: Cookies and Tracking Technologies */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Third-Party Links and Services</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">
            Phintch may contain links to third-party websites or services, including:
          </p>
          <ul className="space-y-2 ml-6">
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>Filmmakers' social media profiles (Instagram, etc.)</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>Creator donation and support links</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>Video hosting and streaming services (Vimeo, etc.)</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>Cloud storage and content delivery networks (Cloudinary, etc.)</span>
            </li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-4">
            We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy 
            policies before providing any information or interacting with their servicesologies to track activity on our Service and store certain information. 
            You can instruct your device to refuse all cookies or to indicate when a cookie is being sent. However, if you 
            do not accept cookies, you may not be able to use some portions of our Service.
          </p>
        </section>

        {/* Section 10: Third-Party Links */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">10. Third-Party Links</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">
            Our Service may contain links to third-party websites or services (such as filmmakers' social media profiles). 
            We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy 
            policies before providing any information.
          </p>
        </section>

        {/* Section 11: California Privacy Rights */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">11. California Privacy Rights</h2>
          </div>

          <p className="text-gray-300 leading-relaxed mb-4">
            If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA):
          </p>
          <ul className="space-y-3 ml-6">
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
              <span>Right to know what personal information is collected, used, and shared</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
              <span>Right to delete personal information held by us</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
              <span>Right to opt-out of the sale of personal information (we do not sell your information)</span>
            </li>
            <li className="text-gray-300 flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
              <span>Right to non-discrimination for exercising your privacy rights</span>
            </li>
          </ul>
        </section>

        {/* Section 12: Changes to This Privacy Policy */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">12. Changes to This Privacy Policy</h2>
          </div>

          <p className="text-gray-300 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy 
            periodically for any changes. Your continued use of the Service after changes are posted constitutes your 
            acceptance of the updated Privacy Policy.
          </p>
        </section>

        {/* Section 13: Contact Us */}
        <section className="bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30 rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/30 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">13. Contact Us</h2>
          </div>

          <p className="text-gray-300 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          
          <div className="bg-secondary/50 border border-secondary rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold">Cosmic Distributors LLC</p>
                <p className="text-gray-400 text-sm">New Mexico, United States</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-3 border-t border-secondary">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Privacy Inquiries</p>
                <a href="mailto:privacy@phintch.app" className="text-primary hover:underline">privacy@phintch.app</a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-3 border-t border-secondary">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">General Support</p>
                <a href="mailto:support@phintch.app" className="text-primary hover:underline">support@phintch.app</a>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed pt-4">
            For data protection inquiries or to exercise your rights under applicable data protection laws, you may also 
            contact us at the email addresses above.
          </p>
        </section>

        {/* Footer */}
        <div className="bg-secondary/30 border border-secondary rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Cosmic Distributors LLC. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
