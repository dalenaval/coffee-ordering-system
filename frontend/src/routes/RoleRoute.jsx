import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, allowedRoles = [] }) {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(rawUser);

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
