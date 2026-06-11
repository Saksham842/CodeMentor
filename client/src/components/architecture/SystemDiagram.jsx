import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export function SystemDiagram() {
  const containerRef = useRef(null);
  const pathRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      pathRefs.current.forEach((path, i) => {
        if (!path) return;
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.2,
          delay: 0.3 + i * 0.2,
          ease: "power2.out"
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !pathRefs.current.includes(el)) {
      pathRefs.current.push(el);
    }
  };

  const boxVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (custom) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: custom * 0.1, type: "spring", stiffness: 120 }
    })
  };

  return (
    <div ref={containerRef} className="w-full flex items-center justify-center p-6 bg-void/30 border border-rift rounded-xl overflow-x-auto select-none">
      <div className="relative w-[800px] h-[400px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path ref={addToRefs} d="M 120 200 L 220 200" stroke="#7c3aed" strokeWidth="2.5" />
          
          <path ref={addToRefs} d="M 320 200 L 420 200" stroke="#6366f1" strokeWidth="2.5" />

          <path ref={addToRefs} d="M 520 200 C 580 200, 580 90, 620 90" stroke="#06b6d4" strokeWidth="2" />
          <path ref={addToRefs} d="M 520 200 L 620 200" stroke="#06b6d4" strokeWidth="2" />
          <path ref={addToRefs} d="M 520 200 C 580 200, 580 310, 620 310" stroke="#06b6d4" strokeWidth="2" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-between">
          
          <motion.div
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="absolute left-[20px] top-[160px] w-[100px] h-[80px] rounded-lg border border-rift bg-cavern flex flex-col items-center justify-center text-center p-2 shadow-lg hover:border-nebula/60 cursor-pointer"
          >
            <span className="text-xl">💻</span>
            <span className="text-xs font-bold text-white uppercase mt-1">Browser</span>
            <span className="text-[9px] text-stardust/40 font-semibold font-mono">React v18</span>
          </motion.div>

          <motion.div
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="absolute left-[220px] top-[160px] w-[100px] h-[80px] rounded-lg border border-nebula/40 bg-vault flex flex-col items-center justify-center text-center p-2 shadow-lg hover:border-nebula cursor-pointer"
          >
            <span className="text-xl">🛡️</span>
            <span className="text-xs font-bold text-white uppercase mt-1">Edge Auth</span>
            <span className="text-[9px] text-nebula font-semibold font-mono">Middleware</span>
          </motion.div>

          <motion.div
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="absolute left-[420px] top-[160px] w-[100px] h-[80px] rounded-lg border border-rift bg-cavern flex flex-col items-center justify-center text-center p-2 shadow-lg hover:border-nebula/60 cursor-pointer"
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs font-bold text-white uppercase mt-1">App Server</span>
            <span className="text-[9px] text-aurora font-semibold font-mono">Next.js 14</span>
          </motion.div>

          <motion.div
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            custom={4}
            className="absolute left-[620px] top-[50px] w-[120px] h-[80px] rounded-lg border border-rift bg-cavern flex flex-col items-center justify-center text-center p-2 shadow-lg hover:border-nebula/60 cursor-pointer"
          >
            <span className="text-lg">🗄️ Prisma</span>
            <span className="text-xs font-bold text-white uppercase mt-1">PostgreSQL</span>
            <span className="text-[9px] text-cosmic font-semibold font-mono">DB Singleton</span>
          </motion.div>

          <motion.div
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            custom={5}
            className="absolute left-[620px] top-[160px] w-[120px] h-[80px] rounded-lg border border-rift bg-cavern flex flex-col items-center justify-center text-center p-2 shadow-lg hover:border-nebula/60 cursor-pointer"
          >
            <span className="text-lg">⚡ Redis</span>
            <span className="text-xs font-bold text-white uppercase mt-1">Session Cache</span>
            <span className="text-[9px] text-nova font-semibold font-mono">Key-Value</span>
          </motion.div>

          <motion.div
            variants={boxVariants}
            initial="hidden"
            animate="visible"
            custom={6}
            className="absolute left-[620px] top-[270px] w-[120px] h-[80px] rounded-lg border border-rift bg-cavern flex flex-col items-center justify-center text-center p-2 shadow-lg hover:border-nebula/60 cursor-pointer"
          >
            <span className="text-lg">💳 Stripe</span>
            <span className="text-xs font-bold text-white uppercase mt-1">Payments</span>
            <span className="text-[9px] text-solar font-semibold font-mono">Webhooks</span>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
