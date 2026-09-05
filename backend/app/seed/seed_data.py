import asyncio
import json
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import engine, Base, AsyncSessionLocal
from app.models.user import User, UserRole, UserStatus
from app.models.role_permission import Permission, UserPermission, DEFAULT_ROLE_PERMISSIONS
from app.models.academic import Department, Student, Faculty
from app.models.audit import AuditLog
from app.models.assessments import (
    Assessment,
    AssessmentType,
    AssessmentStatus,
    Question,
    AssessmentQuestion,
    TestAttempt,
    PerformanceRecord,
    Roadmap,
    RoadmapStep,
    Recommendation,
    Notification
)


async def seed_database():
    print("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        print("Seeding permissions...")
        permissions_data = [
            # Student permissions
            ("VIEW_OWN_PERFORMANCE", "View Own Performance", "Allows viewing personal scorecards and trends", "STUDENT"),
            ("TAKE_ASSESSMENT", "Take Assessment", "Allows taking coding and aptitude assessments", "STUDENT"),
            ("TAKE_MOCK_TEST", "Take Mock Test", "Allows participating in simulated placement mock tests", "STUDENT"),
            ("VIEW_ROADMAP", "View Roadmap", "Allows tracking personalized preparation roadmap", "STUDENT"),
            ("VIEW_RECOMMENDATIONS", "View Recommendations", "Allows viewing AI/rule-based suggestions", "STUDENT"),
            # Faculty permissions
            ("VIEW_ASSIGNED_STUDENTS", "View Assigned Students", "View list of students assigned to faculty", "FACULTY"),
            ("VIEW_STUDENT_PERFORMANCE", "View Student Performance", "Inspect student scorecards and analytics", "FACULTY"),
            ("VIEW_STUDENT_RESULTS", "View Student Results", "Review individual test submissions and answers", "FACULTY"),
            ("VIEW_ANALYTICS", "View Department Analytics", "Access departmental comparison charts", "FACULTY"),
            # Management permissions
            ("MANAGE_STUDENTS", "Manage Students", "Provision, update, and deactivate student accounts", "MANAGEMENT"),
            ("MANAGE_FACULTY", "Manage Faculty", "Provision and manage faculty department assignments", "MANAGEMENT"),
            ("MANAGE_ASSESSMENTS", "Manage Assessments", "Create, edit, publish and archive assessments", "MANAGEMENT"),
            ("MANAGE_MOCK_TESTS", "Manage Mock Tests", "Design full-length placement mock exams", "MANAGEMENT"),
            ("MANAGE_ROADMAPS", "Manage Roadmaps", "Configure institutional roadmaps and milestones", "MANAGEMENT"),
            ("MANAGE_PERMISSIONS", "Manage Permissions", "Grant or revoke granular user permissions", "MANAGEMENT"),
            ("VIEW_INSTITUTION_ANALYTICS", "View Institution Analytics", "Access college-wide placement readiness KPIs", "MANAGEMENT"),
            ("MANAGE_SETTINGS", "Manage System Settings", "Configure scoring weights and cutoff thresholds", "MANAGEMENT"),
        ]

        for code, name, desc, cat in permissions_data:
            p = Permission(code=code, name=name, description=desc, category=cat)
            db.add(p)
        await db.commit()

        print("Seeding departments...")
        departments_data = [
            ("CSE", "Computer Science & Engineering"),
            ("ECE", "Electronics & Communication Engineering"),
            ("EEE", "Electrical & Electronics Engineering"),
            ("MECH", "Mechanical Engineering"),
            ("CIVIL", "Civil Engineering"),
        ]
        dept_objs = {}
        for code, name in departments_data:
            d = Department(code=code, name=name)
            db.add(d)
            await db.flush()
            dept_objs[code] = d
        await db.commit()

        print("Seeding Management & Faculty accounts...")
        # 1. Management
        admin_user = User(
            name="Dr. Rajeshwar Rao (Dean Placements)",
            email="admin@institution.edu",
            role=UserRole.MANAGEMENT,
            status=UserStatus.ACTIVE
        )
        db.add(admin_user)
        await db.flush()

        # 2. Faculty 1 (CSE)
        fac1_user = User(
            name="Prof. Arvind Sharma",
            email="prof.sharma@institution.edu",
            role=UserRole.FACULTY,
            status=UserStatus.ACTIVE
        )
        db.add(fac1_user)
        await db.flush()
        fac1 = Faculty(
            user_id=fac1_user.id,
            employee_id="FAC-CSE-101",
            department_id=dept_objs["CSE"].id,
            designation="Professor & Placement Coordinator"
        )
        db.add(fac1)

        # 3. Faculty 2 (ECE)
        fac2_user = User(
            name="Dr. Neha Patel",
            email="dr.patel@institution.edu",
            role=UserRole.FACULTY,
            status=UserStatus.ACTIVE
        )
        db.add(fac2_user)
        await db.flush()
        fac2 = Faculty(
            user_id=fac2_user.id,
            employee_id="FAC-ECE-202",
            department_id=dept_objs["ECE"].id,
            designation="Associate Professor"
        )
        db.add(fac2)
        await db.commit()

        print("Seeding 25 Student accounts across departments...")
        student_data_list = [
            ("Rohan Verma", "student1@institution.edu", "CSE", 4, "A", 8.8, fac1.id),
            ("Ananya Iyer", "student2@institution.edu", "ECE", 4, "B", 7.4, fac2.id),
            ("Vikram Singh", "student3@institution.edu", "MECH", 4, "A", 6.5, None),
            ("Pooja Hegde", "student4@institution.edu", "CSE", 4, "A", 9.2, fac1.id),
            ("Karthik Nair", "student5@institution.edu", "EEE", 4, "B", 7.8, None),
            ("Divya Menon", "student6@institution.edu", "CIVIL", 4, "A", 6.8, None),
            ("Aditya Roy", "student7@institution.edu", "CSE", 3, "B", 8.4, fac1.id),
            ("Meera Joshi", "student8@institution.edu", "ECE", 4, "A", 8.1, fac2.id),
            ("Siddharth Gupta", "student9@institution.edu", "CSE", 4, "C", 5.8, fac1.id),
            ("Sneha Kulkarni", "student10@institution.edu", "MECH", 4, "B", 7.2, None),
            ("Abhishek Bannerjee", "student11@institution.edu", "EEE", 4, "A", 8.6, None),
            ("Kavita Reddy", "student12@institution.edu", "CIVIL", 4, "B", 5.4, None),
            ("Rahul Deshmukh", "student13@institution.edu", "CSE", 4, "A", 8.9, fac1.id),
            ("Priya Sundaram", "student14@institution.edu", "ECE", 3, "A", 7.9, fac2.id),
            ("Amitabh Das", "student15@institution.edu", "MECH", 4, "A", 6.1, None),
            ("Shreya Mukherjee", "student16@institution.edu", "CSE", 4, "B", 9.4, fac1.id),
            ("Manoj Bajpayee", "student17@institution.edu", "EEE", 4, "A", 7.0, None),
            ("Tanvi Shah", "student18@institution.edu", "CIVIL", 4, "A", 7.3, None),
            ("Gaurav Kapoor", "student19@institution.edu", "CSE", 4, "A", 8.3, fac1.id),
            ("Nalini Swaminathan", "student20@institution.edu", "ECE", 4, "B", 8.7, fac2.id),
            ("Harsh Vardhan", "student21@institution.edu", "MECH", 4, "B", 5.2, None),
            ("Ishita Sen", "student22@institution.edu", "CSE", 3, "A", 8.5, fac1.id),
            ("Rakesh Tiwari", "student23@institution.edu", "EEE", 4, "B", 6.9, None),
            ("Deepika Pillai", "student24@institution.edu", "CIVIL", 4, "B", 7.7, None),
            ("Sameer Alvi", "student25@institution.edu", "CSE", 4, "B", 7.6, fac1.id),
        ]

        created_students = []
        for idx, (sname, semail, sdept, syear, ssec, scgpa, adv_id) in enumerate(student_data_list):
            u = User(
                name=sname,
                email=semail,
                role=UserRole.STUDENT,
                status=UserStatus.ACTIVE
            )
            db.add(u)
            await db.flush()

            st = Student(
                user_id=u.id,
                student_id=f"2022{sdept}{idx+101:03d}",
                department_id=dept_objs[sdept].id,
                year=syear,
                section=ssec,
                cgpa=scgpa,
                faculty_advisor_id=adv_id
            )
            db.add(st)
            await db.flush()
            created_students.append(st)
        await db.commit()

        print("Seeding Questions and Assessments...")
        # 1. Coding Questions
        q1 = Question(
            question="Write a function that reverses an array of integers in-place without using extra space.",
            type="CODING",
            category="Data Structures",
            difficulty="Easy",
            marks=10.0,
            answer="def reverse_array(arr):\n    arr.reverse()\n    return arr",
            explanation="Two-pointer technique swapping elements from both ends achieves O(N) time and O(1) space.",
            code_template="def reverse_array(arr: list[int]) -> list[int]:\n    # Implement in-place reversal\n    pass\n",
            test_cases=json.dumps([
                {"input": "[1, 2, 3, 4, 5]", "expected_output": "[5, 4, 3, 2, 1]", "is_hidden": False},
                {"input": "[10, 20]", "expected_output": "[20, 10]", "is_hidden": False},
                {"input": "[7]", "expected_output": "[7]", "is_hidden": True}
            ])
        )
        q2 = Question(
            question="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            type="CODING",
            category="Algorithms",
            difficulty="Medium",
            marks=15.0,
            answer="def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []",
            explanation="Using a hash map allows one-pass lookup in O(N) time and O(N) auxiliary space.",
            code_template="def two_sum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    pass\n",
            test_cases=json.dumps([
                {"input": "nums = [2,7,11,15], target = 9", "expected_output": "[0, 1]", "is_hidden": False},
                {"input": "nums = [3,2,4], target = 6", "expected_output": "[1, 2]", "is_hidden": False},
                {"input": "nums = [3,3], target = 6", "expected_output": "[0, 1]", "is_hidden": True}
            ])
        )
        q3 = Question(
            question="Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            type="CODING",
            category="Data Structures",
            difficulty="Medium",
            marks=15.0,
            answer="def is_valid_parentheses(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack",
            explanation="Stack-based matching ensures proper nesting and closing order in O(N) time.",
            code_template="def is_valid(s: str) -> bool:\n    # Return True if valid, False otherwise\n    pass\n",
            test_cases=json.dumps([
                {"input": "'()[]{}'", "expected_output": "True", "is_hidden": False},
                {"input": "'(]'", "expected_output": "False", "is_hidden": False},
                {"input": "'{[]}'", "expected_output": "True", "is_hidden": True}
            ])
        )
        db.add_all([q1, q2, q3])
        await db.flush()

        # 2. Aptitude MCQ Questions
        apt_questions = [
            Question(
                question="A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
                type="MCQ",
                category="Quantitative",
                difficulty="Easy",
                marks=2.0,
                options=json.dumps(["120 metres", "150 metres", "180 metres", "324 metres"]),
                answer="150 metres",
                explanation="Speed = 60 * (5/18) = 50/3 m/sec. Distance = Speed * Time = (50/3) * 9 = 150 metres."
            ),
            Question(
                question="A and B together can complete a piece of work in 4 days. If A alone can complete the same work in 12 days, in how many days can B alone complete that work?",
                type="MCQ",
                category="Quantitative",
                difficulty="Medium",
                marks=2.0,
                options=json.dumps(["4 days", "5 days", "6 days", "8 days"]),
                answer="6 days",
                explanation="1/B = 1/4 - 1/12 = (3-1)/12 = 2/12 = 1/6. Hence B takes 6 days."
            ),
            Question(
                question="Statements: All mangoes are golden in colour. No golden-coloured things are cheap. Conclusions: 1) All mangoes are cheap. 2) Golden-coloured mangoes are not cheap.",
                type="MCQ",
                category="Logical",
                difficulty="Medium",
                marks=2.0,
                options=json.dumps(["Only conclusion (1) follows", "Only conclusion (2) follows", "Either (1) or (2) follows", "Neither follows"]),
                answer="Only conclusion (2) follows",
                explanation="Since no golden thing is cheap and all mangoes are golden, golden-coloured mangoes cannot be cheap."
            ),
            Question(
                question="Find the missing number in the series: 4, 9, 25, 49, 121, ?",
                type="MCQ",
                category="Logical",
                difficulty="Easy",
                marks=2.0,
                options=json.dumps(["144", "169", "196", "225"]),
                answer="169",
                explanation="The sequence consists of squares of prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169."
            ),
            Question(
                question="Select the synonym for the word 'CANDID':",
                type="MCQ",
                category="Verbal",
                difficulty="Easy",
                marks=1.0,
                options=json.dumps(["Frank", "Deceptive", "Arrogant", "Vague"]),
                answer="Frank",
                explanation="'Candid' means truthful, frank, and straightforward."
            )
        ]
        db.add_all(apt_questions)
        await db.flush()

        # Create Assessments
        # Assessment 1: Coding
        ass1 = Assessment(
            title="Data Structures & Algorithms Core Assessment",
            description="Assess core proficiency in array manipulation, hashing, two-pointer search, and stack structures.",
            type=AssessmentType.CODING,
            category="Data Structures & Algorithms",
            difficulty="Medium",
            duration=45,
            passing_score=60.0,
            status=AssessmentStatus.PUBLISHED,
            created_by_id=admin_user.id
        )
        db.add(ass1)
        await db.flush()
        db.add(AssessmentQuestion(assessment_id=ass1.id, question_id=q1.id, order_index=1))
        db.add(AssessmentQuestion(assessment_id=ass1.id, question_id=q2.id, order_index=2))
        db.add(AssessmentQuestion(assessment_id=ass1.id, question_id=q3.id, order_index=3))

        # Assessment 2: Aptitude
        ass2 = Assessment(
            title="Quantitative & Logical Speed Test 01",
            description="Fast-paced evaluation focusing on time-and-work, speed calculations, syllogisms, and sequence deduction.",
            type=AssessmentType.APTITUDE,
            category="Quantitative & Logical",
            difficulty="Easy",
            duration=30,
            passing_score=70.0,
            status=AssessmentStatus.PUBLISHED,
            created_by_id=admin_user.id
        )
        db.add(ass2)
        await db.flush()
        for idx, aq in enumerate(apt_questions):
            db.add(AssessmentQuestion(assessment_id=ass2.id, question_id=aq.id, order_index=idx+1))

        # Assessment 3: Placement Full Mock Test
        ass3 = Assessment(
            title="Placement Mock Examination 2026 (Tier-1 Simulation)",
            description="Comprehensive institutional mock test simulating MNC recruitment patterns with Quantitative, Logical, Verbal, and Live Coding sections.",
            type=AssessmentType.MOCK,
            category="Placement Mock Test",
            difficulty="Hard",
            duration=60,
            passing_score=75.0,
            status=AssessmentStatus.PUBLISHED,
            created_by_id=admin_user.id
        )
        db.add(ass3)
        await db.flush()
        all_q = [q1, q2] + apt_questions
        for idx, q_item in enumerate(all_q):
            db.add(AssessmentQuestion(assessment_id=ass3.id, question_id=q_item.id, order_index=idx+1))

        await db.commit()

        print("Seeding Institutional Roadmaps...")
        roadmap = Roadmap(
            title="Campus Placement Preparation Master Roadmap",
            description="Standardized 5-stage placement readiness pipeline designed for university students."
        )
        db.add(roadmap)
        await db.flush()

        steps_data = [
            ("Programming Fundamentals", "Master syntax, OOP, loops, and core problem solving in Python/Java/C++.", 100.0, 1),
            ("Data Structures & Algorithms (DSA)", "Linear & non-linear structures, graphs, trees, sorting, and dynamic programming.", 85.0, 2),
            ("Quantitative & Logical Aptitude", "Speed math, probability, permutations, data interpretation, and deductive logic.", 75.0, 3),
            ("Placement Mock Test Simulation", "Full-length timed mock exams replicating corporate assessment platforms.", 75.0, 4),
            ("Technical Core & HR Interview Prep", "Operating Systems, DBMS, Computer Networks, and behavioral STAR interviews.", 80.0, 5),
        ]
        for stitle, sdesc, starget, sorder in steps_data:
            step = RoadmapStep(
                roadmap_id=roadmap.id,
                title=stitle,
                description=sdesc,
                target_score=starget,
                order_index=sorder
            )
            db.add(step)
        await db.commit()

        print("Seeding realistic test attempts and performance history for students...")
        # Populate attempts and performance records for students
        for s in created_students:
            # Baseline variation
            base_score = 65 + (s.cgpa * 3.2)
            base_score = min(98.0, max(42.0, base_score))

            # Attempt 1: Coding
            att1 = TestAttempt(
                student_id=s.id,
                assessment_id=ass1.id,
                score=round(base_score + 4, 1),
                correct_count=2,
                incorrect_count=1,
                skipped_count=0,
                status="COMPLETED",
                started_at=datetime.utcnow() - timedelta(days=12),
                completed_at=datetime.utcnow() - timedelta(days=12, hours=-1)
            )
            db.add(att1)

            # Attempt 2: Aptitude
            att2 = TestAttempt(
                student_id=s.id,
                assessment_id=ass2.id,
                score=round(base_score - 2, 1),
                correct_count=4,
                incorrect_count=1,
                skipped_count=0,
                status="COMPLETED",
                started_at=datetime.utcnow() - timedelta(days=5),
                completed_at=datetime.utcnow() - timedelta(days=5, hours=-1)
            )
            db.add(att2)

            # Historical performance timeline
            for d_offset, cat, delta in [
                (25, "CODING", -8),
                (18, "APTITUDE", -4),
                (12, "CODING", 0),
                (5, "APTITUDE", +3),
                (2, "MOCK", -2)
            ]:
                pr = PerformanceRecord(
                    student_id=s.id,
                    category=cat,
                    score=round(min(100.0, max(30.0, base_score + delta)), 1),
                    recorded_at=datetime.utcnow() - timedelta(days=d_offset)
                )
                db.add(pr)

        await db.commit()

        print("Seeding Audit Logs...")
        audit_events = [
            ("INITIALIZE_SYSTEM", admin_user.id, admin_user.email, "MANAGEMENT", "SYSTEM", "1", "Placement Training Portal initialized with core configurations"),
            ("CREATE_ASSESSMENT", admin_user.id, admin_user.email, "MANAGEMENT", "ASSESSMENT", str(ass1.id), "Published Data Structures & Algorithms Core Assessment"),
            ("CREATE_ASSESSMENT", admin_user.id, admin_user.email, "MANAGEMENT", "ASSESSMENT", str(ass2.id), "Published Quantitative & Logical Speed Test 01"),
            ("CREATE_ASSESSMENT", admin_user.id, admin_user.email, "MANAGEMENT", "ASSESSMENT", str(ass3.id), "Published Placement Mock Examination 2026"),
            ("PROVISION_USERS", admin_user.id, admin_user.email, "MANAGEMENT", "USER_BATCH", "25", "Provisioned 25 institutional student accounts"),
        ]
        for action, uid, uemail, urole, ttype, tid, det in audit_events:
            entry = AuditLog(
                user_id=uid,
                user_email=uemail,
                user_role=urole,
                action=action,
                target_type=ttype,
                target_id=tid,
                details=det,
                ip_address="127.0.0.1",
                timestamp=datetime.utcnow() - timedelta(hours=2)
            )
            db.add(entry)

        await db.commit()
        print("Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
