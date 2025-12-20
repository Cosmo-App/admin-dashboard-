"use client";

import React from "react";
import { Mail, MessageSquare, Phone, Globe, AlertCircle, Clock, FileText, HelpCircle, ExternalLink, Shield } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
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
            <Link href="/users/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
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
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Support & Help Center</h1>
              <p className="text-gray-400">We're here to help you with any questions or issues</p>
            </div>
          </div>
        </div>

        {/* Quick Support Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Email Support */}
          <a 
            href="mailto:support@phintch.app"
            className="bg-secondary/30 border border-secondary rounded-2xl p-6 hover:bg-secondary/50 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">Email Support</h3>
                <p className="text-gray-400 text-sm mb-3">Get help via email for technical issues, account problems, or general inquiries</p>
                <p className="text-primary text-sm font-medium">support@phintch.app</p>
              </div>
            </div>
          </a>

          {/* Privacy Inquiries */}
          <a 
            href="mailto:privacy@phintch.app"
            className="bg-secondary/30 border border-secondary rounded-2xl p-6 hover:bg-secondary/50 hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">Privacy & Data Protection</h3>
                <p className="text-gray-400 text-sm mb-3">Questions about privacy, data handling, or exercising your rights</p>
                <p className="text-blue-400 text-sm font-medium">privacy@phintch.app</p>
              </div>
            </div>
          </a>
        </div>

        {/* Contact Information */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Contact Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-secondary/50 border border-secondary rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Company</p>
                  <p className="text-white font-semibold">Cosmic Distributors LLC</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">General Support</p>
                  <a href="mailto:support@phintch.app" className="text-white hover:text-primary transition-colors">support@phintch.app</a>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 border border-secondary rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Privacy Inquiries</p>
                  <a href="mailto:privacy@phintch.app" className="text-white hover:text-primary transition-colors">privacy@phintch.app</a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white">New Mexico, United States</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Hours */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Support Hours & Response Time</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Email Response Time</p>
              <p className="text-white text-2xl font-bold">24-48h</p>
              <p className="text-gray-500 text-xs mt-1">Business days</p>
            </div>
            
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Urgent Issues</p>
              <p className="text-white text-2xl font-bold">8-12h</p>
              <p className="text-gray-500 text-xs mt-1">Critical problems</p>
            </div>
            
            <div className="bg-secondary/50 border border-secondary rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Business Hours</p>
              <p className="text-white text-2xl font-bold">9AM-5PM</p>
              <p className="text-gray-500 text-xs mt-1">MST (Mountain Time)</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-200 text-sm">
              <strong>Note:</strong> We aim to respond to all inquiries within 24-48 hours during business days. 
              For urgent technical issues affecting service availability, we prioritize responses within 8-12 hours.
            </p>
          </div>
        </section>

        {/* Common Issues & Solutions */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Common Issues & Quick Solutions</h2>
          </div>

          <div className="space-y-4">
            {/* Account Issues */}
            <div className="bg-secondary/50 border border-secondary rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center text-xs text-primary">1</span>
                Account Login Issues
              </h3>
              <ul className="space-y-2 ml-8 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ensure you're using the correct username and password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check if your account email has been verified</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Clear your browser cache and cookies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Contact support if you've forgotten your password</span>
                </li>
              </ul>
            </div>

            {/* Video Playback */}
            <div className="bg-secondary/50 border border-secondary rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center text-xs text-primary">2</span>
                Video Playback Problems
              </h3>
              <ul className="space-y-2 ml-8 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check your internet connection speed (minimum 5 Mbps recommended)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Try refreshing the page or restarting the app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ensure your device software is up to date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Videos are hosted on Vimeo - check if Vimeo is accessible in your region</span>
                </li>
              </ul>
            </div>

            {/* Profile & Settings */}
            <div className="bg-secondary/50 border border-secondary rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center text-xs text-primary">3</span>
                Profile & Photo Upload Issues
              </h3>
              <ul className="space-y-2 ml-8 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Supported formats: JPG, PNG (max 5MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Grant photo library permissions in your device settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check your internet connection for uploads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Try uploading a different image if one fails</span>
                </li>
              </ul>
            </div>

            {/* Playlist Sharing */}
            <div className="bg-secondary/50 border border-secondary rounded-xl p-5">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center text-xs text-primary">4</span>
                Playlist Sharing Issues
              </h3>
              <ul className="space-y-2 ml-8 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ensure the playlist is set to "public" or has a valid share code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Share codes are case-sensitive - double check the code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Regenerate the share code if it's not working</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Check if the playlist still contains films</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Creator Support */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">For Content Creators</h2>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Are you an independent filmmaker interested in showcasing your work on Phintch? We'd love to hear from you!
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 rounded-xl p-6 space-y-4">
              <h3 className="text-white font-semibold text-lg">Creator Inquiries</h3>
              <p className="text-gray-300 text-sm">
                Contact us to learn about submitting your films, accessing creator analytics, and joining our 
                community of independent filmmakers.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:creators@phintch.app" className="text-primary hover:underline font-medium">
                  creators@phintch.app
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="bg-secondary/30 border border-secondary rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Additional Resources</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="/users/privacy"
              className="bg-secondary/50 border border-secondary rounded-xl p-5 hover:bg-secondary/70 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1 group-hover:text-primary transition-colors">Privacy Policy</h3>
                  <p className="text-gray-400 text-sm">Learn about how we protect your data</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </a>

            <a 
              href="https://phintch.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary/50 border border-secondary rounded-xl p-5 hover:bg-secondary/70 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1 group-hover:text-primary transition-colors">Phintch Website</h3>
                  <p className="text-gray-400 text-sm">Visit our main website</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </a>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-secondary/30 border border-secondary rounded-2xl p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">
            Can't find what you're looking for?
          </p>
          <a 
            href="mailto:support@phintch.app"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <Mail className="w-4 h-4" />
            Contact our support team
          </a>
        </div>
      </div>
    </div>
  );
}
