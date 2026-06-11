import { useRef, useEffect } from "react";
import gsap from "gsap";

export function useMagnetic(strength = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;

      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
}

export function animateCount(el, targetValue, duration = 2) {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: targetValue,
    duration: duration,
    ease: "power1.out",
    onUpdate: () => {
      el.innerText = Math.floor(obj.val).toLocaleString();
    },
  });
}
