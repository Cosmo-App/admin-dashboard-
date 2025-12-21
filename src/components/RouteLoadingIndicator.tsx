"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoadingIndicator() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  // This component can be used to show loading state during route transitions
  return loading ? (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-primary via-red-500 to-primary animate-pulse">
      <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
    </div>
  ) : null;
}
