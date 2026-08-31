import React, { useEffect, useState } from 'react';
import EcoMartLogo from './EcoMartLogo';
import {
  Globe,
  Truck,
  Leaf,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Package,
  RefreshCw,
  Compass
} from 'lucide-react';

export const LogoSplashScreen = ({ onComplete, duration = 3500 }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [phase, setPhase] = useState('orbit'); // 'orbit' -> 'reveal'

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct > 45 && phase === 'orbit') {
        setPhase('reveal');
      }

      if (pct >= 100) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration, onComplete, phase]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-700 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
          poster="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-green-leaves-in-a-forest-4416/1080p.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark Glassmorphism Mesh Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/70 via-transparent to-amber-950/50" />
      </div>

      {/* Main Intro Stage Container */}
      <div className="relative z-10 max-w-lg w-full px-6 flex flex-col items-center text-center">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-amber-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-6 shadow-xl shadow-emerald-950/60 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Global Green Logistics & Eco Trading</span>
        </div>

        {/* 3D World Globe & Recycling Lorry Orbit Animation Stage */}
        <div className="relative w-64 h-64 my-2 flex items-center justify-center">
          
          {/* Rotating Globe Atmosphere Glow Rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-teal-500/20 blur-xl animate-pulse" />
          <div className="absolute w-56 h-56 rounded-full border border-emerald-500/30 animate-spin" style={{ animationDuration: '18s' }} />
          <div className="absolute w-48 h-48 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />

          {/* Orbiting Path Ring with Recycling Lorry */}
          <div className="absolute w-60 h-60 rounded-full border-2 border-emerald-400/30 animate-spin" style={{ animationDuration: '3.5s' }}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 text-slate-950 rounded-xl shadow-xl shadow-emerald-400/60 border border-lime-300 transform -rotate-45">
              <Truck className="w-5 h-5 fill-slate-950 text-slate-950" />
            </div>
          </div>

          {/* Central 3D Globe / Logo Transition Container */}
          <div className="relative z-10 w-40 h-40 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.3)] backdrop-blur-2xl flex flex-col items-center justify-center p-4 transition-all duration-700 hover:scale-105">
            {phase === 'orbit' ? (
              <div className="flex flex-col items-center gap-2 animate-fadeIn">
                <Globe className="w-16 h-16 text-emerald-400 animate-spin" style={{ animationDuration: '16s' }} />
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest flex items-center gap-1">
                  <Compass className="w-3 h-3 text-amber-400" />
                  PAN-INDIA LOGISTICS
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-zoomIn">
                <EcoMartLogo size="md" showTagline={true} />
              </div>
            )}
          </div>

          {/* Orbiting Satellite Eco Icons */}
          <div className="absolute top-2 right-4 p-1.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 animate-bounce" style={{ animationDuration: '3s' }}>
            <Leaf className="w-4 h-4" />
          </div>
          <div className="absolute bottom-4 left-4 p-1.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/40 animate-bounce" style={{ animationDuration: '4s' }}>
            <Package className="w-4 h-4" />
          </div>
          <div className="absolute bottom-6 right-6 p-1.5 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/40 animate-bounce" style={{ animationDuration: '3.5s' }}>
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent mt-3 mb-1">
          ECO MART RECYCLING
        </h1>
        <p className="text-xs text-slate-300 font-medium max-w-xs leading-relaxed mb-6">
          Green EV Fleet Logistics • Industrial Scrap Trading • Zero Carbon
        </p>

        {/* Loading Progress Bar & Percentage Counter */}
        <div className="w-full max-w-xs space-y-2 mb-6">
          <div className="flex justify-between items-center text-[11px] font-extrabold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{phase === 'orbit' ? 'EV Recycling Lorry Orbiting Globe...' : 'Initializing Marketplace Portal...'}</span>
            </span>
            <span className="font-mono text-amber-400 font-black">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-75 shadow-md shadow-emerald-400/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip / Enter Platform Button */}
        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-950 hover:to-slate-900 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-black transition-all shadow-lg shadow-emerald-950/80 cursor-pointer group"
        >
          <span>Enter ECO MART Platform</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
        </button>
      </div>

      {/* Footer Credentials */}
      <div className="absolute bottom-5 text-[11px] font-bold text-slate-400 flex items-center gap-4">
        <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Secure Portal</span>
        <span>•</span>
        <span className="flex items-center gap-1 text-lime-400"><Leaf className="w-3.5 h-3.5 text-lime-400" /> 100% Green Certified</span>
      </div>
    </div>
  );
};

export default LogoSplashScreen;
