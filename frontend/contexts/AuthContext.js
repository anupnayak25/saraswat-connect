"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserWithRole = async (authUser) => {
    if (!authUser) return null;

    const fallbackRole = authUser.user_metadata?.role || "user";

    // Fetch user data including role from users table
    const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).maybeSingle();

    if (error) {
      console.error("Error fetching user role:", error);
      return { ...authUser, role: fallbackRole };
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
        return { ...authUser, role: fallbackRole };
      }

      return { ...authUser, ...newUser };
    }

    return { ...authUser, ...data };
  };

  useEffect(() => {
    // Check active session
    (async () => {
      try {
        const { data: { session } = {} } = await supabase.auth.getSession();
        if (session?.user) {
          const userWithRole = await fetchUserWithRole(session.user);
          setUser(userWithRole);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Avoid refetching the user profile/role on every auth event.
        // In particular, TOKEN_REFRESHED can happen frequently and can create
        // feedback loops if we also hit the DB in response.
        const shouldRefreshProfile =
          _event === "SIGNED_IN" || _event === "USER_UPDATED" || _event === "INITIAL_SESSION";

        if (shouldRefreshProfile) {
          const userWithRole = await fetchUserWithRole(session.user);
          // Preserve any existing enriched fields if the DB lookup fails intermittently.
          setUser((prev) => (prev ? { ...userWithRole, role: prev.role ?? userWithRole.role } : userWithRole));
        } else {
          // Keep the existing enriched user object (role, profile fields) and only
          // update core auth fields if needed.
          setUser((prev) => {
            if (!prev) return { ...session.user, role: session.user.user_metadata?.role || "user" };
            return { ...session.user, ...prev, role: prev.role ?? session.user.user_metadata?.role ?? "user" };
          });
        }
      } catch (error) {
        console.error("Error handling auth change:", error);
      } finally {
        setLoading(false);
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

    if (data?.session?.user && !error) {
      const userWithRole = await fetchUserWithRole(data.session.user);
      setUser(userWithRole);
      return { data: { ...data, user: userWithRole }, error };
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
