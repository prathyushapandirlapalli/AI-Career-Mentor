import React, { useState, useEffect } from 'react';
import { careerAPI } from '../services/api';
import { Building2, Sparkles, CheckCircle2, ExternalLink, BookOpen, Loader2 } from 'lucide-react';

const CompanyPrepPage = () => {
  const [selectedCompany, setSelectedCompany] = useState('Amazon');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const topCompanies = ['Amazon', 'Google', 'Microsoft', 'Meta', 'TCS', 'Infosys', 'Accenture', 'Wipro'];

  const fetchRoadmap = async (companyName) => {
    setLoading(true);
    try {
      const res = await careerAPI.getCompanyRoadmap({
        company_name: companyName,
        target_role: targetRole
      });
      setRoadmap(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(selectedCompany);
  }, [selectedCompany]);

  return (
    <div className="space-y-8">
      
      <div className="glass-panel p-8 rounded-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Target Company Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Company-Specific Preparation Dashboard</h1>
        <p className="text-xs text-slate-400">Interview pattern breakdowns, OA structures, priority DSA topics, and free/paid courses for top companies.</p>

        {/* Company Selector Chips */}
        <div className="flex flex-wrap gap-2 pt-4">
          {topCompanies.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompany(comp)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCompany === comp
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : roadmap ? (
        <div className="space-y-8">
          
          {/* Interview Rounds Breakdown */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>{roadmap.company_name} Interview Process & Rounds</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmap.rounds.map((r, idx) => (
                <div key={idx} className="glass-card p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">Round {r.round_number || idx + 1}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{r.duration}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{r.title}</h3>
                  <p className="text-xs text-slate-300"><b>Format:</b> {r.format}</p>
                  <p className="text-xs text-emerald-400 font-medium">💡 <b>Pro Tip:</b> {r.tips}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Topics & Recommended Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Priority Topics */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Priority Focus Topics for {roadmap.company_name}</span>
              </h3>
              <ul className="space-y-2">
                {roadmap.key_topics.map((t, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200">
                    • {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Recommended Courses (Free & Paid)</span>
              </h3>
              <div className="space-y-3">
                {roadmap.courses.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">{c.platform}</p>
                    </div>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-bold flex items-center space-x-1 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <span>{c.type}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};

export default CompanyPrepPage;
