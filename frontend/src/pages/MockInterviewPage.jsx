import React, { useState } from 'react';
import { interviewAPI } from '../services/api';
import ScoreGauge from '../components/common/ScoreGauge';
import { Video, Sparkles, Send, CheckCircle2, HelpCircle, AlertCircle, Loader2 } from 'lucide-react';

const MockInterviewPage = () => {
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [companyName, setCompanyName] = useState('Amazon');
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await interviewAPI.generateQuestions({
        target_role: targetRole,
        company_name: companyName
      });
      setSession(res.data);
      // Initialize answer state map
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div className="glass-panel p-8 rounded-3xl space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
          <Video className="w-3.5 h-3.5" />
          <span>AI Interview Simulator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">AI Mock Technical Interview</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Practice answering resume-tailored technical & behavioral interview questions evaluated in real time by Gemini AI.
        </p>
      </div>

      {!session ? (
        <form onSubmit={handleStartInterview} className="glass-panel p-6 rounded-3xl space-y-4">
          <h2 className="text-base font-bold text-white">Setup Mock Interview Parameters</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Target Job Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Target Company Persona</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Amazon, Google, TCS, Microsoft"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Generate Tailored Questions & Start</span>
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          
          {/* Header Status */}
          <div className="glass-panel p-6 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{session.company_name} Persona</span>
              <h2 className="text-lg font-bold text-white">{session.target_role} Interview</h2>
            </div>
            {session.status === 'COMPLETED' ? (
              <ScoreGauge score={session.overall_score} title="Interview Score" size="small" />
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                In Progress ({session.questions.length} Questions)
              </span>
            )}
          </div>

          {/* Evaluation Feedback Banner if completed */}
          {session.status === 'COMPLETED' && session.evaluation && (
            <div className="glass-panel p-6 rounded-3xl space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI Interview Evaluation Summary</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {session.evaluation.summary_feedback}
              </p>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {session.questions.map((q, idx) => {
              const qId = q.id || idx + 1;
              return (
                <div key={qId} className="glass-card p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-400">Question {idx + 1} of {session.questions.length}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-semibold">{q.category}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-relaxed">{q.question}</h3>
                  {q.hint && <p className="text-xs text-slate-400 italic">💡 Hint: {q.hint}</p>}

                  {session.status === 'COMPLETED' ? (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <p className="text-xs text-slate-300"><b>Your Submitted Answer:</b> {answers[qId] || "No answer provided"}</p>
                    </div>
                  ) : (
                    <textarea
                      rows={3}
                      value={answers[qId] || ''}
                      onChange={(e) => handleAnswerChange(qId, e.target.value)}
                      placeholder="Type your structured answer here (explain principles, tools, STAR framework)..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {session.status !== 'COMPLETED' && (
            <button
              onClick={handleSubmitAnswers}
              disabled={evaluating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating Answers with AI...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answers for AI Evaluation</span>
                </>
              )}
            </button>
          )}

        </div>
      )}

    </div>
  );
};

export default MockInterviewPage;
