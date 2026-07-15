import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Loader from "../components/Loader.jsx";

// Each page is loaded as its own separate chunk, only when that
// route is actually visited — this reduces the initial bundle size
// and speeds up first page load.
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const EditProfile = lazy(() => import("../pages/EditProfile.jsx"));
const CreatePost = lazy(() => import("../pages/CreatePost.jsx"));
const EditPost = lazy(() => import("../pages/EditPost.jsx"));
const PostDetails = lazy(() => import("../pages/PostDetails.jsx"));
const Search = lazy(() => import("../pages/Search/Search.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

function AppRoutes() {
  return (
    // Suspense shows the fallback (a loader) while a lazy-loaded
    // page's JS chunk is being downloaded over the network.
    <Suspense fallback={<Loader label="Loading page..." />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/search" element={<Search />} />

        {/* Protected routes — require login */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: any unmatched route shows the 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;