import { createContext, useState, useCallback, useRef } from "react";

export const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null); // { message } or null
  // Holds the resolve function of the pending Promise, so the buttons
  // below can "answer" whichever confirm() call is currently open.
  const resolverRef = useRef(null);

  // Returns a Promise<boolean> — true if the user clicks Confirm, false otherwise
  const confirm = useCallback((message) => {
    setDialog({ message });
    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    resolverRef.current?.(true);
    setDialog(null);
  };

  const handleCancel = () => {
    resolverRef.current?.(false);
    setDialog(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {dialog && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <p>{dialog.message}</p>
            <div className="confirm-dialog-actions">
              <button onClick={handleCancel} className="confirm-cancel-btn">
                Cancel
              </button>
              <button onClick={handleConfirm} className="confirm-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}