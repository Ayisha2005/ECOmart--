import React, { useEffect, useState } from 'react';
import EcoMartLogo from './EcoMartLogo';
import { Sparkles, ShieldCheck, Leaf, ArrowRight, Zap } from 'lucide-react';

export const LogoSplashScreen = ({ onComplete, duration = 2800 }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Animated Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-amber-950/40 animate-pulse pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-bounce" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-bounce" style={{ animationDuration: '8s' }} />

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-amber-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-lg shadow-emerald-950/50 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>India's Recyclable Eco Marketplace</span>
        </div>

        {/* Central Logo Container with Glowing Ring */}
        <div className="relative p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-[0_0_50px_rgba(16,185,129,0.25)] backdrop-blur-xl transition-all hover:scale-105 mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-3xl blur-md opacity-40 animate-pulse" />
          <div className="relative flex flex-col items-center">
            <EcoMartLogo size="lg" showTagline={true} />
          </div>
        </div>

        {/* Tagline & Welcome Text */}
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent mb-2">
          ECO MART INDIA
        </h1>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-8">
          Smart Shop • Green Deliver • Better Tomorrow
        </p>

        {/* Loading Progress Bar & Counter */}
        <div className="w-full max-w-xs space-y-2 mb-6">
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="w-3 h-3 animate-spin" />
              Initializing Portal...
            </span>
            <span className="font-mono text-amber-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 rounded-full transition-all duration-75 shadow-sm shadow-emerald-400/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip / Enter Button */}
        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-md cursor-pointer group"
        >
          <span>Enter ECO MART Platform</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-emerald-400" />
        </button>

      </div>

      {/* Footer System Info */}
      <div className="absolute bottom-6 text-[11px] text-slate-500 flex items-center gap-4">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified Secure</span>
        <span>•</span>
        <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-lime-500" /> 100% Eco Certified</span>
      </div>
    </div>
  );
};

export default LogoSplashScreen;
