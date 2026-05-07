import { Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuthStore";

export default function RoleRoute({ children, allowedRoles = [] }) {
  const { accessToken, user } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRoles = allowedRoles.map((item) => item.toLowerCase());

  if (!normalizedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
