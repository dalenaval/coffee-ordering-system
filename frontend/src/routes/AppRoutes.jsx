import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/user/HomePage";
import DashboardPage from "../pages/admin/DashboardPage";
import OrdersPage from "../pages/admin/OrdersPage";
import ReportsPage from "../pages/admin/ReportsPage";
import SystemControlPage from "../pages/admin/SystemControlPage";
import StaffSchedulingPage from "../pages/admin/StaffSchedulingPage";
import EmployeesPage from "../pages/admin/EmployeesPage";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Protected - all logged-in users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "manager", "staff"]}>
                <DashboardPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "manager", "staff"]}>
                <OrdersPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin + Manager only */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <ReportsPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff-scheduling"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <StaffSchedulingPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin", "manager"]}>
                <EmployeesPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/system-control"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={["admin"]}>
                <SystemControlPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
