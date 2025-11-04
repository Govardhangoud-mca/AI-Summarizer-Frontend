import React, { createContext, useContext, useState, type ReactNode } from "react";
import Swal from "sweetalert2";

const BASE_URL = "http://localhost:8080/api/v1/auth";
const LOGIN_URL = `${BASE_URL}/login`;
const REGISTER_URL = `${BASE_URL}/register`;

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const isAuthenticated = !!token;

  // --- LOGIN FUNCTION ---
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Invalid credentials" }));
        Swal.fire("Login Failed", error.message || "Invalid credentials", "error");
        return false;
      }

      const data = await res.json();

      // ✅ Store JWT + Role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      setToken(data.token);
      setRole(data.role);

      Swal.fire("Success", "Login successful!", "success");
      return true;
    } catch (err) {
      Swal.fire("Error", "Network error during login", "error");
      return false;
    }
  };

  // --- REGISTER FUNCTION ---
  const register = async (username: string, password: string, role: string): Promise<boolean> => {
    try {
      const res = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Error occurred" }));
        Swal.fire("Registration Failed", error.message, "error");
        return false;
      }

      Swal.fire("Success", "Registration successful! Please log in.", "success");
      return true;
    } catch (err) {
      Swal.fire("Error", "Network error during registration", "error");
      return false;
    }
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    Swal.fire("Logged out", "You have been logged out successfully", "info");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
