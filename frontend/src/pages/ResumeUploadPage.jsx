import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, DEMO_ANALYSIS } from '../services/api';
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2, Lock, ArrowRight, Target, Award, Eye } from 'lucide-react';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [latestAnalysis, setLatestAnalysis] = useState(null);

  const { user, isDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await resumeAPI.getAnalyses();
        if (res.data && res.data.length > 0) {
          setLatestAnalysis(res.data[0]);
        } else if (isDemoMode) {
          setLatestAnalysis(DEMO_ANALYSIS);
        }
      } catch (err) {
        console.error(err);
        if (isDemoMode) setLatestAnalysis(DEMO_ANALYSIS);
      }
    };
    fetchLatest();
  }, [isDemoMode]);

  // Demo Mode View: Show Sample Resume Analysis Preview (No Login Required to View)
  if (isDemoMode) {
    const sample = latestAnalysis || DEMO_ANALYSIS;
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner Header with Sample Data Badge */}
        <div className="glass-panel p-8 rounded-3xl space-y-3 text-center border border-indigo-500/20 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sample Analysis • Demo Preview</span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Resume Parser & Assessment</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Explore sample AI evaluation output including ATS compatibility metrics, strength analysis, and missing keyword breakdown.
          </p>
        </div>

        {/* Sample Resume Analysis Results Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900/40">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                  Sample Target Role: {sample.target_role}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Demo Data
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sample Evaluation Summary</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{sample.summary_feedback}</p>
            </div>

            <button
              onClick={() => navigate('/analysis-results', { state: { analysisData: sample } })}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Sample Analysis</span>
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sample Resume Score</span>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{sample.resume_score} / 100</div>
              <span className="text-[10px] text-emerald-400 font-semibold">High Professional Impact</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sample ATS Match Rate</span>
              <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">{sample.ats_score}%</div>
              <span className="text-[10px] text-cyan-400 font-semibold">Excellent Keyword Coverage</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Keywords Analyzed</span>
              <div className="text-3xl font-extrabold text-amber-500">{sample.ats_keywords_found.length} Detected</div>
              <span className="text-[10px] text-amber-400 font-semibold">{sample.ats_keywords_missing.length} Missing Suggested</span>
            </div>
          </div>

          {/* Sample Strengths & Missing Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Sample Resume Strengths</span>
              </h3>
              <ul className="space-y-2">
                {sample.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Target className="w-4 h-4 text-cyan-500" />
                <span>Sample Detected ATS Keywords</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {sample.ats_keywords_found.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[11px] font-bold">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* CTA Banner to Analyze Personal Resume */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Analyze Your Own Resume?</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your custom PDF resume, extract exact ATS score pass rates, and receive personalized career recommendations.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login', { state: { from: '/resume-upload' } })}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>

      </div>
    );
  }

  // Handle Drag and Drop for Authenticated Users
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === 'application/pdf') {
        setFile(selected);
        setError('');
      } else {
        setError('Only PDF documents (.pdf) are supported.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf') {
        setFile(selected);
        setError('');
      } else {
        setError('Only PDF documents (.pdf) are supported.');
      }
    }
  };

  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a PDF resume file.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_role', targetRole);

    try {
      const res = await resumeAPI.uploadAndAnalyze(formData);
      navigate('/analysis-results', { state: { analysisData: res.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to analyze resume. Please ensure file is non-password protected.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="glass-panel p-8 rounded-3xl space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 AI Resume Parser</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Upload Resume for AI Assessment</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Extract skills, analyze ATS keyword compatibility, calculate ATS pass rate, and generate step-by-step career roadmaps.
        </p>
      </div>

      {latestAnalysis && (
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Active Resume Analyzed ({latestAnalysis.target_role})</span>
            </div>
            <p className="text-xs text-slate-300">
              Overall Score: <b className="text-white">{latestAnalysis.resume_score}/100</b> • ATS Match: <b className="text-cyan-400">{latestAnalysis.ats_score}%</b>
            </p>
          </div>
          <button
            onClick={() => navigate('/analysis-results', { state: { analysisData: latestAnalysis } })}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0 flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Latest Analysis Results</span>
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUploadAndAnalyze} className="space-y-6">
        
        {/* Target Role Selector */}
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Target Job Role for Assessment
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Senior Full Stack Engineer">Senior Full Stack Engineer</option>
            <option value="Backend Python Developer">Backend Python Developer</option>
            <option value="Frontend React Engineer">Frontend React Engineer</option>
            <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
            <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
            <option value="Data Engineer">Data Engineer</option>
          </select>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`glass-panel p-10 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/20'
              : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            id="pdf-upload-input"
            className="hidden"
          />

          <label htmlFor="pdf-upload-input" className="cursor-pointer flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4">
              {file ? <FileText className="w-8 h-8 text-emerald-400" /> : <Upload className="w-8 h-8" />}
            </div>

            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
                <span className="inline-block mt-2 text-xs font-semibold text-indigo-400 hover:underline">
                  Click to replace file
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Drag and drop your PDF resume here, or <span className="text-indigo-500 dark:text-indigo-400">Browse</span>
                </p>
                <p className="text-xs text-slate-500">Supports text-readable PDF documents up to 10MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Resume with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Run Comprehensive AI Analysis</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default ResumeUploadPage;
