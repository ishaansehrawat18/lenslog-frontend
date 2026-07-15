import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Loader from "../components/Loader.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const EditProfile = lazy(() => import("../pages/EditProfile.jsx"));
const CreatePost = lazy(() => import("../pages/CreatePost.jsx"));
const EditPost = lazy(() => import("../pages/EditPost.jsx"));
const PostDetails = lazy(() => import("../pages/PostDetails.jsx"));
const Search = lazy(() => import("../pages/Search/Search.jsx"));
const UserProfile = lazy(() => import("../pages/UserProfile.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

function AppRoutes() {
  return (
    <Suspense fallback={<Loader label="Loading page..." />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/users/:username" element={<UserProfile />} />

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