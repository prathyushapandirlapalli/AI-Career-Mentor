import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import { Target, CheckCircle2, XCircle, Search, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const ATSMatrixPage = () => {
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

  if (!latest) {
    return (
      <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-dashed border-slate-300 dark:border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-md">
          <Target className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">No ATS Analysis Found</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Please upload your PDF resume to extract key competencies and view your ATS Keyword Match Breakdown.
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
    );
  }

  return (
    <div className="space-y-8">
      
      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
            <Target className="w-3.5 h-3.5" />
            <span>Applicant Tracking System (ATS) Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">ATS Keyword Match Matrix</h1>
          <p className="text-xs text-slate-400">Target Role: {latest.target_role}</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 shrink-0">
          <ScoreGauge score={latest.ats_score} title="ATS Match Rate" size="small" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Keywords Detected */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Keywords Found in Resume ({latest.ats_keywords_found.length})</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {latest.ats_keywords_found.map((kw, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-rose-400 flex items-center space-x-2">
            <XCircle className="w-4 h-4" />
            <span>Missing ATS Keywords ({latest.ats_keywords_missing.length})</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {latest.ats_keywords_missing.map((kw, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center">
                <XCircle className="w-3 h-3 mr-1 text-rose-400" />
                {kw}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ATSMatrixPage;
