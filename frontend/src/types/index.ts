export type UserRole = 'STUDENT' | 'FACULTY' | 'MANAGEMENT';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface StudentProfile {
  id: number;
  student_id: string;
  department_id?: number;
  department_name?: string;
  year: number;
  section: string;
  cgpa: number;
}

export interface FacultyProfile {
  id: number;
  employee_id: string;
  department_id?: number;
  department_name?: string;
  designation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar_url?: string;
  created_at: string;
  permissions: string[];
  student_profile?: StudentProfile;
  faculty_profile?: FacultyProfile;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface Assessment {
  id: number;
  title: string;
  description?: string;
  type: 'CODING' | 'APTITUDE' | 'MOCK';
  category: string;
  difficulty: string;
  duration: number;
  passing_score: number;
  questions_count?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  user_attempt?: {
    id: number;
    score: number;
    status: string;
    completed_at?: string;
  };
}

export interface TestCase {
  input: string;
  expected_output: string;
  is_hidden?: boolean;
}

export interface Question {
  id: number;
  order: number;
  question: string;
  type: 'MCQ' | 'CODING' | 'DESCRIPTIVE';
  category: string;
  difficulty: string;
  marks: number;
  options?: string[];
  code_template?: string;
  test_cases?: TestCase[];
  answer?: string;
  explanation?: string;
}

export interface AssessmentDetail extends Assessment {
  questions: Question[];
}

export interface CodeExecutionResult {
  language: string;
  total_test_cases: number;
  passed_test_cases: number;
  failed_test_cases: number;
  score: number;
  execution_time_ms: number;
  memory_usage_mb: number;
  all_passed: boolean;
  test_cases: Array<{
    case_number: number;
    input: string;
    expected: string;
    actual: string;
    status: 'PASSED' | 'FAILED';
    error?: string;
    is_hidden?: boolean;
  }>;
}

export interface TestAttemptResult {
  attempt_id: number;
  assessment_title?: string;
  category?: string;
  score: number;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  skipped_count: number;
  status: string;
  completed_at?: string;
  strong_areas: string[];
  needs_improvement: string[];
  recommended_action: string;
  breakdown?: Array<{
    question_id: number;
    question: string;
    type: string;
    user_answer?: string;
    correct_answer?: string;
    is_correct: boolean;
    is_skipped: boolean;
    explanation?: string;
    test_case_results?: any[];
  }>;
}

export interface PerformanceSummary {
  overall_score: number;
  coding_score: number;
  aptitude_score: number;
  technical_score: number;
  mock_score: number;
  communication_score: number;
  weights: Record<string, number>;
  total_assessments_taken: number;
  recent_activity: Array<{
    id: number;
    title: string;
    category: string;
    type: string;
    score: number;
    status: string;
    completed_at: string;
    duration_mins: number;
  }>;
  timeline: Array<{
    date: string;
    category: string;
    score: number;
  }>;
}

export interface RoadmapStep {
  id: number;
  order: number;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NEEDS_ATTENTION' | 'NOT_STARTED';
  progress: number;
  target: number;
  topics: string[];
  recommended_action: string;
}

export interface RoadmapData {
  title: string;
  description: string;
  overall_progress: number;
  steps: RoadmapStep[];
}

export interface RecommendationItem {
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  action_label: string;
  action_url: string;
}

export interface AnalysisData {
  overall_score: number;
  coding_score: number;
  aptitude_score: number;
  technical_score: number;
  mock_score: number;
  communication_score: number;
  strengths: Array<{ name: string; score: number; target: number }>;
  weak_areas: Array<{ name: string; score: number; target: number }>;
  progress_trend: {
    period: string;
    coding_delta: string;
    aptitude_delta: string;
    overall_delta: string;
    message: string;
  };
  recommendations: RecommendationItem[];
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user_email?: string;
  user_role?: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: string;
  ip_address?: string;
  timestamp: string;
}
