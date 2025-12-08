"use client";

import React from "react";
import { CreatorAuthProvider } from "@/context/CreatorAuthContext";
import { ToastProvider } from "@/context/ToastContext";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CreatorAuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </CreatorAuthProvider>
  );
}
