import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import { FileDown, Sparkles, CheckCircle2, FileText, Loader2 } from 'lucide-react';

const WeeklyReportPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

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

  const handleDownload = async (analysisId) => {
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div className="glass-panel p-8 rounded-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <FileDown className="w-3.5 h-3.5" />
          <span>Executive Report Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Download AI Career Reports (PDF)</h1>
        <p className="text-xs text-slate-400">Download formatted PDF reports summarizing your ATS score, skill gap matrix, and personalized learning roadmap.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : analyses.length === 0 ? (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-2">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h2 className="text-base font-bold text-white">No PDF Reports Available</h2>
          <p className="text-xs text-slate-400">Upload a resume to generate your first downloadable PDF Report.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-base font-bold text-white">Report #{item.id}: {item.target_role}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-extrabold">
                    Score: {item.resume_score}/100
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  ATS Score: {item.ats_score}% • Generated on {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleDownload(item.id)}
                disabled={downloadingId === item.id}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0 disabled:opacity-50"
              >
                {downloadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                <span>Download PDF Report</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default WeeklyReportPage;
