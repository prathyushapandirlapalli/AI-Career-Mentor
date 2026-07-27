import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import { Layers, AlertCircle, Sparkles, CheckCircle, Loader2 } from 'lucide-react';

const SkillGapPage = () => {
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
  const gaps = latest?.skill_gap_analysis || [];

  return (
    <div className="space-y-8">
      
      <div className="glass-panel p-8 rounded-3xl space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>Competency Matrix</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Skill Gap Analysis</h1>
        <p className="text-xs text-slate-400">Identified missing technologies and competencies for {latest?.target_role || 'Target Role'}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {gaps.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">No skill gaps analyzed yet. Please upload a resume first.</p>
          </div>
        ) : (
          gaps.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-base font-bold text-white">{item.skill}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-400">
                    {item.category || 'General'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">💡 <b>Recommendation:</b> {item.recommendation}</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-extrabold shrink-0 ${
                item.gap_level === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                item.gap_level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                {item.gap_level} Priority Gap
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default SkillGapPage;
