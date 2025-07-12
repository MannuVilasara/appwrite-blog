import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import { Footer, Header } from "./components";
import { useNProgress } from "./hooks/useNProgress";
import { debugAppwrite } from "./lib/debug";
import { login, logout } from "./store/authSlice";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Initialize NProgress for route transitions
  useNProgress();

  useEffect(() => {
    // Debug info for development
    if (import.meta.env.DEV) {
      debugAppwrite();
    }

    authService
      .getCurrentUser()
      .then(user => {
        if (user) {
          dispatch(login({ user }));
        } else {
          dispatch(logout());
        }
      })
      .catch(error => {
        // Reduced error logging for normal guest behavior
        if (!error.message?.includes("missing scope")) {
          console.error("Error fetching user:", error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
