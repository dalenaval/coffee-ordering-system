import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuthStore";

export default function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
