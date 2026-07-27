import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import { BarChart3, TrendingUp, Award, Zap, Loader2, ArrowRight } from 'lucide-react';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await progressAPI.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const skills = data?.skill_breakdown || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      <div className="glass-panel p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Progress Analytics Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Career Readiness Analytics</h1>
        <p className="text-xs text-slate-400">Quantitative skill breakdown, study streaks, and interview performance metrics.</p>
      </div>

      {/* Top 3 Score Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl flex flex-col items-center">
          <ScoreGauge score={data?.overall_readiness_score || 0} title="Overall Career Readiness" />
        </div>
        <div className="glass-card p-6 rounded-3xl flex flex-col items-center">
          <ScoreGauge score={data?.latest_ats_score || 0} title="Latest ATS Match Rate" />
        </div>
        <div className="glass-card p-6 rounded-3xl flex flex-col items-center">
          <ScoreGauge score={data?.average_interview_score || 0} title="Avg Interview Score" />
        </div>
      </div>

      {/* Skill Proficiency Radar Breakdown / Empty State */}
      {skills.length === 0 ? (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Analytics Data Yet</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your PDF resume to generate quantitative skill competency breakdowns and career readiness tracking.
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
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Core Competency Mastery Breakdown</span>
          </h2>

          <div className="space-y-4">
            {skills.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-200">{item.skill}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{item.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AnalyticsPage;
