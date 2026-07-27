import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI, resumeAPI } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import {
  FileText,
  Target,
  Video,
  Calendar,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashRes, resumeRes] = await Promise.all([
          progressAPI.getDashboard(),
          resumeAPI.getAnalyses()
        ]);
        setMetrics(dashRes.data);
        setAnalyses(resumeRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-xs text-slate-400 font-semibold">Loading AI Career Metrics...</span>
        </div>
      </div>
    );
  }

  const latestAnalysis = analyses.length > 0 ? analyses[0] : null;

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome to Your AI Mentor Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Your real-time career readiness analytics, ATS scores, and AI-driven study curriculum.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 shrink-0">
          <ScoreGauge score={metrics?.overall_readiness_score || 72} title="Career Readiness" size="small" />
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latest Resume Score</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {metrics?.latest_resume_score || (latestAnalysis ? latestAnalysis.resume_score : 0)}/100
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center mt-1">
              <CheckCircle2 className="w-3 h-3 mr-1" /> PDF Parsed & Evaluated
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ATS Match Rate</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {metrics?.latest_ats_score || (latestAnalysis ? latestAnalysis.ats_score : 0)}%
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold flex items-center mt-1">
              <Target className="w-3 h-3 mr-1" /> Target Job Alignment
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mock Interviews</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {metrics?.mock_interviews_completed || 0} Sessions
            </div>
            <span className="text-[10px] text-indigo-400 font-semibold flex items-center mt-1">
              Avg Score: {metrics?.average_interview_score || 0}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Study Task Progress</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {metrics?.completed_study_tasks || 0} / {metrics?.total_study_tasks || 0}
            </div>
            <span className="text-[10px] text-amber-400 font-semibold flex items-center mt-1">
              {metrics?.completion_percentage || 0}% Completed
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Quick Launchpad Actions */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Quick Launchpad</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/resume-upload" className="glass-card p-4 rounded-xl flex items-center space-x-3 group">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center">
                <span>Upload PDF Resume</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-60" />
              </h3>
              <p className="text-[10px] text-slate-400">Get AI Resume & ATS Score</p>
            </div>
          </Link>

          <Link to="/mock-interview" className="glass-card p-4 rounded-xl flex items-center space-x-3 group">
            <div className="p-3 rounded-lg bg-purple-600/20 text-purple-400 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center">
                <span>Start Mock Interview</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-60" />
              </h3>
              <p className="text-[10px] text-slate-400">Resume-tailored questions</p>
            </div>
          </Link>

          <Link to="/company-prep" className="glass-card p-4 rounded-xl flex items-center space-x-3 group">
            <div className="p-3 rounded-lg bg-cyan-600/20 text-cyan-400 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center">
                <span>Company Prep Hub</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-60" />
              </h3>
              <p className="text-[10px] text-slate-400">Amazon, TCS, Google prep</p>
            </div>
          </Link>

          <Link to="/study-planner" className="glass-card p-4 rounded-xl flex items-center space-x-3 group">
            <div className="p-3 rounded-lg bg-amber-600/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center">
                <span>Daily Study Planner</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-60" />
              </h3>
              <p className="text-[10px] text-slate-400">30-day learning curriculum</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Resume Analyses Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent AI Resume Analyses</h2>
          <Link to="/resume-upload" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            + Analyze New PDF
          </Link>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl p-6">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No resumes analyzed yet.</p>
            <Link to="/resume-upload" className="inline-block mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              Upload PDF Resume
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">Resume Score</th>
                  <th className="py-3 px-4">ATS Match</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {analyses.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-semibold text-white">{item.target_role}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-bold">
                        {item.resume_score}/100
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-bold">
                        {item.ats_score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/analysis-results"
                        state={{ analysisData: item }}
                        className="text-xs font-bold text-indigo-400 hover:underline"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
