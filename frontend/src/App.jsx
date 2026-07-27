import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUploadPage from './pages/ResumeUploadPage';
import ResumeHistoryPage from './pages/ResumeHistoryPage';
import ResumeAnalysisResultsPage from './pages/ResumeAnalysisResultsPage';
import ATSMatrixPage from './pages/ATSMatrixPage';
import SkillGapPage from './pages/SkillGapPage';
import JobMatchPage from './pages/JobMatchPage';
import RoadmapPage from './pages/RoadmapPage';
import CompanyPrepPage from './pages/CompanyPrepPage';
import MockInterviewPage from './pages/MockInterviewPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import ProfilePage from './pages/ProfilePage';
import AppLoader from './components/common/AppLoader';

// Protected / Demo Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isDemoMode, loading } = useAuth();

  if (loading) {
    return <AppLoader />;
  }

  // Accessible if logged in OR in Demo Mode
  return (isAuthenticated || isDemoMode) ? children : <Navigate to="/login" replace />;
};

// Main App Layout
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AppLoader />;
  }

  // Hide Navbar/Sidebar on auth & landing pages
  const isAuthOrLanding = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      
      {!isAuthOrLanding && (
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      )}

      <div className={`flex flex-1 relative ${!isAuthOrLanding ? 'pt-[72px]' : ''}`}>
        
        {!isAuthOrLanding && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all ${!isAuthOrLanding ? 'lg:pl-[322px]' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard & Tool Routes (Accessible in Demo or Authenticated Mode) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/resume-upload" element={<ProtectedRoute><ResumeUploadPage /></ProtectedRoute>} />
            <Route path="/resume-history" element={<ProtectedRoute><ResumeHistoryPage /></ProtectedRoute>} />
            <Route path="/analysis-results" element={<ProtectedRoute><ResumeAnalysisResultsPage /></ProtectedRoute>} />
            <Route path="/ats-matrix" element={<ProtectedRoute><ATSMatrixPage /></ProtectedRoute>} />
            <Route path="/skill-gap" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
            <Route path="/job-match" element={<ProtectedRoute><JobMatchPage /></ProtectedRoute>} />
            <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
            <Route path="/company-prep" element={<ProtectedRoute><CompanyPrepPage /></ProtectedRoute>} />
            <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewPage /></ProtectedRoute>} />
            <Route path="/study-planner" element={<ProtectedRoute><StudyPlannerPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/weekly-report" element={<ProtectedRoute><WeeklyReportPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}

export default App;
