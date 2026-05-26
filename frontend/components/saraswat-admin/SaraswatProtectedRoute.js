"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ToastProvider";

export default function SaraswatProtectedRoute({ children, requiredRole = "admin" }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { error: showError } = useToast();
  const hasRedirectedRef = useRef(false);

  const effectiveRole = useMemo(() => {
    if (!user) return null;
    return user.role || user.user_metadata?.role || null;
  }, [user]);

  const isAuthorized = useMemo(() => {
    if (loading) return false;
    if (!user) return false;
    if (requiredRole && effectiveRole !== requiredRole) return false;
    return true;
  }, [loading, user, requiredRole, effectiveRole]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;
      if (typeof window !== "undefined") {
        const redirectPayload = {
          path: window.location.pathname,
          search: window.location.search,
        };
        sessionStorage.setItem("postAuthRedirect", JSON.stringify(redirectPayload));
      }
      router.push("/login");
      return;
    }

    if (requiredRole && effectiveRole !== requiredRole) {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;
      showError("Unauthorized");
      router.push("/");
    }
  }, [loading, user, requiredRole, router, effectiveRole, showError]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth is resolved; if unauthorized we're redirecting (or already did).
  if (!isAuthorized) return null;

  return <>{children}</>;
}
