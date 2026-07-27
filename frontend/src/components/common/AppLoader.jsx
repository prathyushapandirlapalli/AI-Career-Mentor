import React from 'react';
import { Sparkles } from 'lucide-react';

const AppLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/20 dark:bg-indigo-500/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 dark:bg-cyan-400/20 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Loader Content */}
      <div className="relative z-10 flex flex-col items-center space-y-5 animate-fade-in">
        
        {/* Animated Brand Logo Icon */}
        <div className="relative group">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-1 shadow-xl shadow-indigo-500/30 animate-pulse">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          {/* Subtle outer pulsing ring */}
          <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-30 blur-sm animate-ping pointer-events-none" />
        </div>

        {/* Brand Name & Tagline */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Career <span className="text-gradient">Mentor</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">
            Initializing AI Intelligence Suite...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative mt-2">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 rounded-full animate-indeterminate-bar" />
        </div>

      </div>
    </div>
  );
};

export default AppLoader;
