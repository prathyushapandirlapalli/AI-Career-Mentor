import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Sparkles, LogOut, User as UserIcon, Menu, Shield } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Brand & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                AI Career <span className="text-gradient ml-1.5">Mentor</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">Production Suite</span>
            </div>
          </Link>
        </div>

        {/* Right Navigation & User Controls */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/60 text-slate-300 hover:text-white border border-slate-700/50 transition-all"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link 
                to="/profile"
                className="hidden sm:flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-700/60 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-slate-200">{user?.full_name}</p>
                  <p className="text-[10px] text-slate-400">{user?.target_role || 'Candidate'}</p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all flex items-center space-x-1.5 text-xs font-medium"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
