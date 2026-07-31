import { motion } from "framer-motion";

// Wraps each page's content with a consistent enter/exit animation.
// Keeping the transition short (0.2s) and subtle (small y-offset) so
// it feels responsive rather than sluggish.
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;