import axios from 'axios';

// Create base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper check for Demo Mode
const isDemoMode = () => localStorage.getItem('access_token') === 'demo_token';

// Sample Demo Analysis for non-personal static exploration
export const DEMO_ANALYSIS = {
  id: 999,
  target_role: "Senior Full Stack Engineer",
  resume_score: 88,
  ats_score: 92,
  formatting_score: 90,
  impact_score: 85,
  summary_feedback: "Sample candidate profile demonstrating 5+ years of full-stack engineering expertise across React, Python, PostgreSQL, and cloud deployments.",
  strengths: [
    "Expertise in modern full-stack technologies (React 18, FastAPI, PostgreSQL)",
    "Strong technical leadership with clear bullet point impact metrics",
    "Comprehensive test coverage & modern CI/CD deployment pipelines"
  ],
  improvements: [
    "Incorporate Redis caching & in-memory data store keywords for ATS optimization",
    "Add explicit Kubernetes container orchestration achievements"
  ],
  ats_keywords_found: [
    "React", "Python", "FastAPI", "TypeScript", "PostgreSQL", "TailwindCSS", "REST APIs", "Git", "Docker", "CI/CD", "Node.js", "System Design"
  ],
  ats_keywords_missing: [
    "Redis", "Kubernetes", "GraphQL", "AWS Lambda"
  ],
  skill_gap_analysis: [
    { skill: "Redis Caching & In-Memory Stores", category: "Backend Infrastructure", recommendation: "Master Redis caching patterns with FastAPI to optimize database load.", gap_level: "High" },
    { skill: "Kubernetes Container Orchestration", category: "DevOps & Cloud", recommendation: "Deploy multi-service clusters using Helm charts on Minikube.", gap_level: "Medium" },
    { skill: "GraphQL API Specifications", category: "API Architecture", recommendation: "Build a GraphQL schema layer to complement REST endpoints.", gap_level: "Low" }
  ],
  job_recommendations: [
    { title: "Senior Full Stack Engineer", match_percentage: 92, reason: "Outstanding alignment with React 18, FastAPI, and database architecture." },
    { title: "Backend Python Engineer", match_percentage: 88, reason: "Strong REST API design, ORM optimization, and cloud backend experience." },
    { title: "Frontend Technical Lead", match_percentage: 85, reason: "Demonstrated mastery of modern TypeScript, state management, and UX design systems." }
  ],
  learning_roadmap: [
    { phase: "Phase 1: Advanced Caching", goal: "Master Redis & In-Memory Caching", estimated_hours: 15, topics: ["Redis Data Types", "Pub/Sub Messaging", "Cache Invalidation"], action_items: ["Configure Redis container with FastAPI", "Implement cache-aside pattern for heavy endpoints"] },
    { phase: "Phase 2: Container Orchestration", goal: "Deploy Containers with Kubernetes", estimated_hours: 25, topics: ["K8s Pods & Services", "Helm Charts", "Ingress Controllers"], action_items: ["Write K8s deployment manifests", "Set up local Minikube cluster"] },
    { phase: "Phase 3: System Design & Scale", goal: "Design High-Availability Distributed Systems", estimated_hours: 30, topics: ["Distributed Caching", "Load Balancing", "Database Sharding"], action_items: ["Solve 5 System Design architectural cases", "Benchmarking database read/write throughput"] }
  ],
  created_at: new Date().toISOString()
};

// Request Interceptor: Attach JWT Bearer Token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !isDemoMode()) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- API Service Functions ---

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => isDemoMode()
    ? Promise.resolve({
        data: {
          full_name: 'Demo Visitor',
          email: 'demo@aicareer.io',
          target_role: 'Aspiring Software Engineer',
          education: 'B.Tech – Computer Science',
          location: 'India',
          experience_level: 'Entry Level',
          preferred_job_type: 'Full Time',
          preferred_work_mode: 'Hybrid',
          skills: ['React.js', 'JavaScript', 'HTML', 'CSS', 'Java', 'Python', 'Node.js', 'Git', 'GitHub', 'SQL', 'Firebase'],
          career_interests: ['Full Stack Development', 'Frontend Development', 'Software Engineering', 'Web Development'],
          is_demo: true
        }
      })
    : api.get('/auth/me'),
  updateProfile: (profileData) => isDemoMode()
    ? Promise.resolve({ data: profileData })
    : api.put('/auth/me', profileData),
};

// Resume APIs
export const resumeAPI = {
  uploadAndAnalyze: (formData) => isDemoMode() 
    ? Promise.reject({ response: { status: 403, data: { detail: "Authentication required to analyze custom resumes." } } }) 
    : api.post('/resume/upload-and-analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAnalyses: () => isDemoMode() ? Promise.resolve({ data: [DEMO_ANALYSIS] }) : api.get('/resume/analyses'),
  getAnalysisById: (id) => isDemoMode() ? Promise.resolve({ data: DEMO_ANALYSIS }) : api.get(`/resume/analysis/${id}`),
  downloadPDFReport: (id) => api.get(`/resume/analysis/${id}/pdf`, { responseType: 'blob' }),
  getOriginalResumePDF: (id) => api.get(`/resume/analysis/${id}/original-pdf`, { responseType: 'blob' }),
  deleteAnalysis: (id) => isDemoMode() ? Promise.resolve({ data: { id } }) : api.delete(`/resume/analysis/${id}`),
};

// Career Intelligence & Company Roadmaps APIs
export const careerAPI = {
  getCompanyRoadmap: (data) => api.post('/career/company-roadmap', data),
  getUserCompanyRoadmaps: () => isDemoMode() ? Promise.resolve({ data: [] }) : api.get('/career/company-roadmaps'),
};

// AI Mock Interview APIs
export const interviewAPI = {
  generateQuestions: (data) => api.post('/interview/generate-questions', data),
  submitAnswers: (data) => api.post('/interview/submit-answers', data),
  getSessions: () => isDemoMode() ? Promise.resolve({ data: [] }) : api.get('/interview/sessions'),
  getSessionById: (id) => api.get(`/interview/session/${id}`),
};

// Daily Study Planner APIs
export const plannerAPI = {
  generatePlan: (data) => api.post('/planner/generate-plan', data),
  getTasks: () => isDemoMode() ? Promise.resolve({ data: [] }) : api.get('/planner/tasks'),
  updateTask: (id, data) => api.patch(`/planner/task/${id}`, data),
  deleteTask: (id) => api.delete(`/planner/task/${id}`),
};

// Progress Dashboard APIs
export const progressAPI = {
  getDashboard: () => isDemoMode() 
    ? Promise.resolve({ 
        data: { 
          overall_readiness_score: 78,
          latest_resume_score: 88, 
          latest_ats_score: 92, 
          target_role: 'Senior Full Stack Engineer', 
          total_analyses: 1, 
          overall_progress: 75,
          mock_interviews_completed: 2,
          average_interview_score: 84,
          completed_study_tasks: 12,
          total_study_tasks: 15,
          completion_percentage: 80,
          skill_breakdown: [
            { skill: "React 18 & TypeScript", score: 92 },
            { skill: "Python & FastAPI", score: 88 },
            { skill: "PostgreSQL & Database Design", score: 85 },
            { skill: "Docker & CI/CD Pipelines", score: 80 },
            { skill: "Redis & System Caching", score: 65 }
          ]
        } 
      }) 
    : api.get('/progress/dashboard'),
};

export default api;
