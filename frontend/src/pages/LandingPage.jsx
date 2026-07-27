import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, FileCheck, Target, Video, Calendar, Award, CheckCircle, Sun, Moon } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, enterDemoMode } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/10 to-purple-600/20 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none flex items-center">
              AI Career <span className="text-gradient ml-1.5">Mentor</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider font-semibold uppercase block mt-0.5">PRODUCTION SUITE</span>
          </div>
        </div>

        <div className="flex items-center space-x-3.5">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700/60 transition-all shadow-sm cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <Link to="/login" className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all">
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-500 dark:text-cyan-400 animate-spin-slow" />
          <span>Powered by Google Gemini 2.5 AI Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white mb-6">
          Land Your Dream Tech Job with <br />
          <span className="text-gradient">AI Resume Analysis & Interview Prep</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
          Get real-time ATS resume scoring, skill gap detection, company-specific preparation roadmaps for Amazon, TCS, Google & Microsoft, and interactive AI mock interviews.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <span>Analyze Resume Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button
            onClick={() => {
              enterDemoMode();
              navigate('/dashboard');
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 hover:bg-slate-300 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Explore Dashboard Demo</span>
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Complete AI Career Suite</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">15+ Integrated production features engineered to accelerate tech career growth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Resume & ATS Scoring</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your PDF resume to extract content, receive instant 0-100 ATS match scoring, missing keyword detection, and bullet point impact tips.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Skill Gap & Job Matching</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compare your experience against target Job Descriptions to identify critical tech stack gaps and top recommended matching roles.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Mock Interview Simulator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Practice candidate interview sessions with tailored technical and behavioral questions generated directly from your resume.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/80 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 AI Career Mentor. Production Full Stack Engineering Suite.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
