import React, { useState } from 'react';
import { companyPrepData } from '../data/companyPrepData';
import { Building2, Sparkles, CheckCircle2, ExternalLink, BookOpen, Star, Info, Target, Layers } from 'lucide-react';

const CompanyPrepPage = () => {
  const [selectedCompany, setSelectedCompany] = useState('Amazon');

  const topCompanies = ['Amazon', 'Google', 'Microsoft', 'Meta', 'TCS', 'Infosys', 'Accenture', 'Wipro'];

  const companyKey = selectedCompany.toLowerCase();
  const currentData = companyPrepData[companyKey] || companyPrepData.amazon;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* 1. Header Banner & Company Selector Tabs */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Target Company Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Company-Specific Preparation Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Tailored interview round structures, priority DSA/aptitude focus areas, preparation rating benchmarks, and target courses.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0 text-center sm:text-right">
            <span>Selected: </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white ml-1">{currentData.company_name}</span>
          </div>
        </div>

        {/* Company Selector Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
          {topCompanies.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompany(comp)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCompany === comp
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Company Banner Details */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
            <span>{currentData.company_name} Preparation Strategy</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{currentData.tagline}</h2>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0 shadow-sm">
          <span className="text-slate-500 dark:text-slate-400">Difficulty: </span>
          <span className="text-indigo-600 dark:text-cyan-400 font-extrabold">{currentData.difficulty}</span>
        </div>
      </div>

      {/* Disclaimer Note */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/30 border border-indigo-500/20 text-slate-700 dark:text-slate-300 text-xs flex items-start space-x-3 shadow-xs">
        <Info className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <b className="text-indigo-600 dark:text-indigo-400">Note on Interview Patterns:</b> Interview stages and question patterns may vary by role, location, experience level, and specific hiring program (e.g., Campus vs. Lateral). Use this as an optimized preparation guide.
        </p>
      </div>

      {/* 3. Company Priority Rating Matrix ("What to Prioritize") */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800/80 shadow-md">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Target className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <span>Preparation Focus Ratings (What to Prioritize for {currentData.company_name})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentData.priorities.map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{item.category}</span>
                <span className="text-xs font-extrabold text-indigo-600 dark:text-cyan-400 tracking-wider">{item.stars}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Common Interview Process & Rounds Breakdown */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800/80 shadow-md">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Layers className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          <span>Typical {currentData.company_name} Interview Stages & Rounds</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentData.rounds.map((r, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                  Round {r.round_number || idx + 1}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{r.duration}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{r.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <b>Format:</b> {r.format}
              </p>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs leading-relaxed">
                💡 <b>Preparation Tip:</b> {r.tips}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Priority Topics & Recommended Targeted Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Priority Focus Topics */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800/80 shadow-md">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <span>Priority Focus Topics for {currentData.company_name}</span>
          </h3>
          <ul className="space-y-2.5">
            {currentData.key_topics.map((t, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-start space-x-2">
                <span className="text-indigo-500 dark:text-indigo-400 font-bold">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Targeted Courses */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800/80 shadow-md">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            <span>Recommended Targeted Prep Resources</span>
          </h3>
          <div className="space-y-3">
            {currentData.courses.map((c, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{c.platform}</p>
                </div>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:text-indigo-400 dark:hover:text-white text-xs font-bold transition-all shrink-0 flex items-center space-x-1 border border-indigo-500/20"
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
  );
};

export default CompanyPrepPage;
