import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UploadModal } from "@/components/upload/UploadModal";
import { ChevronDown, ArrowRight, Shield, Activity, Sparkles, Terminal, Rocket, Database, Lock, Eye, BookOpen, Heart, Award, Compass, MessageSquareCode, Clock } from "lucide-react";

export default function LandingPage() {
  const [showUpload, setShowUpload] = useState(false);
  const heroRef = useRef(null);
  const titleLettersRef = useRef([]);
  const scrollTrackRef = useRef(null);

  gsap.registerPlugin(useGSAP);

  useGSAP(() => {
    if (titleLettersRef.current.length > 0) {
      gsap.fromTo(
        titleLettersRef.current,
        { opacity: 0, y: 30, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.04,
          ease: "back.out(1.7)",
        }
      );
    }

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const dx = clientX - window.innerWidth / 2;
      const dy = clientY - window.innerHeight / 2;

      gsap.to(".parallax-glow", {
        x: dx * 0.03,
        y: dy * 0.03,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: heroRef });

  const addLetterRef = (el) => {
    if (el && !titleLettersRef.current.includes(el)) {
      titleLettersRef.current.push(el);
    }
  };

  const titleText = "Your Codebase Has a Story.";
  const subtitleText = "We Help You Tell It.";

  const chapters = [
    { num: "Chapter I", title: "Upload", desc: "Drop your ZIP package or paste a public GitHub URL to start.", icon: Rocket },
    { num: "Chapter II", title: "Understand", desc: "Decode every file structure, key function, and connection.", icon: Eye },
    { num: "Chapter III", title: "Learn", desc: "Onboard with custom timelines, study roadmaps, and quizzes.", icon: BookOpen },
    { num: "Chapter IV", title: "Practice", desc: "Test your skills with mock interviews and project defenses.", icon: Award },
    { num: "Chapter V", title: "Achieve", desc: "Forge ATS resume bullets and export auto-generated docs.", icon: Compass }
  ];

  const features = [
    { name: "Codebase Chat", desc: "Speak directly to the codebase oracle.", icon: MessageSquareCode },
    { name: "File Explorer", desc: "Navigate your directory with AI explainers.", icon: Compass },
    { name: "Architecture", desc: "Interactive inline SVG diagrams of auth and schema.", icon: Terminal },
    { name: "Code Search", desc: "Deep semantic query results with previews.", icon: Rocket },
    { name: "Onboarding Mode", desc: "Time-estimated timelines for developers.", icon: Clock },
    { name: "Learning Roadmap", desc: "Custom progress checkpoints by difficulty.", icon: BookOpen },
    { name: "Quiz Mode", desc: "Verify domain knowledge with custom trials.", icon: Award },
    { name: "Timeline logs", desc: "Track architectural growth version history.", icon: Activity },
    { name: "Mock Interviews", desc: "Face demanding candidate trials.", icon: Award },
    { name: "Project Defense", desc: "Adversarial challenges with intensity levels.", icon: Shield },
    { name: "Knowledge Gaps", desc: "Radar charts identifying skills weaknesses.", icon: Activity },
    { name: "Resume Builder", desc: "Generate high-level experience bullets.", icon: Award },
    { name: "Auto Docs", desc: "Generate README, API references, and ADRs.", icon: Compass },
    { name: "Contributor Guides", desc: "Identify good first issues and dependency maps.", icon: Terminal },
    { name: "Knowledge Base", desc: "Developer wiki explaining design choices.", icon: Database },
    { name: "Security Scan", desc: "Breach point scanner with visual patch diffs.", icon: Lock },
    { name: "Complexity", desc: "Compute cyclomatic scores per function.", icon: Activity },
    { name: "Bug Detector", desc: "Detect logical defects and generate repairs.", icon: Terminal },
    { name: "AI Reviewer", desc: "Obtain the final production-ready verdict.", icon: Award },
    { name: "Settings Codex", desc: "Configure custom models and focus parameters.", icon: Terminal }
  ];

  return (
    <div ref={heroRef} className="relative w-full min-h-screen text-stardust overflow-hidden">
      <div className="parallax-glow absolute top-[25%] left-[30%] w-[300px] h-[300px] bg-nebula/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <nav className="fixed top-0 left-0 right-0 h-20 border-b border-rift bg-void/65 backdrop-blur-md flex items-center justify-between px-8 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/logo.svg" className="w-9 h-9" alt="CodeMentor Logo" />
          <span className="font-display font-bold text-base tracking-widest text-white uppercase">
            CodeMentor <span className="text-gradient">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs font-display font-bold uppercase tracking-widest">
          <a href="#journey" className="hover:text-white transition-colors">Journey</a>
          <a href="#features" className="hover:text-white transition-colors">Chapters</a>
          <a href="#preview" className="hover:text-white transition-colors">Demo</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs uppercase font-bold tracking-wider">
              Sign In
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowUpload(true)}
            className="text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-lg"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </nav>

      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 z-10">
        <div className="max-w-4xl space-y-4">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white uppercase select-none leading-none">
            {titleText.split("").map((char, index) => (
              <span key={index} ref={addLetterRef} className="inline-block origin-bottom">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            <br />
            <span className="text-gradient-aurora block mt-2">
              {subtitleText}
            </span>
          </h1>

          <p className="text-sm md:text-base text-stardust/80 max-w-2xl mx-auto leading-relaxed pt-3">
            Upload any repository. CodeMentor AI decodes its scrolls, maps dependencies, identifies vulnerabilities, and becomes your interactive tutor, reviewer, and guide.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 shadow-2xl cursor-pointer w-full sm:w-auto font-bold tracking-wider uppercase text-xs"
          >
            <span>Begin Your Quest</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="w-full sm:w-auto font-bold tracking-wider uppercase text-xs cursor-pointer"
          >
            Enter Demo Sandbox
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-lg mt-16 text-center select-none">
          <div className="bg-cavern/40 border border-rift rounded-full px-4 py-2 text-xs flex items-center justify-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-nebula animate-pulse" />
            <span className="font-bold text-white">147 Files Decoded</span>
          </div>
          <div className="bg-cavern/40 border border-rift rounded-full px-4 py-2 text-xs flex items-center justify-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-aurora animate-pulse" />
            <span className="font-bold text-white">20 AI Features</span>
          </div>
          <div className="bg-cavern/40 border border-rift rounded-full px-4 py-2 text-xs flex items-center justify-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cosmic animate-pulse" />
            <span className="font-bold text-white">Grok-3 Powered</span>
          </div>
        </div>

        <div className="absolute bottom-10 flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-stardust/40 cursor-pointer hover:text-white transition-colors">
          <span>Scroll to begin journey</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      <section id="journey" className="py-24 px-8 border-t border-rift bg-void/20 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-nebula">THE QUEST PATHWAY</span>
            <h2 className="text-3xl font-display font-bold text-white mt-1 uppercase tracking-wide">
              The Developer's Journey
            </h2>
          </div>

          <div ref={scrollTrackRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin">
            {chapters.map((chap, idx) => {
              const Icon = chap.icon;
              return (
                <Card key={idx} glow elevated className="p-7 min-w-[300px] md:min-w-[340px] flex flex-col justify-between h-[240px] shrink-0 group">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-comet/70">{chap.num}</span>
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-nebula/20 to-aurora/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-4.5 h-4.5 text-nebula" />
                      </div>
                    </div>
                    <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-2 group-hover:text-gradient transition-all">{chap.title}</h3>
                    <p className="text-sm text-stardust/70 leading-relaxed">{chap.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-rift/30 mt-3">
                    <span className="text-[10px] font-mono text-stardust/30 font-semibold uppercase tracking-wider">
                      Stage 0{idx + 1}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-nebula/40 group-hover:text-nebula group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-8 border-t border-rift bg-void/50 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-cosmic">SYSTEM ARMS</span>
            <h2 className="text-3xl font-display font-bold text-white mt-1 uppercase tracking-wide">
              20 Chapters of Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card
                  key={idx}
                  glow
                  className="p-5 flex flex-col gap-3 h-[150px] cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rift to-cavern flex items-center justify-center text-nebula border border-rift/50 group-hover:border-nebula/30 group-hover:shadow-[0_0_16px_rgba(124,58,237,0.08)] transition-all">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5 group-hover:text-gradient transition-all">{feat.name}</h4>
                    <p className="text-[11px] text-stardust/60 leading-relaxed line-clamp-2">{feat.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="preview" className="py-24 px-8 border-t border-rift bg-void/20 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-solar">THE REALM PREVIEW</span>
            <h2 className="text-3xl font-display font-bold text-white mt-1 uppercase tracking-wide">
              See Every Feature In Action
            </h2>
          </div>

          <div className="max-w-5xl mx-auto border border-rift rounded-xl bg-abyss overflow-hidden shadow-2xl relative select-none">
            <div className="h-10 bg-cavern border-b border-rift px-4 flex items-center justify-between text-[10px] font-mono text-comet">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-supernova" />
                <div className="w-2.5 h-2.5 rounded-full bg-solar" />
                <div className="w-2.5 h-2.5 rounded-full bg-nova" />
              </div>
              <span>sandbox://codementor-ai/dashboard</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-nova">Connected</span>
            </div>

            <div className="flex h-[450px]">
              <div className="w-44 border-r border-rift p-3 space-y-4 bg-void/30">
                <div className="h-5 bg-cavern rounded w-20" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 bg-cavern rounded w-full border-l-2 border-l-nebula" />
                  <div className="h-3.5 bg-cavern/50 rounded w-2/3" />
                  <div className="h-3.5 bg-cavern/50 rounded w-3/4" />
                  <div className="h-3.5 bg-cavern/50 rounded w-1/2" />
                </div>
              </div>

              <div className="flex-1 p-6 space-y-6 bg-cavern/10">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-cavern rounded w-44" />
                  <div className="h-5 bg-cavern rounded w-24" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-cavern border border-rift rounded-lg p-3" />
                  <div className="h-20 bg-cavern border border-rift rounded-lg p-3" />
                  <div className="h-20 bg-cavern border border-rift rounded-lg p-3" />
                </div>
                <div className="h-44 bg-cavern border border-rift rounded-lg p-4 relative overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-tr from-nebula/5 to-transparent absolute inset-0" />
                  <div className="h-4 bg-void/70 rounded w-32 mb-4" />
                  <div className="h-24 bg-void/30 rounded border border-rift" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 border-t border-rift bg-void/50 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider">
            Your Quest Begins Here.
          </h2>
          <p className="text-sm text-stardust/80 max-w-lg mx-auto leading-relaxed">
            Upload your ZIP codebase packages or Git directories. No initial account required. Start decoding for free today.
          </p>

          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowUpload(true)}
              className="px-8 shadow-2xl cursor-pointer font-bold tracking-wider uppercase text-xs"
            >
              Upload Your Codebase — It's Free
            </Button>
          </div>

          <span className="block text-[10px] font-mono text-stardust/30 uppercase tracking-widest">
            Grok-3 free tier enabled by default
          </span>
        </div>
      </section>

      <footer className="border-t border-rift bg-void/70 py-10 px-8 text-center text-xs text-stardust/40 z-10 relative">
        <p>© 2026 CodeMentor AI. Built in the depths of deep cosmic space.</p>
      </footer>

      <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </div>
  );
}
