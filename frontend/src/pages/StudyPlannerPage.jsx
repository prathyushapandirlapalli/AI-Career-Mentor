import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { plannerAPI } from '../services/api';
import { Calendar, CheckCircle2, Circle, ExternalLink, Clock, Sparkles, Loader2, Lock, ArrowRight } from 'lucide-react';

const DEMO_STUDY_TASKS = [
  {
    id: 101,
    day_number: 1,
    category: 'System Design',
    title: 'Master Redis Data Structures & Pub/Sub Messaging',
    description: 'Learn Redis hashes, sorted sets, bitfields, and pub/sub architecture for real-time applications.',
    resource_name: 'Redis Official Architecture Guide',
    resource_url: 'https://redis.io/docs/',
    duration_minutes: 45,
    is_free: true,
    is_completed: true
  },
  {
    id: 102,
    day_number: 2,
    category: 'Backend Engineering',
    title: 'FastAPI Async Middleware & JWT Authentication',
    description: 'Implement OAuth2 password bearer tokens, refresh tokens, and rate limiting middleware.',
    resource_name: 'FastAPI Security Docs',
    resource_url: 'https://fastapi.tiangolo.com/tutorial/security/',
    duration_minutes: 60,
    is_free: true,
    is_completed: false
  },
  {
    id: 103,
    day_number: 3,
    category: 'DevOps',
    title: 'Docker Multi-Stage Builds & Kubernetes Pod Deployment',
    description: 'Optimize Dockerfile layer caching and write Kubernetes deployment manifests with health probes.',
    resource_name: 'Kubernetes Official Tutorials',
    resource_url: 'https://kubernetes.io/docs/tutorials/',
    duration_minutes: 90,
    is_free: true,
    is_completed: false
  }
];

const StudyPlannerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const { isDemoMode } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      if (isDemoMode) {
        setTasks(DEMO_STUDY_TASKS);
      } else {
        const res = await plannerAPI.getTasks();
        setTasks(res.data || []);
      }
    } catch (err) {
      console.error(err);
      if (isDemoMode) setTasks(DEMO_STUDY_TASKS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isDemoMode]);

  const handleToggleTask = async (taskId, currentStatus) => {
    if (isDemoMode) {
      navigate('/login', { state: { from: '/study-planner' } });
      return;
    }
    try {
      const res = await plannerAPI.updateTask(taskId, { is_completed: !currentStatus });
      setTasks(tasks.map(t => t.id === taskId ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegeneratePlan = async () => {
    if (isDemoMode) {
      navigate('/login', { state: { from: '/study-planner' } });
      return;
    }
    setGenerating(true);
    try {
      const res = await plannerAPI.generatePlan({ timeline_days: 30 });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleRequireLogin = () => {
    navigate('/login', { state: { from: '/study-planner' } });
  };

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      
      {/* Top Header Banner */}
      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>30-Day Daily Study Planner</span>
            </span>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                Sample Preview
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Daily Learning Curriculum</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Structured daily topics, free & paid learning resources, and progress tracking.</p>
        </div>

        {tasks.length > 0 && (
          <button
            onClick={handleRegeneratePlan}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {generating ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : isDemoMode ? <Lock className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
            <span className="text-white">{isDemoMode ? "Sign In to Custom Plan" : "Regenerate 30-Day Plan"}</span>
          </button>
        )}
      </div>

      {/* Demo Mode Alert Banner */}
      {isDemoMode && (
        <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-200 font-medium">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white block text-sm">Demo Mode Active</span>
              <span>You are viewing sample daily study goals. Sign in to check off completed tasks, save learning progress, and customize curriculum.</span>
            </div>
          </div>
          <button
            onClick={handleRequireLogin}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer"
          >
            <span className="text-white">Sign In to Track Tasks</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* Progress Bar (Only when plan is generated) */}
      {tasks.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-900 dark:text-white">Overall Plan Completion</span>
            <span className="text-indigo-600 dark:text-indigo-400">{completedCount} of {tasks.length} Tasks ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Daily Task Cards / Empty State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-dashed border-slate-300 dark:border-slate-800 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Study Curriculum Generated</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Generate a personalized 30-day learning curriculum tailored to your target job role.
            </p>
          </div>
          <button
            onClick={handleRegeneratePlan}
            disabled={generating}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {generating ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Sparkles className="w-4 h-4 text-white" />}
            <span>Generate 30-Day Plan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id, task.is_completed)}
              className={`glass-card p-5 rounded-2xl flex items-start justify-between cursor-pointer transition-all border border-slate-200 dark:border-slate-800 shadow-md ${
                task.is_completed ? 'border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <button className="mt-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                  {task.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Day {task.day_number}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">{task.category}</span>
                  </div>
                  <h3 className={`text-sm font-bold ${task.is_completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{task.description}</p>
                  
                  {task.resource_url && (
                    <a
                      href={task.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                    >
                      <span>{task.resource_name || 'Study Resource'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2 shrink-0">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-slate-400" />
                  {task.duration_minutes} mins
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  task.is_free ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                }`}>
                  {task.is_free ? 'Free' : 'Paid Course'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default StudyPlannerPage;
