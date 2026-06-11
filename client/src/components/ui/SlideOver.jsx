import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const WIDTH_MAP = {
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
};

export function SlideOver({ isOpen, open, onClose, title, children, className, width = "md" }) {
  const visible = open ?? isOpen ?? false;
  return (
    <AnimatePresence>
      {visible && (
        <Dialog.Root open={visible} onOpenChange={(o) => !o && onClose()}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className={cn(
                  "fixed bottom-0 right-0 top-0 z-50 flex h-full w-full flex-col border-l border-rift bg-abyss p-6 shadow-2xl focus:outline-none glass-panel",
                  WIDTH_MAP[width],
                  className
                )}
              >
                <div className="flex items-center justify-between border-b border-rift pb-4 mb-4">
                  {title && (
                    <Dialog.Title className="text-lg font-display font-bold text-white uppercase tracking-wider">
                      {title}
                    </Dialog.Title>
                  )}
                  <Dialog.Close asChild>
                    <button
                      onClick={onClose}
                      className="rounded p-1 text-comet hover:text-white hover:bg-rift/50 transition-colors focus:outline-none ml-auto"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-vault-600 scrollbar-track-transparent">
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}
