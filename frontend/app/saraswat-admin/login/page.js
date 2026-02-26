"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SaraswatAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Hardcoded credentials
  const ADMIN_EMAIL = "admin@saraswathconnect.com";
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    // Check if already logged in
    const adminAuth = localStorage.getItem("saraswat_admin_auth");
    if (adminAuth === "true") {
      router.push("/saraswat-admin");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simple delay to simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Store auth state
      localStorage.setItem("saraswat_admin_auth", "true");
      localStorage.setItem("saraswat_admin_email", email);
      router.push("/saraswat-admin");
    } else {
      setError("Invalid login credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-orange-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">SA</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Saraswat Admin</h1>
          <p className="text-center text-gray-600 mb-8">Sign in to manage your account</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-orange-500 hover:text-orange-600 font-medium text-sm">
              ← Back to Home
            </Link>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Email:</span> {ADMIN_EMAIL}
            </p>
            <p className="text-sm text-blue-700">
              <span className="font-medium">Password:</span> {ADMIN_PASSWORD}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
