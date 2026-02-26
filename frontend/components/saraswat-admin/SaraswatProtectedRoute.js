"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SaraswatProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const adminAuth = localStorage.getItem("saraswat_admin_auth");
        if (adminAuth !== "true") {
          router.push("/saraswat-admin/login");
        }
      }
    };

    checkAuth();
  }, [router]);

  // Always render children - the redirect will happen if not authenticated
  return <>{children}</>;
}
