import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI, resumeAPI } from '../services/api';
import {
  User,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
  Edit3,
  CheckCircle2,
  X,
  Plus,
  Moon,
  Sun,
  Laptop,
  Loader2,
  Clock,
  Globe,
  Award,
  ChevronRight,
  RefreshCw,
  LogIn
} from 'lucide-react';

const SUGGESTED_INTERESTS = [
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'Software Engineering',
  'Web Development',
  'Mobile App Development',
  'DevOps & Cloud',
  'Data Science & AI'
];

const ProfilePage = () => {
  const { user, isDemoMode, updateUser } = useAuth();
  const { isDark, themeMode, setThemeMode } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');

  // Local state for profile data
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    target_role: user?.target_role || '',
    education: user?.education || '',
    location: user?.location || '',
    experience_level: user?.experience_level || '',
    preferred_job_type: user?.preferred_job_type || '',
    preferred_work_mode: user?.preferred_work_mode || '',
    skills: user?.skills || [],
    career_interests: user?.career_interests || [],
  });

  // Form state inside Edit Modal
  const [formData, setFormData] = useState({ ...profile });
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newInterestInput, setNewInterestInput] = useState('');

  // Lock body scroll when Edit Profile modal is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  // Fetch profile from API on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (isDemoMode) return;
      setLoading(true);
      try {
        const res = await authAPI.getMe();
        if (res.data) {
          const loadedData = {
            full_name: res.data.full_name || '',
            email: res.data.email || '',
            target_role: res.data.target_role || '',
            education: res.data.education || '',
            location: res.data.location || '',
            experience_level: res.data.experience_level || '',
            preferred_job_type: res.data.preferred_job_type || '',
            preferred_work_mode: res.data.preferred_work_mode || '',
            skills: res.data.skills || [],
            career_interests: res.data.career_interests || [],
          };
          setProfile(loadedData);
          setFormData(loadedData);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [isDemoMode]);

  // Compute initials
  const initials = useMemo(() => {
    const name = profile.full_name || 'Demo User';
    const parts = name.trim().split(' ');
    if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'DU';
  }, [profile.full_name]);

  // Calculate profile completion percentage & missing suggestion
  const { completionPercentage, missingSuggestion } = useMemo(() => {
    const fields = [
      { name: 'Full Name', val: profile.full_name, sugg: 'Add your full name' },
      { name: 'Email', val: profile.email, sugg: 'Add your email address' },
      { name: 'Education', val: profile.education, sugg: 'Add your education background' },
      { name: 'Location', val: profile.location, sugg: 'Add your location' },
      { name: 'Target Role', val: profile.target_role, sugg: 'Add your target career role' },
      { name: 'Experience Level', val: profile.experience_level, sugg: 'Select your experience level' },
      { name: 'Job Type', val: profile.preferred_job_type, sugg: 'Select preferred job type' },
      { name: 'Work Mode', val: profile.preferred_work_mode, sugg: 'Add your preferred work mode' },
      { name: 'Skills', val: profile.skills?.length > 0, sugg: 'Add your technical skills' },
      { name: 'Career Interests', val: profile.career_interests?.length > 0, sugg: 'Select your career interests' },
    ];

    const completed = fields.filter((f) => Boolean(f.val)).length;
    const pct = Math.round((completed / fields.length) * 100);

    const firstMissing = fields.find((f) => !Boolean(f.val));
    const suggestion = firstMissing ? firstMissing.sugg : '';

    return { completionPercentage: pct, missingSuggestion: suggestion };
  }, [profile]);

  // Handle Edit Action - Redirect to Login if in Demo Mode
  const handleOpenDrawer = () => {
    if (isDemoMode) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    setFormData({ ...profile });
    setIsDrawerOpen(true);
  };

  // Add Skill tag
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const val = newSkillInput.trim();
    if (val && !formData.skills.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, val],
      }));
      setNewSkillInput('');
    }
  };

  // Remove Skill tag
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Add Custom Career Interest
  const handleAddCustomInterest = (e) => {
    if (e) e.preventDefault();
    const val = newInterestInput.trim();
    if (val && !formData.career_interests.includes(val)) {
      setFormData((prev) => ({
        ...prev,
        career_interests: [...prev.career_interests, val],
      }));
      setNewInterestInput('');
    }
  };

  // Toggle Interest chip (suggested or custom)
  const handleToggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.career_interests.includes(interest);
      if (exists) {
        return {
          ...prev,
          career_interests: prev.career_interests.filter((item) => item !== interest),
        };
      } else {
        return {
          ...prev,
          career_interests: [...prev.career_interests, interest],
        };
      }
    });
  };

  // Sync Skills from latest Resume
  const handleSyncSkillsFromResume = async () => {
    if (isDemoMode) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    try {
      const res = await resumeAPI.getAnalyses();
      if (res.data?.length > 0) {
        const latest = res.data[0];
        const keywords = latest.ats_keywords_found || [];
        if (keywords.length > 0) {
          const mergedSkills = Array.from(new Set([...profile.skills, ...keywords]));
          const updated = { ...profile, skills: mergedSkills };
          setProfile(updated);
          setFormData(updated);

          await authAPI.updateProfile(updated);
          updateUser(updated);
          setSyncNotice(`Synced ${keywords.length} skills from your latest resume evaluation!`);
          setTimeout(() => setSyncNotice(''), 4000);
        }
      }
    } catch (err) {
      console.error("Resume skill sync error:", err);
    }
  };

  // Save Modal changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!isDemoMode) {
        const res = await authAPI.updateProfile(formData);
        if (res.data) {
          setProfile(res.data);
          updateUser(res.data);
        }
      } else {
        setProfile(formData);
      }
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Profile save error:", err);
      alert(err.response?.data?.detail || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-xs text-slate-400 font-semibold">Loading Profile & Preferences...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1150px] mx-auto pb-16">
      
      {/* Demo Mode Alert Banner */}
      {isDemoMode && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>You are viewing the <b>Demo Profile</b>. Sign in to edit your details, add custom skills, and personalize your target role.</span>
          </div>
          <button
            onClick={() => navigate('/login', { state: { from: '/profile' } })}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0 transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login to Edit Profile</span>
          </button>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Account & Career Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your personal details, career goals, skills, and job preferences.
          </p>
        </div>

        {syncNotice && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{syncNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Profile Hero Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Side: Avatar & Details */}
        <div className="flex items-center space-x-5">
          {/* Avatar with Gradient Ring */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg ring-4 ring-indigo-500/20">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" title="Account Active" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {profile.full_name || 'User Profile'}
              </h2>
              
              {/* Profile Strength Badge */}
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                <Sparkles className="w-3 h-3" />
                <span>Profile {completionPercentage}% Complete</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {profile.target_role || <span className="text-slate-400 font-normal italic">Target role not specified</span>}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              <span className="flex items-center">
                <GraduationCap className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {profile.education || 'Education not specified'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {profile.location || 'Location not specified'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {profile.email}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full md:w-auto shrink-0">
          <button
            onClick={handleOpenDrawer}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-105"
          >
            {isDemoMode ? <LogIn className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isDemoMode ? 'Login to Edit Profile' : 'Edit Profile'}</span>
          </button>
        </div>

      </div>

      {/* Completion Suggestion Notice if incomplete */}
      {missingSuggestion && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span><b>Profile Strength:</b> {missingSuggestion} to complete your profile.</span>
          </div>
          <button
            onClick={handleOpenDrawer}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0 ml-3 cursor-pointer"
          >
            {isDemoMode ? 'Login Now →' : 'Complete Now →'}
          </button>
        </div>
      )}

      {/* 3. Personal Information Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Personal Information</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {profile.full_name || <span className="text-slate-400 font-normal italic">Not specified</span>}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {profile.email || <span className="text-slate-400 font-normal italic">Not specified</span>}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Education</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {profile.education || <span className="text-slate-400 font-normal italic">Not specified</span>}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {profile.location || <span className="text-slate-400 font-normal italic">Not specified</span>}
            </p>
          </div>

        </div>
      </div>

      {/* 4. Career Preferences Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Career Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Role</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 truncate">
              {profile.target_role || <span className="text-slate-400 font-normal italic">Not specified</span>}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience Level</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {profile.experience_level || <span className="text-slate-400 font-normal italic">Not specified</span>}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preferred Job Type</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {profile.preferred_job_type || <span className="text-slate-400 font-normal italic">Not specified</span>}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preferred Work Mode</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
              {profile.preferred_work_mode || <span className="text-slate-400 font-normal italic">Not specified</span>}
            </p>
          </div>

        </div>
      </div>

      {/* 5. Skills & Technologies Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Skills & Technologies</span>
          </h3>

          <button
            onClick={handleSyncSkillsFromResume}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            <span>Update skills from latest resume</span>
          </button>
        </div>

        {profile.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-xs shadow-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No skills added yet. Click Edit Profile to add your skills.</p>
        )}
      </div>

      {/* 6. Career Interests Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Career Interests</span>
        </h3>

        {profile.career_interests?.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {profile.career_interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No career interests added yet. Click Edit Profile to add your career interests.</p>
        )}
      </div>

      {/* 7. Settings Section (Appearance & System Preferences) */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-md">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <span>Application Settings</span>
        </h3>

        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Theme Appearance</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Customize your interface viewing preference across dark and light modes.</p>
          </div>

          {/* Connected Theme Selector */}
          <div className="flex p-1 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-bold">
            <button
              onClick={() => setThemeMode('system')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                themeMode === 'system'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-indigo-500" />
              <span>System</span>
            </button>
            <button
              onClick={() => setThemeMode('light')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8. EDIT PROFILE CENTERED MODAL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-2xl w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Edit Profile & Preferences</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update your account details, career goals, and matching criteria.</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveChanges} className="flex-1 overflow-y-auto pr-1 space-y-6 text-xs">
              
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                  Personal Information
                </h4>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/40 border border-slate-300 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Education</label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Career Preferences */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                  Career Preferences
                </h4>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Role</label>
                  <input
                    type="text"
                    value={formData.target_role}
                    onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Experience Level</label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    >
                      <option value="">Select Level</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead / Architect">Lead / Architect</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Job Type</label>
                    <select
                      value={formData.preferred_job_type}
                      onChange={(e) => setFormData({ ...formData, preferred_job_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    >
                      <option value="">Select Type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Work Mode</label>
                    <select
                      value={formData.preferred_work_mode}
                      onChange={(e) => setFormData({ ...formData, preferred_work_mode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                    >
                      <option value="">Select Mode</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skills Tag Input */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                  Skills & Technologies
                </h4>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                    placeholder="Type a skill and click + Add..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-rose-500 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom & Suggested Career Interests Input */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                  Career Interests
                </h4>

                {/* Add Custom Interest Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomInterest(e)}
                    placeholder="Type custom career interest & click + Add..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomInterest}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Interest</span>
                  </button>
                </div>

                {/* Selected Interests Tags */}
                {formData.career_interests.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Your Interests:</span>
                    <div className="flex flex-wrap gap-2">
                      {formData.career_interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs"
                        >
                          <span>{interest}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleInterest(interest)}
                            className="hover:text-rose-500 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Interest Chips */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Suggestions:</span>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_INTERESTS.map((interest, idx) => {
                      const isSelected = formData.career_interests.includes(interest);
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleToggleInterest(interest)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </form>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
