import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useProject } from "@/hooks/useProject";
import { FloatingOrb } from "../animations/FloatingOrb";

export function AnalysisLoader() {
  const { isAnalyzing, analysisProgress, analysisMessage } = useProject();
  const ringRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || !isAnalyzing) return;

    const ctx = gsap.context(() => {
      gsap.to(ring, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-void text-center p-6 select-none overflow-hidden">
      <FloatingOrb color="nebula" className="top-1/4 left-1/4" size="w-[500px] h-[500px]" />
      <FloatingOrb color="cosmic" className="bottom-1/4 right-1/4" size="w-[500px] h-[500px]" />

      <div className="relative mb-8">
        <svg
          ref={ringRef}
          className="w-32 h-32 text-nebula opacity-80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="15" r="3" fill="#ffffff" />
          <circle cx="85" cy="50" r="3" fill="#ffffff" />
          <circle cx="50" cy="85" r="3" fill="#ffffff" />
          <circle cx="15" cy="50" r="3" fill="#ffffff" />
          <circle cx="50" cy="50" r="5" fill="#7c3aed" />

          <path
            d="M 50 15 L 85 50 L 50 85 L 15 50 Z"
            stroke="url(#constellation-grad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path d="M 50 15 L 50 85" stroke="url(#constellation-grad)" strokeWidth="1" />
          <path d="M 15 50 L 85 50" stroke="url(#constellation-grad)" strokeWidth="1" />

          <defs>
            <linearGradient id="constellation-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-nebula/30 animate-ping" />
        </div>
      </div>

      <div className="max-w-md w-full space-y-4">
        <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">
          Decoding Codebase
        </h2>

        <p className="text-sm font-mono text-gradient-aurora h-6 transition-all duration-300">
          {analysisMessage}
        </p>

        <div className="w-full h-1 bg-rift rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-nebula via-aurora to-cosmic transition-all duration-500 rounded-full"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>

        <span className="block font-mono text-xs text-stardust/40">
          {analysisProgress}% Decoded
        </span>
      </div>
    </div>
  );
}
