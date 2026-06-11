import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { FloatingOrb } from "@/components/animations/FloatingOrb";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast.error("Please fill in all requested fields.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    showToast.success("Guild Account Forged Successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 bg-void overflow-hidden">
      <FloatingOrb color="cosmic" className="-top-20 -left-20" size="w-[420px] h-[420px]" />
      <FloatingOrb color="nebula" className="-bottom-20 -right-20" size="w-[450px] h-[450px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card glow elevated className="p-8 space-y-6 glass-panel-elevated">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <img src="/icons/logo.svg" className="w-12 h-12" alt="Logo" />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-widest text-white uppercase">
              CodeMentor <span className="text-gradient">AI</span>
            </h1>
            <p className="text-[10px] font-display font-bold uppercase tracking-wider text-comet">
              Forge Your Legend
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Adventurer Name"
              type="text"
              placeholder="Galahad of the Code"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs"
            />

            <Input
              label="Explorer Email"
              type="email"
              placeholder="explorer@codementor.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs"
            />

            <Input
              label="Password Cipher"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs"
            />

            <Button
              type="submit"
              className="w-full uppercase font-bold tracking-wider text-xs py-3"
              isLoading={loading}
            >
              Forge Your Account
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-stardust/60">
              Already a guild member?{" "}
              <Link to="/login" className="text-nebula hover:underline font-semibold transition-all">
                Login cipher
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
