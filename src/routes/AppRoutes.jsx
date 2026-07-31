import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import Loader from "../components/Loader.jsx";
import PageTransition from "../components/PageTransition.jsx";

const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("../pages/ResetPassword.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const EditProfile = lazy(() => import("../pages/EditProfile.jsx"));
const CreatePost = lazy(() => import("../pages/CreatePost.jsx"));
const EditPost = lazy(() => import("../pages/EditPost.jsx"));
const PostDetails = lazy(() => import("../pages/PostDetails.jsx"));
const Search = lazy(() => import("../pages/Search/Search.jsx"));
const UserProfile = lazy(() => import("../pages/UserProfile.jsx"));
const SavedPosts = lazy(() => import("../pages/SavedPosts.jsx"));
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard.jsx"));
const Messages = lazy(() => import("../pages/Messages/Messages.jsx"));
const ChatThread = lazy(() => import("../pages/Messages/ChatThread.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

// Small helper so every route below stays a one-liner instead of
// repeating <PageTransition><Comp /></PageTransition> everywhere.
const withTransition = (Component) => (
  <PageTransition>
    <Component />
  </PageTransition>
);

function AppRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<Loader label="Loading page..." />}>
      {/* mode="wait" ensures the old page fully exits before the new
          one enters, avoiding an awkward overlap. key={pathname} is
          what tells AnimatePresence a route change actually happened. */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={withTransition(Home)} />
          <Route path="/login" element={withTransition(Login)} />
          <Route path="/register" element={withTransition(Register)} />
          <Route path="/forgot-password" element={withTransition(ForgotPassword)} />
          <Route path="/reset-password/:token" element={withTransition(ResetPassword)} />
          <Route path="/posts/:id" element={withTransition(PostDetails)} />
          <Route path="/search" element={withTransition(Search)} />
          <Route path="/users/:username" element={withTransition(UserProfile)} />

          {/* Protected routes — require login */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <EditProfile />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <CreatePost />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <EditPost />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <SavedPosts />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Messages />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:userId"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ChatThread />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Admin-only route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </AdminRoute>
            }
          />

          {/* Catch-all: any unmatched route shows the 404 page */}
          <Route path="*" element={withTransition(NotFound)} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AppRoutes;