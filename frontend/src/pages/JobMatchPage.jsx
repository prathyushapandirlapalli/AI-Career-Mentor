import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { Crosshair, Briefcase, Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const JobMatchPage = () => {
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
  const recommendations = latest?.job_recommendations || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      <div className="glass-panel p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <Crosshair className="w-3.5 h-3.5" />
          <span>Job Role Compatibility Matcher</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Target Job Role Recommendations</h1>
        <p className="text-xs text-slate-400">AI-matched target tech roles based on your extracted resume competencies.</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-md">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Resume Analyzed Yet</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your PDF resume to unlock AI-matched job role recommendations tailored to your skills and experience.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((job, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-extrabold">
                  {job.match_percentage}% Match Score
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {job.reason}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Recommended Focus:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">High Demand Role</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default JobMatchPage;
