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
  Loader2,
  X,
  Upload,
  History,
  ArrowLeft
} from 'lucide-react';

const ensureArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return val.split('\n').filter(Boolean);
    }
  }
  return [];
};

const ResumeAnalysisResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDemoMode } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const rawData = location.state?.analysisData || (isDemoMode ? DEMO_ANALYSIS : null);

  if (!rawData) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-slate-400 text-sm">No analysis result loaded. Please upload a resume first.</p>
        <Link to="/resume-upload" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">
          Upload PDF Resume
        </Link>
      </div>
    );
  }

  // Safely parse array fields to prevent undefined .map() crashes
  const data = {
    ...rawData,
    strengths: ensureArray(rawData.strengths),
    ats_keywords_missing: ensureArray(rawData.ats_keywords_missing),
    improvements: ensureArray(rawData.improvements),
    job_recommendations: ensureArray(rawData.job_recommendations),
  };

  const handleDownloadPDF = async () => {
    if (isDemoMode) {
      navigate('/login', { state: { from: '/resume-analysis' } });
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
    <div className="space-y-8 max-w-[1150px] mx-auto pb-12">
      
      {/* Top Header & Actions */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
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

        {/* Action Buttons: Exit Evaluation, Upload Another, Download PDF */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            title="Exit Evaluation to Dashboard"
          >
            <X className="w-4 h-4 text-rose-500" />
            <span>Exit Evaluation</span>
          </button>

          <button
            onClick={() => navigate('/resume-upload')}
            className="px-4 py-2.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            title="Upload Another Resume"
          >
            <Upload className="w-4 h-4 text-indigo-500" />
            <span>Upload Another</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span>{isDemoMode ? "Download Report (Sample)" : "Download PDF Report"}</span>
          </button>
        </div>
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
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Executive Summary</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {data.summary_feedback}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Strengths */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Key Strengths</span>
            </h3>
            {data.strengths.length > 0 ? (
              <ul className="space-y-2">
                {data.strengths.map((item, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-start space-x-2">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No key strengths listed.</p>
            )}
          </div>

          {/* Missing ATS Keywords */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Missing ATS Keywords</span>
            </h3>
            {data.ats_keywords_missing.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.ats_keywords_missing.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-300">
                    {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">All key ATS keywords present!</p>
            )}
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Target className="w-4 h-4 text-indigo-500" />
            <span>Recommended Improvements</span>
          </h3>
          {data.improvements.length > 0 ? (
            <ul className="space-y-2">
              {data.improvements.map((item, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400 italic">No specific improvements recommended.</p>
          )}
        </div>

      </div>

      {/* Recommended Job Roles */}
      {data.job_recommendations.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Recommended Job Roles</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.job_recommendations.map((job, idx) => (
              <div key={idx} className="glass-card p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.title || job}</h4>
                  {job.reason && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{job.reason}</p>}
                </div>
                {job.match_percentage && (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-extrabold text-xs shrink-0">
                    {job.match_percentage}% Match
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Finished reviewing your evaluation?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Return to your dashboard or analyze another resume.</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => navigate('/resume-upload')}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-indigo-500" />
            <span>Upload Another Resume</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Exit Evaluation</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResumeAnalysisResultsPage;
