"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAuthorized = useMemo(() => {
    if (loading) return false;
    if (!user) return false;
    if (requiredRole && user.user_metadata?.role !== requiredRole) return false;
    return true;
  }, [loading, user, requiredRole]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (requiredRole && user.user_metadata?.role !== requiredRole) {
      router.push("/");
    }
  }, [user, loading, requiredRole, router]);

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
