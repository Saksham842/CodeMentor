import { Outlet } from "react-router-dom";
import { StarField } from "@/components/animations/StarField";
import { FloatingOrb } from "@/components/animations/FloatingOrb";
import { ToastProvider } from "@/components/ui/ToastProvider";

export function Layout() {
  return (
    <div className="relative min-h-screen bg-void text-white font-body selection:bg-nebula/40 overflow-x-hidden">
      <ToastProvider />
      <StarField />
      <FloatingOrb color="nebula" className="top-10 left-10" size="w-[450px] h-[450px]" delay={0} />
      <FloatingOrb color="aurora" className="bottom-10 right-10" size="w-[500px] h-[500px]" delay={2} />
      <FloatingOrb color="cosmic" className="top-1/2 left-1/3" size="w-[400px] h-[400px]" delay={4} />
      <main className="relative z-10 w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
