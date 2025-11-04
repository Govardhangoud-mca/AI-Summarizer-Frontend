import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Welcome from "./pages/Welcome";
import SummarizerPage from "./pages/SummarizerPage";
import LoginModal from "./component/LoginModal";
import AdminDashboard from "./pages/AdminDashboard";

const AuthGate: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated && window.location.pathname === "/home") {
    return <LoginModal />;
  }
  return null;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/home" element={<SummarizerPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    {/* ✅ Correct Admin Path */}
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppRoutes />
      <AuthGate />
    </AuthProvider>
  </Router>
);

export default App;
