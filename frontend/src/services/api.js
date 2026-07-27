import axios from 'axios';

// Create base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    if (error.response && error.response.status === 401) {
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
  getMe: () => api.get('/auth/me'),
};

// Resume APIs
export const resumeAPI = {
  uploadAndAnalyze: (formData) => api.post('/resume/upload-and-analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAnalyses: () => api.get('/resume/analyses'),
  getAnalysisById: (id) => api.get(`/resume/analysis/${id}`),
  downloadPDFReport: (id) => api.get(`/resume/analysis/${id}/pdf`, { responseType: 'blob' }),
};

// Career Intelligence & Company Roadmaps APIs
export const careerAPI = {
  getCompanyRoadmap: (data) => api.post('/career/company-roadmap', data),
  getUserCompanyRoadmaps: () => api.get('/career/company-roadmaps'),
};

// AI Mock Interview APIs
export const interviewAPI = {
  generateQuestions: (data) => api.post('/interview/generate-questions', data),
  submitAnswers: (data) => api.post('/interview/submit-answers', data),
  getSessions: () => api.get('/interview/sessions'),
  getSessionById: (id) => api.get(`/interview/session/${id}`),
};

// Daily Study Planner APIs
export const plannerAPI = {
  generatePlan: (data) => api.post('/planner/generate-plan', data),
  getTasks: () => api.get('/planner/tasks'),
  updateTask: (id, data) => api.patch(`/planner/task/${id}`, data),
  deleteTask: (id) => api.delete(`/planner/task/${id}`),
};

// Progress Dashboard APIs
export const progressAPI = {
  getDashboard: () => api.get('/progress/dashboard'),
};

export default api;
