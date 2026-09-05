import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layouts/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { RoleRedirect } from '../components/auth/RoleRedirect';

// Auth Pages
import { LoginPage } from '../pages/LoginPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { MyPerformancePage } from '../pages/student/MyPerformancePage';
import { AssessmentsPage } from '../pages/student/AssessmentsPage';
import { CodingAssessmentPage } from '../pages/student/CodingAssessmentPage';
import { AptitudeAssessmentPage } from '../pages/student/AptitudeAssessmentPage';
import { MockTestsPage } from '../pages/student/MockTestsPage';
import { TestResultPage } from '../pages/student/TestResultPage';
import { MyRoadmapPage } from '../pages/student/MyRoadmapPage';
import { AnalysisSuggestionsPage } from '../pages/student/AnalysisSuggestionsPage';
import { ProfilePage } from '../pages/student/ProfilePage';

// Faculty Pages
import { FacultyDashboard } from '../pages/faculty/FacultyDashboard';
import { FacultyStudentsPage } from '../pages/faculty/FacultyStudentsPage';
import { FacultyStudentDetailPage } from '../pages/faculty/FacultyStudentDetailPage';
import { FacultyAnalyticsPage } from '../pages/faculty/FacultyAnalyticsPage';

// Management Pages
import { ManagementDashboard } from '../pages/management/ManagementDashboard';
import { StudentManagementPage } from '../pages/management/StudentManagementPage';
import { FacultyManagementPage } from '../pages/management/FacultyManagementPage';
import { AssessmentManagementPage } from '../pages/management/AssessmentManagementPage';
import { MockTestManagementPage } from '../pages/management/MockTestManagementPage';
import { RoadmapManagementPage } from '../pages/management/RoadmapManagementPage';
import { PermissionManagementPage } from '../pages/management/PermissionManagementPage';
import { ReportsPage } from '../pages/management/ReportsPage';
import { AuditLogsPage } from '../pages/management/AuditLogsPage';
import { SettingsPage } from '../pages/management/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<RoleRedirect />} />

      {/* STUDENT PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route element={<AppLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/performance" element={<MyPerformancePage />} />
          <Route path="/student/assessments" element={<AssessmentsPage />} />
          <Route path="/student/mock-tests" element={<MockTestsPage />} />
          <Route path="/student/roadmap" element={<MyRoadmapPage />} />
          <Route path="/student/analysis" element={<AnalysisSuggestionsPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
        </Route>
        {/* Full screen test IDE and Scorecard */}
        <Route path="/student/assessments/:id/coding" element={<CodingAssessmentPage />} />
        <Route path="/student/assessments/:id/aptitude" element={<AptitudeAssessmentPage />} />
        <Route path="/student/attempts/:attemptId/result" element={<TestResultPage />} />
      </Route>

      {/* FACULTY PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['FACULTY', 'MANAGEMENT']} />}>
        <Route element={<AppLayout />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/students" element={<FacultyStudentsPage />} />
          <Route path="/faculty/students/:id" element={<FacultyStudentDetailPage />} />
          <Route path="/faculty/analytics" element={<FacultyAnalyticsPage />} />
          <Route path="/faculty/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* MANAGEMENT PROTECTED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['MANAGEMENT']} />}>
        <Route element={<AppLayout />}>
          <Route path="/management/dashboard" element={<ManagementDashboard />} />
          <Route path="/management/students" element={<StudentManagementPage />} />
          <Route path="/management/faculty" element={<FacultyManagementPage />} />
          <Route path="/management/assessments" element={<AssessmentManagementPage />} />
          <Route path="/management/mock-tests" element={<MockTestManagementPage />} />
          <Route path="/management/roadmaps" element={<RoadmapManagementPage />} />
          <Route path="/management/permissions" element={<PermissionManagementPage />} />
          <Route path="/management/reports" element={<ReportsPage />} />
          <Route path="/management/audit-logs" element={<AuditLogsPage />} />
          <Route path="/management/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
