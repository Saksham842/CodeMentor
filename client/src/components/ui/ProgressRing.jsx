import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = "stroke-nebula",
  label,
  className
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setDisplayValue(0);

    const circle = circleRef.current;
    if (!circle) return;

    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    const targetOffset = circumference - (value / 100) * circumference;

    const ctx = gsap.context(() => {
      gsap.to(circle, {
        strokeDashoffset: targetOffset,
        duration: 1.8,
        ease: "power2.out",
      });

      const counter = { val: 0 };
      gsap.to(counter, {
        val: value,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          setDisplayValue(Math.floor(counter.val));
        },
      });
    });

    return () => ctx.revert();
  }, [value, circumference]);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-rift"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={cn("transition-all duration-300", color)}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span ref={textRef} className="text-2xl font-display font-bold text-white">
            {displayValue}%
          </span>
          {label && (
            <span className="text-[10px] text-comet uppercase font-semibold tracking-wider mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
