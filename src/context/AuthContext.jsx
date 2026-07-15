import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/authService.js";

export const AuthContext = createContext(null);

const TOKEN_KEY = "lenslog_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, if a token exists in localStorage, try to fetch the
  // logged-in user so a page refresh doesn't log the user out.
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Token invalid/expired — clear it
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data);
    return data;
  };

  const register = async (formValues) => {
    const data = await registerUser(formValues);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  // Allows other parts of the app (e.g. after profile update) to
  // update the cached user object without a full re-fetch.
  const updateUserInContext = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUserInContext }}
    >
      {children}
    </AuthContext.Provider>
  );
}