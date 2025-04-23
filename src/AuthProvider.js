// src/AuthProvider.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  token: null,
  login: (token) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // login sets token in state+storage
  const login = useCallback((newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }, []);

  // logout clears everything and sends to /login
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  // watch for changes to localStorage from another tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") setToken(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // if token ever becomes null on a protected page, force a redirect
  useEffect(() => {
    const protectedPaths = ["/reset"];
    const path = window.location.pathname;
    if (!token && protectedPaths.includes(path)) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
