import { PrismaClient, UserRole, UserStatus, AssessmentType, AssessmentStatus, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Placement Training Portal Database...');

  // 1. Permissions
  const permissionsData = [
    { code: 'VIEW_OWN_PERFORMANCE', name: 'View Own Performance', category: 'STUDENT', description: 'View personal scorecards and trends' },
    { code: 'TAKE_ASSESSMENT', name: 'Take Assessment', category: 'STUDENT', description: 'Attempt coding and aptitude tests' },
    { code: 'TAKE_MOCK_TEST', name: 'Take Mock Test', category: 'STUDENT', description: 'Participate in simulated placement mock exams' },
    { code: 'VIEW_ROADMAP', name: 'View Roadmap', category: 'STUDENT', description: 'Track personalized roadmap milestones' },
    { code: 'VIEW_RECOMMENDATIONS', name: 'View Recommendations', category: 'STUDENT', description: 'Inspect AI and rule-based suggestions' },
    { code: 'VIEW_ASSIGNED_STUDENTS', name: 'View Assigned Students', category: 'FACULTY', description: 'Access cohort student roster' },
    { code: 'VIEW_STUDENT_PERFORMANCE', name: 'View Student Performance', category: 'FACULTY', description: 'Deep-dive student analytics' },
    { code: 'VIEW_ANALYTICS', name: 'View Department Analytics', category: 'FACULTY', description: 'Department comparison charts' },
    { code: 'MANAGE_STUDENTS', name: 'Manage Students', category: 'MANAGEMENT', description: 'Provision, update, and activate student accounts' },
    { code: 'MANAGE_FACULTY', name: 'Manage Faculty', category: 'MANAGEMENT', description: 'Manage faculty cohort assignments' },
    { code: 'MANAGE_ASSESSMENTS', name: 'Manage Assessments', category: 'MANAGEMENT', description: 'Author, edit, publish assessments' },
    { code: 'MANAGE_MOCK_TESTS', name: 'Manage Mock Tests', category: 'MANAGEMENT', description: 'Create and schedule placement simulations' },
    { code: 'MANAGE_ROADMAPS', name: 'Manage Roadmaps', category: 'MANAGEMENT', description: 'Configure roadmap milestones and templates' },
    { code: 'MANAGE_PERMISSIONS', name: 'Manage Permissions', category: 'MANAGEMENT', description: 'Grant or revoke granular user permissions' },
    { code: 'VIEW_INSTITUTION_ANALYTICS', name: 'View Institution Analytics', category: 'MANAGEMENT', description: 'Access college-wide readiness KPIs' },
    { code: 'VIEW_REPORTS', name: 'View Reports', category: 'MANAGEMENT', description: 'Generate and export placement CSV reports' },
    { code: 'VIEW_AUDIT_LOGS', name: 'View Audit Logs', category: 'MANAGEMENT', description: 'Inspect security audit trail' },
    { code: 'MANAGE_SETTINGS', name: 'Manage System Settings', category: 'MANAGEMENT', description: 'Configure placement cutoffs and thresholds' },
  ];

  for (const p of permissionsData) {
    await prisma.permission.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  // 2. Departments
  const departmentsData = [
    { code: 'CSE', name: 'Computer Science & Engineering' },
    { code: 'ECE', name: 'Electronics & Communication Engineering' },
    { code: 'EEE', name: 'Electrical & Electronics Engineering' },
    { code: 'MECH', name: 'Mechanical Engineering' },
    { code: 'CIVIL', name: 'Civil Engineering' },
  ];

  const deptMap: Record<string, string> = {};
  for (const d of departmentsData) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: {},
      create: d,
    });
    deptMap[d.code] = dept.id;
  }

  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 3. Management User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: {
      name: 'Dr. Rajeshwar Rao (Dean Placements)',
      email: 'admin@college.edu',
      passwordHash: adminPasswordHash,
      role: UserRole.MANAGEMENT,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@institution.edu' },
    update: {},
    create: {
      name: 'Dr. Rajeshwar Rao (Dean Placements)',
      email: 'admin@institution.edu',
      passwordHash: adminPasswordHash,
      role: UserRole.MANAGEMENT,
      status: UserStatus.ACTIVE,
    },
  });

  // 4. Faculty Users
  const fac1User = await prisma.user.upsert({
    where: { email: 'faculty@college.edu' },
    update: {},
    create: {
      name: 'Prof. Arvind Sharma',
      email: 'faculty@college.edu',
      passwordHash: defaultPasswordHash,
      role: UserRole.FACULTY,
      status: UserStatus.ACTIVE,
    },
  });

  const fac1 = await prisma.faculty.upsert({
    where: { userId: fac1User.id },
    update: {},
    create: {
      userId: fac1User.id,
      employeeId: 'FAC-CSE-101',
      departmentId: deptMap['CSE'],
      designation: 'Professor & Placement Coordinator',
    },
  });

  const fac2User = await prisma.user.upsert({
    where: { email: 'dr.patel@institution.edu' },
    update: {},
    create: {
      name: 'Dr. Neha Patel',
      email: 'dr.patel@institution.edu',
      passwordHash: defaultPasswordHash,
      role: UserRole.FACULTY,
      status: UserStatus.ACTIVE,
    },
  });

  const fac2 = await prisma.faculty.upsert({
    where: { userId: fac2User.id },
    update: {},
    create: {
      userId: fac2User.id,
      employeeId: 'FAC-ECE-202',
      departmentId: deptMap['ECE'],
      designation: 'Associate Professor',
    },
  });

  // 5. Students
  const studentsList = [
    { name: 'Likith Yadav', email: 'likith@college.edu', dept: 'CSE', year: 4, sec: 'A', cgpa: 8.9, overall: 82, coding: 86, apt: 78, mock: 82, advisor: fac1.id },
    { name: 'Likith Yadav (Google)', email: 'likith.yadav@gmail.com', dept: 'CSE', year: 4, sec: 'A', cgpa: 8.9, overall: 82, coding: 86, apt: 78, mock: 82, advisor: fac1.id },
    { name: 'Rohan Verma', email: 'rohan.verma@institution.edu', dept: 'CSE', year: 4, sec: 'A', cgpa: 8.8, overall: 78, coding: 82, apt: 74, mock: 76, advisor: fac1.id },
    { name: 'Ananya Iyer', email: 'ananya.iyer@institution.edu', dept: 'ECE', year: 4, sec: 'B', cgpa: 8.5, overall: 74, coding: 75, apt: 72, mock: 75, advisor: fac2.id },
    { name: 'Pooja Hegde', email: 'pooja.hegde@institution.edu', dept: 'CSE', year: 4, sec: 'A', cgpa: 9.2, overall: 92, coding: 95, apt: 88, mock: 92, advisor: fac1.id },
    { name: 'Siddharth Gupta', email: 'siddharth.gupta@institution.edu', dept: 'CSE', year: 4, sec: 'C', cgpa: 7.2, overall: 58, coding: 62, apt: 52, mock: 60, advisor: fac1.id },
    { name: 'Karan Malhotra (Inactive)', email: 'inactive.student@institution.edu', dept: 'MECH', year: 4, sec: 'B', cgpa: 6.8, overall: 50, coding: 45, apt: 55, mock: 50, advisor: null, status: UserStatus.INACTIVE },
    { name: 'Abhishek Roy (Blocked)', email: 'blocked.student@institution.edu', dept: 'CIVIL', year: 4, sec: 'A', cgpa: 6.5, overall: 45, coding: 40, apt: 50, mock: 45, advisor: null, status: UserStatus.BLOCKED },
    { name: 'Sneha Sen (Pending)', email: 'pending.student@institution.edu', dept: 'EEE', year: 4, sec: 'A', cgpa: 7.9, overall: 62, coding: 60, apt: 64, mock: 62, advisor: null, status: UserStatus.PENDING },
  ];

  for (let i = 0; i < studentsList.length; i++) {
    const s = studentsList[i];
    const u = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        name: s.name,
        email: s.email,
        passwordHash: defaultPasswordHash,
        role: UserRole.STUDENT,
        status: s.status || UserStatus.ACTIVE,
      },
    });

    const stu = await prisma.student.upsert({
      where: { userId: u.id },
      update: {},
      create: {
        userId: u.id,
        studentId: `2022${s.dept}${101 + i}`,
        departmentId: deptMap[s.dept],
        year: s.year,
        section: s.sec,
        cgpa: s.cgpa,
        overallScore: s.overall,
        codingScore: s.coding,
        aptitudeScore: s.apt,
        mockScore: s.mock,
        readinessStatus: s.overall >= 75 ? 'PLACEMENT_READY' : s.overall >= 60 ? 'IN_PROGRESS' : 'NEEDS_SUPPORT',
        facultyAdvisorId: s.advisor,
      },
    });

    // Seed Roadmap for primary student
    if (s.email === 'likith@college.edu' || s.email === 'rohan.verma@institution.edu') {
      const rm = await prisma.roadmap.create({
        data: {
          studentId: stu.id,
          title: 'Campus Recruitment Preparation Master Track 2026',
          description: 'Four-tier placement curriculum covering DSA, Aptitude, System Design & Mocks',
          progress: 72.0,
          status: 'IN_PROGRESS',
          steps: {
            create: [
              { orderIndex: 1, title: 'Programming Fundamentals', category: 'Core', percentage: 100, status: 'COMPLETED' },
              { orderIndex: 2, title: 'Data Structures & Algorithms', category: 'Algorithms', percentage: 82, status: 'IN_PROGRESS' },
              { orderIndex: 3, title: 'Quantitative & Logical Aptitude', category: 'Aptitude', percentage: 74, status: 'NEEDS_PRACTICE' },
              { orderIndex: 4, title: 'Placement Mock Exams', category: 'Simulation', percentage: 76, status: 'IN_PROGRESS' },
            ],
          },
        },
      });

      // Recommendations
      await prisma.recommendation.createMany({
        data: [
          {
            studentId: stu.id,
            title: 'Coding & Problem Solving (82%)',
            type: 'STRENGTH',
            description: 'Fast algorithmic implementation and consistent test case pass rate in Array & String tasks.',
            priority: 'MEDIUM',
            category: 'Coding',
          },
          {
            studentId: stu.id,
            title: 'Quantitative Math Benchmark (74%)',
            type: 'WEAKNESS',
            description: 'Currently at 74%, which is below the 75% placement cutoff. Focus on Time & Work and Permutations.',
            priority: 'HIGH',
            category: 'Aptitude',
          },
        ],
      });

      // Performance records trend
      const trendData = [
        { date: new Date('2026-08-10'), overall: 68, coding: 70, apt: 65, mock: 68 },
        { date: new Date('2026-08-18'), overall: 71, coding: 74, apt: 68, mock: 71 },
        { date: new Date('2026-08-25'), overall: 74, coding: 78, apt: 70, mock: 73 },
        { date: new Date('2026-09-01'), overall: 76, coding: 80, apt: 72, mock: 75 },
        { date: new Date('2026-09-05'), overall: s.overall, coding: s.coding, apt: s.apt, mock: s.mock },
      ];

      for (const t of trendData) {
        await prisma.performanceRecord.create({
          data: {
            studentId: stu.id,
            date: t.date,
            overallScore: t.overall,
            codingScore: t.coding,
            aptitudeScore: t.apt,
            mockScore: t.mock,
          },
        });
      }
    }
  }

  // 6. Questions & Assessments
  const q1 = await prisma.question.create({
    data: {
      title: 'Reverse Array In-Place',
      question: 'Given an integer array arr, write a function to reverse the elements in-place without allocating additional memory.',
      type: QuestionType.CODING,
      category: 'Data Structures',
      difficulty: 'Easy',
      marks: 10,
      codeTemplate: 'def reverse_array(arr: list[int]) -> list[int]:\n    # Reverse in-place\n    return arr[::-1]\n',
      testCases: [
        { input: '[1, 2, 3, 4, 5]', expected_output: '[5, 4, 3, 2, 1]', is_hidden: false },
        { input: '[10, 20]', expected_output: '[20, 10]', is_hidden: false },
        { input: '[7]', expected_output: '[7]', is_hidden: true },
      ],
      explanation: 'Two-pointer swapping achieves O(N) time and O(1) auxiliary space.',
    },
  });

  const q2 = await prisma.question.create({
    data: {
      title: 'Two Sum Problem',
      question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      type: QuestionType.CODING,
      category: 'Algorithms',
      difficulty: 'Medium',
      marks: 15,
      codeTemplate: 'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Return indices\n    pass\n',
      testCases: [
        { input: 'nums = [2,7,11,15], target = 9', expected_output: '[0, 1]', is_hidden: false },
        { input: 'nums = [3,2,4], target = 6', expected_output: '[1, 2]', is_hidden: false },
        { input: 'nums = [3,3], target = 6', expected_output: '[0, 1]', is_hidden: true },
      ],
      explanation: 'Hash map lookups allow single-pass resolution in O(N) time.',
    },
  });

  const q3 = await prisma.question.create({
    data: {
      title: 'Train Speed & Distance',
      question: 'A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train in metres?',
      type: QuestionType.MCQ,
      category: 'Quantitative',
      difficulty: 'Easy',
      marks: 2,
      options: ['120 metres', '150 metres', '180 metres', '324 metres'],
      answer: '150 metres',
      explanation: 'Speed = 60 * (5/18) = 50/3 m/s. Length = (50/3) * 9 = 150 metres.',
    },
  });

  const q4 = await prisma.question.create({
    data: {
      title: 'Time & Work Formula',
      question: 'A and B together can complete a piece of work in 4 days. If A alone takes 12 days, in how many days can B alone complete it?',
      type: QuestionType.MCQ,
      category: 'Quantitative',
      difficulty: 'Medium',
      marks: 2,
      options: ['4 days', '5 days', '6 days', '8 days'],
      answer: '6 days',
      explanation: '1/B = 1/4 - 1/12 = (3-1)/12 = 2/12 = 1/6. Hence B alone takes 6 days.',
    },
  });

  // Create Assessments
  const ass1 = await prisma.assessment.create({
    data: {
      title: 'DSA Core Placement Assessment',
      description: 'Assess core proficiency in array manipulation, hashing, two-pointer search, and stack structures.',
      type: AssessmentType.CODING,
      category: 'Data Structures & Algorithms',
      difficulty: 'Medium',
      duration: 45,
      passingScore: 60.0,
      totalMarks: 25.0,
      status: AssessmentStatus.PUBLISHED,
      createdById: adminUser.id,
      questions: {
        create: [
          { questionId: q1.id, orderIndex: 1 },
          { questionId: q2.id, orderIndex: 2 },
        ],
      },
    },
  });

  const ass2 = await prisma.assessment.create({
    data: {
      title: 'Speed Math & Quantitative Aptitude Set',
      description: 'Practice time and work, speed-distance-time, and percentage calculations under test conditions.',
      type: AssessmentType.APTITUDE,
      category: 'Quantitative',
      difficulty: 'Medium',
      duration: 30,
      passingScore: 70.0,
      totalMarks: 4.0,
      status: AssessmentStatus.PUBLISHED,
      createdById: adminUser.id,
      questions: {
        create: [
          { questionId: q3.id, orderIndex: 1 },
          { questionId: q4.id, orderIndex: 2 },
        ],
      },
    },
  });

  const ass3 = await prisma.assessment.create({
    data: {
      title: 'Placement Mock Simulation 2026',
      description: 'Comprehensive campus recruitment simulation covering Quantitative Math, Logical Reasoning, and Live Coding.',
      type: AssessmentType.MOCK,
      category: 'Campus Recruitment Simulation',
      difficulty: 'Hard',
      duration: 90,
      passingScore: 75.0,
      totalMarks: 29.0,
      status: AssessmentStatus.PUBLISHED,
      createdById: adminUser.id,
      questions: {
        create: [
          { questionId: q1.id, orderIndex: 1 },
          { questionId: q2.id, orderIndex: 2 },
          { questionId: q3.id, orderIndex: 3 },
          { questionId: q4.id, orderIndex: 4 },
        ],
      },
    },
  });

  // 7. System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'placement_cutoff' },
    update: {},
    create: { key: 'placement_cutoff', value: '75', description: 'Placement Readiness Benchmark percentage threshold' },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'at_risk_threshold' },
    update: {},
    create: { key: 'at_risk_threshold', value: '60', description: 'Score threshold triggering at-risk faculty attention' },
  });

  // 8. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userEmail: 'admin@college.edu',
        userRole: 'MANAGEMENT',
        action: 'INITIALIZE_SYSTEM',
        target: 'SYSTEM',
        details: 'Configured Microsoft Entra ID OpenID Connect Authentication & PostgreSQL schema',
      },
      {
        userEmail: 'admin@college.edu',
        userRole: 'MANAGEMENT',
        action: 'CREATE_ASSESSMENT',
        target: 'DSA Core Placement Assessment',
        details: 'Published 2-problem coding assessment',
      },
      {
        userEmail: 'faculty@college.edu',
        userRole: 'FACULTY',
        action: 'UPDATE_STUDENT_NOTE',
        target: 'Likith Yadav (STU001)',
        details: 'Added faculty mentorship note on algorithmic capability',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
