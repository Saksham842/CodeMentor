import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({ isOpen, onClose, title, children, className }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-void/80 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className={cn(
                    "relative w-full max-w-lg rounded-xl border border-rift bg-cavern p-6 shadow-2xl focus:outline-none glass-panel-elevated",
                    className
                  )}
                >
                  <div className="flex items-center justify-between mb-4 border-b border-rift pb-3">
                    {title && (
                      <Dialog.Title className="text-lg font-display font-bold text-white uppercase tracking-wider">
                        {title}
                      </Dialog.Title>
                    )}
                    <Dialog.Close asChild>
                      <button
                        onClick={onClose}
                        className="rounded p-1 text-comet hover:text-white hover:bg-rift/50 transition-colors focus:outline-none"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="max-h-[75vh] overflow-y-auto pr-1">
                    {children}
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
}
