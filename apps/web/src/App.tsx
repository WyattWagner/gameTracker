import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./api/AuthContext";
import { AppShell } from "./components/AppShell";
import { LoginPage } from "./pages/LoginPage";

function ProtectedLayout() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <AppShell />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
