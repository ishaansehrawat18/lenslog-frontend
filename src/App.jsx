import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ConfirmProvider } from "./context/ConfirmContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import Navbar from "./components/Navbar.jsx";
import MobileNav from "./components/MobileNav.jsx";
import AIChatWidget from "./components/AIChatWidget/AIChatWidget.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show the 3D splash once per full page load, then reveal the app.
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <SocketProvider>
        <ConfirmProvider>
          <SplashScreen visible={showSplash} />
          <Navbar />
          <main className="pb-20 lg:pb-0">
            <AppRoutes />
          </main>
          <MobileNav />
          <AIChatWidget />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "12px",
                background: "#111827",
                color: "#fff",
                fontSize: "14px",
                padding: "12px 16px",
              },
              success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
              error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
            }}
          />
        </ConfirmProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;