import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, DEMO_ANALYSIS } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  Sparkles,
  FileDown,
  CheckCircle2,
  AlertTriangle,
  Target,
  Briefcase,
  Layers,
  ArrowRight,
  Loader2
} from 'lucide-react';

const ResumeAnalysisResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDemoMode } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const data = location.state?.analysisData || (isDemoMode ? DEMO_ANALYSIS : null);

  if (!data) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-400 text-sm">No analysis result loaded. Please upload a resume first.</p>
        <Link to="/resume-upload" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
          Upload PDF Resume
        </Link>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (isDemoMode) {
      alert("PDF report download is a feature for registered users. Please Sign In or Create an Account.");
      return;
    }
    setDownloading(true);
    try {
      const response = await resumeAPI.downloadPDFReport(data.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AI_Career_Report_${data.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Actions */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AI Resume Assessment Complete</span>
            </span>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                Sample Preview
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Resume Evaluation: <span className="text-gradient">{data.target_role}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isDemoMode ? "Sample evaluation criteria for Senior Full Stack Engineer role." : `Generated on ${new Date(data.created_at).toLocaleDateString()}`}
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
          <span>{isDemoMode ? "Download Report (Sample)" : "Download PDF Report"}</span>
        </button>
      </div>

      {/* 4 Score Gauges Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
          <ScoreGauge score={data.resume_score} title="Overall Resume Score" />
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
          <ScoreGauge score={data.ats_score} title="ATS Match Score" />
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
          <ScoreGauge score={data.formatting_score} title="Formatting Quality" />
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center">
          <ScoreGauge score={data.impact_score} title="Action Impact Score" />
        </div>
      </div>

      {/* Summary Evaluation */}
      <div className="glass-panel p-6 rounded-3xl space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Executive Summary & Feedback</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {data.summary_feedback}
        </p>
      </div>

      {/* Strengths vs Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Strengths Identified</span>
          </h3>
          <ul className="space-y-2.5">
            {data.strengths.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Actionable Improvements</span>
          </h3>
          <ul className="space-y-2.5">
            {data.improvements.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Recommended Job Roles */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Recommended Job Roles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.job_recommendations.map((job, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{job.reason}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-extrabold text-xs shrink-0">
                {job.match_percentage}% Match
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ResumeAnalysisResultsPage;
