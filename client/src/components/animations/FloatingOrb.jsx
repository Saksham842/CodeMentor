import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export function FloatingOrb({ color = "nebula", size = "w-[350px] h-[350px]", className, delay = 0 }) {
  const orbRef = useRef(null);

  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        orb,
        { x: -30, y: -20 },
        {
          x: 30,
          y: 20,
          duration: 12 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: delay,
        }
      );
    });

    return () => ctx.revert();
  }, [delay]);

  const colors = {
    nebula: "bg-nebula/15",
    aurora: "bg-aurora/15",
    cosmic: "bg-cosmic/15",
  };

  return (
    <div
      ref={orbRef}
      className={cn(
        "absolute rounded-full blur-[90px] pointer-events-none z-0",
        colors[color],
        size,
        className
      )}
    />
  );
}
