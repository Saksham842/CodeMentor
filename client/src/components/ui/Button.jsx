import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useAnimation";
import { Loader2 } from "lucide-react";

export const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", isLoading = false, isMagnetic = false, children, ...props }, ref) => {
    const magneticRef = useMagnetic(0.2);
    const resolvedRef = (isMagnetic && variant === "primary") ? magneticRef : ref;

    const baseStyles = "inline-flex items-center justify-center font-display font-semibold transition-all rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-gradient-to-r from-nebula to-aurora text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] border border-nebula/30",
      secondary: "border border-rift bg-cavern text-comet hover:text-white hover:bg-vault hover:border-nebula/30",
      danger: "bg-supernova text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
      ghost: "text-stardust hover:text-white hover:bg-rift/30"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3 text-base"
    };

    return (
      <motion.button
        ref={resolvedRef}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
