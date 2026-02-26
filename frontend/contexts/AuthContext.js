"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserWithRole = async (authUser) => {
    if (!authUser) return null;

    // Fetch user data including role from users table
    const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).maybeSingle();

    if (error) {
      console.error("Error fetching user role:", error);
      return { ...authUser, role: "user" }; // Default to user if error
    }

    // If user doesn't exist in users table, create it
    if (!data) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || "",
            phone: authUser.user_metadata?.phone || "",
            role: "user", // Default role
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating user record:", insertError);
        return { ...authUser, role: "user" }; // Default to user if error
      }

      return { ...authUser, ...newUser };
    }

    return { ...authUser, ...data };
  };

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const userWithRole = await fetchUserWithRole(session.user);
        setUser(userWithRole);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userWithRole = await fetchUserWithRole(session.user);
        setUser(userWithRole);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user && !error) {
      const userWithRole = await fetchUserWithRole(data.user);
      setUser(userWithRole);
      return { data: { ...data, user: userWithRole }, error };
    }

    return { data, error };
  };

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    // Create user record in users table with role
    if (data?.user && !error) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: metadata.full_name || "",
          phone: metadata.phone || "",
          role: metadata.role || "user", // Default role is 'user'
        },
      ]);

      if (insertError) {
        console.error("Error creating user record:", insertError);
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    return { error };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
