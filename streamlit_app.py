import streamlit as st
import pandas as pd
import plotly.express as px
import time
from datetime import datetime

# Configure Page
st.set_page_config(
    page_title="Placement Training Portal",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (Universal Dark/Light Mode Compatible)
st.markdown("""
<style>
    .metric-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .custom-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 12px;
    }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-warning { background: #fef3c7; color: #b45309; }
    .badge-danger { background: #fee2e2; color: #b91c1c; }
</style>
""", unsafe_allow_html=True)

# Session State Initialization
if "user_role" not in st.session_state:
    st.session_state.user_role = "STUDENT"
if "student_scores" not in st.session_state:
    st.session_state.student_scores = {
        "overall": 78,
        "coding": 82,
        "aptitude": 74,
        "technical": 72,
        "mock": 76,
        "communication": 78
    }
if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"timestamp": "2026-09-05 10:30:15", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "INITIALIZE_SYSTEM", "target": "SYSTEM #1", "details": "Initialized portal configuration"},
        {"timestamp": "2026-09-05 11:15:22", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "CREATE_ASSESSMENT", "target": "ASSESSMENT #1", "details": "Published DSA Core Assessment"},
        {"timestamp": "2026-09-05 11:45:00", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "GRANT_PERMISSION", "target": "USER #2", "details": "Granted MANAGE_ASSESSMENTS override to Faculty"}
    ]

# Sidebar - Role Selection & Navigation
with st.sidebar:
    st.markdown("## 🎓 Placement Training Portal")
    st.caption("College Institutional Training System")
    
    selected_role = st.selectbox(
        "Current Active Role",
        ["STUDENT", "FACULTY", "MANAGEMENT"],
        index=["STUDENT", "FACULTY", "MANAGEMENT"].index(st.session_state.user_role)
    )
    st.session_state.user_role = selected_role

    st.markdown("---")
    
    if selected_role == "STUDENT":
        menu = st.radio("Student Menu", [
            "Dashboard", "My Performance", "Assessments", "Coding IDE", 
            "Aptitude Test", "Mock Tests", "My Roadmap", "Analysis & Suggestions", "Profile"
        ])
    elif selected_role == "FACULTY":
        menu = st.radio("Faculty Menu", [
            "Dashboard", "Students Directory", "Student Deep-Dive", "Cohort Analytics", "Profile"
        ])
    else:
        menu = st.radio("Management Menu", [
            "Dashboard", "Student Management", "Faculty Management", "Assessment Authoring", 
            "Permission Matrix (RBAC)", "Reports & CSV Export", "Audit Logs", "System Settings"
        ])

    st.markdown("---")
    st.caption(f"Authenticated as **{selected_role}**")
    if st.button("🚪 Switch Account / Logout", use_container_width=True):
        st.session_state.user_role = "STUDENT"
        st.rerun()

