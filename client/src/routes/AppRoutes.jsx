import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
            path="/login"
            element={
                <PublicRoute>
                <Login />
                </PublicRoute>
            }
        />

        <Route
            path="/register"
            element={
                <PublicRoute>
                <Register />
                </PublicRoute>
            }
        />
        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                <Dashboard />
                </ProtectedRoute>
            }
        />
        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
            }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;