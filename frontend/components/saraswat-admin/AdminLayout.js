"use client";

import { useState, useCallback } from "react";
import SaraswatSidebar from "./SaraswatSidebar";
import SaraswatProtectedRoute from "./SaraswatProtectedRoute";

export default function AdminLayout({ children, title, description }) {
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  }, []);

  return (
    <SaraswatProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <SaraswatSidebar />

        <div className="flex-1 ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
            </div>
          </header>

          {/* Message Alert */}
          {message.text && (
            <div className="px-8 mt-4">
              <div
                className={`p-4 rounded-lg ${
                  message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                {message.text}
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="px-8 py-8">{typeof children === "function" ? children({ showMessage }) : children}</main>
        </div>
      </div>
    </SaraswatProtectedRoute>
  );
}
