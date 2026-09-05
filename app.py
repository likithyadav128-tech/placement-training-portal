import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
import time
from datetime import datetime

# Configure Page
st.set_page_config(
    page_title="Robotech • Placement Training Portal",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (Pastel Lavender Glassmorphic Aesthetic matching screenshot)
st.markdown("""
<style>
    /* Global Styles */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    .stApp {
        background-color: #ECE7F6;
        background-image: 
            radial-gradient(circle at 10% 10%, rgba(254, 215, 170, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(216, 180, 254, 0.35) 0%, transparent 45%);
    }

    /* Card Containers */
    .soft-card {
        background: #ffffff;
        border-radius: 1.5rem;
        padding: 1.25rem;
        box-shadow: 0 4px 20px -2px rgba(124, 58, 237, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(241, 245, 249, 0.9);
        margin-bottom: 1.25rem;
    }

    .hero-banner {
        background: linear-gradient(135deg, #8E7CC3 0%, #7B69B3 50%, #6856A1 100%);
        border-radius: 1.5rem;
        padding: 1.5rem;
        color: #ffffff;
        position: relative;
        overflow: hidden;
        margin-bottom: 1.25rem;
        box-shadow: 0 10px 25px -3px rgba(124, 58, 237, 0.2);
    }

    .hero-btn {
        background: #ffffff;
        color: #1e293b;
        font-weight: 700;
        font-size: 0.8rem;
        padding: 0.5rem 1.1rem;
        border-radius: 9999px;
        display: inline-block;
        text-decoration: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        margin-top: 0.5rem;
    }

    .hero-btn:hover {
        background: #f8fafc;
        color: #0f172a;
    }

    .metric-badge-pink {
        background: #fff1f2;
        color: #f43f5e;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 6px;
    }

    .sidebar .sidebar-content {
        background-color: #ffffff;
    }

    /* Section Headings */
    .widget-title {
        font-weight: 800;
        font-size: 0.95rem;
        color: #1e293b;
        margin-bottom: 0.75rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .widget-link {
        font-size: 0.75rem;
        font-weight: 700;
        color: #94a3b8;
        text-decoration: none;
    }

    .widget-link:hover {
        color: #7c3aed;
    }

    .teacher-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.4rem 0;
        border-bottom: 1px solid #f8fafc;
    }

    .teacher-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 10px;
    }

    .calendar-capsule {
        background: #ede9fe;
        color: #5b21b6;
        font-weight: 700;
        border-radius: 12px;
        padding: 4px;
        text-align: center;
    }
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
        "rating": 8.5
    }
if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"timestamp": "2026-09-05 10:30:15", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "INITIALIZE_SYSTEM", "target": "SYSTEM #1", "details": "Initialized portal configuration"},
        {"timestamp": "2026-09-05 11:15:22", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "CREATE_ASSESSMENT", "target": "ASSESSMENT #1", "details": "Published DSA Core Assessment"},
        {"timestamp": "2026-09-05 11:45:00", "user": "admin@institution.edu", "role": "MANAGEMENT", "action": "GRANT_PERMISSION", "target": "USER #2", "details": "Granted MANAGE_ASSESSMENTS override to Faculty"}
    ]

# Sidebar - Matching Screenshot Layout
with st.sidebar:
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
        <div style="width: 36px; height: 36px; background: #7c3aed; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 18px;">
            ✦
        </div>
        <div style="font-weight: 900; font-size: 20px; color: #1e1b4b; letter-spacing: -0.5px;">
            Robotech
        </div>
    </div>
    """, unsafe_allow_html=True)

    selected_role = st.selectbox(
        "Active Role Mode",
        ["STUDENT", "FACULTY", "MANAGEMENT"],
        index=["STUDENT", "FACULTY", "MANAGEMENT"].index(st.session_state.user_role)
    )
    st.session_state.user_role = selected_role

    st.markdown("<hr style='margin: 15px 0; border: none; border-top: 1px solid #f1f5f9;'>", unsafe_allow_html=True)
    
    if selected_role == "STUDENT":
        menu = st.radio("Navigation", [
            "Dashboard", "My Schedule", "Message", "Projects & Assessments", 
            "Grades & Performance", "Live Coding IDE", "Mock Tests", "Profile"
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

    st.markdown("<hr style='margin: 15px 0; border: none; border-top: 1px solid #f1f5f9;'>", unsafe_allow_html=True)
    
    st.markdown("""
    <div style="padding: 10px 0; font-size: 12px; color: #64748b;">
        <div style="margin-bottom: 6px;">⚙️ <b>Settings</b></div>
        <div style="margin-bottom: 6px;">💬 <b>Support</b></div>
    </div>
    """, unsafe_allow_html=True)
    
    if st.button("🚪 Sign Out", use_container_width=True):
        st.session_state.user_role = "STUDENT"
        st.rerun()

# ==========================================
# STUDENT ROLE VIEWS
# ==========================================
if selected_role == "STUDENT":
    # Top Header Bar matching screenshot
    col_h_left, col_h_mid, col_h_right = st.columns([4, 4, 4])
    with col_h_left:
        st.markdown("""
        <div>
            <h1 style="font-size: 26px; font-weight: 900; color: #1e1b4b; margin: 0; line-height: 1.1;">Hello, Anna!</h1>
            <p style="font-size: 13px; color: #94a3b8; margin: 2px 0 0 0; font-weight: 500;">Have a good day!</p>
        </div>
        """, unsafe_allow_html=True)
    with col_h_mid:
        st.markdown("""
        <div style="background: white; border-radius: 9999px; padding: 8px 18px; border: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; display: flex; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            🔍 Search assessments, roadmaps, mentors...
        </div>
        """, unsafe_allow_html=True)
    with col_h_right:
        st.markdown("""
        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
            <div style="background: white; padding: 4px 12px 4px 6px; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 8px;">
                <div style="width: 30px; height: 30px; background: #fbbf24; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; color: #78350f;">
                    AA
                </div>
                <div style="text-align: left; line-height: 1.1;">
                    <div style="font-weight: 800; font-size: 12px; color: #1e1b4b;">Anna Alekseeva</div>
                    <div style="font-size: 10px; color: #94a3b8;">Pupil</div>
                </div>
            </div>
            <div style="width: 38px; height: 38px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 14px;">
                🔔
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<div style='height: 15px;'></div>", unsafe_allow_html=True)

    if menu == "Dashboard":
        # 3-Column Layout matching screenshot
        col1, col2, col3 = st.columns([5, 3.5, 3.5])

        # -------------------------------------------------------------
        # COLUMN 1: Left (Hero Banner, Line Chart, Rating & Hours)
        # -------------------------------------------------------------
        with col1:
            # 1. Hero Banner Card
            st.markdown("""
            <div class="hero-banner">
                <div style="max-width: 60%;">
                    <div style="font-size: 11px; font-weight: 700; color: #e9d5ff; text-transform: uppercase; letter-spacing: 0.5px;">Masterclass</div>
                    <h3 style="font-size: 18px; font-weight: 900; margin: 6px 0 4px 0; line-height: 1.2;">Online lesson with Web designer</h3>
                    <div style="font-size: 12px; color: #f3e8ff; margin-bottom: 12px;">19.02.2025</div>
                    <a href="#" class="hero-btn">Register now →</a>
                </div>
                <div style="position: absolute; right: 15px; bottom: 10px; font-size: 55px; opacity: 0.9;">
                    💡👨‍💻
                </div>
            </div>
            """, unsafe_allow_html=True)

            # 2. Progress Trajectory Line Chart
            st.markdown("""
            <div class="soft-card">
                <div class="widget-title">
                    <span style="font-weight: 800; color: #1e293b;">Progress <span style="font-size: 11px; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 10px;">• 2025 ▼</span></span>
                    <span style="color: #94a3b8;">•••</span>
                </div>
            """, unsafe_allow_html=True)

            months = ["August", "September", "October", "November", "December", "January"]
            values = [8.0, 12.5, 18.0, 14.2, 19.5, 24.8]

            fig_prog = go.Figure()
            fig_prog.add_trace(go.Scatter(
                x=months,
                y=values,
                mode="lines+markers",
                line=dict(color="#06b6d4", width=3, shape="spline"),
                marker=dict(size=6, color="#06b6d4"),
                fill="tozeroy",
                fillcolor="rgba(6, 182, 212, 0.12)"
            ))
            fig_prog.update_layout(
                margin=dict(l=20, r=20, t=10, b=20),
                height=180,
                xaxis=dict(showgrid=False, color="#94a3b8", tickfont=dict(size=10)),
                yaxis=dict(showgrid=True, gridcolor="#f1f5f9", range=[0, 26], color="#94a3b8", tickfont=dict(size=9)),
                plot_bgcolor="rgba(0,0,0,0)",
                paper_bgcolor="rgba(0,0,0,0)"
            )
            st.plotly_chart(fig_prog, use_container_width=True, config={"displayModeBar": False})
            st.markdown("</div>", unsafe_allow_html=True)

            # 3. Dual Mini Cards (Rating & Learning Hours)
            m_col1, m_col2 = st.columns(2)
            with m_col1:
                st.markdown("""
                <div class="soft-card">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 12px; font-weight: 800; color: #1e293b;">Rating</span>
                        <span style="font-size: 9px; color: #94a3b8;">from teachers</span>
                    </div>
                    <div style="display: flex; align-items: baseline; gap: 8px; margin: 8px 0 4px 0;">
                        <span style="font-size: 26px; font-weight: 900; color: #0f172a;">8,5</span>
                        <span class="metric-badge-pink">+15% vs last week</span>
                    </div>
                """, unsafe_allow_html=True)

                fig_spark = go.Figure(go.Scatter(
                    x=[1, 2, 3, 4, 5, 6, 7],
                    y=[2, 4, 3, 7, 5, 8, 9],
                    mode="lines",
                    line=dict(color="#f43f5e", width=2.5, shape="spline"),
                    fill="tozeroy",
                    fillcolor="rgba(244, 63, 94, 0.15)"
                ))
                fig_spark.update_layout(
                    margin=dict(l=0, r=0, t=0, b=0),
                    height=50,
                    xaxis=dict(visible=False),
                    yaxis=dict(visible=False),
                    plot_bgcolor="rgba(0,0,0,0)",
                    paper_bgcolor="rgba(0,0,0,0)"
                )
                st.plotly_chart(fig_spark, use_container_width=True, config={"displayModeBar": False})
                st.markdown("</div>", unsafe_allow_html=True)

            with m_col2:
                st.markdown("""
                <div class="soft-card">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 12px; font-weight: 800; color: #1e293b;">Learning hours</span>
                        <span style="font-size: 9px; color: #94a3b8;">this week ▼</span>
                    </div>
                """, unsafe_allow_html=True)

                days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
                hours = [1.2, 1.8, 2.2, 1.5, 2.5, 0.8, 1.1]
                colors = ["#cffafe", "#cffafe", "#cffafe", "#cffafe", "#06b6d4", "#cffafe", "#cffafe"]

                fig_bar = go.Figure(go.Bar(
                    x=days,
                    y=hours,
                    marker=dict(color=colors, cornerradius=4),
                ))
                fig_bar.update_layout(
                    margin=dict(l=0, r=0, t=10, b=0),
                    height=90,
                    xaxis=dict(showgrid=False, tickfont=dict(size=9)),
                    yaxis=dict(visible=False),
                    plot_bgcolor="rgba(0,0,0,0)",
                    paper_bgcolor="rgba(0,0,0,0)"
                )
                st.plotly_chart(fig_bar, use_container_width=True, config={"displayModeBar": False})
                st.markdown("</div>", unsafe_allow_html=True)

        # -------------------------------------------------------------
        # COLUMN 2: Center (Days Report Gauge, Teachers, Homework)
        # -------------------------------------------------------------
        with col2:
            # 1. Days Report Radial Gauge
            st.markdown("""
            <div class="soft-card">
                <div class="widget-title">
                    <span>Days report <span style="font-size: 10px; font-weight: 600; color: #94a3b8;">Month ▼</span></span>
                    <span style="color: #94a3b8;">•••</span>
                </div>
            """, unsafe_allow_html=True)

            fig_gauge = go.Figure(go.Indicator(
                mode="gauge+number",
                value=65,
                number=dict(suffix="%", font=dict(size=26, family="Plus Jakarta Sans", color="#1e1b4b")),
                gauge=dict(
                    axis=dict(range=[0, 100], visible=False),
                    bar=dict(color="#06b6d4", thickness=0.8),
                    bgcolor="#f1f5f9",
                    shape="angular"
                )
            ))
            fig_gauge.update_layout(
                margin=dict(l=10, r=10, t=10, b=0),
                height=110,
                paper_bgcolor="rgba(0,0,0,0)"
            )
            st.plotly_chart(fig_gauge, use_container_width=True, config={"displayModeBar": False})
            st.markdown("""
                <div style="display: flex; justify-content: center; gap: 15px; font-size: 10px; font-weight: 700; color: #64748b;">
                    <span><span style="color: #06b6d4;">●</span> Done</span>
                    <span><span style="color: #cbd5e1;">●</span> Progress</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

            # 2. Teachers / Mentors Card
            st.markdown("""
            <div class="soft-card">
                <div class="widget-title">
                    <span>Teachers</span>
                    <a href="#" class="widget-link">see all</a>
                </div>
                <div class="teacher-row">
                    <div style="display: flex; align-items: center;">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces" class="teacher-avatar" />
                        <div>
                            <div style="font-weight: 800; font-size: 11px; color: #1e293b;">Olga Potapova</div>
                            <div style="font-size: 9px; color: #94a3b8;">DSA & Algorithms</div>
                        </div>
                    </div>
                    <span style="font-size: 12px; color: #94a3b8; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px 6px;">✉️</span>
                </div>
                <div class="teacher-row">
                    <div style="display: flex; align-items: center;">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces" class="teacher-avatar" />
                        <div>
                            <div style="font-weight: 800; font-size: 11px; color: #1e293b;">Sviatosav Kush</div>
                            <div style="font-size: 9px; color: #94a3b8;">System Design</div>
                        </div>
                    </div>
                    <span style="font-size: 12px; color: #94a3b8; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px 6px;">✉️</span>
                </div>
                <div class="teacher-row">
                    <div style="display: flex; align-items: center;">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces" class="teacher-avatar" />
                        <div>
                            <div style="font-weight: 800; font-size: 11px; color: #1e293b;">John Daniell</div>
                            <div style="font-size: 9px; color: #94a3b8;">Quantitative Aptitude</div>
                        </div>
                    </div>
                    <span style="font-size: 12px; color: #94a3b8; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px 6px;">✉️</span>
                </div>
                <div class="teacher-row">
                    <div style="display: flex; align-items: center;">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces" class="teacher-avatar" />
                        <div>
                            <div style="font-weight: 800; font-size: 11px; color: #1e293b;">Irina Silviska</div>
                            <div style="font-size: 9px; color: #94a3b8;">Discrete Logic</div>
                        </div>
                    </div>
                    <span style="font-size: 12px; color: #94a3b8; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px 6px;">✉️</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

            # 3. Homework / Milestones Card
            st.markdown("""
            <div class="soft-card">
                <div class="widget-title">
                    <span>Homework</span>
                    <a href="#" class="widget-link">see all</a>
                </div>
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">
                        <span>Math & DSA</span>
                        <span style="color: #94a3b8; font-weight: 500;">10 tasks left</span>
                    </div>
                    <div style="background: #f1f5f9; border-radius: 999px; height: 6px; overflow: hidden;">
                        <div style="background: #f43f5e; width: 70%; height: 100%; border-radius: 999px;"></div>
                    </div>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">
                        <span>Physics & Systems</span>
                        <span style="color: #94a3b8; font-weight: 500;">04 tasks left</span>
                    </div>
                    <div style="background: #f1f5f9; border-radius: 999px; height: 6px; overflow: hidden;">
                        <div style="background: #7c3aed; width: 45%; height: 100%; border-radius: 999px;"></div>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

        # -------------------------------------------------------------
        # COLUMN 3: Right (Mini-Calendar, Today's Schedule, Events)
        # -------------------------------------------------------------
        with col3:
            # 1. Mini-Calendar Widget
            st.markdown("""
            <div class="soft-card">
                <div class="widget-title">
                    <span>January 2025</span>
                    <span style="color: #94a3b8; font-size: 11px;">⟨ ⟩</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 9px; font-weight: 800; color: #94a3b8; margin-bottom: 6px;">
                    <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 11px; font-weight: 700; color: #64748b; align-items: center;">
                    <div>16</div>
                    <div>17</div>
                    <div class="calendar-capsule">18</div>
                    <div class="calendar-capsule">19</div>
                    <div class="calendar-capsule">20</div>
                    <div class="calendar-capsule">21</div>
                    <div class="calendar-capsule">22</div>
                </div>

                <hr style="margin: 12px 0; border: none; border-top: 1px solid #f1f5f9;">

                <div class="widget-title" style="margin-bottom: 6px;">
                    <span style="font-size: 11px;">Today</span>
                    <a href="#" class="widget-link" style="font-size: 10px;">see all</a>
                </div>
                <div style="font-size: 11px; margin-bottom: 6px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 700; color: #1e293b;">📘 Book club & DSA</span>
                        <span style="color: #94a3b8; font-size: 10px;">11:00 - 12:30</span>
                    </div>
                </div>
                <div style="font-size: 11px; margin-bottom: 6px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 700; color: #1e293b;">⚛️ Physics & Systems</span>
                        <span style="color: #94a3b8; font-size: 10px;">14:30 - 15:30</span>
                    </div>
                </div>

                <div style="font-size: 10px; font-weight: 700; color: #94a3b8; margin: 8px 0 4px 0;">Tomorrow</div>
                <div style="font-size: 11px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="font-weight: 700; color: #1e293b;">💻 C++ Speed Test</span>
                        <span style="color: #94a3b8; font-size: 10px;">11:00 - 12:30</span>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)

            # 2. Events Card
            st.markdown("""
            <div class="soft-card">
                <div class="widget-title">
                    <span>Events</span>
                    <a href="#" class="widget-link">see all</a>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div>
                        <div style="font-weight: 800; font-size: 11px; color: #1e293b;">Robot Fest: Drive</div>
                        <div style="font-size: 9px; color: #94a3b8;">Friday, 24th January 11:30 PM</div>
                    </div>
                    <span style="font-size: 12px; color: #94a3b8;">🔄</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div>
                        <div style="font-weight: 800; font-size: 11px; color: #1e293b;">News: Webinar</div>
                        <div style="font-size: 9px; color: #94a3b8;">Monday, 10th January 02:00 PM</div>
                    </div>
                    <span style="font-size: 12px; color: #94a3b8;">📻</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-weight: 800; font-size: 11px; color: #1e293b;">English club: HR</div>
                        <div style="font-size: 9px; color: #94a3b8;">Tuesday, 18th January 11:30 PM</div>
                    </div>
                    <span style="font-size: 12px; color: #94a3b8;">🎙️</span>
                </div>
            </div>
            """, unsafe_allow_html=True)

    elif menu == "My Schedule" or menu == "Mock Tests":
        st.subheader("📅 Schedule & Placement Mock Tests")
        st.markdown("""
        <div class="soft-card">
            <div style="font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 8px;">Placement Tier-1 Simulation Schedule</div>
            <p style="font-size: 12px; color: #64748b;">Upcoming institutional simulation exams designed to assess full-stack coding, quantitative aptitude, and system design readiness.</p>
        </div>
        """, unsafe_allow_html=True)
        st.button("Start Full Placement Mock Simulation", type="primary")

    elif menu == "Projects & Assessments":
        st.subheader("💻 Assessments Catalog")
        a1, a2, a3 = st.columns(3)
        with a1:
            st.markdown("""
            <div class="soft-card">
                <div style="font-weight: 800; font-size: 14px; color: #1e293b;">DSA Core Assessment</div>
                <div style="font-size: 11px; color: #94a3b8; margin: 4px 0 8px 0;">Medium • 45 Mins • Arrays & Hash Maps</div>
                <span class="metric-badge-pink">Score: 85% (Passed)</span>
            </div>
            """, unsafe_allow_html=True)
        with a2:
            st.markdown("""
            <div class="soft-card">
                <div style="font-weight: 800; font-size: 14px; color: #1e293b;">Quantitative Speed Test</div>
                <div style="font-size: 11px; color: #94a3b8; margin: 4px 0 8px 0;">Easy • 30 Mins • Speed Math & Logic</div>
                <span class="metric-badge-pink">Score: 74% (Passed)</span>
            </div>
            """, unsafe_allow_html=True)
        with a3:
            st.markdown("""
            <div class="soft-card">
                <div style="font-weight: 800; font-size: 14px; color: #1e293b;">Placement Mock 2026</div>
                <div style="font-size: 11px; color: #94a3b8; margin: 4px 0 8px 0;">Hard • 60 Mins • Full-Length Simulation</div>
                <span class="metric-badge-pink">Score: 76% (Passed)</span>
            </div>
            """, unsafe_allow_html=True)

    elif menu == "Live Coding IDE":
        st.subheader("💻 Sandboxed Coding Assessment IDE")
        col_desc, col_editor = st.columns([1, 1])
        with col_desc:
            st.markdown("""
            <div class="soft-card">
                <div style="font-weight: 800; font-size: 14px; color: #1e293b;">Problem: Reverse Array In-Place</div>
                <p style="font-size: 12px; color: #64748b; margin-top: 6px;">Given an array of integers <code>arr</code>, write a function to reverse the array in-place without using extra memory.</p>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 10px;">
                    <b>Example:</b> Input: [1, 2, 3, 4, 5] → Output: [5, 4, 3, 2, 1]
                </div>
            </div>
            """, unsafe_allow_html=True)
        with col_editor:
            lang = st.selectbox("Language", ["Python 3", "JavaScript", "C++ 17", "Java 17"])
            starter = "def reverse_array(arr: list[int]) -> list[int]:\n    # Write your solution here\n    return arr[::-1]\n"
            code = st.text_area("Code Editor", starter, height=180)
            if st.button("▶️ Run & Evaluate Test Cases", type="primary"):
                with st.spinner("Executing in sandboxed container..."):
                    time.sleep(0.4)
                    st.success("✅ All 3 Test Cases Passed! Runtime: 38.2 ms | Memory: 14.2 MB")

    elif menu == "Grades & Performance" or menu == "Message":
        st.subheader("📊 Performance Trajectory & Mentorship")
        df_trend = pd.DataFrame({
            "Month": ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
            "Overall Score": [68, 71, 74, 76, 78, 85],
            "Coding Score": [70, 74, 78, 80, 82, 88]
        })
        fig = px.line(df_trend, x="Month", y=["Overall Score", "Coding Score"], markers=True, title="Performance Benchmark")
        fig.update_layout(template="plotly_white")
        st.plotly_chart(fig, use_container_width=True)

    elif menu == "Profile":
        st.subheader("👤 Student Profile")
        st.markdown("""
        <div class="soft-card">
            <div style="font-weight: 800; font-size: 16px; color: #1e293b;">Anna Alekseeva</div>
            <div style="font-size: 12px; color: #64748b; margin: 4px 0 12px 0;">anna.alekseeva@institution.edu • Roll: 2022CSE101</div>
            <div style="font-size: 12px; color: #1e1b4b;">
                Department: Computer Science & Engineering (Year 4)<br>
                CGPA: 8.9 / 10.0 • Placement Readiness: <b>85%</b>
            </div>
        </div>
        """, unsafe_allow_html=True)

# ==========================================
# FACULTY ROLE VIEWS
# ==========================================
elif selected_role == "FACULTY":
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

# ==========================================
# MANAGEMENT ROLE VIEWS
# ==========================================
elif selected_role == "MANAGEMENT":
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

st.markdown("<div style='height: 30px;'></div>", unsafe_allow_html=True)
st.caption("Robotech • Placement Training Portal • University Edition")
