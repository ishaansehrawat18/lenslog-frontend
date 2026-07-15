import { useToast } from "../hooks/useToast.js";

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="toast-close">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;