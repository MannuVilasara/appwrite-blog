import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, LogoutButton } from "../index";

interface stateType {
  auth: {
    status: boolean;
    user: {
      name: string;
      email: string;
      image: string;
    } | null;
  };
}

function Header() {
  const authStatus = useSelector(
    (state: stateType) => state.auth?.status || false
  );
  const user = useSelector((state: stateType) => state.auth?.user || null);

  const navItems = [
    { name: "Home", path: "/", active: true },
    { name: "Login", path: "/login", active: !authStatus },
    { name: "Signup", path: "/signup", active: !authStatus },
    { name: "Posts", path: "/posts", active: authStatus },
    { name: "Drafts", path: "/drafts", active: authStatus },
    { name: "Add Post", path: "/add-post", active: authStatus },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                    clipRule="evenodd"
                  />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Blog</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item =>
              item.active ? (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ) : null
            )}
          </nav>

          {/* Right side - User info or Auth buttons */}
          <div className="flex items-center space-x-4">
            {authStatus && user ? (
              // Authenticated user section
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <LogoutButton />
              </div>
            ) : (
              // Non-authenticated user section
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden border-t border-gray-200 py-3">
          <div className="flex flex-col space-y-2">
            {navItems.map(item =>
              item.active ? (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ) : null
            )}

            {authStatus && user && (
              <div className="sm:hidden pt-2 border-t border-gray-200 mt-2">
                <div className="px-3 py-2">
                  <p className="text-base font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
