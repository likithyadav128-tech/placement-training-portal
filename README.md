# Placement Training & Student Performance Management Portal 🎓🚀

A modern, full-stack, enterprise-grade Placement Training and Student Performance Management Portal engineered with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Lucide Icons**, **Prisma ORM**, and **PostgreSQL**, built for seamless deployment on **Vercel**.

Migrated from Streamlit to support ~1,500+ concurrent students, faculty coordinators, and placement deans with real-time analytics, sandboxed multi-language code execution, database-driven RBAC, and Microsoft Entra ID / Google SSO.

---

## 🌟 Key Features

### 🎓 1. Student Portal (`/student/*`)
- **Executive Dashboard**: Readiness score (0–100), weekly progression trends, upcoming placement drives, faculty recommendations, and quick actions.
- **Performance Breakdown**: Cognitive aptitude, coding proficiency, domain depth, interview readiness, and radar skill charts.
- **Assessment Center**: Timed coding and aptitude tests with automated test case evaluation, score breakdown, and submission logs.
- **Live Coding Sandbox**: Multi-language interactive code editor supporting **Python**, **JavaScript**, **C++**, and **Java** with custom stdin/stdout and real-time execution feedback.
- **Mock Tests**: Company-specific mock test catalog (TCS, Infosys, Amazon, etc.) with real-time countdown timers and automated performance analytics.
- **Placement Roadmap**: Step-by-step milestone checklist from Foundation to Placement Day with interactive progress tracker.
- **AI Analysis & Suggestions**: Weakness diagnosis, customized practice recommendations, and benchmark comparisons against batch peers.
- **Student Profile**: Academic records (USN, CGPA, department), resume link, technical skills badges, and placement readiness badge.

### 👨‍🏫 2. Faculty Coordinator Portal (`/faculty/*`)
- **Faculty Dashboard**: Department summary metrics, batch average, high-risk student warnings, and student activity logs.
- **Students Directory**: Filterable and searchable student roster by department, placement readiness, and USN with CSV export.
- **Student Drilldown (`/faculty/students/[id]`)**: Comprehensive individual student profile, test attempt history, aptitude radar charts, and note addition.
- **Cohort Analytics**: Pass rates by department, skill readiness distributions, and historical performance trends.
- **Faculty Profile**: Coordinator credentials, department designation, and assigned student batches.

### 🏛️ 3. Management & Placement Dean Portal (`/management/*`)
- **Institution Overview**: University-wide placement statistics, department-wise comparative bar charts, and placement trajectory metrics.
- **Student & Faculty Management**: Edit student statuses (`ACTIVE`, `INACTIVE`, `BLOCKED`, `PENDING`), adjust CGPA/readiness, manage faculty assignments.
- **Assessment & Mock Test Authoring**: Create new coding and aptitude assessments, set time limits, minimum pass scores, and publish/draft statuses.
- **Curriculum & Roadmap Designer**: Manage institutional training roadmaps and learning milestones.
- **Role-Based Access Control (RBAC)**: Manage granular system permissions (`ASSESSMENT_CREATE`, `STUDENT_EDIT`, `REPORT_EXPORT`, `AUDIT_VIEW`).
- **Reports & Data Export**: Generate and download university placement reports, student performance spreadsheets, and at-risk cohort lists.
- **Comprehensive Audit Trail**: Real-time immutable activity logging with IP timestamps, user actions, and entity changes.
- **System Settings**: Configure cutoff criteria, batch year defaults, maintenance mode, and sandbox execution timeouts.

---

## 🔒 Security & Authentication Architecture

1. **Enterprise SSO + Credentials**:
   - **Microsoft Entra ID (Azure AD)** OpenID Connect single sign-on.
   - **Google OAuth 2.0** SSO.
   - **Credentials Provider** with `bcryptjs` password hashing and database lookup.
2. **Database-Driven Role Resolution**:
   - Authentication verifies user identity; the database determines user role (`STUDENT`, `FACULTY`, `MANAGEMENT`).
   - Strict server-side route guards in Next.js Middleware and `getServerSession` RBAC helper.
3. **Instant 1-Click Demo Switcher**:
   - Instant sign-in buttons for Student, Faculty Coordinator, and Placement Dean testing on the sign-in page.

---

## ⚡ Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, Server & Client Components)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS, CSS Grid/Flexbox, Custom Design System
- **Icons**: Lucide React
- **Charts**: Recharts (LineChart, BarChart, RadarChart)
- **ORM & Database**: Prisma ORM with PostgreSQL (Compatible with Neon, Supabase, Vercel Postgres, AWS RDS)
- **Authentication**: NextAuth.js (Auth.js) with JWT Sessions
- **Code Execution**: Sandboxed multi-language execution via isolated runner

---

## 🚀 Getting Started (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/likithyadav128-tech/placement-training-portal.git
cd placement-training-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` with your PostgreSQL connection string and set `NEXTAUTH_SECRET`.

### 4. Initialize Database Schema & Seed Data
```bash
npx prisma db push
npx prisma db seed
```
*(Or use `npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts`)*

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel (Production)

### Step 1: Create a PostgreSQL Database
You can use any cloud PostgreSQL provider:
- **Neon Database** ([neon.tech](https://neon.tech)) - Free serverless Postgres
- **Supabase** ([supabase.com](https://supabase.com)) - Free managed Postgres
- **Vercel Postgres** (Built directly into Vercel)

Obtain your `DATABASE_URL` connection string (e.g., `postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`).

### Step 2: Push Repository to GitHub
```bash
git add .
git commit -m "Migrate Streamlit Placement Portal to Next.js 14 full-stack application"
git push origin main
```

### Step 3: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import the `placement-training-portal` repository.
3. In **Environment Variables**, add the following:
   | Variable | Value / Description |
   |---|---|
   | `DATABASE_URL` | Your Cloud PostgreSQL connection string |
   | `NEXTAUTH_SECRET` | Generate a random 32-char secret (e.g. `openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://your-app.vercel.app`) |
   | `AZURE_AD_CLIENT_ID` | Microsoft Entra ID App Client ID |
   | `AZURE_AD_CLIENT_SECRET` | Microsoft Entra ID App Secret Value |
   | `AZURE_AD_TENANT_ID` | `common` or your institutional Tenant ID |
   | `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
   | `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

4. Click **Deploy**.

### Step 4: Run Prisma Migrations on Production DB
In your Vercel Project Settings or locally with production `DATABASE_URL`:
```bash
npx prisma db push
npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts
```

### Step 5: Configure Microsoft Entra ID Redirect URIs
In Azure Portal > App Registrations > Your App > Authentication:
- Add Redirect URI: `https://your-app.vercel.app/api/auth/callback/azure-ad`

---

## 👥 Demo User Accounts (Pre-Seeded)

| Role | Email | Password | Details |
|---|---|---|---|
| **Student** | `likith@student.college.edu` | `password123` | Dept: CSE, USN: 1MS22CS045 |
| **Faculty Coordinator** | `coordinator@college.edu` | `password123` | Dept: CSE, Employee: FAC-CSE-01 |
| **Placement Dean** | `dean@college.edu` | `password123` | University Placement Office |

---

## 📄 License
This project is licensed under the MIT License.
