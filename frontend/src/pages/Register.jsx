import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../services/api';
import { Sparkles, Mail, Lock, User, Briefcase, AlertCircle, ArrowRight, Loader2, ChevronDown, Check, Sun, Moon, ArrowLeft } from 'lucide-react';

const ROLE_OPTIONS = [
  'Senior Full Stack Engineer',
  'Backend Python Developer',
  'Frontend React Engineer',
  'DevOps & Cloud Engineer',
  'AI / Machine Learning Engineer',
  'Data Scientist',
  'Software Quality Engineer',
  'Product Manager',
  'Other'
];

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dropdownRef = useRef(null);
  const { login, isAuthenticated, enterDemoMode } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/dashboard';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select your target job role.');
      return;
    }

    const finalTargetRole = selectedRole === 'Other'
      ? customRole.trim()
      : selectedRole;

    if (!finalTargetRole) {
      setError('Please type your custom target job role.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await authAPI.register({
        full_name: fullName,
        email,
        password,
        target_role: finalTargetRole,
      });
      login(res.data.access_token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Email may already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExit = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    /* Parent Auth Page (.auth-page): 100% width, 100dvh height, 24px/64px padding, zero margin */
    <div className="w-full h-[100dvh] px-4 sm:px-12 md:px-16 py-6 m-0 box-border flex items-center justify-center bg-transparent">
      
      {/* Single Rounded Gradient Container (.auth-background) */}
      <div className="w-full h-full min-w-0 min-h-0 rounded-[24px] overflow-hidden relative flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl transition-colors duration-300">
        
        {/* Top Left Exit Button */}
        <div className="absolute top-5 left-5 z-20">
          <button
            onClick={handleExit}
            className="p-2.5 px-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all shadow-md cursor-pointer flex items-center space-x-1.5 text-xs font-bold"
            title="Exit Registration & Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <span>Exit</span>
          </button>
        </div>

        {/* Top Right Theme Toggle Button */}
        <div className="absolute top-5 right-5 z-20">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-all shadow-md cursor-pointer"
            title="Toggle Dark / Light Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>

        {/* Ambient Gradient Glows on ALL 4 Sides */}
        <div className="absolute -top-40 -right-40 w-[450px] h-[450px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-gradient-to-tr from-blue-500/15 to-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] bg-gradient-to-tr from-purple-500/15 to-indigo-500/15 rounded-full blur-[130px] pointer-events-none" />

        {/* Centered Registration Form Card */}
        <div className="w-full max-w-md glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative z-10 my-auto max-h-full overflow-y-auto">
          
          {/* Company Logo & Brand Name */}
          <div className="text-center mb-5">
            <Link to="/" className="inline-flex items-center space-x-3 mb-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div className="text-left">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none flex items-center">
                  AI Career <span className="text-gradient ml-1.5">Mentor</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider font-semibold uppercase block mt-0.5">PRODUCTION SUITE</span>
              </div>
            </Link>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Start optimizing your career with AI</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex.johnson@example.com"
                  className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
            </div>

            {/* Custom Styled Target Role Dropdown */}
            <div ref={dropdownRef}>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Target Job Role</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full bg-slate-100 dark:bg-slate-900/80 border rounded-xl pl-10 pr-4 py-2 text-xs flex items-center justify-between cursor-pointer focus:outline-none transition-all ${
                    isDropdownOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-300 dark:border-slate-800'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                  <span className={selectedRole ? "text-slate-900 dark:text-white font-semibold" : "text-slate-400 dark:text-slate-500 font-medium"}>
                    {selectedRole ? (selectedRole === 'Other' ? '+ Add Custom Role / Other...' : selectedRole) : 'Select your target role...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden py-1.5 max-h-52 overflow-y-auto animate-scale-up">
                    {ROLE_OPTIONS.map((role, idx) => {
                      const isSelected = selectedRole === role;
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => {
                            setSelectedRole(role);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-extrabold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium'
                          }`}
                        >
                          <span>{role === 'Other' ? '+ Add Custom Role / Other...' : role}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedRole === 'Other' && (
                <div className="mt-2 animate-fade-in">
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. Cyber Security Engineer, Cloud Architect, etc."
                    className="w-full bg-slate-100 dark:bg-slate-900/80 border border-indigo-500 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-semibold shadow-xs"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-1 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create AI Mentor Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div>
              Already registered?{' '}
              <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign In
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-3 text-[11px] font-semibold text-slate-400 dark:text-slate-400 pt-1">
              <Link to="/" className="hover:text-indigo-500 underline">
                ← Home Page
              </Link>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  enterDemoMode();
                  navigate('/dashboard');
                }}
                className="hover:text-indigo-500 underline cursor-pointer"
              >
                Explore Demo Mode →
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;
