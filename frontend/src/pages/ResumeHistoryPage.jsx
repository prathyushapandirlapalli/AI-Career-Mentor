import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, DEMO_ANALYSIS } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  History,
  FileText,
  Search,
  Sparkles,
  ArrowUpRight,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  X,
  FileCode,
  Filter,
  Plus,
  ExternalLink
} from 'lucide-react';

const DEMO_HISTORICAL_RECORDS = [
  {
    id: 101,
    resume_id: 1,
    filename: 'senior-fullstack-resume.pdf',
    target_role: 'Senior Full Stack Engineer',
    resume_score: 92,
    ats_score: 95,
    formatting_score: 90,
    impact_score: 88,
    created_at: new Date().toISOString(),
    extracted_text: `SAI LOKESH GOUD
Full Stack Engineer | React 18, Python, FastAPI, PostgreSQL
Email: demo@aicareer.io | Location: India

SUMMARY:
Results-driven Senior Full Stack Engineer with 5+ years of experience architecting high-throughput web applications, microservices, and modern UI component systems.

TECHNICAL SKILLS:
• Frontend: React 18, TypeScript, TailwindCSS, Next.js, Redux Toolkit
• Backend: Python, FastAPI, Django, Node.js, Express
• Database & Cloud: PostgreSQL, Redis, Docker, AWS (S3, EC2, Lambda), CI/CD`
  },
  {
    id: 102,
    resume_id: 2,
    filename: 'frontend-developer-cv.pdf',
    target_role: 'Frontend React Engineer',
    resume_score: 88,
    ats_score: 91,
    formatting_score: 85,
    impact_score: 82,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    extracted_text: `FRONTEND ENGINEER CANDIDATE
Specializing in React, TypeScript & Responsive Web UI Architecture`
  },
  {
    id: 103,
    resume_id: 3,
    filename: 'backend-python-resume.pdf',
    target_role: 'Backend Python Developer',
    resume_score: 82,
    ats_score: 86,
    formatting_score: 80,
    impact_score: 79,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    extracted_text: `BACKEND PYTHON DEVELOPER
Specializing in FastAPI, AsyncIO & Distributed Microservices Architecture`
  }
];

const ResumeHistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Preview & Delete Modal States
  const [previewItem, setPreviewItem] = useState(null);
  const [previewMode, setPreviewMode] = useState('pdf');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);

  const { isDemoMode, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Generate / Fetch Original PDF Blob when previewItem changes
  useEffect(() => {
    let activeUrl = null;
    const generatePdfView = async () => {
      if (!previewItem) {
        setPdfUrl(null);
        setPdfError(null);
        return;
      }
      setPdfLoading(true);
      setPdfError(null);
      try {
        if (!isDemoMode && previewItem.id) {
          const res = await resumeAPI.getOriginalResumePDF(previewItem.id);
          const blob = new Blob([res.data], { type: 'application/pdf' });
          activeUrl = URL.createObjectURL(blob);
          setPdfUrl(activeUrl);
        } else {
          // Sample binary PDF Blob for Demo view
          const pdfContent = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>> >> endobj
4 0 obj <</Length 350>> stream
BT
/F1 16 Tf
50 730 Td
(${previewItem.filename?.toUpperCase() || 'UPLOADED_RESUME.PDF'}) Tj
/F1 10 Tf
0 -25 Td
(CANDIDATE UPLOADED RESUME DOCUMENT) Tj
0 -20 Td
(--------------------------------------------------------------------------------) Tj
0 -20 Td
(SAI LOKESH GOUD - Senior Full Stack Engineer) Tj
0 -15 Td
(Email: demo@aicareer.io | Location: India) Tj
0 -25 Td
(SUMMARY:) Tj
0 -15 Td
(Results-driven Senior Full Stack Engineer with 5+ years of experience) Tj
0 -15 Td
(architecting high-throughput web applications, microservices, and React UI systems.) Tj
0 -25 Td
(TECHNICAL SKILLS:) Tj
0 -15 Td
(React 18, TypeScript, Python, FastAPI, PostgreSQL, Docker, AWS, Redis) Tj
ET
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000645 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
714
%%EOF`;
          const blob = new Blob([pdfContent], { type: 'application/pdf' });
          activeUrl = URL.createObjectURL(blob);
          setPdfUrl(activeUrl);
        }
      } catch (err) {
        console.error("Original PDF fetch failed:", err);
        setPdfError("Original PDF file is unavailable for this historical record. Please upload this resume again.");
      } finally {
        setPdfLoading(false);
      }
    };

    generatePdfView();

    return () => {
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [previewItem, isDemoMode]);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      if (isDemoMode) {
        setAnalyses(DEMO_HISTORICAL_RECORDS);
      } else {
        const res = await resumeAPI.getAnalyses();
        setAnalyses(res.data || []);
      }
    } catch (err) {
      console.error("Fetch analyses error:", err);
      if (isDemoMode) setAnalyses(DEMO_HISTORICAL_RECORDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [isDemoMode]);

  // Filter & Sort Logic
  const filteredAnalyses = useMemo(() => {
    let result = [...analyses];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.target_role.toLowerCase().includes(q) ||
          (item.filename && item.filename.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'highest_resume') return b.resume_score - a.resume_score;
      if (sortBy === 'highest_ats') return b.ats_score - a.ats_score;
      return 0;
    });

    return result;
  }, [analyses, searchQuery, sortBy]);

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (isDemoMode) {
      setDemoNotice(true);
      setDeleteTarget(null);
      return;
    }

    setDeleting(true);
    try {
      await resumeAPI.deleteAnalysis(deleteTarget.id);
      setAnalyses((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.detail || "Failed to delete resume analysis.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-xs text-slate-400 font-semibold">Loading Resume History...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. Header Banner & Top Action */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <History className="w-3.5 h-3.5" />
              <span>Resume History Hub</span>
            </span>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                Demo Data
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Resume History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            View and manage your previously analyzed resumes, examine ATS scores, and track career readiness over time.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
            {analyses.length} {analyses.length === 1 ? 'Analysis' : 'Analyses'}
          </span>
          <Link
            to="/resume-upload"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Analyze New Resume</span>
          </Link>
        </div>
      </div>

      {/* 2. Controls Bar (Search & Filter) */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes or target roles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Sorting Selection */}
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_resume">Highest Resume Score</option>
            <option value="highest_ats">Highest ATS Match</option>
          </select>
        </div>

      </div>

      {/* 3. History Content / Table / Empty State */}
      {filteredAnalyses.length === 0 ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-dashed border-slate-300 dark:border-slate-800 shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {searchQuery ? "No matching resume analyses" : "No resume analyses yet"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {searchQuery
                ? `No historical records match "${searchQuery}". Try a different search term.`
                : "Analyze your first resume to start tracking your ATS performance and career improvements."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/resume-upload"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>Analyze Your First Resume</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100/50 dark:bg-slate-900/60">
                  <th className="py-4 px-5">Resume File</th>
                  <th className="py-4 px-5">Target Role</th>
                  <th className="py-4 px-5">Resume Score</th>
                  <th className="py-4 px-5">ATS Match</th>
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
                {filteredAnalyses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/40 transition-colors">
                    
                    {/* Resume File Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                            {item.filename || `resume_${item.id}.pdf`}
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold">PDF Document</span>
                        </div>
                      </div>
                    </td>

                    {/* Target Role */}
                    <td className="py-4 px-5 font-semibold text-slate-800 dark:text-slate-200">
                      {item.target_role}
                    </td>

                    {/* Resume Score */}
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                        {item.resume_score} / 100
                      </span>
                    </td>

                    {/* ATS Match */}
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-extrabold text-xs">
                        {item.ats_score}%
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-slate-500 dark:text-slate-400">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View Original Resume Button */}
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                          title="View Original Uploaded PDF Resume"
                        >
                          <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="hidden md:inline">View Resume</span>
                        </button>

                        {/* View AI Analysis Button */}
                        <button
                          onClick={() => navigate('/analysis-results', { state: { analysisData: item } })}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:text-indigo-400 dark:hover:text-white font-bold text-xs transition-all flex items-center space-x-1.5 border border-indigo-500/20 cursor-pointer"
                          title="View Saved AI Assessment Report"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">View Analysis</span>
                        </button>

                        {/* Delete Analysis Button */}
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                          title="Delete Analysis & Resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Resume Preview Modal (Original PDF Viewer) */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-4xl w-full space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {previewItem.filename || `resume_${previewItem.id}.pdf`}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Target Role: <b>{previewItem.target_role}</b> • Original Uploaded PDF
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                
                {/* Open PDF in New Tab Link */}
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:text-indigo-400 dark:hover:text-white text-xs font-bold transition-all flex items-center space-x-1.5 border border-indigo-500/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open PDF in New Tab</span>
                  </a>
                )}

                {/* View Mode Toggle */}
                <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                  <button
                    onClick={() => setPreviewMode('pdf')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      previewMode === 'pdf'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    📄 PDF View
                  </button>
                  <button
                    onClick={() => setPreviewMode('text')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      previewMode === 'text'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    📝 Parsed Text
                  </button>
                </div>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Resume Content Body: ORIGINAL Embedded PDF Viewer */}
            {previewMode === 'pdf' ? (
              <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner relative flex flex-col">
                {pdfLoading ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[450px] space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <span className="text-xs text-slate-400 font-semibold">Loading Original PDF File...</span>
                  </div>
                ) : pdfError ? (
                  <div className="p-8 text-center text-slate-400 my-auto space-y-3">
                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-200">Original PDF File Unavailable</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      {pdfError}
                    </p>
                    <Link to="/resume-upload" className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md">
                      Re-upload Resume PDF
                    </Link>
                  </div>
                ) : pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full min-h-[500px] rounded-2xl bg-white border-0"
                    title={previewItem.filename || "Original PDF Resume"}
                  />
                ) : null}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed border border-slate-800">
                {previewItem.extracted_text || "No text content available."}
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Document: <b className="text-slate-900 dark:text-white">{previewItem.filename || `resume_${previewItem.id}.pdf`}</b>
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all items-center space-x-1.5 border border-slate-200 dark:border-slate-800"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open PDF in New Tab</span>
                  </a>
                )}
                
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const item = previewItem;
                    setPreviewItem(null);
                    navigate('/analysis-results', { state: { analysisData: item } });
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Full AI Analysis</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-5 border border-rose-500/30 shadow-2xl relative">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-md">
              <Trash2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Delete Resume Analysis?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This will permanently delete <b>{deleteTarget.filename || `Analysis #${deleteTarget.id}`}</b> and its saved AI evaluation. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="w-1/2 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Demo Mode Delete Toast Notice */}
      {demoNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-500/90 text-slate-950 font-bold text-xs shadow-xl flex items-center space-x-3 animate-slide-up">
          <Lock className="w-4 h-4 shrink-0" />
          <span>Deleting records is unavailable in Demo Mode. Sign in to manage your resumes.</span>
          <button onClick={() => setDemoNotice(false)} className="ml-2 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default ResumeHistoryPage;
