import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Sparkles, LogOut, User as UserIcon, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAuthenticated, isDemoMode } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] w-full glass-panel border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center transition-all">
      <div className="w-full flex items-center justify-between">
        
        {/* Left Brand & Mobile Menu Button */}
        <div className="flex items-center space-x-3.5">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to={isAuthenticated || isDemoMode ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/15 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-snug flex items-center">
                AI Career <span className="text-gradient ml-1.5">Mentor</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider font-semibold uppercase leading-none">PRODUCTION SUITE</span>
            </div>
          </Link>
        </div>

        {/* Right Navigation & User Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Demo Mode Badge Indicator */}
          {isDemoMode && !isAuthenticated && (
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-cyan-400 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Demo Mode</span>
            </span>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all shadow-sm cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2.5">
              <Link 
                to="/profile"
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700/60 transition-all shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 leading-tight">{user?.full_name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{user?.target_role || 'Candidate'}</p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all flex items-center space-x-1.5 text-xs font-semibold shadow-xs cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
