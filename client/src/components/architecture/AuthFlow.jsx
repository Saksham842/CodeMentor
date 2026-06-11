import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export function AuthFlow() {
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
          duration: 1.0,
          delay: i * 0.2,
          ease: "power1.inOut"
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

  const nodeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (custom) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: custom * 0.15, duration: 0.3 }
    })
  };

  return (
    <div className="w-full flex items-center justify-center p-6 bg-void/30 border border-rift rounded-xl overflow-x-auto select-none">
      <div className="relative w-[850px] h-[360px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 850 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path ref={addToRefs} d="M 110 100 L 210 100" stroke="#7c3aed" strokeWidth="2" />
          <path ref={addToRefs} d="M 310 100 L 410 100" stroke="#7c3aed" strokeWidth="2" />
          <path ref={addToRefs} d="M 510 100 L 610 100" stroke="#7c3aed" strokeWidth="2" />
          <path ref={addToRefs} d="M 710 100 L 710 180" stroke="#7c3aed" strokeWidth="2" />
          
          <path ref={addToRefs} d="M 710 260 L 710 300" stroke="#10b981" strokeWidth="2" />
          <path ref={addToRefs} d="M 660 220 L 160 220 L 160 140" stroke="#ef4444" strokeWidth="2" />
        </svg>

        <motion.div
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="absolute left-[10px] top-[70px] w-[100px] h-[60px] rounded-lg border border-rift bg-cavern flex flex-col items-center justify-center text-center shadow-lg"
        >
          <span className="text-xs font-bold text-white uppercase">1. User Login</span>
          <span className="text-[9px] text-comet font-mono">Credentials</span>
        </motion.div>

        <motion.div
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          className="absolute left-[210px] top-[70px] w-[100px] h-[60px] rounded-lg border border-nebula/40 bg-vault flex flex-col items-center justify-center text-center shadow-lg"
        >
          <span className="text-xs font-bold text-white uppercase">2. NextAuth</span>
          <span className="text-[9px] text-nebula font-semibold font-mono">Token Sign</span>
        </motion.div>

        <motion.div
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          className="absolute left-[410px] top-[70px] w-[100px] h-[60px] rounded-lg border border-rift bg-cavern flex flex-col items-center justify-center text-center shadow-lg"
        >
          <span className="text-xs font-bold text-white uppercase">3. JWT Token</span>
          <span className="text-[9px] text-stardust/40 font-mono">Encrypted Claim</span>
        </motion.div>

        <motion.div
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          custom={4}
          className="absolute left-[610px] top-[70px] w-[100px] h-[60px] rounded-lg border border-rift bg-cavern flex flex-col items-center justify-center text-center shadow-lg"
        >
          <span className="text-xs font-bold text-white uppercase">4. Edge Filter</span>
          <span className="text-[9px] text-aurora font-mono">Middleware</span>
        </motion.div>

        <motion.div
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          custom={5}
          className="absolute left-[660px] top-[180px] w-[100px] h-[80px] bg-vault border border-rift transform rotate-45 flex items-center justify-center shadow-lg"
        >
          <div className="transform -rotate-45 text-center">
            <span className="block text-xs font-bold text-white">Valid?</span>
            <span className="text-[8px] text-stardust/40 uppercase font-semibold">JWT check</span>
          </div>
        </motion.div>

        <div className="absolute left-[725px] top-[265px] text-[10px] font-bold text-nova uppercase">
          Yes
        </div>
        <div className="absolute left-[400px] top-[195px] text-[10px] font-bold text-supernova uppercase">
          No (Redirect Login)
        </div>

        <motion.div
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          custom={6}
          className="absolute left-[610px] top-[300px] w-[200px] h-[50px] rounded-lg border border-nova/40 bg-cavern flex items-center justify-center text-center shadow-lg"
        >
          <span className="text-xs font-bold text-nova uppercase">🚀 Access App Route Granted</span>
        </motion.div>
      </div>
    </div>
  );
}
