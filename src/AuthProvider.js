// src/AuthProvider.js - FIXED VERSION
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

// STORAGE FIX: Create a storage wrapper with fallbacks for Safari's limits
const createSecureStorage = () => {
  // Check if localStorage is actually working (Safari may claim it exists but fail)
  const isStorageWorking = () => {
    try {
      const testKey = "__test__";
      localStorage.setItem(testKey, testKey);
      const result = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return result === testKey;
    } catch (e) {
      return false;
    }
  };

  const storageAvailable = isStorageWorking();

  // Memory fallback when localStorage isn't available
  const memoryStorage = new Map();

  return {
    getItem: (key) => {
      try {
        if (storageAvailable) {
          return localStorage.getItem(key);
        } else {
          return memoryStorage.get(key) || null;
        }
      } catch (e) {
        console.warn("Storage get failed, using memory fallback", e);
        return memoryStorage.get(key) || null;
      }
    },
    setItem: (key, value) => {
      try {
        if (storageAvailable) {
          localStorage.setItem(key, value);
        } else {
          memoryStorage.set(key, value);
        }
      } catch (e) {
        console.warn("Storage set failed, using memory fallback", e);
        memoryStorage.set(key, value);
      }
    },
    removeItem: (key) => {
      try {
        if (storageAvailable) {
          localStorage.removeItem(key);
        } else {
          memoryStorage.delete(key);
        }
      } catch (e) {
        console.warn("Storage remove failed", e);
        memoryStorage.delete(key);
      }
    },
  };
};

const secureStorage = createSecureStorage();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track active session with ref to prevent race conditions
  const activeSessionRef = useRef(false);

  useEffect(() => {
    console.log("[AuthProvider] token is now:", token);
  }, [token]);

  // ROBUST LOGIN: Improved login with better errors and storage
  const login = useCallback((newToken) => {
    console.log("[AuthProvider] login with new token");

    // Validate token structure before setting
    if (!newToken || typeof newToken !== "string" || newToken.trim() === "") {
      console.error("[AuthProvider] Invalid token format received");
      return false;
    }

    try {
      // Quick validation of token format before storing
      const parts = newToken.split(".");
      if (parts.length !== 3) {
        console.error("[AuthProvider] Invalid JWT format");
        return false;
      }

      // Set token in memory immediately for UI
      setToken(newToken);
      activeSessionRef.current = true;

      // Then persist to storage asynchronously
      if (window.requestIdleCallback) {
        // Use requestIdleCallback for modern browsers (smoother UI)
        window.requestIdleCallback(() => {
          secureStorage.setItem("token", newToken);
        });
      } else {
        // Fallback to setTimeout for older browsers
        setTimeout(() => {
          secureStorage.setItem("token", newToken);
        }, 0);
      }

      return true;
    } catch (err) {
      console.error("[AuthProvider] Error in login:", err);
      return false;
    }
  }, []);

  // IMPROVED LOGOUT: More reliable logout with clear feedback
  const logout = useCallback(() => {
    console.log("[AuthProvider] logout() called");

    // Clear in-memory state first (immediate UI response)
    setToken(null);
    activeSessionRef.current = false;

    // Then clear storage asynchronously
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        secureStorage.removeItem("token");
      });
    } else {
      setTimeout(() => {
        secureStorage.removeItem("token");
      }, 0);
    }

    // Force navigation with replace to prevent back-button issues
    navigate("/login", { replace: true });
  }, [navigate]);

  // TOKEN VALIDATION: Fix race conditions and add proper expiry checking
  useEffect(() => {
    let isMounted = true;
    console.log("[AuthProvider] Initial token validation started");

    const validateToken = async () => {
      try {
        const stored = secureStorage.getItem("token");
        console.log("[AuthProvider] Retrieved token from storage:", !!stored);

        if (stored && isMounted) {
          try {
            // Parse token and check expiration
            const decoded = jwtDecode(stored);

            // Add a 60-second buffer to expire slightly early
            // to prevent edge cases where token expires during use
            const bufferTime = 60; // seconds
            const isTokenValid =
              decoded.exp &&
              Math.floor(Date.now() / 1000) < decoded.exp - bufferTime;

            if (isTokenValid) {
              console.log("[AuthProvider] Valid token found");
              setToken(stored);
              activeSessionRef.current = true;
            } else {
              console.log("[AuthProvider] Expired token found");
              secureStorage.removeItem("token");
            }
          } catch (error) {
            console.error("[AuthProvider] Token validation error:", error);
            secureStorage.removeItem("token");
          }
        }

        // Always complete loading
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("[AuthProvider] Error in token validation:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Set a maximum time for initial validation
    const loadingTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn("[AuthProvider] Loading timeout reached");
        setLoading(false);
      }
    }, 3000); // 3 seconds max loading time

    // Validate with minimal delay
    const validationTimeout = setTimeout(validateToken, 10);

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(validationTimeout);
      clearTimeout(loadingTimeout);
    };
  }, []);

  // IMPROVED STORAGE SYNC: Handle storage events from other tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        console.log("[AuthProvider] Storage event detected");
        // Token was changed in another tab
        if (e.newValue) {
          // Another tab logged in
          setToken(e.newValue);
          activeSessionRef.current = true;
        } else {
          // Another tab logged out
          setToken(null);
          activeSessionRef.current = false;
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // AUTOMATIC SESSION REFRESH: Add periodic token validation
  useEffect(() => {
    // Check token validity every 5 minutes
    const refreshInterval = setInterval(() => {
      if (activeSessionRef.current) {
        const storedToken = secureStorage.getItem("token");
        if (storedToken) {
          try {
            const decoded = jwtDecode(storedToken);
            // Check if token expires in next 10 minutes
            const tenMinutes = 10 * 60; // 10 minutes in seconds
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp && currentTime > decoded.exp - tenMinutes) {
              console.log(
                "[AuthProvider] Token nearing expiration, logging out"
              );
              logout();
            }
          } catch (error) {
            console.error("[AuthProvider] Token refresh error:", error);
            logout();
          }
        } else if (token) {
          // Memory and storage are out of sync, prioritize memory
          secureStorage.setItem("token", token);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [token, logout]);

  // IMPROVED LOADING: Better loading screen
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
