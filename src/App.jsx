import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ConfirmProvider } from "./context/ConfirmContext.jsx";
import Navbar from "./components/Navbar.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import ToastContainer from "./components/ToastContainer.jsx";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Navbar />
          <main>
            <AppRoutes />
          </main>
          <ToastContainer />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;