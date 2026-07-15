import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// Lets components do `const { user, login, logout } = useAuth();`
// instead of importing useContext + AuthContext everywhere.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}