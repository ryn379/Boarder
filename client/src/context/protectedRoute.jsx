import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth.js";

export default function ProtectedRoute() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
