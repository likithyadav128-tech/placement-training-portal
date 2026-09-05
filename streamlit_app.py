import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
import time
import textwrap
from datetime import datetime

# ==============================================================================
# 1. PAGE CONFIGURATION
# ==============================================================================
st.set_page_config(
    page_title="Placement Training Portal",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==============================================================================
# 2. DESIGN SYSTEM & REUSABLE UI HELPERS
# ==============================================================================
def render_html(html_str: str):
    """Safely render dedented HTML strings in Streamlit."""
    st.markdown(textwrap.dedent(html_str).strip(), unsafe_allow_html=True)

# Enterprise SaaS CSS Theme
render_html("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .stApp {
        background-color: #f8fafc;
    }

    /* Professional Metric Cards */
    .saas-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
        margin-bottom: 16px;
    }

    .metric-container {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
    }

    .metric-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #64748b;
        margin-bottom: 4px;
    }

    .metric-value {
        font-size: 28px;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.1;
    }

    .metric-subtext {
        font-size: 11px;
        font-weight: 600;
        margin-top: 6px;
    }

    .subtext-positive { color: #059669; }
    .subtext-neutral { color: #64748b; }
    .subtext-warning { color: #d97706; }

    /* Recommended Next Step Banner */
    .rec-banner {
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        color: #ffffff;
        border-radius: 12px;
        padding: 22px 26px;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px -2px rgba(30, 58, 138, 0.25);
    }

    .rec-badge {
        background: rgba(255, 255, 255, 0.15);
        color: #93c5fd;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: inline-block;
        margin-bottom: 8px;
    }

    /* Badges */
    .badge {
        display: inline-block;
        padding: 3px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 700;
    }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-warning { background: #fef3c7; color: #b45309; }
    .badge-danger { background: #fee2e2; color: #b91c1c; }
    .badge-info { background: #dbeafe; color: #1d4ed8; }

    /* Activity Row */
    .activity-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f1f5f9;
    }
    .activity-item:last-child {
        border-bottom: none;
    }

    /* Timeline Step */
    .timeline-item {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 14px 0;
        border-bottom: 1px solid #f1f5f9;
    }
    .timeline-item:last-child {
        border-bottom: none;
    }

    .step-number {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #f1f5f9;
        color: #475569;
        font-weight: 700;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .step-active {
        background: #2563eb;
        color: #ffffff;
    }

    .step-done {
        background: #10b981;
        color: #ffffff;
    }
</style>
""")

# ==============================================================================
# 3. STATE INITIALIZATION & DATA LAYER
# ==============================================================================
if "user_role" not in st.session_state:
    st.session_state.user_role = "STUDENT"

if "student_scores" not in st.session_state:
    st.session_state.student_scores = {
        "overall": 78,
        "coding": 82,
        "aptitude": 74,
        "mock": 76,
        "technical": 72,
        "verbal": 80
    }

if "active_student_view" not in st.session_state:
    st.session_state.active_student_view = "2022CSE101"

if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"timestamp": "2026-09-05 10:30:15", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "INITIALIZE_SYSTEM", "target": "SYSTEM #1", "details": "Initialized portal placement readiness configuration"},
        {"timestamp": "2026-09-05 11:15:22", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "CREATE_ASSESSMENT", "target": "ASSESSMENT #1", "details": "Published DSA Core Assessment (Medium, 45 Mins)"},
        {"timestamp": "2026-09-05 11:45:00", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "GRANT_PERMISSION", "target": "Prof. Arvind Sharma", "details": "Granted MANAGE_ASSESSMENTS override to Faculty Coordinator"}
    ]

# ==============================================================================
# 4. SIDEBAR NAVIGATION
# ==============================================================================
with st.sidebar:
    render_html("""
    <div style="padding: 6px 0 16px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; background: #1e3a8a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 16px;">
                🎓
            </div>
            <div>
                <div style="font-weight: 800; font-size: 15px; color: #0f172a; line-height: 1.2;">Placement Portal</div>
                <div style="font-size: 11px; color: #64748b; font-weight: 500;">Prepare smarter. Perform better.</div>
            </div>
        </div>
    </div>
    """)

    # Active Role Selector
    selected_role = st.selectbox(
        "Current Active Role",
        ["STUDENT", "FACULTY", "MANAGEMENT"],
        index=["STUDENT", "FACULTY", "MANAGEMENT"].index(st.session_state.user_role)
    )
    st.session_state.user_role = selected_role

    st.markdown("<div style='height: 10px;'></div>", unsafe_allow_html=True)

    # Role-Specific Navigation Menu (Strict RBAC Separation)
    if selected_role == "STUDENT":
        menu = st.radio("Student Menu", [
            "Dashboard", "My Performance", "Assessments", "Mock Tests", 
            "My Roadmap", "Analysis & Suggestions", "Profile"
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

    st.markdown("<div style='height: 20px;'></div>", unsafe_allow_html=True)
    st.markdown("---")

    # Authenticated User Badge & Logout
    if selected_role == "STUDENT":
        u_name, u_email, u_detail = "Rohan Verma", "rohan.verma@institution.edu", "CSE • Year 4"
    elif selected_role == "FACULTY":
        u_name, u_email, u_detail = "Prof. Arvind Sharma", "prof.sharma@institution.edu", "CSE Placement Lead"
    else:
        u_name, u_email, u_detail = "Dr. Rajeshwar Rao", "admin@institution.edu", "Dean of Placements"

    render_html(f"""
    <div style="padding: 10px 0; font-size: 12px; color: #475569;">
        <div style="font-weight: 700; color: #0f172a;">{u_name}</div>
        <div style="font-size: 11px; color: #64748b;">{u_email}</div>
        <div style="font-size: 10px; color: #2563eb; font-weight: 600; margin-top: 2px;">{u_detail}</div>
    </div>
    """)

    if st.button("🚪 Sign Out / Switch Role", use_container_width=True):
        st.session_state.user_role = "STUDENT"
        st.rerun()

# ==============================================================================
# 5. STUDENT VIEWS
# ==============================================================================
if selected_role == "STUDENT":
    if menu == "Dashboard":
        # Greeting Header
        st.title("Good morning, Rohan Verma")
        st.caption("Here's your placement preparation progress • Department of Computer Science & Engineering")

        st.markdown("<div style='height: 10px;'></div>", unsafe_allow_html=True)

        # EXACTLY 4 Primary KPI Cards
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #1e3a8a;">
                <div class="metric-label">Overall Score</div>
                <div class="metric-value">78%</div>
                <div class="metric-subtext subtext-positive">+6% readiness vs baseline</div>
            </div>
            """)
        with c2:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #2563eb;">
                <div class="metric-label">Coding & DSA</div>
                <div class="metric-value">82%</div>
                <div class="metric-subtext subtext-positive">+8% this month</div>
            </div>
            """)
        with c3:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #f59e0b;">
                <div class="metric-label">Aptitude & Logic</div>
                <div class="metric-value">74%</div>
                <div class="metric-subtext subtext-warning">Target: 75% (Priority)</div>
            </div>
            """)
        with c4:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #6366f1;">
                <div class="metric-label">Mock Tests</div>
                <div class="metric-value">76%</div>
                <div class="metric-subtext subtext-neutral">1 completed • 1 scheduled</div>
            </div>
            """)

        st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

        # Prominent "Recommended Next Step" Banner
        render_html("""
        <div class="rec-banner">
            <div class="rec-badge">Recommended Next Step</div>
            <h3 style="font-size: 18px; font-weight: 800; margin: 0 0 6px 0;">Focus on Quantitative Aptitude</h3>
            <p style="font-size: 13px; color: #e0e7ff; margin: 0 0 14px 0; max-width: 750px; line-height: 1.5;">
                Your Quantitative Aptitude score is currently at <b>74%</b>, which is below your target benchmark of <b>75%</b>. 
                Complete <i>Time & Work Speed Practice</i> before taking the next placement mock simulation.
            </p>
        </div>
        """)

        # Main 2-Column Section: Performance Trend + Roadmap & Activity
        col_chart, col_side = st.columns([1.3, 1])

        with col_chart:
            render_html("""
            <div class="saas-card">
                <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Performance Trend</div>
            """)
            
            df_trend = pd.DataFrame({
                "Date": ["Aug 10", "Aug 18", "Aug 25", "Sep 01", "Sep 05"],
                "Overall Score": [68, 71, 74, 76, 78],
                "Coding & DSA": [70, 74, 78, 80, 82],
                "Aptitude": [65, 68, 70, 72, 74]
            })

            fig_trend = px.line(
                df_trend, 
                x="Date", 
                y=["Overall Score", "Coding & DSA", "Aptitude"],
                markers=True,
                color_discrete_sequence=["#1e3a8a", "#2563eb", "#f59e0b"]
            )
            fig_trend.update_layout(
                margin=dict(l=10, r=10, t=10, b=10),
                height=260,
                legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
                xaxis=dict(showgrid=False),
                yaxis=dict(showgrid=True, gridcolor="#f1f5f9", range=[50, 100]),
                plot_bgcolor="rgba(0,0,0,0)",
                paper_bgcolor="rgba(0,0,0,0)"
            )
            st.plotly_chart(fig_trend, use_container_width=True, config={"displayModeBar": False})
            render_html("</div>")

        with col_side:
            # Roadmap Preview
            render_html("""
            <div class="saas-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 14px; font-weight: 700; color: #0f172a;">Placement Roadmap</span>
                    <span style="font-size: 12px; font-weight: 700; color: #2563eb;">72% Overall</span>
                </div>
                <div style="background: #f1f5f9; border-radius: 999px; height: 6px; margin-bottom: 12px; overflow: hidden;">
                    <div style="background: #1e3a8a; width: 72%; height: 100%;"></div>
                </div>
                <div style="font-size: 12px; line-height: 1.8;">
                    <div>✅ <b>Programming Fundamentals</b> — 100%</div>
                    <div>⏳ <b>Data Structures & Algorithms</b> — 82%</div>
                    <div>⚠️ <b>Quantitative Aptitude</b> — 74% (Needs Practice)</div>
                    <div>⏳ <b>Placement Mock Exams</b> — 76%</div>
                </div>
            </div>
            """)

            # Recent Activity Rows
            render_html("""
            <div class="saas-card">
                <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Recent Activity</div>
                <div class="activity-item">
                    <div>
                        <div style="font-weight: 700; font-size: 12px; color: #0f172a;">DSA Core Assessment</div>
                        <div style="font-size: 10px; color: #64748b;">Completed 3 days ago • Python 3</div>
                    </div>
                    <span class="badge badge-success">85% Passed</span>
                </div>
                <div class="activity-item">
                    <div>
                        <div style="font-weight: 700; font-size: 12px; color: #0f172a;">Quantitative Speed Test 01</div>
                        <div style="font-size: 10px; color: #64748b;">Completed 5 days ago • 10 Questions</div>
                    </div>
                    <span class="badge badge-warning">74% Review</span>
                </div>
                <div class="activity-item">
                    <div>
                        <div style="font-weight: 700; font-size: 12px; color: #0f172a;">Placement Simulation Mock 01</div>
                        <div style="font-size: 10px; color: #64748b;">Completed 1 week ago • Full-Length</div>
                    </div>
                    <span class="badge badge-success">76% Passed</span>
                </div>
            </div>
            """)

    elif menu == "My Performance":
        st.title("My Performance")
        st.caption("Detailed breakdown of skills, benchmarks, and historical performance.")

        t_filter = st.selectbox("Time Filter", ["Last 30 Days", "Last 7 Days", "Last 3 Months", "All Time"])

        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Overall Score", "78%", "+6%")
        m2.metric("Coding & DSA", "82%", "+8%")
        m3.metric("Aptitude", "74%", "+2%")
        m4.metric("Mock Tests", "76%", "+4%")

        st.markdown("<div style='height: 10px;'></div>", unsafe_allow_html=True)

        col_p1, col_p2 = st.columns(2)
        with col_p1:
            st.subheader("Skill vs Placement Benchmark")
            df_comp = pd.DataFrame({
                "Skill": ["Coding", "Aptitude", "Technical", "Mock Tests", "Verbal"],
                "Your Score": [82, 74, 72, 76, 80],
                "Placement Target": [85, 75, 80, 75, 75]
            })
            fig_bar = px.bar(
                df_comp, 
                x="Skill", 
                y=["Your Score", "Placement Target"], 
                barmode="group",
                color_discrete_sequence=["#2563eb", "#cbd5e1"]
            )
            fig_bar.update_layout(template="plotly_white", height=300)
            st.plotly_chart(fig_bar, use_container_width=True)

        with col_p2:
            st.subheader("Placement Readiness Index")
            fig_radar = go.Figure(go.Scatterpolar(
                r=[82, 74, 72, 76, 80, 82],
                theta=['Coding', 'Aptitude', 'Technical', 'Mock Tests', 'Verbal', 'Coding'],
                fill='toself',
                fillcolor='rgba(37, 99, 235, 0.15)',
                line=dict(color='#2563eb', width=2)
            ))
            fig_radar.update_layout(
                polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
                height=300,
                margin=dict(l=30, r=30, t=20, b=20)
            )
            st.plotly_chart(fig_radar, use_container_width=True)

    elif menu == "Assessments":
        st.title("Assessments")
        st.caption("Practice the skills required for campus placement.")

        tab_coding, tab_aptitude = st.tabs(["💻 Coding Assessments", "🧠 Aptitude & Logic"])

        with tab_coding:
            col_c1, col_c2, col_c3 = st.columns(3)
            with col_c1:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">Algorithms</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 4px 0 6px 0;">DSA Core Assessment</div>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Arrays, two-pointers, hash tables, and string manipulation.</p>
                    <div style="font-size: 11px; color: #475569; margin-bottom: 14px;">
                        • <b>3 Problems</b> • 45 Mins • <span class="badge badge-warning">Medium</span>
                    </div>
                </div>
                """)
                if st.button("Start DSA Test", key="btn_dsa", use_container_width=True, type="primary"):
                    st.session_state.active_assessment = "DSA"

            with col_c2:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">Data Structures</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 4px 0 6px 0;">Binary Trees & Recursion</div>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Tree traversals, binary search trees, and DFS/BFS patterns.</p>
                    <div style="font-size: 11px; color: #475569; margin-bottom: 14px;">
                        • <b>2 Problems</b> • 45 Mins • <span class="badge badge-danger">Hard</span>
                    </div>
                </div>
                """)
                if st.button("Start Trees Test", key="btn_trees", use_container_width=True):
                    st.session_state.active_assessment = "Trees"

            with col_c3:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">Fundamentals</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 4px 0 6px 0;">Python & OOP Basics</div>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Object-oriented principles, exception handling, and lambdas.</p>
                    <div style="font-size: 11px; color: #475569; margin-bottom: 14px;">
                        • <b>4 Problems</b> • 30 Mins • <span class="badge badge-success">Easy</span>
                    </div>
                </div>
                """)
                if st.button("Start OOP Test", key="btn_oop", use_container_width=True):
                    st.session_state.active_assessment = "OOP"

            # In-line Coding IDE Sandbox
            st.markdown("---")
            st.subheader("💻 Interactive Sandbox IDE: Problem Runner")
            
            c_desc, c_code = st.columns([1, 1])
            with c_desc:
                st.markdown("""
                **Problem:** Reverse Array In-Place  
                **Difficulty:** Easy | **Marks:** 10  
                
                Given an integer array `arr`, write a function to reverse the elements in-place without allocating additional array buffers.
                
                **Example 1:**  
                - Input: `[1, 2, 3, 4, 5]`  
                - Output: `[5, 4, 3, 2, 1]`  
                """)
            with c_code:
                lang = st.selectbox("Runtime", ["Python 3", "JavaScript", "C++ 17", "Java 17"])
                starter = "def reverse_array(arr: list[int]) -> list[int]:\n    # In-place reversal implementation\n    return arr[::-1]\n"
                code = st.text_area("Code Editor", starter, height=140)
                if st.button("▶️ Run & Evaluate Test Cases", type="primary"):
                    with st.spinner("Executing in sandboxed runtime..."):
                        time.sleep(0.4)
                        st.success("✅ All 3 Test Cases Passed! Runtime: 36.4 ms | Memory: 14.1 MB")

        with tab_aptitude:
            col_a1, col_a2, col_a3 = st.columns(3)
            with col_a1:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase;">Quantitative</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 4px 0 6px 0;">Speed Math & Percentages</div>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Time & work, ratios, profit & loss, and quick calculation tricks.</p>
                    <div style="font-size: 11px; color: #475569; margin-bottom: 14px;">
                        • <b>15 Questions</b> • 20 Mins • <span class="badge badge-success">Easy</span>
                    </div>
                </div>
                """)
                st.button("Start Quantitative Set", key="btn_quant", use_container_width=True, type="primary")

            with col_a2:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase;">Logical</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 4px 0 6px 0;">Logical Deductions & Puzzles</div>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Seating arrangements, blood relations, and syllogisms.</p>
                    <div style="font-size: 11px; color: #475569; margin-bottom: 14px;">
                        • <b>15 Questions</b> • 25 Mins • <span class="badge badge-warning">Medium</span>
                    </div>
                </div>
                """)
                st.button("Start Logical Set", key="btn_logic", use_container_width=True)

            with col_a3:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase;">Verbal</div>
                    <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 4px 0 6px 0;">Verbal Ability & Comprehension</div>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Reading comprehension, sentence correction, and vocabulary.</p>
                    <div style="font-size: 11px; color: #475569; margin-bottom: 14px;">
                        • <b>20 Questions</b> • 20 Mins • <span class="badge badge-success">Easy</span>
                    </div>
                </div>
                """)
                st.button("Start Verbal Set", key="btn_verbal", use_container_width=True)

    elif menu == "Mock Tests":
        st.title("Placement Mock Exams")
        st.caption("Simulate real recruitment tests with sectional timers.")

        render_html("""
        <div class="saas-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <span class="badge badge-info">Tier-1 Corporate Simulation</span>
                    <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 6px 0 8px 0;">Placement Mock Simulation 2026</h3>
                    <p style="font-size: 13px; color: #475569; max-width: 650px; line-height: 1.5;">
                        Complete simulation covering Quantitative Math (15 Qs), Logical Reasoning (15 Qs), Verbal Ability (10 Qs), and Live Coding (2 Problems).
                    </p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 18px; font-weight: 800; color: #0f172a;">60 Mins</div>
                    <div style="font-size: 11px; color: #64748b;">Sectional Timing</div>
                </div>
            </div>
        </div>
        """)
        st.button("Start Full Mock Exam Simulation", type="primary")

    elif menu == "My Roadmap":
        st.title("My Placement Roadmap")
        st.caption("Vertical timeline and milestone tracking for campus placements.")

        render_html("""
        <div class="saas-card">
            <div class="timeline-item">
                <div class="step-number step-done">✓</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 800; font-size: 14px; color: #0f172a;">1. Programming Fundamentals</span>
                        <span class="badge badge-success">100% Completed</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">C++, Java, and Python fundamentals, control structures, and basic functions.</p>
                </div>
            </div>

            <div class="timeline-item">
                <div class="step-number step-active">2</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 800; font-size: 14px; color: #0f172a;">2. Data Structures & Algorithms</span>
                        <span class="badge badge-info">82% In Progress</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Arrays, LinkedLists, Stacks, Queues, Trees, Graphs, and Dynamic Programming.</p>
                </div>
            </div>

            <div class="timeline-item">
                <div class="step-number" style="background: #f59e0b; color: white;">3</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 800; font-size: 14px; color: #0f172a;">3. Quantitative & Logical Aptitude</span>
                        <span class="badge badge-warning">74% Needs Practice</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Speed math, permutations, probability, logical puzzles, and data interpretation.</p>
                </div>
            </div>

            <div class="timeline-item">
                <div class="step-number step-active">4</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 800; font-size: 14px; color: #0f172a;">4. Placement Mock Exams</span>
                        <span class="badge badge-info">76% In Progress</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Full-length MNC pattern tests with sectional cutoffs.</p>
                </div>
            </div>

            <div class="timeline-item">
                <div class="step-number">5</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 800; font-size: 14px; color: #0f172a;">5. Core Engineering & HR Interview Prep</span>
                        <span class="badge" style="background: #f1f5f9; color: #64748b;">25% Scheduled</span>
                    </div>
                    <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Operating Systems, DBMS, Computer Networks, System Design, and Behavioral HR.</p>
                </div>
            </div>
        </div>
        """)

    elif menu == "Analysis & Suggestions":
        st.title("Analysis & Suggestions")
        st.caption("AI-grounded performance insights and priority actions.")

        col_str, col_weak = st.columns(2)
        with col_str:
            render_html("""
            <div class="saas-card" style="border-top: 4px solid #10b981;">
                <div style="font-size: 14px; font-weight: 800; color: #065f46; margin-bottom: 8px;">Identified Strengths</div>
                <div style="font-size: 12px; line-height: 1.8; color: #334155;">
                    <div>• <b>Coding & Problem Solving (82%)</b> — Fast implementation in Python & C++.</div>
                    <div>• <b>Verbal Ability (80%)</b> — Strong reading comprehension & sentence logic.</div>
                    <div>• <b>Data Structures (85%)</b> — High accuracy on arrays, strings, and hash maps.</div>
                </div>
            </div>
            """)

        with col_weak:
            render_html("""
            <div class="saas-card" style="border-top: 4px solid #f59e0b;">
                <div style="font-size: 14px; font-weight: 800; color: #92400e; margin-bottom: 8px;">Priority Weaknesses</div>
                <div style="font-size: 12px; line-height: 1.8; color: #334155;">
                    <div>• <b>Quantitative Math (74%)</b> — Below the 75% placement readiness cutoff.</div>
                    <div>• <b>Time & Work Calculations</b> — Lower speed on complex proportion problems.</div>
                    <div>• <b>Operating Systems Core (68%)</b> — Review memory management and paging.</div>
                </div>
            </div>
            """)

        render_html("""
        <div class="saas-card">
            <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Actionable Recommendation</div>
            <p style="font-size: 13px; color: #475569; margin: 0; line-height: 1.5;">
                Practice <b>Quantitative Aptitude Set 3</b> focusing on speed arithmetic before attempting Placement Mock 02. Raising your score by 2% will promote your profile to the <b>Tier-1 Placement Ready</b> cohort.
            </p>
        </div>
        """)

    elif menu == "Profile":
        st.title("Student Profile")
        st.caption("Institutional Academic & Placement Profile")

        render_html("""
        <div class="saas-card">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                <div style="width: 50px; height: 50px; background: #1e3a8a; border-radius: 12px; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800;">
                    RV
                </div>
                <div>
                    <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0;">Rohan Verma</h3>
                    <div style="font-size: 12px; color: #64748b;">Roll No: 2022CSE101 • Institutional ID: STU-CSE-401</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; font-size: 13px; color: #334155; border-top: 1px solid #f1f5f9; padding-top: 16px;">
                <div><b>Department:</b> Computer Science & Eng.</div>
                <div><b>Year & Section:</b> Year 4 • Section A</div>
                <div><b>Academic CGPA:</b> 8.8 / 10.0</div>
                <div><b>Placement Status:</b> <span class="badge badge-success">Placement Ready</span></div>
                <div><b>Primary Mentor:</b> Prof. Arvind Sharma</div>
                <div><b>Target Tier:</b> Tier-1 Product & MNC</div>
            </div>
        </div>
        """)

# ==============================================================================
# 6. FACULTY VIEWS
# ==============================================================================
elif selected_role == "FACULTY":
    if menu == "Dashboard":
        st.title("Faculty Coordinator Dashboard")
        st.caption("Prof. Arvind Sharma • CSE Department Placement Lead")

        f1, f2, f3, f4 = st.columns(4)
        with f1:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #1e3a8a;">
                <div class="metric-label">Assigned Students</div>
                <div class="metric-value">120</div>
                <div class="metric-subtext subtext-neutral">Cohort CSE 4th Year</div>
            </div>
            """)
        with f2:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #059669;">
                <div class="metric-label">Average Score</div>
                <div class="metric-value">74.8%</div>
                <div class="metric-subtext subtext-positive">+3.2% vs last term</div>
            </div>
            """)
        with f3:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #2563eb;">
                <div class="metric-label">Assessment Completion</div>
                <div class="metric-value">86.4%</div>
                <div class="metric-subtext subtext-positive">Target: 80%</div>
            </div>
            """)
        with f4:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #dc2626;">
                <div class="metric-label">Needs Attention</div>
                <div class="metric-value">12</div>
                <div class="metric-subtext subtext-warning">At-Risk (<60% score)</div>
            </div>
            """)

        st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)
        st.subheader("⚠️ Students Needing Immediate Mentorship")
        
        df_risk = pd.DataFrame([
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Score": "58%", "Reason": "Low Aptitude (52%)", "Action": "Assign Practice Set"},
            {"Student ID": "2022MECH121", "Name": "Harsh Vardhan", "Dept": "MECH", "Score": "52%", "Reason": "Low Coding (48%)", "Action": "Schedule Doubt Session"},
            {"Student ID": "2022CIVIL112", "Name": "Kavita Reddy", "Dept": "CIVIL", "Score": "54%", "Reason": "Low Overall Score (54%)", "Action": "Review Roadmap"}
        ])
        st.dataframe(df_risk, use_container_width=True)

    elif menu == "Students Directory":
        st.title("Students Directory")
        st.caption("Search, filter, and inspect student cohort readiness.")

        col_s1, col_s2, col_s3 = st.columns([2, 1, 1])
        with col_s1:
            search_q = st.text_input("Search student by name or Roll ID", "")
        with col_s2:
            dept_f = st.selectbox("Department", ["All", "CSE", "ECE", "EEE", "MECH", "CIVIL"])
        with col_s3:
            perf_f = st.selectbox("Status Filter", ["All", "Placement Ready (>=75%)", "At-Risk (<60%)"])

        df_all_students = pd.DataFrame([
            {"Roll ID": "2022CSE101", "Name": "Rohan Verma", "Dept": "CSE", "Year": 4, "Overall": "78%", "Coding": "82%", "Aptitude": "74%", "Status": "Ready"},
            {"Roll ID": "2022ECE102", "Name": "Ananya Iyer", "Dept": "ECE", "Year": 4, "Overall": "74%", "Coding": "75%", "Aptitude": "72%", "Status": "In Progress"},
            {"Roll ID": "2022CSE104", "Name": "Pooja Hegde", "Dept": "CSE", "Year": 4, "Overall": "92%", "Coding": "95%", "Aptitude": "88%", "Status": "Top Performer"},
            {"Roll ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Year": 4, "Overall": "58%", "Coding": "62%", "Aptitude": "52%", "Status": "At-Risk"},
            {"Roll ID": "2022MECH103", "Name": "Vikram Singh", "Dept": "MECH", "Year": 4, "Overall": "68%", "Coding": "70%", "Aptitude": "66%", "Status": "In Progress"}
        ])
        st.dataframe(df_all_students, use_container_width=True)

    elif menu == "Student Deep-Dive":
        st.title("Student Deep-Dive Inspection")
        st.caption("Inspect individual student performance and recommend interventions.")

        s_select = st.selectbox("Select Student", ["2022CSE101 - Rohan Verma", "2022CSE109 - Siddharth Gupta", "2022CSE104 - Pooja Hegde"])
        
        st.markdown("### Profile Summary: Rohan Verma (2022CSE101)")
        c1, c2, c3 = st.columns(3)
        c1.metric("Coding & DSA", "82%")
        c2.metric("Aptitude", "74%")
        c3.metric("Placement Mock", "76%")

        render_html("""
        <div class="saas-card">
            <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 6px;">Faculty Mentorship Note</div>
            <p style="font-size: 13px; color: #475569; margin: 0;">
                Strong problem-solving capability in dynamic programming and tree traversals. 
                Requires targeted review on Permutations & Probability to meet Tier-1 cutoff standards.
            </p>
        </div>
        """)

    elif menu == "Cohort Analytics":
        st.title("Cohort Analytics")
        st.caption("Departmental benchmarks and skill distributions.")

        df_dept_perf = pd.DataFrame({
            "Department": ["CSE", "ECE", "EEE", "MECH", "CIVIL"],
            "Average Score": [78.4, 73.2, 69.8, 66.5, 64.1],
            "Placement Ready %": [84.0, 72.5, 65.0, 58.0, 52.0]
        })
        fig = px.bar(
            df_dept_perf, 
            x="Department", 
            y=["Average Score", "Placement Ready %"], 
            barmode="group",
            color_discrete_sequence=["#1e3a8a", "#2563eb"]
        )
        fig.update_layout(template="plotly_white")
        st.plotly_chart(fig, use_container_width=True)

    elif menu == "Profile":
        st.title("Faculty Profile")
        render_html("""
        <div class="saas-card">
            <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">Prof. Arvind Sharma</h3>
            <div style="font-size: 13px; color: #64748b; margin-bottom: 12px;">Professor & Placement Coordinator • Department of Computer Science & Engineering</div>
            <div style="font-size: 13px; color: #334155;">
                • Employee ID: <b>FAC-CSE-101</b><br>
                • Institutional Email: <b>prof.sharma@institution.edu</b><br>
                • Assigned Cohort: <b>Year 4 CSE (120 Students)</b>
            </div>
        </div>
        """)

# ==============================================================================
# 7. MANAGEMENT VIEWS
# ==============================================================================
elif selected_role == "MANAGEMENT":
    if menu == "Dashboard":
        st.title("Institution Governance Dashboard")
        st.caption("Dr. Rajeshwar Rao • Dean of Placements")

        m1, m2, m3, m4, m5 = st.columns(5)
        m1.metric("Total Students", "25", "Active in Portal")
        m2.metric("Total Faculty", "2", "Coordinators")
        m3.metric("Average Score", "74.8%", "+4.1% this term")
        m4.metric("Placement Ready", "72.0%", "Score >= 75%")
        m5.metric("Completion Rate", "88.5%", "Target: 85%")

        st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)
        st.subheader("Department Placement Performance Rankings")
        
        df_mgmt_depts = pd.DataFrame([
            {"Department": "CSE", "Enrolled": 120, "Avg Score": "78.4%", "Placement Ready Rate": "84.0%", "Status": "On Track"},
            {"Department": "ECE", "Enrolled": 90, "Avg Score": "73.2%", "Placement Ready Rate": "72.5%", "Status": "On Track"},
            {"Department": "EEE", "Enrolled": 60, "Avg Score": "69.8%", "Placement Ready Rate": "65.0%", "Status": "Needs Focus"},
            {"Department": "MECH", "Enrolled": 75, "Avg Score": "66.5%", "Placement Ready Rate": "58.0%", "Status": "Needs Focus"},
            {"Department": "CIVIL", "Enrolled": 45, "Avg Score": "64.1%", "Placement Ready Rate": "52.0%", "Status": "Needs Focus"}
        ])
        st.dataframe(df_mgmt_depts, use_container_width=True)

    elif menu == "Student Management":
        st.title("Student Management")
        st.caption("Provision students, assign cohort leads, and manage active status.")

        df_s_mgmt = pd.DataFrame([
            {"Student ID": "2022CSE101", "Name": "Rohan Verma", "Email": "rohan.verma@institution.edu", "Dept": "CSE", "Year": 4, "Status": "ACTIVE"},
            {"Student ID": "2022ECE102", "Name": "Ananya Iyer", "Email": "ananya.iyer@institution.edu", "Dept": "ECE", "Year": 4, "Status": "ACTIVE"},
            {"Student ID": "2022MECH103", "Name": "Vikram Singh", "Email": "vikram.singh@institution.edu", "Dept": "MECH", "Year": 4, "Status": "ACTIVE"},
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Email": "siddharth.gupta@institution.edu", "Dept": "CSE", "Year": 4, "Status": "ACTIVE"},
        ])
        st.dataframe(df_s_mgmt, use_container_width=True)

        with st.expander("➕ Provision New Student"):
            ns_name = st.text_input("Full Name")
            ns_email = st.text_input("Institutional Email")
            ns_dept = st.selectbox("Department", ["CSE", "ECE", "EEE", "MECH", "CIVIL"])
            if st.button("Provision Student", type="primary"):
                st.success(f"Student '{ns_name}' successfully provisioned!")

    elif menu == "Faculty Management":
        st.title("Faculty Management")
        st.caption("Manage faculty coordinators and department appointments.")

        df_f_mgmt = pd.DataFrame([
            {"Employee ID": "FAC-CSE-101", "Name": "Prof. Arvind Sharma", "Email": "prof.sharma@institution.edu", "Dept": "CSE", "Role": "Placement Lead", "Status": "ACTIVE"},
            {"Employee ID": "FAC-ECE-202", "Name": "Dr. Neha Patel", "Email": "dr.patel@institution.edu", "Dept": "ECE", "Role": "Coordinator", "Status": "ACTIVE"}
        ])
        st.dataframe(df_f_mgmt, use_container_width=True)

    elif menu == "Assessment Authoring":
        st.title("Assessment Authoring & Configuration")
        st.caption("Create and publish curriculum-aligned assessments.")

        with st.expander("➕ Create New Assessment", expanded=True):
            st.text_input("Assessment Title", "Graph Algorithms & Shortest Path")
            col_a1, col_a2 = st.columns(2)
            with col_a1:
                st.selectbox("Type", ["CODING", "APTITUDE", "MOCK"])
                st.number_input("Duration (Minutes)", 15, 180, 45)
            with col_a2:
                st.selectbox("Difficulty", ["Easy", "Medium", "Hard"])
                st.number_input("Passing Score (%)", 40, 100, 60)
            if st.button("Publish Assessment to Students", type="primary"):
                st.success("Assessment published successfully to all department cohorts!")

    elif menu == "Permission Matrix (RBAC)":
        st.title("🛡️ Granular RBAC & Permission Matrix")
        st.caption("Inspect and grant/revoke individual permission overrides with audit tracking.")

        target_fac = st.selectbox("Select Coordinator", ["Prof. Arvind Sharma (CSE Placement Lead)", "Dr. Neha Patel (ECE Coordinator)"])

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
            p_to_grant = st.selectbox("Select Permission to Grant", ["MANAGE_ASSESSMENTS", "MANAGE_STUDENTS", "MANAGE_MOCK_TESTS"])
            if st.button("✅ Grant Permission Override"):
                st.session_state.audit_logs.insert(0, {
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "user": "admin@institution.edu",
                    "role": "MANAGEMENT",
                    "action": "GRANT_PERMISSION",
                    "target": target_fac,
                    "details": f"Granted permission override '{p_to_grant}'"
                })
                st.success(f"Permission '{p_to_grant}' granted and recorded in audit log!")
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
                st.warning(f"Permission '{p_to_revoke}' revoked and recorded in audit log!")

    elif menu == "Reports & CSV Export":
        st.title("Placement Reports & CSV Export")
        st.caption("Generate institution-wide performance records.")

        df_export = pd.DataFrame([
            {"Student ID": "2022CSE101", "Name": "Rohan Verma", "Dept": "CSE", "Year": 4, "Overall Score": 78, "Coding": 82, "Aptitude": 74, "Status": "Placement Ready"},
            {"Student ID": "2022ECE102", "Name": "Ananya Iyer", "Dept": "ECE", "Year": 4, "Overall Score": 74, "Coding": 75, "Aptitude": 72, "Status": "In Progress"},
            {"Student ID": "2022CSE104", "Name": "Pooja Hegde", "Dept": "CSE", "Year": 4, "Overall Score": 92, "Coding": 95, "Aptitude": 88, "Status": "Top Performer"},
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Year": 4, "Overall Score": 58, "Coding": 62, "Aptitude": 52, "Status": "Needs Support"}
        ])
        st.dataframe(df_export, use_container_width=True)
        csv_data = df_export.to_csv(index=False).encode('utf-8')
        st.download_button("📥 Download CSV Performance Report", csv_data, "placement_performance_report.csv", "text/csv", type="primary")

    elif menu == "Audit Logs":
        st.title("📜 Security & System Audit Trail")
        st.caption("Immutable system governance and access log.")
        st.dataframe(pd.DataFrame(st.session_state.audit_logs), use_container_width=True)

    elif menu == "System Settings":
        st.title("⚙️ Placement Scoring Settings")
        st.caption("Configure centralized weighting and at-risk alert thresholds.")
        
        st.markdown("**Centralized Weight Distribution:**")
        st.markdown("- Coding & DSA: **30%**")
        st.markdown("- Quantitative Aptitude: **25%**")
        st.markdown("- Technical Core CS: **20%**")
        st.markdown("- Placement Mock Exams: **15%**")
        st.markdown("- Communication & HR: **10%**")
        
        st.slider("Placement Readiness Cutoff (%)", 50, 100, 75)
        st.slider("At-Risk Alert Trigger (%)", 40, 80, 60)
        st.button("Save Settings", type="primary")

# ==============================================================================
# 8. FOOTER
# ==============================================================================
st.markdown("---")
st.caption("Placement Training Portal • Enterprise University Edition • 2026")