# ==========================================
# STUDENT ROLE VIEWS
# ==========================================
if selected_role == "STUDENT":
    if menu == "Dashboard":
        st.title("Good morning, Rohan Verma")
        st.caption("Roll No: 2022CSE101 • Department of Computer Science & Engineering • Year 4 (Section A)")
        
        # Compact Metrics
        c1, c2, c3, c4 = st.columns(4)
        c1.metric("Overall Readiness", f"{st.session_state.student_scores['overall']}%", "+6% this term")
        c2.metric("Coding & DSA", f"{st.session_state.student_scores['coding']}%", "+8% this month")
        c3.metric("Aptitude & Logic", f"{st.session_state.student_scores['aptitude']}%", "Target: 75%")
        c4.metric("Mock Tests", f"{st.session_state.student_scores['mock']}%", "1 completed")
        
        # Recommended Next Step Banner
        st.info("✨ **Recommended Next Step:** Your quantitative aptitude performance is at **74%**, below your **75% target**. Practice Time & Work and Percentages before attempting the next placement mock test.")
        
        col_l, col_r = st.columns(2)
        with col_l:
            st.subheader("Placement Roadmap Progress")
            st.progress(72)
            st.caption("Overall preparation milestone: **72% Completed**")
            st.markdown("- ✅ **Programming Fundamentals** (100% Completed)")
            st.markdown("- ⏳ **Data Structures & Algorithms** (82% In Progress)")
            st.markdown("- ⚠️ **Quantitative Aptitude** (74% Needs Practice)")
            st.markdown("- ⏳ **Placement Mock Exams** (76% In Progress)")
        
        with col_r:
            st.subheader("Recent Activity")
            st.markdown("**Data Structures & Algorithms Assessment** — Score: 85% (Passed)")
            st.caption("Completed 3 days ago • Python 3")
            st.markdown("**Quantitative Speed Test 01** — Score: 74% (Passed)")
            st.caption("Completed 5 days ago • 10 Questions")
            st.markdown("**Placement Tier-1 Simulation Mock** — Score: 76% (Passed)")
            st.caption("Completed 1 week ago • Full-length")

    elif menu == "My Performance":
        st.title("My Performance Trajectory")
        t_filter = st.selectbox("Time Filter", ["Last 30 Days", "Last 7 Days", "Last 3 Months", "All Time"])
        
        # Line Chart of Progress Over Time
        df_trend = pd.DataFrame({
            "Date": ["Aug 10", "Aug 18", "Aug 25", "Sep 01"],
            "Overall Score": [68, 71, 74, 78],
            "Coding": [70, 74, 78, 82],
            "Aptitude": [65, 68, 72, 74]
        })
        fig = px.line(df_trend, x="Date", y=["Overall Score", "Coding", "Aptitude"], title="Skill Improvement Over Time")
        fig.update_layout(template="plotly_white")
        st.plotly_chart(fig, use_container_width=True)

        # Bar comparison
        df_skills = pd.DataFrame({
            "Skill": ["Coding", "Aptitude", "Technical", "Mock Tests", "Communication"],
            "Your Score": [82, 74, 72, 76, 78],
            "Target Benchmark": [85, 75, 80, 75, 80]
        })
        fig_bar = px.bar(df_skills, x="Skill", y=["Your Score", "Target Benchmark"], barmode="group", title="Current Score vs Placement Benchmark")
        fig_bar.update_layout(template="plotly_white")
        st.plotly_chart(fig_bar, use_container_width=True)

    elif menu == "Assessments":
        st.title("Assessments Catalog")
        st.caption("Select an assessment to test your technical skills and aptitude")
        
        a1, a2, a3 = st.columns(3)
        with a1:
            st.markdown("### 💻 DSA Core Assessment")
            st.caption("Category: Algorithms • Medium • 45 Mins")
            st.markdown("Covers arrays, two-pointers, hash maps, and valid parentheses.")
            st.success("Score: 85% (Passed)")
        with a2:
            st.markdown("### 🧠 Quantitative Speed Test")
            st.caption("Category: Aptitude • Easy • 30 Mins")
            st.markdown("Speed math, time & work, and sequence logic.")
            st.success("Score: 74% (Passed)")
        with a3:
            st.markdown("### 🏆 Placement Mock 2026")
            st.caption("Category: Simulation • Hard • 60 Mins")
            st.markdown("Full mock test across Quantitative, Logical, and Live Coding.")
            st.success("Score: 76% (Passed)")

    elif menu == "Coding IDE":
        st.title("💻 Live Coding Assessment IDE")
        col_desc, col_editor = st.columns([1, 1])
        
        with col_desc:
            st.subheader("Problem: Reverse Array In-Place")
            st.markdown("""
            **Difficulty:** Easy  
            **Marks:** 10  
            
            Given an array of integers `arr`, write a function to reverse the array in-place without using extra memory.
            
            **Example 1:**
            - **Input:** `[1, 2, 3, 4, 5]`
            - **Output:** `[5, 4, 3, 2, 1]`
            
            **Example 2:**
            - **Input:** `[10, 20]`
            - **Output:** `[20, 10]`
            """)
        
        with col_editor:
            lang = st.selectbox("Language", ["Python 3", "JavaScript", "C++ 17", "Java 17"])
            starter = "def reverse_array(arr: list[int]) -> list[int]:\n    # Write your solution here\n    return arr[::-1]\n"
            code = st.text_area("Code Editor", starter, height=220)
            
            if st.button("▶️ Run Code & Evaluate Test Cases", type="primary"):
                with st.spinner("Executing code in sandboxed runtime..."):
                    time.sleep(0.5)
                    st.success("✅ All 3 Test Cases Passed! Runtime: 42.1 ms | Memory: 14.8 MB")
                    st.json({
                        "Case 1": {"input": "[1, 2, 3, 4, 5]", "expected": "[5, 4, 3, 2, 1]", "status": "PASSED"},
                        "Case 2": {"input": "[10, 20]", "expected": "[20, 10]", "status": "PASSED"},
                        "Case 3 (Hidden)": {"status": "PASSED"}
                    })

    elif menu == "Aptitude Test":
        st.title("🧠 Quantitative & Logical Aptitude Test")
        st.caption("Timer: 28:45 remaining • 5 Questions")
        
        st.markdown("#### Question 1 of 5")
        st.markdown("A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?")
        ans1 = st.radio("Options", ["120 metres", "150 metres", "180 metres", "324 metres"], key="q1")
        
        st.markdown("#### Question 2 of 5")
        st.markdown("A and B together can complete a piece of work in 4 days. If A alone can complete the same work in 12 days, in how many days can B alone complete that work?")
        ans2 = st.radio("Options", ["4 days", "5 days", "6 days", "8 days"], key="q2")
        
        if st.button("Submit Aptitude Answers", type="primary"):
            st.success("🎉 Test Submitted Successfully! You scored 100% on these questions.")

    elif menu == "Mock Tests":
        st.title("🏆 Placement Full Mock Exam Simulation")
        st.markdown("""
        Replicate corporate MNC and Product recruitment tests with sectional timers.
        - **Quantitative Math:** 15 Questions
        - **Logical Reasoning:** 15 Questions
        - **Verbal Ability:** 10 Questions
        - **Live Coding Challenge:** 2 Problems
        """)
        st.button("Start Full Mock Exam Simulation", type="primary")

    elif menu == "My Roadmap":
        st.title("🗺️ My Placement Readiness Roadmap")
        st.progress(72)
        st.markdown("### Stage 1: Programming Fundamentals — 100% (Completed)")
        st.markdown("### Stage 2: Data Structures & Algorithms — 82% (In Progress)")
        st.markdown("### Stage 3: Quantitative & Logical Aptitude — 74% (Needs Practice)")
        st.markdown("### Stage 4: Placement Mock Exams — 76% (In Progress)")
        st.markdown("### Stage 5: Technical Core & HR Interview Prep — 25% (Not Started)")

    elif menu == "Analysis & Suggestions":
        st.title("💡 Performance Analysis & Suggestions")
        st.info("💡 **Grounded Suggestion:** Practice quantitative aptitude before taking your next mock test to raise your score into the Tier-1 80%+ bracket.")
        st.markdown("**Identified Strengths:** Coding & Problem Solving (82%), Verbal Ability (80%)")
        st.markdown("**Priority Improvements:** Quantitative Math (74%), Operating Systems (68%)")

    elif menu == "Profile":
        st.title("👤 Student Profile")
        st.markdown("""
        - **Name:** Rohan Verma
        - **Email:** student1@institution.edu
        - **Roll No:** 2022CSE101
        - **Department:** Computer Science & Engineering
        - **Year & Section:** Year 4 • Section A
        - **CGPA:** 8.8 / 10.0
        """)

