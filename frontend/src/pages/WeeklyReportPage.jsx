import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, DEMO_ANALYSIS } from '../services/api';
import { FileDown, Sparkles, CheckCircle2, FileText, Loader2, ArrowRight, Lock } from 'lucide-react';

const WeeklyReportPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const { isDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        if (isDemoMode) {
          setAnalyses([DEMO_ANALYSIS]);
        } else {
          const res = await resumeAPI.getAnalyses();
          setAnalyses(res.data || []);
        }
      } catch (err) {
        console.error(err);
        if (isDemoMode) setAnalyses([DEMO_ANALYSIS]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyses();
  }, [isDemoMode]);

  const handleDownload = async (analysisId) => {
    if (isDemoMode) {
      navigate('/login', { state: { from: '/weekly-report' } });
      return;
    }
    setDownloadingId(analysisId);
    try {
      const response = await resumeAPI.downloadPDFReport(analysisId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AI_Career_Report_${analysisId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF Download error:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRequireLogin = () => {
    navigate('/login', { state: { from: '/weekly-report' } });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <FileDown className="w-3.5 h-3.5" />
            <span>Executive Report Center</span>
          </span>
          {isDemoMode && (
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
              Sample Preview
            </span>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Download AI Career Reports (PDF)</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Download formatted PDF reports summarizing your ATS score, skill gap matrix, and personalized learning roadmap.
        </p>
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
              <span>You are viewing a sample report preview. Sign in to analyze your resume and download custom PDF reports.</span>
            </div>
          </div>
          <button
            onClick={handleRequireLogin}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer"
          >
            <span className="text-white">Sign In to Download</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : analyses.length === 0 ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
            <FileDown className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No PDF Reports Available</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your PDF resume to generate and download formatted PDF Career Reports.
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
        <div className="space-y-4">
          {analyses.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Report #{item.id}: {item.target_role}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold">
                    Score: {item.resume_score}/100
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  ATS Score: {item.ats_score}% • Generated on {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleDownload(item.id)}
                disabled={downloadingId === item.id}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {downloadingId === item.id ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : isDemoMode ? <Lock className="w-4 h-4 text-white" /> : <FileDown className="w-4 h-4 text-white" />}
                <span className="text-white">{isDemoMode ? "Sign In to Download PDF" : "Download PDF Report"}</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default WeeklyReportPage;
