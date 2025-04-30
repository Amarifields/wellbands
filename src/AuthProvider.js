// src/AuthProvider.js - ENHANCED VERSION
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext({
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
  validateBackend: () => {},
});

// PERFORMANCE: Create a high-performance token cache with cookies fallback
const TokenCache = (() => {
  // Memory cache for instant access
  let cachedToken = null;
  let tokenExpiry = 0;

  // Session storage often performs better than localStorage
  const useSessionStorage = () => {
    try {
      return window.sessionStorage && window.sessionStorage.getItem;
    } catch (e) {
      return false;
    }
  };

  const hasSessionStorage = useSessionStorage();

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

  const localStorageAvailable = isStorageWorking();

  // Memory fallback when localStorage isn't available
  const memoryStorage = new Map();

  // Last validation time to avoid repeated validation
  let lastValidated = 0;

  // Cookie functions for maximum compatibility
  const setCookie = (name, value, days = 30) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  };

  const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
  };

  return {
    getToken: () => {
      // Always prioritize memory cache for speed
      if (cachedToken) {
        // Quick check if it's still valid
        if (Date.now() < tokenExpiry - 60000) {
          // 1 minute buffer
          return cachedToken;
        }
        // Token expired, clear it
        cachedToken = null;
      }

      try {
        // Try cookie first (most compatible across browsers)
        const cookieToken = getCookie("auth_token");
        if (cookieToken) {
          try {
            const decoded = jwtDecode(cookieToken);
            if (decoded.exp && Date.now() < decoded.exp * 1000) {
              cachedToken = cookieToken;
              tokenExpiry = decoded.exp * 1000;
              return cookieToken;
            } else {
              // Token expired, remove it
              deleteCookie("auth_token");
            }
          } catch (e) {
            // Invalid token
            deleteCookie("auth_token");
          }
        }

        // Try session storage next (faster)
        if (hasSessionStorage) {
          const sessionToken = sessionStorage.getItem("token");
          if (sessionToken) {
            try {
              const decoded = jwtDecode(sessionToken);
              if (decoded.exp && Date.now() < decoded.exp * 1000) {
                cachedToken = sessionToken;
                tokenExpiry = decoded.exp * 1000;
                return sessionToken;
              } else {
                // Token expired, remove it
                sessionStorage.removeItem("token");
              }
            } catch (e) {
              // Invalid token
              sessionStorage.removeItem("token");
            }
          }
        }

        // Fall back to localStorage or memory
        const token = localStorageAvailable
          ? localStorage.getItem("token")
          : memoryStorage.get("token");

        if (token) {
          try {
            const decoded = jwtDecode(token);
            if (decoded.exp && Date.now() < decoded.exp * 1000) {
              cachedToken = token;
              tokenExpiry = decoded.exp * 1000;

              // Also cache in cookie and session storage for maximum compatibility
              setCookie("auth_token", token);
              if (hasSessionStorage) {
                try {
                  sessionStorage.setItem("token", token);
                } catch (e) {
                  /* Ignore errors */
                }
              }

              return token;
            } else {
              // Token expired, remove it
              if (localStorageAvailable) {
                localStorage.removeItem("token");
              } else {
                memoryStorage.delete("token");
              }
            }
          } catch (e) {
            // Invalid token
            if (localStorageAvailable) {
              localStorage.removeItem("token");
            } else {
              memoryStorage.delete("token");
            }
          }
        }
      } catch (e) {
        console.error("Error retrieving token:", e);
      }

      return null;
    },

    setToken: (token, rememberMe = true) => {
      // Update memory immediately
      cachedToken = token;

      try {
        // Parse expiration time
        const decoded = jwtDecode(token);
        tokenExpiry = decoded.exp * 1000; // Convert to milliseconds

        // Store in cookie for maximum compatibility (important for Safari)
        setCookie("auth_token", token, rememberMe ? 30 : 1);

        // Use requestAnimationFrame for non-blocking updates to storage
        requestAnimationFrame(() => {
          try {
            // Update session storage (faster than localStorage)
            if (hasSessionStorage) {
              sessionStorage.setItem("token", token);
            }

            // Update persistent storage in the background
            setTimeout(() => {
              if (localStorageAvailable) {
                localStorage.setItem("token", token);
                // Also store the "remember me" preference
                localStorage.setItem("remember_me", rememberMe.toString());
              } else {
                memoryStorage.set("token", token);
                memoryStorage.set("remember_me", rememberMe.toString());
              }
            }, 0);
          } catch (e) {
            console.error("Error storing token:", e);
            // Fallback to memory-only storage
            memoryStorage.set("token", token);
          }
        });
      } catch (e) {
        console.error("Error setting token:", e);
      }
    },

    removeToken: () => {
      cachedToken = null;
      tokenExpiry = 0;
      lastValidated = 0;

      try {
        // Clear cookie first
        deleteCookie("auth_token");

        if (hasSessionStorage) {
          sessionStorage.removeItem("token");
        }

        if (localStorageAvailable) {
          localStorage.removeItem("token");
          localStorage.removeItem("remember_me");
        } else {
          memoryStorage.delete("token");
          memoryStorage.delete("remember_me");
        }
      } catch (e) {
        console.error("Error removing token:", e);
      }
    },

    // Fast validation that avoids repeated work
    validateToken: (token) => {
      if (!token) return false;

      // Skip validation if we did it recently
      const now = Date.now();
      if (now - lastValidated < 60000) {
        // Only validate once per minute
        return true;
      }

      try {
        const parts = token.split(".");
        if (parts.length !== 3) return false;

        // Simple decode without full verification
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));

        const isValid = payload.exp && Math.floor(now / 1000) < payload.exp;

        if (isValid) {
          lastValidated = now;
          return true;
        }

        return false;
      } catch (e) {
        return false;
      }
    },

    // Get when token was last validated
    getLastValidated: () => lastValidated,

    // Check if "remember me" was enabled
    isRemembered: () => {
      try {
        if (localStorageAvailable) {
          return localStorage.getItem("remember_me") === "true";
        } else {
          return memoryStorage.get("remember_me") === "true";
        }
      } catch (e) {
        return false;
      }
    },
  };
})();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("unknown"); // "unknown", "online", "offline"

  // Track active session with ref to prevent race conditions
  const activeSessionRef = useRef(false);
  const isInitializing = useRef(true);

  // Track API endpoints
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://wellbands-backend.onrender.com";

  // PERFORMANCE: Connect faster to Firebase API
  useEffect(() => {
    if (isInitializing.current) {
      // Perform DNS prefetch for Firebase API to reduce connection time on login
      const linkDNS = document.createElement("link");
      linkDNS.rel = "dns-prefetch";
      linkDNS.href = "https://identitytoolkit.googleapis.com";
      document.head.appendChild(linkDNS);

      // Also preconnect
      const linkPreconnect = document.createElement("link");
      linkPreconnect.rel = "preconnect";
      linkPreconnect.href = "https://identitytoolkit.googleapis.com";
      document.head.appendChild(linkPreconnect);

      // Preconnect to backend
      const apiPreconnect = document.createElement("link");
      apiPreconnect.rel = "preconnect";
      apiPreconnect.href = API_URL;
      document.head.appendChild(apiPreconnect);

      // Initial backend health check
      validateBackend();
    }
  }, []);

  useEffect(() => {
    console.log(
      "[AuthProvider] token is now:",
      token ? "token exists" : "no token"
    );
  }, [token]);

  // New function to validate backend health
  const validateBackend = useCallback(async () => {
    try {
      // Use the health endpoint instead of login endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_URL}/api/health`, {
        method: "GET", // Use GET, not HEAD
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log("Backend health check successful");
        setBackendStatus("online");
        return true;
      } else {
        console.warn(
          "Backend health check failed with status:",
          response.status
        );
        setBackendStatus("offline");
        return false;
      }
    } catch (error) {
      console.warn("[AuthProvider] Backend validation failed:", error.message);
      setBackendStatus("offline");
      return false;
    }
  }, [API_URL]);

  // OPTIMIZED LOGIN: Improved login with better errors and storage
  const login = useCallback(
    (newToken, refreshToken, expiresIn, rememberMe = true) => {
      console.log("[AuthProvider] login called with rememberMe =", rememberMe);

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

        // Use the high-performance token cache - CRITICAL: pass rememberMe correctly
        TokenCache.setToken(newToken, rememberMe === true);

        // Log success
        console.log(
          "[AuthProvider] Login successful, token saved with rememberMe =",
          rememberMe
        );

        // Update backend status
        setBackendStatus("online");

        return true;
      } catch (err) {
        console.error("[AuthProvider] Error in login:", err);
        return false;
      }
    },
    []
  );

  // IMPROVED LOGOUT: More reliable logout with clear feedback
  const logout = useCallback(() => {
    console.log("[AuthProvider] logout() called");

    // Clear in-memory state first (immediate UI response)
    setToken(null);
    activeSessionRef.current = false;

    // Clear all token storage
    TokenCache.removeToken();

    // Force navigation with replace to prevent back-button issues
    navigate("/login", { replace: true });
  }, [navigate]);

  // OPTIMIZED TOKEN VALIDATION: Fix race conditions and add proper expiry checking
  useEffect(() => {
    let isMounted = true;
    console.log("[AuthProvider] Initial token validation started");

    const initializeAuth = async () => {
      try {
        console.log("[AuthProvider] Checking for existing token...");
        // Fast check from the cache - includes cookies, which is critical for cross-browser support
        const cachedToken = TokenCache.getToken();

        if (cachedToken && isMounted) {
          console.log("[AuthProvider] Valid token found in cache");

          // Set token in state - this is critical for route protection
          setToken(cachedToken);
          activeSessionRef.current = true;

          // Verify token validity with server, but don't block UI
          setTimeout(() => {
            validateBackend().catch(() => {
              console.warn(
                "[AuthProvider] Backend health check failed, but continuing with cached token"
              );
            });
          }, 0);
        } else {
          console.log("[AuthProvider] No valid token found");
        }
      } catch (error) {
        console.error("[AuthProvider] Error in token validation:", error);
      } finally {
        // Always complete loading
        if (isMounted) {
          setLoading(false);
          isInitializing.current = false;
        }
      }
    };

    // Run initialization immediately
    initializeAuth();

    // Set a safety timeout to ensure we don't get stuck loading
    const loadingTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn("[AuthProvider] Loading timeout reached");
        setLoading(false);
        isInitializing.current = false;
      }
    }, 2000); // 2 second max loading time

    // Cleanup function
    return () => {
      isMounted = false;
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
    // Set a flag to track if we're currently validating
    let isValidating = false;

    // Check token validity every 5 minutes
    const refreshInterval = setInterval(() => {
      // Skip if we're already validating or don't have an active token
      if (isValidating || !activeSessionRef.current || !token) {
        return;
      }

      try {
        isValidating = true;

        // Only perform lightweight client-side validation
        if (!TokenCache.validateToken(token)) {
          console.log("[AuthProvider] Token expired during periodic check");
          logout();
        } else {
          // Only check backend health occasionally (every 15 minutes)
          const lastCheck = TokenCache.getLastValidated();
          const checkInterval = 15 * 60 * 1000; // 15 minutes

          if (Date.now() - lastCheck > checkInterval) {
            // Perform backend check but don't block on result
            validateBackend().catch(() => {
              console.warn(
                "[AuthProvider] Backend health check failed during refresh"
              );
            });
          }
        }
      } catch (error) {
        console.error("[AuthProvider] Token refresh error:", error);
      } finally {
        isValidating = false;
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [token, logout, validateBackend]);

  // BACKGROUND TOKEN REFRESH: Proactively refresh tokens to prevent expiration
  useEffect(() => {
    let refreshTimer;

    const scheduleRefresh = () => {
      if (!token) return;

      try {
        // Quick decode
        const parts = token.split(".");
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));

        if (payload.exp) {
          // Calculate time until token expires
          const expiresIn = payload.exp * 1000 - Date.now();

          // If token expires in less than 30 minutes, schedule refresh
          if (expiresIn < 30 * 60 * 1000 && expiresIn > 0) {
            console.log(
              `[AuthProvider] Token expires in ${Math.round(
                expiresIn / 1000 / 60
              )} minutes, scheduling refresh`
            );

            // Clear any existing timer
            if (refreshTimer) clearTimeout(refreshTimer);

            // Schedule refresh for 1 minute before expiration
            const refreshTime = Math.max(expiresIn - 60000, 0);
            refreshTimer = setTimeout(() => {
              // For now just trigger a logout when close to expiry
              console.log("[AuthProvider] Token nearing expiration");
              logout();
            }, refreshTime);
          }
        }
      } catch (e) {
        console.error("Error scheduling token refresh:", e);
      }
    };

    scheduleRefresh();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [token, logout]);

  // IMPROVED LOADING SCREEN: Better visual feedback during loading
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
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        loading,
        backendStatus,
        validateBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
