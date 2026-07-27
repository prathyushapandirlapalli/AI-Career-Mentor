import React, { useState, useEffect } from 'react';
import { plannerAPI } from '../services/api';
import { Calendar, CheckCircle2, Circle, ExternalLink, Clock, Sparkles, Loader2 } from 'lucide-react';

const StudyPlannerPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await plannerAPI.getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const res = await plannerAPI.updateTask(taskId, { is_completed: !currentStatus });
      setTasks(tasks.map(t => t.id === taskId ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegeneratePlan = async () => {
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

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>30-Day Daily Study Planner</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Daily Learning Curriculum</h1>
          <p className="text-xs text-slate-400">Structured daily topics, free & paid learning resources, and progress tracking.</p>
        </div>

        <button
          onClick={handleRegeneratePlan}
          disabled={generating}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Regenerate 30-Day Plan</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="glass-panel p-6 rounded-3xl space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-white">Overall Plan Completion</span>
          <span className="text-amber-400">{completedCount} of {tasks.length} Tasks ({progressPercent}%)</span>
        </div>
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Daily Task Cards */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id, task.is_completed)}
              className={`glass-card p-5 rounded-2xl flex items-start justify-between cursor-pointer transition-all ${
                task.is_completed ? 'border-emerald-500/30 bg-emerald-950/10' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <button className="mt-1 text-slate-400 hover:text-white">
                  {task.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400">Day {task.day_number}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-semibold text-slate-400">{task.category}</span>
                  </div>
                  <h3 className={`text-sm font-bold ${task.is_completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{task.description}</p>
                  
                  {task.resource_url && (
                    <a
                      href={task.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:underline pt-1"
                    >
                      <span>{task.resource_name || 'Study Resource'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end space-y-2 shrink-0">
                <span className="text-[10px] text-slate-400 font-semibold flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-slate-500" />
                  {task.duration_minutes} mins
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  task.is_free ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'
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
