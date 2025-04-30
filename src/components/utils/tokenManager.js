import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Constants for storage keys
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const REMEMBER_ME_KEY = "auth_remember_me";
const EXPIRY_KEY = "auth_expiry";

// Base API URL
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://wellbands-backend.onrender.com";

// Multi-storage system for cross-browser compatibility
const Storage = (() => {
  // Check if a storage type is available and working
  const isStorageAvailable = (type) => {
    try {
      const storage = window[type];
      const testKey = `__storage_test__${Math.random()}`;
      storage.setItem(testKey, testKey);
      const result = storage.getItem(testKey);
      storage.removeItem(testKey);
      return result === testKey;
    } catch (e) {
      return false;
    }
  };

  // Check storage availability
  const hasLocalStorage = isStorageAvailable("localStorage");
  const hasSessionStorage = isStorageAvailable("sessionStorage");

  // In-memory fallback
  const memoryStorage = new Map();

  // Cookie functions for maximum compatibility
  const setCookie = (name, value, days = 30) => {
    try {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      const expires = `expires=${date.toUTCString()}`;

      // Update cookie settings for maximum cross-browser compatibility
      // Including domain and path helps with subdomain issues
      const domain =
        window.location.hostname === "localhost"
          ? "localhost"
          : `.${window.location.hostname}`;

      // Set the cookie with precise options
      document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax;domain=${domain}`;

      // Test if cookie was actually set
      setTimeout(() => {
        const testRead = getCookie(name);
        if (!testRead) {
          console.warn(
            `Cookie ${name} could not be set. Falling back to localStorage.`
          );
        } else {
          console.log(`Cookie ${name} successfully set.`);
        }
      }, 100);
    } catch (e) {
      console.error("Error setting cookie:", e);
    }
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

  const removeCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
  };

  return {
    setItem: (key, value, isPersistent = false) => {
      try {
        // Always store in memory first for fast access
        memoryStorage.set(key, value);

        // Use cookies for critical auth data for maximum compatibility
        setCookie(key, value, isPersistent ? 30 : 1); // 30 days if persistent

        // Try to use local/session storage as backup
        if (isPersistent && hasLocalStorage) {
          localStorage.setItem(key, value);
        } else if (hasSessionStorage) {
          sessionStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn(`Storage set failed for ${key}`, e);
      }
    },

    getItem: (key) => {
      try {
        // Try memory first (fastest)
        if (memoryStorage.has(key)) {
          return memoryStorage.get(key);
        }

        // Try cookie (most compatible)
        const cookieValue = getCookie(key);
        if (cookieValue) {
          // Sync back to memory
          memoryStorage.set(key, cookieValue);
          return cookieValue;
        }

        // Try localStorage/sessionStorage as fallback
        if (hasLocalStorage) {
          const lsValue = localStorage.getItem(key);
          if (lsValue) {
            memoryStorage.set(key, lsValue);
            return lsValue;
          }
        }

        if (hasSessionStorage) {
          const ssValue = sessionStorage.getItem(key);
          if (ssValue) {
            memoryStorage.set(key, ssValue);
            return ssValue;
          }
        }

        return null;
      } catch (e) {
        console.warn(`Storage get failed for ${key}`, e);
        return null;
      }
    },

    removeItem: (key) => {
      try {
        memoryStorage.delete(key);
        removeCookie(key);

        if (hasLocalStorage) {
          localStorage.removeItem(key);
        }

        if (hasSessionStorage) {
          sessionStorage.removeItem(key);
        }
      } catch (e) {
        console.warn(`Storage remove failed for ${key}`, e);
      }
    },
  };
})();

// Token Manager
const TokenManager = {
  // Set tokens after login
  setTokens: (token, refreshToken, expiresIn, rememberMe) => {
    try {
      const now = Date.now();
      const expiryTime = now + expiresIn * 1000;

      // Store tokens using the multi-storage system
      Storage.setItem(TOKEN_KEY, token, rememberMe);
      Storage.setItem(EXPIRY_KEY, expiryTime.toString(), rememberMe);
      Storage.setItem(REMEMBER_ME_KEY, rememberMe.toString(), rememberMe);

      // Only store refresh token if using "remember me"
      if (rememberMe && refreshToken) {
        Storage.setItem(REFRESH_TOKEN_KEY, refreshToken, true);
      }

      console.log(
        `Tokens stored with rememberMe=${rememberMe}, expires in ${expiresIn} seconds`
      );
      return true;
    } catch (error) {
      console.error("Error storing tokens:", error);
      return false;
    }
  },

  // Get the access token, refresh if needed
  getToken: async () => {
    try {
      const token = Storage.getItem(TOKEN_KEY);
      if (!token) return null;

      // Check if token needs refresh
      const expiryTime = parseInt(Storage.getItem(EXPIRY_KEY) || "0", 10);
      const now = Date.now();

      // Add a 5-minute buffer to refresh before expiry
      const bufferTime = 5 * 60 * 1000; // 5 minutes in ms

      if (now + bufferTime >= expiryTime) {
        console.log("Token expired or about to expire, attempting refresh");

        // Check if we have a refresh token and "remember me" is enabled
        const rememberMe = Storage.getItem(REMEMBER_ME_KEY) === "true";
        const refreshToken = Storage.getItem(REFRESH_TOKEN_KEY);

        if (rememberMe && refreshToken) {
          const newTokens = await TokenManager.refreshToken(refreshToken);
          if (newTokens) {
            return newTokens.token;
          }
        }

        // If refresh failed or wasn't possible, return null
        TokenManager.clearTokens();
        return null;
      }

      // Token is still valid
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  // Refresh the token
  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken,
      });

      const { token, refreshToken: newRefreshToken, expiresIn } = response.data;
      const rememberMe = Storage.getItem(REMEMBER_ME_KEY) === "true";

      TokenManager.setTokens(token, newRefreshToken, expiresIn, rememberMe);

      return {
        token,
        refreshToken: newRefreshToken,
        expiresIn,
      };
    } catch (error) {
      console.error("Token refresh failed:", error);
      TokenManager.clearTokens();
      return null;
    }
  },

  // Clear all tokens
  clearTokens: () => {
    Storage.removeItem(TOKEN_KEY);
    Storage.removeItem(REFRESH_TOKEN_KEY);
    Storage.removeItem(EXPIRY_KEY);
    Storage.removeItem(REMEMBER_ME_KEY);
  },

  // Check if user is remembered
  isRemembered: () => {
    return Storage.getItem(REMEMBER_ME_KEY) === "true";
  },
};

export default TokenManager;
