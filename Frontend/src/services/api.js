import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.detail) {
      error.response.data.detail = error.response.data.detail;
    } else if (error.message) {
      error.response = { 
        data: { 
          detail: error.message.includes('Network Error') 
            ? 'Cannot connect to server. Is the backend running?' 
            : error.message 
        } 
      };
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getMe: () => api.get('/auth/me'),
};

export const resumeAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAll: () => api.get('/resume/list'),
};

export const analysisAPI = {
  analyzeResume: (resumeText) => api.post('/analysis/resume', { resume_text: resumeText }),
  skillsGap: (resumeText, jobDescription) => api.post('/analysis/skills-gap', {
    resume_text: resumeText,
    job_description: jobDescription,
  }),
  coverLetter: (data) => api.post('/analysis/cover-letter', data),
};

export const jobsAPI = {
  discover: (keywords, location) => api.post('/jobs/discover', { keywords, location }),
  mockJobs: (keywords) => api.get(`/jobs/mock-jobs/${keywords}`),
};

export default api;