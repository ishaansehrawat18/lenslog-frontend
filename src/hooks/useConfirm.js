import { useContext } from "react";
import { ConfirmContext } from "../context/ConfirmContext.jsx";

// Lets components do:
//   const confirm = useConfirm();
//   const ok = await confirm("Delete this post?");
//   if (ok) { ...actually delete... }
export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context.confirm;
}