import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import { Video, Sparkles, Send, CheckCircle2, HelpCircle, AlertCircle, Loader2, Lock, ArrowRight } from 'lucide-react';

const DEMO_INTERVIEW_SESSION = {
  id: 'demo-session-101',
  target_role: 'Senior Full Stack Engineer',
  company_name: 'Amazon',
  status: 'COMPLETED',
  overall_score: 88,
  evaluation: {
    summary_feedback: 'Strong understanding of distributed caching, microservices architecture, and system design patterns. Concise communication using the STAR method.'
  },
  questions: [
    {
      id: 1,
      category: 'System Architecture',
      question: 'How would you design a high-throughput cache invalidation layer for Amazon Product Search APIs using Redis?',
      hint: 'Discuss cache-aside pattern, TTL policies, and event-driven invalidation.'
    },
    {
      id: 2,
      category: 'Frontend Performance',
      question: 'Explain how React 18 Concurrent Rendering and Server Components optimize initial page load metrics (FCP & LCP).',
      hint: 'Mention streaming SSR, selective hydration, and code splitting.'
    }
  ]
};

const MockInterviewPage = () => {
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [companyName, setCompanyName] = useState('Amazon');
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({
    1: 'I implement Redis with a Cache-Aside pattern, combined with pub/sub invalidation messages whenever product data updates.',
    2: 'React 18 Concurrent mode allows non-blocking UI updates and selective hydration for fast LCP metrics.'
  });
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const { isDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDemoMode) {
      setSession(DEMO_INTERVIEW_SESSION);
    }
  }, [isDemoMode]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (isDemoMode) {
      navigate('/login', { state: { from: '/mock-interview' } });
      return;
    }
    setLoading(true);
    try {
      const res = await interviewAPI.generateQuestions({
        target_role: targetRole,
        company_name: companyName
      });
      setSession(res.data);
      const initialAnswers = {};
      res.data.questions.forEach((q) => {
        initialAnswers[q.id || q.question_id] = '';
      });
      setAnswers(initialAnswers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qId, text) => {
    setAnswers({ ...answers, [qId]: text });
  };

  const handleSubmitAnswers = async () => {
    if (isDemoMode) {
      navigate('/login', { state: { from: '/mock-interview' } });
      return;
    }
    setEvaluating(true);
    try {
      const payload = {
        session_id: session.id,
        answers: Object.entries(answers).map(([qId, ansText]) => ({
          question_id: parseInt(qId),
          answer: ansText
        }))
      };
      const res = await interviewAPI.submitAnswers(payload);
      setSession(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleRequireLogin = () => {
    navigate('/login', { state: { from: '/mock-interview' } });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-3xl space-y-3 text-center border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
          <Video className="w-3.5 h-3.5" />
          <span>AI Interview Simulator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Mock Technical Interview</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Practice answering resume-tailored technical & behavioral interview questions evaluated in real time by Gemini AI.
        </p>
      </div>

      {/* Demo Mode Alert Banner */}
      {isDemoMode && (
        <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center space-x-3 text-xs text-slate-700 dark:text-slate-200 font-medium">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white block text-sm">Demo Mode Active</span>
              <span>You are viewing sample interview questions. Sign in to start custom AI mock interviews and submit answers for scoring.</span>
            </div>
          </div>
          <button
            onClick={handleRequireLogin}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Sign In to Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {!session ? (
        <form onSubmit={handleStartInterview} className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Setup Mock Interview Parameters</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Target Job Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Target Company Persona</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Amazon, Google, TCS, Microsoft"
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isDemoMode ? "Sign In to Generate Questions" : "Generate Tailored Questions & Start"}</span>
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          
          {/* Header Status */}
          <div className="glass-panel p-6 rounded-3xl flex items-center justify-between border border-slate-200 dark:border-slate-800 shadow-xl">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{session.company_name} Persona</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{session.target_role} Interview</h2>
            </div>
            {session.status === 'COMPLETED' ? (
              <ScoreGauge score={session.overall_score} title="Interview Score" size="small" />
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
                In Progress ({session.questions.length} Questions)
              </span>
            )}
          </div>

          {/* Evaluation Feedback Banner if completed */}
          {session.status === 'COMPLETED' && session.evaluation && (
            <div className="glass-panel p-6 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI Interview Evaluation Summary</span>
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {session.evaluation.summary_feedback}
              </p>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {(session.questions || []).map((q, idx) => {
              const qId = q.id || idx + 1;
              return (
                <div key={qId} className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">Question {idx + 1} of {session.questions.length}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-bold">{q.category}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{q.question}</h3>
                  {q.hint && <p className="text-xs text-slate-500 dark:text-slate-400 italic">💡 Hint: {q.hint}</p>}

                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Candidate Response</label>
                    <textarea
                      rows={3}
                      value={answers[qId] || ''}
                      onChange={(e) => handleAnswerChange(qId, e.target.value)}
                      placeholder="Type your structured answer here (explain principles, tools, STAR framework)..."
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSubmitAnswers}
            disabled={evaluating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {evaluating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Evaluating Answers with AI...</span>
              </>
            ) : isDemoMode ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Sign In to Evaluate Answers with AI</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Answers for AI Evaluation</span>
              </>
            )}
          </button>

        </div>
      )}

    </div>
  );
};

export default MockInterviewPage;
