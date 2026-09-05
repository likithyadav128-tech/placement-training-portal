import axios from 'axios';
import {
  AuthResponse,
  User,
  Assessment,
  AssessmentDetail,
  CodeExecutionResult,
  TestAttemptResult,
  PerformanceSummary,
  RoadmapData,
  AnalysisData,
  AuditLog
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT Bearer token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('placement_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Global 401 interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('placement_token');
        localStorage.removeItem('placement_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authService = {
  getMicrosoftLoginUrl: async () => {
    const res = await apiClient.get<{ auth_url: string; state: string }>('/auth/microsoft');
    return res.data;
  },
  loginWithMicrosoftCallback: async (code: string, state?: string) => {
    const res = await apiClient.post<AuthResponse>('/auth/microsoft/callback', { code, state });
    return res.data;
  },
  demoLogin: async (email: string) => {
    const res = await apiClient.post<AuthResponse>('/auth/demo-login', { email });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('placement_token');
      localStorage.removeItem('placement_user');
    }
  },
};

// Student Endpoints
export const studentService = {
  getPerformance: async (studentId: number) => {
    const res = await apiClient.get<PerformanceSummary>(`/students/${studentId}/performance`);
    return res.data;
  },
  getAnalysis: async (studentId: number) => {
    const res = await apiClient.get<AnalysisData>(`/students/${studentId}/analysis`);
    return res.data;
  },
  getRoadmap: async (studentId: number) => {
    const res = await apiClient.get<RoadmapData>(`/students/${studentId}/roadmap`);
    return res.data;
  },
  getRecommendations: async (studentId: number) => {
    const res = await apiClient.get<any[]>(`/students/${studentId}/recommendations`);
    return res.data;
  },
  getStudentDetail: async (studentId: number) => {
    const res = await apiClient.get<any>(`/students/${studentId}`);
    return res.data;
  }
};

// Assessment & Attempt Endpoints
export const assessmentService = {
  listAssessments: async (params?: { type?: string; category?: string; difficulty?: string; search?: string }) => {
    const res = await apiClient.get<Assessment[]>('/assessments', { params });
    return res.data;
  },
  getAssessmentDetail: async (id: number) => {
    const res = await apiClient.get<AssessmentDetail>(`/assessments/${id}`);
    return res.data;
  },
  runCode: async (assessmentId: number, data: { code: string; language: string; question_id: number }) => {
    const res = await apiClient.post<CodeExecutionResult>(`/assessments/${assessmentId}/run-code`, data);
    return res.data;
  },
  startAttempt: async (assessmentId: number) => {
    const res = await apiClient.post<{ attempt_id: number }>('/attempts/start', { assessment_id: assessmentId });
    return res.data;
  },
  submitAttempt: async (attemptId: number, data: { answers: Record<string, string>; code_languages?: Record<string, string> }) => {
    const res = await apiClient.post<TestAttemptResult>(`/attempts/${attemptId}/submit`, data);
    return res.data;
  },
  getAttemptResult: async (attemptId: number) => {
    const res = await apiClient.get<TestAttemptResult>(`/attempts/${attemptId}/result`);
    return res.data;
  }
};

// Faculty Endpoints
export const facultyService = {
  getDashboard: async () => {
    const res = await apiClient.get<any>('/faculty/dashboard');
    return res.data;
  },
  getAnalytics: async () => {
    const res = await apiClient.get<any>('/faculty/analytics');
    return res.data;
  },
  listStudents: async (params?: { search?: string; department?: string; year?: number; performance_filter?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get<any>('/students', { params });
    return res.data;
  }
};

// Management Endpoints
export const managementService = {
  getAnalytics: async () => {
    const res = await apiClient.get<any>('/management/analytics');
    return res.data;
  },
  createUser: async (data: any) => {
    const res = await apiClient.post<any>('/management/users', data);
    return res.data;
  },
  updateUserStatus: async (userId: number, status: string) => {
    const res = await apiClient.patch<any>(`/management/users/${userId}/status`, { status });
    return res.data;
  },
  getSettings: async () => {
    const res = await apiClient.get<any>('/management/settings');
    return res.data;
  },
  listFaculty: async () => {
    const res = await apiClient.get<any[]>('/faculty');
    return res.data;
  },
  getAuditLogs: async (params?: { action?: string; limit?: number }) => {
    const res = await apiClient.get<AuditLog[]>('/audit-logs', { params });
    return res.data;
  },
  getUserPermissions: async (userId: number) => {
    const res = await apiClient.get<any>(`/permissions/users/${userId}`);
    return res.data;
  },
  overridePermission: async (userId: number, data: { permission_code: string; is_granted: boolean }) => {
    const res = await apiClient.post<any>(`/permissions/users/${userId}/override`, data);
    return res.data;
  },
  createAssessment: async (data: any) => {
    const res = await apiClient.post<any>('/assessments', data);
    return res.data;
  },
  createRoadmap: async (data: any) => {
    const res = await apiClient.post<any>('/roadmaps', data);
    return res.data;
  },
  exportPerformanceCSV: () => {
    const token = localStorage.getItem('placement_token');
    window.open(`${API_BASE_URL}/reports/export/csv?token=${token}`, '_blank');
  }
};
