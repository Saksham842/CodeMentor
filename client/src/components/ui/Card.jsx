import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef(
  ({ className, hover = true, elevated = false, glow = false, children, ...props }, ref) => {
    const Component = hover ? motion.div : "div";
    const motionProps = hover
      ? {
          whileHover: {
            y: -4,
            boxShadow: "0 24px 48px rgba(124, 58, 237, 0.12)",
            borderColor: "rgba(124, 58, 237, 0.3)",
          },
          transition: { duration: 0.25, ease: "easeOut" }
        }
      : {};

    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-2xl border transition-all duration-300",
          elevated
            ? "bg-vault/80 border-nebula/10 shadow-[0_0_24px_rgba(124,58,237,0.04)]"
            : "bg-cavern/60 border-rift/60",
          glow && "card-glow",
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";
