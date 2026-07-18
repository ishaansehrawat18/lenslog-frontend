import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ConfirmProvider } from "./context/ConfirmContext.jsx";
import Navbar from "./components/Navbar.jsx";
import MobileNav from "./components/MobileNav.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <Navbar />
        <main className="pb-20 lg:pb-0">
          <AppRoutes />
        </main>
        <MobileNav />
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
    </AuthProvider>
  );
}

export default App;