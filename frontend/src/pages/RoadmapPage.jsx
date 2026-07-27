import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { MapPin, Clock, CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';

const RoadmapPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await resumeAPI.getAnalyses();
        setAnalyses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const latest = analyses.length > 0 ? analyses[0] : null;
  const roadmap = latest?.learning_roadmap || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="glass-panel p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" />
          <span>Personalized Timeline</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Personalized Learning Roadmap</h1>
        <p className="text-xs text-slate-400">Step-by-step career path optimized for {latest?.target_role || 'Target Role'}</p>
      </div>

      {/* Vertical Timeline / Empty State */}
      {roadmap.length === 0 ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Roadmap Generated Yet</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your PDF resume to generate a personalized step-by-step career learning roadmap tailored to your target job role.
            </p>
          </div>
          <Link
            to="/resume-upload"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <span>Upload PDF Resume</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-indigo-500/30">
          {roadmap.map((step, idx) => (
            <div key={idx} className="relative group">
              
              {/* Timeline Node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-indigo-600 border-4 border-slate-950 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-indigo-600/50">
                {idx + 1}
              </div>

              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{step.phase}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.goal}</h3>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 mr-1 text-cyan-500 dark:text-cyan-400" />
                    Est. {step.estimated_hours} Hours
                  </span>
                </div>

                {/* Topics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Learning Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {step.topics.map((t, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Items */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actionable Milestones</h4>
                  <div className="space-y-1.5">
                    {step.action_items.map((act, aIdx) => (
                      <div key={aIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default RoadmapPage;
