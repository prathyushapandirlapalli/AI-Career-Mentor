import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Briefcase, Shield, Sun, Moon, Sparkles } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      <div className="glass-panel p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <User className="w-3.5 h-3.5" />
          <span>User Profile</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Account & Preferences</h1>
        <p className="text-xs text-slate-400">Manage your profile, target role, and interface settings.</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.full_name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
              {user?.target_role || 'Candidate'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interface Theme Settings</h3>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-3">
              {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
              <div>
                <h4 className="text-xs font-bold text-white">Theme Mode</h4>
                <p className="text-[10px] text-slate-400">{isDark ? 'Dark Glassmorphism Theme' : 'Light Theme'}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
            >
              Toggle Mode
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