# ==========================================
# FACULTY ROLE VIEWS
# ==========================================
elif selected_role == "FACULTY":
    if menu == "Dashboard":
        st.title("Faculty Coordinator Dashboard")
        st.caption("Prof. Arvind Sharma • CSE Department Placement Lead")
        
        f1, f2, f3, f4 = st.columns(4)
        f1.metric("Assigned Students", "120", "Cohort CSE 4th Year")
        f2.metric("Average Score", "74.8%", "+3.2% vs last term")
        f3.metric("Assessment Completion", "86.4%", "Target: 80%")
        f4.metric("Needs Attention", "12", "At-Risk (<60%)")
        
        st.subheader("⚠️ Students Needing Immediate Attention")
        df_risk = pd.DataFrame([
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Score": "58%", "Reason": "Low Aptitude (52%)"},
            {"Student ID": "2022MECH121", "Name": "Harsh Vardhan", "Dept": "MECH", "Score": "52%", "Reason": "Low Coding (48%)"},
            {"Student ID": "2022CIVIL112", "Name": "Kavita Reddy", "Dept": "CIVIL", "Score": "54%", "Reason": "Low Overall Score (54%)"}
        ])
        st.dataframe(df_risk, use_container_width=True)

    elif menu == "Students Directory":
        st.title("Student Directory & Search")
        search_txt = st.text_input("Search student by name or Roll ID", "")
        dept_filter = st.selectbox("Department", ["All", "CSE", "ECE", "EEE", "MECH", "CIVIL"])
        
        df_students = pd.DataFrame([
            {"Roll ID": "2022CSE101", "Name": "Rohan Verma", "Dept": "CSE", "Year": 4, "Overall": "78%", "Coding": "82%", "Aptitude": "74%", "Status": "Active"},
            {"Roll ID": "2022ECE102", "Name": "Ananya Iyer", "Dept": "ECE", "Year": 4, "Overall": "74%", "Coding": "75%", "Aptitude": "72%", "Status": "Active"},
            {"Roll ID": "2022CSE104", "Name": "Pooja Hegde", "Dept": "CSE", "Year": 4, "Overall": "92%", "Coding": "95%", "Aptitude": "88%", "Status": "Top Performer"},
            {"Roll ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Year": 4, "Overall": "58%", "Coding": "62%", "Aptitude": "52%", "Status": "At-Risk"},
        ])
        st.dataframe(df_students, use_container_width=True)

    elif menu == "Student Deep-Dive":
        st.title("🔍 Student Deep-Dive Inspection")
        st.markdown("### Rohan Verma (2022CSE101)")
        st.caption("Department of CSE • Year 4 • Section A • CGPA: 8.8")
        
        c1, c2, c3 = st.columns(3)
        c1.metric("Coding Score", "82%")
        c2.metric("Aptitude Score", "74%")
        c3.metric("Mock Exam Score", "76%")
        
        st.markdown("**Faculty Note:** Strong in algorithmic coding and data structures. Recommend focused practice in speed math and permutations.")

    elif menu == "Cohort Analytics":
        st.title("Cohort Analytics & Benchmarks")
        df_dept_avg = pd.DataFrame({
            "Department": ["CSE", "ECE", "EEE", "MECH", "CIVIL"],
            "Average Score": [78.4, 73.2, 69.8, 66.5, 64.1],
            "Readiness Rate (%)": [84.0, 72.5, 65.0, 58.0, 52.0]
        })
        fig = px.bar(df_dept_avg, x="Department", y=["Average Score", "Readiness Rate (%)"], barmode="group", title="Departmental Performance & Readiness")
        fig.update_layout(template="plotly_white")
        st.plotly_chart(fig, use_container_width=True)

    elif menu == "Profile":
        st.title("👤 Faculty Profile")
        st.markdown("""
        - **Name:** Prof. Arvind Sharma
        - **Email:** prof.sharma@institution.edu
        - **Employee ID:** FAC-CSE-101
        - **Department:** Computer Science & Engineering
        - **Designation:** Professor & Placement Coordinator
        """)

