import { motion } from "framer-motion";

export function PageTransition({ children }) {
  return (
    <div className="relative w-full h-full">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-nebula to-transparent origin-left z-20"
      />
      <motion.div
        initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -15, filter: "blur(2px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
