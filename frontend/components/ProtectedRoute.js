"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();
  const router = useRouter();

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
      router.push("/login");
      return;
    }

    if (requiredRole && effectiveRole !== requiredRole) {
      router.push("/");
    }
  }, [user, loading, requiredRole, router, effectiveRole]);

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
