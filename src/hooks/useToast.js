import { useContext } from "react";
import { ToastContext } from "../context/ToastContext.jsx";

// Lets components do `const { addToast } = useToast(); addToast("Saved!", "success");`
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}