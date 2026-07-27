import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
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
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-[65px] bottom-0 left-0 z-40 w-64 glass-panel border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full py-4 px-3 overflow-y-auto">
          
          <div className="px-3 pb-3 mb-2 border-b border-slate-800/60">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </span>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700 text-white shadow-lg shadow-indigo-600/25'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </NavLink>
              );
            })}
          </nav>

          {/* AI Banner Badge */}
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/30">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Gemini 2.5 Intelligence</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time ATS parsing, interview scoring & personalized roadmap generation.
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
