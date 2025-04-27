// src/AuthProvider.js - OPTIMIZED VERSION (KEEPS SAME LOOK)
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthProvider] token is now:", token);
  }, [token]);

  // PERFORMANCE FIX: Optimized login function
  const login = useCallback((newToken) => {
    // Set token in memory first for immediate UI response
    setToken(newToken);

    // Then store in localStorage (this can be slow on mobile)
    // Use a small timeout to prevent UI blocking
    setTimeout(() => {
      localStorage.setItem("token", newToken);
    }, 0);
  }, []);

  // PERFORMANCE FIX: Optimized logout function
  const logout = useCallback(() => {
    console.log("[AuthProvider] logout() called");
    // Clear token in memory first (fast)
    setToken(null);

    // Then clear localStorage (this can be slow)
    setTimeout(() => {
      localStorage.removeItem("token");
    }, 0);

    navigate("/login", { replace: true });
  }, [navigate]);

  // PERFORMANCE FIX: Optimize token validation on mount
  useEffect(() => {
    // Use a flag to track component mount state
    let isMounted = true;

    const validateToken = async () => {
      try {
        const stored = localStorage.getItem("token");

        if (stored && isMounted) {
          try {
            const decoded = jwtDecode(stored);
            if (decoded.exp && Date.now() < decoded.exp * 1000) {
              setToken(stored);
            } else {
              // Token expired
              localStorage.removeItem("token");
            }
          } catch (error) {
            // Invalid token
            localStorage.removeItem("token");
          }
        }

        // Always complete loading
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Start validation asynchronously with minimal delay
    // This prevents UI blocking on initial load
    const timeoutId = setTimeout(validateToken, 10);

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Keep rest of the code unchanged
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        setToken(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // PERFORMANCE FIX: Better loading screen
  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
          fontSize: "1.2rem",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
