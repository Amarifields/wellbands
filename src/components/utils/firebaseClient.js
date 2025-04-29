import axios from "axios";
import TokenManager from "./tokenManager";

// PERFORMANCE: Create optimized Firebase API wrapper
const firebaseClient = (() => {
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://wellbands-backend.onrender.com";

  // Create a base axios instance for auth requests
  const authAxios = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Create a token-based API client
  const createApiClient = (token) => {
    const instance = axios.create({
      baseURL: API_URL,
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Add token refresh handling
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // If token expired error, handle refresh logic here
        if (error.response?.status === 401) {
          const newToken = await TokenManager.getToken();

          if (newToken) {
            // Retry the request with the new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axios(error.config);
          } else {
            // Clear token and redirect to login in case of auth error
            TokenManager.clearTokens();
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  };

  // Lightweight token validator (no network request)
  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      // Basic structure check
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Decode payload
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));

      // Check expiration with 1 minute buffer
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime + 60;
    } catch (e) {
      console.error("Error validating token:", e);
      return false;
    }
  };

  return {
    login: async (email, password, rememberMe = false) => {
      try {
        console.log(`Attempting login with rememberMe=${rememberMe}`);
        const response = await authAxios.post("/api/auth/login", {
          email,
          password,
          rememberMe,
        });

        // Store tokens with the TokenManager
        const { token, refreshToken, expiresIn } = response.data;
        TokenManager.setTokens(token, refreshToken, expiresIn, rememberMe);

        return response.data;
      } catch (error) {
        throw error;
      }
    },

    validateToken: async () => {
      // Get token using TokenManager (it handles refresh if needed)
      const token = await TokenManager.getToken();

      if (!token) {
        return { valid: false };
      }

      // Verify with server
      try {
        const response = await axios.get(`${API_URL}/api/auth/validate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        });
        return response.data;
      } catch (error) {
        return { valid: false };
      }
    },

    logout: () => {
      TokenManager.clearTokens();
    },

    createApiClient,
    isTokenValid,
  };
})();

export default firebaseClient;
