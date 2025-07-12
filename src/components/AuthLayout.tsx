import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import type { RootState } from "../store/store";

interface AuthLayoutProps {
  children: React.ReactNode;
  authentication?: boolean; // true = protected route, false = public route, undefined = either
  redirectTo?: string; // where to redirect if auth fails
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  authentication = true,
  redirectTo,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const authStatus = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    // Wait a moment for auth state to settle
    const checkAuth = () => {
      setLoading(false);

      // If authentication is required but user is not logged in
      if (authentication && !authStatus) {
        const loginRedirect = redirectTo || "/login";
        // Save the current location to redirect back after login
        navigate(loginRedirect, {
          state: { from: location.pathname },
          replace: true,
        });
        return;
      }

      // If user is logged in but trying to access auth pages (login/register)
      if (authentication === false && authStatus) {
        // Get the intended destination from location state or default to home
        const from = location.state?.from || "/";
        navigate(from, { replace: true });
        return;
      }
    };

    // Small delay to ensure auth state is properly loaded
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [authStatus, authentication, navigate, location, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in, don't render children
  if (authentication && !authStatus) {
    return null;
  }

  // If authentication is false (public route) but user is logged in, don't render children
  if (authentication === false && authStatus) {
    return null;
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default AuthLayout;
