import React, { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import { BarChart3, TrendingUp, Award, Zap, Loader2 } from 'lucide-react';

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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="glass-panel p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Progress Analytics Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Career Readiness Analytics</h1>
        <p className="text-xs text-slate-400">Quantitative skill breakdown, study streaks, and interview performance metrics.</p>
      </div>

      {/* Top 3 Score Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl flex flex-col items-center">
          <ScoreGauge score={data?.overall_readiness_score || 75} title="Overall Career Readiness" />
        </div>
        <div className="glass-card p-6 rounded-3xl flex flex-col items-center">
          <ScoreGauge score={data?.latest_ats_score || 80} title="Latest ATS Match Rate" />
        </div>
        <div className="glass-card p-6 rounded-3xl flex flex-col items-center">
          <ScoreGauge score={data?.average_interview_score || 82} title="Avg Interview Score" />
        </div>
      </div>

      {/* Skill Proficiency Radar Breakdown */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Core Competency Mastery Breakdown</span>
        </h2>

        <div className="space-y-4">
          {data?.skill_breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-200">{item.skill}</span>
                <span className="text-indigo-400">{item.score}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPage;