# ==========================================
# MANAGEMENT ROLE VIEWS
# ==========================================
elif selected_role == "MANAGEMENT":
    if menu == "Dashboard":
        st.title("Institution Governance Dashboard")
        st.caption("Dr. Rajeshwar Rao • Dean of Placements")
        
        m1, m2, m3, m4, m5 = st.columns(5)
        m1.metric("Total Students", "25", "Active in Training")
        m2.metric("Total Faculty", "2", "Coordinators")
        m3.metric("Average Score", "74.8%", "+4.1% this term")
        m4.metric("Placement Ready", "72.0%", "Score >= 75%")
        m5.metric("Completion Rate", "88.5%", "Target: 85%")
        
        st.subheader("Department Placement Performance Rankings")
        df_depts = pd.DataFrame([
            {"Department": "CSE", "Enrolled": 120, "Avg Score": "78.4%", "Placement Ready Rate": "84.0%", "Status": "On Track"},
            {"Department": "ECE", "Enrolled": 90, "Avg Score": "73.2%", "Placement Ready Rate": "72.5%", "Status": "On Track"},
            {"Department": "EEE", "Enrolled": 60, "Avg Score": "69.8%", "Placement Ready Rate": "65.0%", "Status": "Needs Focus"},
            {"Department": "MECH", "Enrolled": 75, "Avg Score": "66.5%", "Placement Ready Rate": "58.0%", "Status": "Needs Focus"},
            {"Department": "CIVIL", "Enrolled": 45, "Avg Score": "64.1%", "Placement Ready Rate": "52.0%", "Status": "Needs Focus"}
        ])
        st.dataframe(df_depts, use_container_width=True)

    elif menu == "Student Management":
        st.title("Student Management")
        st.caption("Provision students, assign department cohorts, and manage active status")
        df_s_mgmt = pd.DataFrame([
            {"Student ID": "2022CSE101", "Name": "Rohan Verma", "Email": "student1@institution.edu", "Dept": "CSE", "Year": 4, "Status": "ACTIVE"},
            {"Student ID": "2022ECE102", "Name": "Ananya Iyer", "Email": "student2@institution.edu", "Dept": "ECE", "Year": 4, "Status": "ACTIVE"},
            {"Student ID": "2022MECH103", "Name": "Vikram Singh", "Email": "student3@institution.edu", "Dept": "MECH", "Year": 4, "Status": "ACTIVE"},
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Email": "student9@institution.edu", "Dept": "CSE", "Year": 4, "Status": "ACTIVE"},
        ])
        st.dataframe(df_s_mgmt, use_container_width=True)
        
        with st.expander("➕ Provision New Student"):
            ns_name = st.text_input("Full Name")
            ns_email = st.text_input("Institutional Email")
            ns_dept = st.selectbox("Department", ["CSE", "ECE", "EEE", "MECH", "CIVIL"], key="ns_dept")
            if st.button("Provision Student"):
                st.success(f"Student '{ns_name}' successfully provisioned!")

    elif menu == "Faculty Management":
        st.title("Faculty Management")
        st.caption("Manage faculty leads and department appointments")
        df_f_mgmt = pd.DataFrame([
            {"Employee ID": "FAC-CSE-101", "Name": "Prof. Arvind Sharma", "Email": "prof.sharma@institution.edu", "Dept": "CSE", "Designation": "Professor & Coordinator", "Status": "ACTIVE"},
            {"Employee ID": "FAC-ECE-202", "Name": "Dr. Neha Patel", "Email": "dr.patel@institution.edu", "Dept": "ECE", "Designation": "Associate Professor", "Status": "ACTIVE"}
        ])
        st.dataframe(df_f_mgmt, use_container_width=True)

    elif menu == "Assessment Authoring":
        st.title("Assessment Authoring & Configuration")
        with st.expander("➕ Create New Assessment", expanded=True):
            st.text_input("Assessment Title", "Graph Traversal & BFS/DFS")
            st.selectbox("Type", ["CODING", "APTITUDE", "MOCK"], key="ass_type")
            st.selectbox("Difficulty", ["Easy", "Medium", "Hard"], key="ass_diff")
            st.number_input("Duration (Minutes)", 15, 180, 45)
            st.number_input("Passing Score (%)", 40, 100, 60)
            if st.button("Publish Assessment to Students"):
                st.success("Assessment published successfully!")

    elif menu == "Permission Matrix (RBAC)":
        st.title("🛡️ Granular RBAC & Permission Matrix")
        st.caption("Inspect and grant/revoke individual permission overrides with audit tracking")
        
        target_fac = st.selectbox("Select User", ["Prof. Arvind Sharma (CSE Placement Lead)", "Dr. Neha Patel (ECE Coordinator)"])
        
        df_perms = pd.DataFrame([
            {"Permission": "VIEW_STUDENT_PERFORMANCE", "Role Default": "Granted", "Override": "None", "Effective": "Granted"},
            {"Permission": "VIEW_STUDENT_RESULTS", "Role Default": "Granted", "Override": "None", "Effective": "Granted"},
            {"Permission": "MANAGE_ASSESSMENTS", "Role Default": "Restricted", "Override": "Granted by Admin", "Effective": "Granted"},
            {"Permission": "MANAGE_STUDENTS", "Role Default": "Restricted", "Override": "None", "Effective": "Restricted"},
            {"Permission": "MANAGE_PERMISSIONS", "Role Default": "Restricted", "Override": "None", "Effective": "Restricted"}
        ])
        st.dataframe(df_perms, use_container_width=True)
        
        col_p1, col_p2 = st.columns(2)
        with col_p1:
            p_to_grant = st.selectbox("Select Permission to Grant Override", ["MANAGE_ASSESSMENTS", "MANAGE_STUDENTS", "MANAGE_MOCK_TESTS"])
            if st.button("✅ Grant Permission Override"):
                st.session_state.audit_logs.insert(0, {
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "user": "admin@institution.edu",
                    "role": "MANAGEMENT",
                    "action": "GRANT_PERMISSION",
                    "target": target_fac,
                    "details": f"Granted permission override '{p_to_grant}'"
                })
                st.success(f"Permission '{p_to_grant}' granted and logged!")
        with col_p2:
            p_to_revoke = st.selectbox("Select Permission to Revoke", ["MANAGE_ASSESSMENTS", "VIEW_STUDENT_PERFORMANCE"])
            if st.button("🚫 Revoke Permission Override"):
                st.session_state.audit_logs.insert(0, {
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "user": "admin@institution.edu",
                    "role": "MANAGEMENT",
                    "action": "REVOKE_PERMISSION",
                    "target": target_fac,
                    "details": f"Revoked permission override '{p_to_revoke}'"
                })
                st.warning(f"Permission '{p_to_revoke}' revoked and logged!")

    elif menu == "Reports & CSV Export":
        st.title("📊 Placement Reports & CSV Export")
        df_export = pd.DataFrame([
            {"Student ID": "2022CSE101", "Name": "Rohan Verma", "Dept": "CSE", "Year": 4, "Overall Readiness": 78, "Coding": 82, "Aptitude": 74, "Status": "Placement Ready"},
            {"Student ID": "2022ECE102", "Name": "Ananya Iyer", "Dept": "ECE", "Year": 4, "Overall Readiness": 74, "Coding": 75, "Aptitude": 72, "Status": "Moderate"},
            {"Student ID": "2022CSE104", "Name": "Pooja Hegde", "Dept": "CSE", "Year": 4, "Overall Readiness": 92, "Coding": 95, "Aptitude": 88, "Status": "Placement Ready"},
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Year": 4, "Overall Readiness": 58, "Coding": 62, "Aptitude": 52, "Status": "Needs Support"}
        ])
        st.dataframe(df_export, use_container_width=True)
        csv_data = df_export.to_csv(index=False).encode('utf-8')
        st.download_button("📥 Download CSV Performance Report", csv_data, "placement_performance_report.csv", "text/csv")

    elif menu == "Audit Logs":
        st.title("📜 Security & System Audit Trail")
        st.dataframe(pd.DataFrame(st.session_state.audit_logs), use_container_width=True)

    elif menu == "System Settings":
        st.title("⚙️ Placement Scoring Formula Settings")
        st.markdown("**Centralized Weight Distribution:**")
        st.markdown("- Coding & DSA: **30%**")
        st.markdown("- Quantitative Aptitude: **25%**")
        st.markdown("- Technical Core CS: **20%**")
        st.markdown("- Placement Mock Exams: **15%**")
        st.markdown("- Communication & HR: **10%**")
        st.slider("Placement Readiness Cutoff (%)", 50, 100, 75)
        st.slider("At-Risk Alert Trigger (%)", 40, 80, 60)
        st.button("Save Settings", type="primary")

st.markdown("---")
st.caption("Placement Training Portal • Full-Stack University Edition • 2026")
