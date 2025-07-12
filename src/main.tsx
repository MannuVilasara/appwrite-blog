import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { AuthLayout, Login, Register } from "./components/index.ts";
import "./index.css";
import {
  About,
  AddPost,
  Contact,
  Drafts,
  EditPost,
  Home,
  NotFound,
  Posts,
  SinglePost,
} from "./pages/index.ts";
import store from "./store/store.ts";

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
      {
        path: "/drafts",
        element: (
          <AuthLayout authentication={true}>
            <Drafts />
          </AuthLayout>
        ),
      },
      {
        path: "/posts/:slug",
        element: <SinglePost />,
      },
      {
        path: "/post/:slug",
        element: <SinglePost />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      // Protected routes - require authentication
      {
        path: "/add-post",
        element: (
          <AuthLayout authentication={true}>
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <AuthLayout authentication={true}>
            <EditPost />
          </AuthLayout>
        ),
      },
      // Auth routes - redirect to home if already logged in
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },
      // Catch-all route for 404 errors
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
