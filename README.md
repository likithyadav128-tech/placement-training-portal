# Placement Training Portal

A complete, production-quality university placement training platform built with **FastAPI**, **React**, **TypeScript**, **Tailwind CSS**, and **SQLAlchemy**.

---

## Key Highlights

- **Strict Three-Role Architecture**:
  - **STUDENT**: Personal placement dashboard, performance analytics, coding test environment, aptitude quizzes, mock exams, personalized roadmaps, and grounded suggestions.
  - **FACULTY**: Cohort monitoring, student search, detailed student performance records, at-risk intervention tracking, and departmental analytics.
  - **MANAGEMENT**: College-wide KPIs, user provisioning & deactivation, assessment authoring, granular RBAC permission matrix (with instant grant/revoke overrides), exportable reports (CSV), and immutable audit logs.
- **Enterprise Security & RBAC**:
  - Microsoft Entra ID (Azure AD) OAuth 2.0 / OpenID Connect integration.
  - Fast institutional login switcher for immediate testing of each role.
  - Centralized authorization middleware (`require_role`, `require_permission`).
  - Strict tenant isolation (students cannot query other students' scorecards).
  - Centralized scoring engine weights (Coding 30%, Aptitude 25%, Technical 20%, Mock Tests 15%, Communication 10%).

---

## Project Structure

```
placement-training-portal/
├── backend/
│   ├── app/
│   │   ├── api/             # REST endpoints (auth, students, faculty, assessments, attempts, permissions, management, reports, audit)
│   │   ├── auth/            # JWT creation, MSAL / Entra ID, authorization dependencies
│   │   ├── middleware/      # Security headers, audit logging
│   │   ├── models/          # Normalized SQLAlchemy models (User, Student, Faculty, Assessment, Attempt, Roadmap, AuditLog)
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── seed/            # Rich demo seed script (Dean, 2 Faculty, 25 Students across 5 depts)
│   │   ├── services/        # PerformanceService, RecommendationEngine, CodeRunnerService
│   │   ├── config.py        # Settings configuration
│   │   ├── database.py      # Async SQLAlchemy engine & sessions
│   │   └── main.py          # FastAPI application entrypoint
│   ├── tests/               # Pytest async test suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # UI library (Button, Card, Badge, Modal, Input, Alert, Skeleton) and Layouts (Sidebar, Header, MobileNav)
│   │   ├── context/         # AuthContext with RBAC helpers
│   │   ├── pages/
│   │   │   ├── student/     # Dashboard, Performance, Assessments, Coding IDE, Aptitude, Mock, Result, Roadmap, Analysis, Profile
│   │   │   ├── faculty/     # Dashboard, Student Directory, Detail, Cohort Analytics
│   │   │   └── management/  # Dashboard, Student Mgmt, Faculty Mgmt, Assessment Authoring, Permissions Matrix, Reports, Audit Logs, Settings
│   │   ├── routes/          # ProtectedRoute and role-based routing
│   │   ├── services/        # Axios API client
│   │   └── types/           # TypeScript domain definitions
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

---

## Demo Accounts

| Role | Email | Password / Auth | Notes |
|---|---|---|---|
| **Student (High Performer)** | `student1@institution.edu` | Instant Fast-Login | Rohan Verma (CSE, 4th Year, 8.8 CGPA) |
| **Student (Needs Support)** | `student9@institution.edu` | Instant Fast-Login | Siddharth Gupta (CSE, 4th Year, 5.8 CGPA) |
| **Faculty Coordinator** | `prof.sharma@institution.edu` | Instant Fast-Login | Prof. Arvind Sharma (CSE Placement Lead) |
| **Faculty In-Charge** | `dr.patel@institution.edu` | Instant Fast-Login | Dr. Neha Patel (ECE Associate Professor) |
| **Management / Dean** | `admin@institution.edu` | Instant Fast-Login | Dr. Rajeshwar Rao (Dean Placements) |

---

## Quickstart

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m app.seed.seed_data
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

### 3. Run Backend Test Suite

```bash
cd backend
pytest -v
```
