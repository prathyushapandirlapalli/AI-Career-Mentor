import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === 'application/pdf') {
        setFile(selected);
        setError('');
      } else {
        setError('Only PDF documents (.pdf) are supported.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf') {
        setFile(selected);
        setError('');
      } else {
        setError('Only PDF documents (.pdf) are supported.');
      }
    }
  };

  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a PDF resume file.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target_role', targetRole);

    try {
      const res = await resumeAPI.uploadAndAnalyze(formData);
      // Navigate directly to Analysis Results View
      navigate('/analysis-results', { state: { analysisData: res.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to analyze resume. Please ensure file is non-password protected.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="glass-panel p-8 rounded-3xl space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 AI Resume Parser</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Upload Resume for AI Assessment</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Extract skills, analyze ATS keyword compatibility, calculate ATS pass rate, and generate step-by-step career roadmaps.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleUploadAndAnalyze} className="space-y-6">
        
        {/* Target Role Selector */}
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Target Job Role for Assessment
          </label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Senior Full Stack Engineer">Senior Full Stack Engineer</option>
            <option value="Backend Python Developer">Backend Python Developer</option>
            <option value="Frontend React Engineer">Frontend React Engineer</option>
            <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
            <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
            <option value="Data Engineer">Data Engineer</option>
          </select>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`glass-panel p-10 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/20'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            id="pdf-upload-input"
            className="hidden"
          />

          <label htmlFor="pdf-upload-input" className="cursor-pointer flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4">
              {file ? <FileText className="w-8 h-8 text-emerald-400" /> : <Upload className="w-8 h-8" />}
            </div>

            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
                  {file.name}
                </p>
                <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
                <span className="inline-block mt-2 text-xs font-semibold text-indigo-400 hover:underline">
                  Click to replace file
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  Drag and drop your PDF resume here, or <span className="text-indigo-400">Browse</span>
                </p>
                <p className="text-xs text-slate-500">Supports text-readable PDF documents up to 10MB</p>
              </div>
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Resume with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Run Comprehensive AI Analysis</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default ResumeUploadPage;
