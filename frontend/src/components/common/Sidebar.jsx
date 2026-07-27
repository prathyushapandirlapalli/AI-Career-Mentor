import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  History,
  Target,
  Layers,
  MapPin,
  Building2,
  Video,
  Calendar,
  BarChart3,
  FileDown,
  User,
  Sparkles,
  ChevronRight,
  Crosshair
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Upload & AI Score', path: '/resume-upload', icon: FileText },
    { name: 'Resume History', path: '/resume-history', icon: History },
    { name: 'ATS Score Matrix', path: '/ats-matrix', icon: Target },
    { name: 'Skill Gap Analysis', path: '/skill-gap', icon: Layers },
    { name: 'Job JD Match', path: '/job-match', icon: Crosshair },
    { name: 'Learning Roadmap', path: '/roadmap', icon: MapPin },
    { name: 'Company Prep Hub', path: '/company-prep', icon: Building2 },
    { name: 'AI Mock Interview', path: '/mock-interview', icon: Video },
    { name: 'Daily Study Planner', path: '/study-planner', icon: Calendar },
    { name: 'Progress Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Weekly AI Report', path: '/weekly-report', icon: FileDown },
    { name: 'Profile & Settings', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 top-[72px] z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-[72px] bottom-0 left-0 z-40 w-[280px] lg:w-[290px] h-[calc(100vh-72px)] glass-panel border-r border-slate-200 dark:border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full py-3 px-3">
          
          {/* Navigation Items */}
          <nav className="space-y-1 flex-1 overflow-y-auto pr-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-1.5 h-[38px] rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </NavLink>
              );
            })}
          </nav>

          {/* Gemini 2.5 Intelligence Card */}
          <div className="shrink-0 mt-2 p-3 rounded-xl bg-gradient-to-br from-[#EEF2FF] via-[#F5F3FF] to-[#EFF6FF] dark:from-[rgba(79,70,229,0.20)] dark:via-[rgba(99,102,241,0.10)] dark:to-[rgba(15,23,42,0.90)] border border-[#C7D2FE] dark:border-[rgba(129,140,248,0.25)] shadow-xs transition-all">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-[#A5B4FC] text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6366F1] dark:text-[#818CF8]" />
              <span className="text-[#4F46E5] dark:text-[#A5B4FC]">Gemini 2.5 Intelligence</span>
            </div>
            <p className="text-[10.5px] text-[#64748B] dark:text-[#94A3B8] leading-snug">
              Real-time ATS parsing, interview scoring & personalized roadmap generation.
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
