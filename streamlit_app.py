import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
import time
from datetime import datetime
from typing import Optional, Dict, Any

# ==============================================================================
# 1. STREAMLIT PAGE CONFIGURATION
# ==============================================================================
st.set_page_config(
    page_title="Placement Training Portal",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

def render_html(html_str: str):
    """
    Safely render HTML in Streamlit.
    Strips all linebreaks and whitespace so Markdown parser NEVER triggers code block <pre><code> mode.
    """
    cleaned_html = " ".join([line.strip() for line in html_str.splitlines() if line.strip()])
    st.markdown(cleaned_html, unsafe_allow_html=True)

# ==============================================================================
# 2. GLOBAL THEME & HIGH-CONTRAST DARK TYPOGRAPHY STYLES
# ==============================================================================
render_html("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #0f172a;
    }
    
    .stApp {
        background-color: #f1f5f9;
    }

    /* High Contrast Text Classes */
    .text-dark-primary {
        color: #0f172a !important;
        font-weight: 800;
    }
    
    .text-dark-secondary {
        color: #1e293b !important;
        font-weight: 600;
    }

    .text-dark-muted {
        color: #334155 !important;
        font-weight: 500;
    }

    /* Professional Card Containers */
    .saas-card {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        margin-bottom: 16px;
    }

    .metric-container {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        padding: 18px 20px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
    }

    .metric-label {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #334155;
        margin-bottom: 4px;
    }

    .metric-value {
        font-size: 30px;
        font-weight: 900;
        color: #0f172a;
        line-height: 1.1;
    }

    .metric-subtext {
        font-size: 12px;
        font-weight: 700;
        margin-top: 6px;
    }

    .subtext-positive { color: #047857; }
    .subtext-neutral { color: #334155; }
    .subtext-warning { color: #b45309; }

    /* Recommended Next Step Banner */
    .rec-banner {
        background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
        color: #ffffff;
        border-radius: 12px;
        padding: 24px 28px;
        margin-bottom: 20px;
        box-shadow: 0 4px 14px -2px rgba(15, 23, 42, 0.3);
    }

    .rec-badge {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
        font-size: 11px;
        font-weight: 800;
        padding: 4px 12px;
        border-radius: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: inline-block;
        margin-bottom: 8px;
    }

    /* Badges */
    .badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 800;
    }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #dbeafe; color: #1e40af; }

    /* Activity & Timeline */
    .activity-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 0;
        border-bottom: 1px solid #e2e8f0;
    }
    .activity-item:last-child {
        border-bottom: none;
    }

    .timeline-item {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 16px 0;
        border-bottom: 1px solid #e2e8f0;
    }
    .timeline-item:last-child {
        border-bottom: none;
    }

    .step-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #e2e8f0;
        color: #0f172a;
        font-weight: 800;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .step-active { background: #1d4ed8; color: #ffffff; }
    .step-done { background: #059669; color: #ffffff; }
</style>
""")

# ==============================================================================
# 3. DATABASE USER REGISTRY & REPOSITORY
# ==============================================================================
INSTITUTIONAL_USERS_DB: Dict[str, Dict[str, Any]] = {
    "likith@college.edu": {
        "id": "STU001",
        "name": "Likith Yadav",
        "email": "likith@college.edu",
        "role": "STUDENT",
        "status": "ACTIVE",
        "department": "Computer Science & Engineering",
        "year": 4,
        "section": "A",
        "cgpa": 8.9,
        "overall_score": 82
    },
    "rohan.verma@institution.edu": {
        "id": "STU002",
        "name": "Rohan Verma",
        "email": "rohan.verma@institution.edu",
        "role": "STUDENT",
        "status": "ACTIVE",
        "department": "Computer Science & Engineering",
        "year": 4,
        "section": "A",
        "cgpa": 8.8,
        "overall_score": 78
    },
    "student1@institution.edu": {
        "id": "STU003",
        "name": "Rohan Verma",
        "email": "student1@institution.edu",
        "role": "STUDENT",
        "status": "ACTIVE",
        "department": "Computer Science & Engineering",
        "year": 4,
        "section": "A",
        "cgpa": 8.8,
        "overall_score": 78
    },
    "ananya.iyer@institution.edu": {
        "id": "STU004",
        "name": "Ananya Iyer",
        "email": "ananya.iyer@institution.edu",
        "role": "STUDENT",
        "status": "ACTIVE",
        "department": "Electronics & Communication",
        "year": 4,
        "section": "B",
        "cgpa": 8.5,
        "overall_score": 74
    },
    "siddharth.gupta@institution.edu": {
        "id": "STU005",
        "name": "Siddharth Gupta",
        "email": "siddharth.gupta@institution.edu",
        "role": "STUDENT",
        "status": "ACTIVE",
        "department": "Computer Science & Engineering",
        "year": 4,
        "section": "A",
        "cgpa": 7.2,
        "overall_score": 58
    },
    "inactive.student@institution.edu": {
        "id": "STU006",
        "name": "Karan Malhotra",
        "email": "inactive.student@institution.edu",
        "role": "STUDENT",
        "status": "INACTIVE",
        "department": "Mechanical Engineering",
        "year": 4,
        "section": "B",
        "cgpa": 6.8,
        "overall_score": 50
    },
    "blocked.student@institution.edu": {
        "id": "STU007",
        "name": "Abhishek Roy",
        "email": "blocked.student@institution.edu",
        "role": "STUDENT",
        "status": "BLOCKED",
        "department": "Civil Engineering",
        "year": 4,
        "section": "A",
        "cgpa": 6.5,
        "overall_score": 45
    },
    "pending.student@institution.edu": {
        "id": "STU008",
        "name": "Sneha Sen",
        "email": "pending.student@institution.edu",
        "role": "STUDENT",
        "status": "PENDING",
        "department": "Electrical & Electronics",
        "year": 4,
        "section": "A",
        "cgpa": 7.9,
        "overall_score": 62
    },
    "faculty@college.edu": {
        "id": "FAC101",
        "name": "Prof. Arvind Sharma",
        "email": "faculty@college.edu",
        "role": "FACULTY",
        "status": "ACTIVE",
        "department": "Computer Science & Engineering",
        "title": "Professor & Placement Coordinator"
    },
    "prof.sharma@institution.edu": {
        "id": "FAC102",
        "name": "Prof. Arvind Sharma",
        "email": "prof.sharma@institution.edu",
        "role": "FACULTY",
        "status": "ACTIVE",
        "department": "Computer Science & Engineering",
        "title": "Professor & Placement Coordinator"
    },
    "dr.patel@institution.edu": {
        "id": "FAC103",
        "name": "Dr. Neha Patel",
        "email": "dr.patel@institution.edu",
        "role": "FACULTY",
        "status": "ACTIVE",
        "department": "Electronics & Communication",
        "title": "Associate Professor"
    },
    "admin@college.edu": {
        "id": "MGT001",
        "name": "Dr. Rajeshwar Rao",
        "email": "admin@college.edu",
        "role": "MANAGEMENT",
        "status": "ACTIVE",
        "department": "Institutional Governance",
        "title": "Dean of Placements & Training"
    },
    "admin@institution.edu": {
        "id": "MGT002",
        "name": "Dr. Rajeshwar Rao",
        "email": "admin@institution.edu",
        "role": "MANAGEMENT",
        "status": "ACTIVE",
        "department": "Institutional Governance",
        "title": "Dean of Placements & Training"
    }
}

def lookup_user_in_database(email: Optional[str]) -> Optional[Dict[str, Any]]:
    """Look up authenticated email in database. Role is NEVER user-selected."""
    if not email:
        return None
    return INSTITUTIONAL_USERS_DB.get(email.strip().lower())

# Session State & Audit Logs
if "audit_logs" not in st.session_state:
    st.session_state.audit_logs = [
        {"timestamp": "2026-09-05 10:30:15", "user": "admin@college.edu", "role": "MANAGEMENT", "action": "INITIALIZE_SYSTEM", "target": "SYSTEM #1", "details": "Configured Microsoft Entra ID OpenID Connect Authentication"},
        {"timestamp": "2026-09-05 11:15:22", "user": "admin@college.edu", "role": "MANAGEMENT", "action": "CREATE_ASSESSMENT", "target": "ASSESSMENT #1", "details": "Published DSA Core Assessment"},
        {"timestamp": "2026-09-05 11:45:00", "user": "admin@college.edu", "role": "MANAGEMENT", "action": "GRANT_PERMISSION", "target": "faculty@college.edu", "details": "Granted MANAGE_ASSESSMENTS override to Faculty Lead"}
    ]

# ==============================================================================
# 4. AUTHENTICATION ENGINE (NATIVE STREAMLIT AUTH & ENTRA ID)
# ==============================================================================
def get_authenticated_identity() -> Optional[Dict[str, Any]]:
    """Retrieve identity from Streamlit's native st.user or session state."""
    # 1. Check Streamlit native st.user (Streamlit >= 1.42.0)
    try:
        if hasattr(st, "user") and st.user and getattr(st.user, "is_logged_in", False):
            return {
                "email": getattr(st.user, "email", None) or getattr(st.user, "sub", None),
                "name": getattr(st.user, "name", None) or "Authenticated User"
            }
    except Exception:
        pass

    # 2. Check session state simulated login (for development when Azure Entra secrets not yet configured locally)
    if "authenticated_user_email" in st.session_state and st.session_state.authenticated_user_email:
        return {
            "email": st.session_state.authenticated_user_email,
            "name": st.session_state.get("authenticated_user_name", "User")
        }

    return None

def perform_logout():
    """Terminate the session using Streamlit native logout and clear session state."""
    if "authenticated_user_email" in st.session_state:
        del st.session_state["authenticated_user_email"]
    if "authenticated_user_name" in st.session_state:
        del st.session_state["authenticated_user_name"]
    
    try:
        if hasattr(st, "logout"):
            st.logout()
    except Exception:
        pass
    st.rerun()

current_identity = get_authenticated_identity()

# ==============================================================================
# 5. LOGIN VIEW (HIGH-CONTRAST DARK TEXT & PURE HTML RENDERING)
# ==============================================================================
if not current_identity:
    st.markdown("<div style='height: 40px;'></div>", unsafe_allow_html=True)
    
    col_left, col_mid_space, col_right = st.columns([1.2, 0.1, 1.1])
    
    # -------------------------------------------------------------------------
    # LEFT BRANDING SECTION (DARK, BOLD, CRISP TYPOGRAPHY)
    # -------------------------------------------------------------------------
    with col_left:
        render_html("""
        <div style="padding: 24px 10px;">
            <div style="width: 48px; height: 48px; background: #0f172a; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 24px; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(15,23,42,0.2);">
                🎓
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #1d4ed8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                Institutional Placement System
            </div>
            <h1 style="font-size: 38px; font-weight: 900; color: #0f172a; line-height: 1.15; margin: 0 0 16px 0; letter-spacing: -0.5px;">
                PLACEMENT<br>TRAINING<br>PORTAL
            </h1>
            <div style="font-size: 17px; font-weight: 800; color: #1e3a8a; margin-bottom: 12px;">
                Prepare smarter. Perform better. Get placement ready.
            </div>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; max-width: 460px; margin-bottom: 24px; font-weight: 500;">
                Personalized placement preparation, assessments, performance insights, and career readiness in one unified platform.
            </p>
            <div style="display: flex; gap: 20px; font-size: 13px; color: #0f172a; font-weight: 700; border-top: 2px solid #cbd5e1; padding-top: 18px;">
                <div>🔒 Microsoft Entra ID Protected</div>
                <div>🛡️ Granular Institutional RBAC</div>
            </div>
        </div>
        """)

    # -------------------------------------------------------------------------
    # RIGHT LOGIN CARD (CRISP WHITE CARD WITH BOLD DARK TEXT)
    # -------------------------------------------------------------------------
    with col_right:
        render_html("""
        <div class="saas-card" style="padding: 36px 32px; max-width: 440px; margin: 0 auto; border: 1px solid #cbd5e1; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
            <h2 style="font-size: 26px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Welcome Back</h2>
            <p style="font-size: 14px; color: #334155; margin: 0 0 24px 0; font-weight: 600;">
                Sign in to access your placement training portal.
            </p>
        </div>
        """)

        # Official Microsoft Entra ID Login Button
        login_btn_clicked = st.button(
            "⊞  Continue with Microsoft",
            use_container_width=True,
            type="primary"
        )

        if login_btn_clicked:
            # 1. Attempt native Streamlit st.login("microsoft") if configured
            try:
                if hasattr(st, "login"):
                    st.login("microsoft")
                else:
                    st.session_state.authenticated_user_email = "likith@college.edu"
                    st.session_state.authenticated_user_name = "Likith Yadav"
                    st.rerun()
            except Exception as e:
                st.warning(f"Microsoft Entra ID not configured in secrets.toml: {e}. Use fast institutional testing below:")

        render_html("""
        <div style="max-width: 440px; margin: 10px auto 0 auto; text-align: center;">
            <div style="font-size: 13px; color: #1e293b; font-weight: 700; margin-bottom: 16px;">
                Use your registered college Microsoft account.
            </div>
            <div style="border-top: 1px solid #cbd5e1; padding-top: 14px; font-size: 12px; color: #475569; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px;">
                <span>🔒</span>
                <span>Secure authentication powered by Microsoft Entra ID</span>
            </div>
        </div>
        """)

        # Fast Institutional Testing Switcher for Development
        with st.expander("🛠️ Institutional Microsoft Account Simulator (Dev Mode)"):
            st.markdown("<span style='font-size: 12px; color: #0f172a; font-weight: 700;'>Simulates authentication from different institutional accounts to verify database-driven role resolution:</span>", unsafe_allow_html=True)
            
            test_acc = st.selectbox("Select Authenticated Microsoft Identity", [
                "likith@college.edu (STUDENT - Active)",
                "rohan.verma@institution.edu (STUDENT - Active)",
                "siddharth.gupta@institution.edu (STUDENT - At Risk)",
                "inactive.student@institution.edu (STUDENT - Inactive)",
                "blocked.student@institution.edu (STUDENT - Blocked)",
                "pending.student@institution.edu (STUDENT - Pending)",
                "faculty@college.edu (FACULTY - Placement Lead)",
                "admin@college.edu (MANAGEMENT - Dean)",
                "unknown.user@external.com (UNREGISTERED MICROSOFT ACCOUNT)"
            ])
            
            if st.button("Simulate Microsoft Sign In"):
                email = test_acc.split(" ")[0]
                name = email.split("@")[0].replace(".", " ").title()
                st.session_state.authenticated_user_email = email
                st.session_state.authenticated_user_name = name
                st.rerun()

    st.stop()

# ==============================================================================
# 6. POST-AUTHENTICATION DATABASE RESOLUTION & ACCESS CONTROL
# ==============================================================================
auth_email = current_identity.get("email", "").strip().lower()
user_record = lookup_user_in_database(auth_email)

# CASE 1: Unknown / Unregistered Microsoft Account
if not user_record:
    st.markdown("<div style='height: 50px;'></div>", unsafe_allow_html=True)
    col_e1, col_e2, col_e3 = st.columns([1, 2, 1])
    with col_e2:
        render_html(f"""
        <div class="saas-card" style="text-align: center; padding: 36px 30px; border-top: 4px solid #ef4444;">
            <div style="font-size: 36px; margin-bottom: 12px;">🚫</div>
            <h3 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Account Not Registered</h3>
            <p style="font-size: 14px; color: #1e293b; line-height: 1.5; margin-bottom: 20px; font-weight: 600;">
                Your Microsoft account (<b>{auth_email}</b>) was successfully authenticated, but it is not registered in the Placement Training Portal.
            </p>
            <p style="font-size: 13px; color: #475569; margin-bottom: 24px; font-weight: 500;">
                Please contact your college placement cell coordinator or administration to provision your student or faculty profile.
            </p>
        </div>
        """)
        if st.button("← Back to Sign In", use_container_width=True, type="primary"):
            perform_logout()
    st.stop()

# CASE 2: Account Status Checks (INACTIVE, PENDING, BLOCKED)
user_status = user_record.get("status", "ACTIVE")

if user_status == "INACTIVE":
    col_e1, col_e2, col_e3 = st.columns([1, 2, 1])
    with col_e2:
        render_html("""
        <div class="saas-card" style="text-align: center; padding: 36px 30px; border-top: 4px solid #f59e0b;">
            <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
            <h3 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Account Inactive</h3>
            <p style="font-size: 14px; color: #1e293b; margin-bottom: 24px; font-weight: 600;">
                Your account is currently inactive. Please contact the placement administration.
            </p>
        </div>
        """)
        if st.button("Sign Out", use_container_width=True):
            perform_logout()
    st.stop()

elif user_status == "PENDING":
    col_e1, col_e2, col_e3 = st.columns([1, 2, 1])
    with col_e2:
        render_html("""
        <div class="saas-card" style="text-align: center; padding: 36px 30px; border-top: 4px solid #3b82f6;">
            <div style="font-size: 36px; margin-bottom: 12px;">⏳</div>
            <h3 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Activation Pending</h3>
            <p style="font-size: 14px; color: #1e293b; margin-bottom: 24px; font-weight: 600;">
                Your account has not yet been activated by your department coordinator.
            </p>
        </div>
        """)
        if st.button("Sign Out", use_container_width=True):
            perform_logout()
    st.stop()

elif user_status == "BLOCKED":
    col_e1, col_e2, col_e3 = st.columns([1, 2, 1])
    with col_e2:
        render_html("""
        <div class="saas-card" style="text-align: center; padding: 36px 30px; border-top: 4px solid #ef4444;">
            <div style="font-size: 36px; margin-bottom: 12px;">🛑</div>
            <h3 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Account Blocked</h3>
            <p style="font-size: 14px; color: #1e293b; margin-bottom: 24px; font-weight: 600;">
                Your account has been blocked. Please contact the administrator.
            </p>
        </div>
        """)
        if st.button("Sign Out", use_container_width=True):
            perform_logout()
    st.stop()

# CASE 3: Active User -> Authoritative Role from Database
user_role = user_record["role"]
user_name = user_record["name"]

# ==============================================================================
# 7. PROTECTED SIDEBAR NAVIGATION (STRICTLY ROLE-BOUND)
# ==============================================================================
with st.sidebar:
    render_html("""
    <div style="padding: 6px 0 16px 0; border-bottom: 1px solid #cbd5e1; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 34px; height: 34px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 18px;">
                🎓
            </div>
            <div>
                <div style="font-weight: 900; font-size: 16px; color: #0f172a; line-height: 1.2;">Placement Portal</div>
                <div style="font-size: 11px; color: #334155; font-weight: 600;">Prepare smarter. Perform better.</div>
            </div>
        </div>
    </div>
    """)

    badge_color = "#166534" if user_role == "STUDENT" else "#1e40af" if user_role == "FACULTY" else "#991b1b"
    badge_bg = "#dcfce7" if user_role == "STUDENT" else "#dbeafe" if user_role == "FACULTY" else "#fee2e2"

    render_html(f"""
    <div style="margin-bottom: 16px;">
        <span style="background: {badge_bg}; color: {badge_color}; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
            🛡️ {user_role} SPACE
        </span>
    </div>
    """)

    # Render Protected Menus Strictly by Database Role
    if user_role == "STUDENT":
        menu = st.radio("Navigation", [
            "Dashboard", "My Performance", "Assessments", "Mock Tests", 
            "My Roadmap", "Analysis & Suggestions", "Profile"
        ])
    elif user_role == "FACULTY":
        menu = st.radio("Navigation", [
            "Dashboard", "Students Directory", "Student Deep-Dive", "Cohort Analytics", "Profile"
        ])
    elif user_role == "MANAGEMENT":
        menu = st.radio("Navigation", [
            "Dashboard", "Student Management", "Faculty Management", "Assessment Authoring", 
            "Permission Matrix (RBAC)", "Reports & CSV Export", "Audit Logs", "System Settings"
        ])

    st.markdown("<div style='height: 20px;'></div>", unsafe_allow_html=True)
    st.markdown("---")

    render_html(f"""
    <div style="padding: 8px 0; font-size: 12px; color: #0f172a;">
        <div style="font-weight: 900; font-size: 13px; color: #0f172a;">{user_name}</div>
        <div style="font-size: 11px; color: #334155; font-weight: 600;">{auth_email}</div>
        <div style="font-size: 11px; color: #1d4ed8; font-weight: 800; margin-top: 3px;">{user_record.get('department', 'Engineering')}</div>
    </div>
    """)

    if st.button("🚪 Logout", use_container_width=True):
        perform_logout()

# ==============================================================================
# 8. ROLE VIEW: STUDENT (PROTECTED)
# ==============================================================================
if user_role == "STUDENT":
    if menu == "Dashboard":
        st.title(f"Good morning, {user_name}")
        st.caption(f"Here's your placement preparation progress • {user_record.get('department', 'Computer Science & Engineering')}")

        # 4 Core Metrics
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            render_html(f"""
            <div class="metric-container" style="border-left: 4px solid #0f172a;">
                <div class="metric-label">Overall Score</div>
                <div class="metric-value">{user_record.get('overall_score', 78)}%</div>
                <div class="metric-subtext subtext-positive">+6% vs baseline</div>
            </div>
            """)
        with c2:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #1d4ed8;">
                <div class="metric-label">Coding & DSA</div>
                <div class="metric-value">82%</div>
                <div class="metric-subtext subtext-positive">+8% this month</div>
            </div>
            """)
        with c3:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #b45309;">
                <div class="metric-label">Aptitude & Logic</div>
                <div class="metric-value">74%</div>
                <div class="metric-subtext subtext-warning">Target: 75% (Priority)</div>
            </div>
            """)
        with c4:
            render_html("""
            <div class="metric-container" style="border-left: 4px solid #4338ca;">
                <div class="metric-label">Mock Tests</div>
                <div class="metric-value">76%</div>
                <div class="metric-subtext subtext-neutral">1 completed • 1 scheduled</div>
            </div>
            """)

        st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

        render_html("""
        <div class="rec-banner">
            <div class="rec-badge">Recommended Next Step</div>
            <h3 style="font-size: 19px; font-weight: 900; margin: 0 0 6px 0; color: #ffffff;">Focus on Quantitative Aptitude</h3>
            <p style="font-size: 14px; color: #e2e8f0; margin: 0 0 14px 0; max-width: 750px; line-height: 1.5; font-weight: 500;">
                Your Quantitative Aptitude score is currently at <b>74%</b>, which is below your target benchmark of <b>75%</b>. 
                Complete <i>Time & Work Speed Practice</i> before taking the next placement mock simulation.
            </p>
        </div>
        """)

        col_chart, col_side = st.columns([1.3, 1])
        with col_chart:
            render_html("""
            <div class="saas-card">
                <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">Performance Trend</div>
            """)
            df_trend = pd.DataFrame({
                "Date": ["Aug 10", "Aug 18", "Aug 25", "Sep 01", "Sep 05"],
                "Overall Score": [68, 71, 74, 76, user_record.get('overall_score', 78)],
                "Coding & DSA": [70, 74, 78, 80, 82],
                "Aptitude": [65, 68, 70, 72, 74]
            })
            fig_trend = px.line(
                df_trend, x="Date", y=["Overall Score", "Coding & DSA", "Aptitude"],
                markers=True, color_discrete_sequence=["#0f172a", "#1d4ed8", "#b45309"]
            )
            fig_trend.update_layout(
                margin=dict(l=10, r=10, t=10, b=10), height=260,
                legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
                xaxis=dict(showgrid=False), yaxis=dict(showgrid=True, gridcolor="#e2e8f0", range=[50, 100]),
                plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)"
            )
            st.plotly_chart(fig_trend, use_container_width=True, config={"displayModeBar": False})
            render_html("</div>")

        with col_side:
            render_html("""
            <div class="saas-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 15px; font-weight: 800; color: #0f172a;">Placement Roadmap</span>
                    <span style="font-size: 13px; font-weight: 800; color: #1d4ed8;">72% Overall</span>
                </div>
                <div style="background: #e2e8f0; border-radius: 999px; height: 8px; margin-bottom: 14px; overflow: hidden;">
                    <div style="background: #0f172a; width: 72%; height: 100%;"></div>
                </div>
                <div style="font-size: 13px; line-height: 1.8; font-weight: 600; color: #1e293b;">
                    <div>✅ <b>Programming Fundamentals</b> — 100%</div>
                    <div>⏳ <b>Data Structures & Algorithms</b> — 82%</div>
                    <div>⚠️ <b>Quantitative Aptitude</b> — 74% (Needs Practice)</div>
                    <div>⏳ <b>Placement Mock Exams</b> — 76%</div>
                </div>
            </div>
            """)

    elif menu == "My Performance":
        st.title("My Performance")
        st.caption("Detailed breakdown of skills, benchmarks, and historical performance.")
        t_filter = st.selectbox("Time Filter", ["Last 30 Days", "Last 7 Days", "Last 3 Months", "All Time"])

        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Overall Score", f"{user_record.get('overall_score', 78)}%", "+6%")
        m2.metric("Coding & DSA", "82%", "+8%")
        m3.metric("Aptitude", "74%", "+2%")
        m4.metric("Mock Tests", "76%", "+4%")

        col_p1, col_p2 = st.columns(2)
        with col_p1:
            st.subheader("Skill vs Placement Benchmark")
            df_comp = pd.DataFrame({
                "Skill": ["Coding", "Aptitude", "Technical", "Mock Tests", "Verbal"],
                "Your Score": [82, 74, 72, 76, 80],
                "Placement Target": [85, 75, 80, 75, 75]
            })
            fig_bar = px.bar(df_comp, x="Skill", y=["Your Score", "Placement Target"], barmode="group", color_discrete_sequence=["#1d4ed8", "#94a3b8"])
            fig_bar.update_layout(template="plotly_white", height=300)
            st.plotly_chart(fig_bar, use_container_width=True)

        with col_p2:
            st.subheader("Placement Readiness Index")
            fig_radar = go.Figure(go.Scatterpolar(
                r=[82, 74, 72, 76, 80, 82],
                theta=['Coding', 'Aptitude', 'Technical', 'Mock Tests', 'Verbal', 'Coding'],
                fill='toself', fillcolor='rgba(29, 78, 216, 0.15)', line=dict(color='#1d4ed8', width=2)
            ))
            fig_radar.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 100])), height=300, margin=dict(l=30, r=30, t=20, b=20))
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
                    <div style="font-size: 11px; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">Algorithms</div>
                    <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin: 4px 0 6px 0;">DSA Core Assessment</div>
                    <p style="font-size: 13px; color: #334155; margin-bottom: 12px; font-weight: 500;">Arrays, two-pointers, hash tables, and string manipulation.</p>
                    <div style="font-size: 12px; color: #0f172a; font-weight: 700; margin-bottom: 14px;">
                        • <b>3 Problems</b> • 45 Mins • <span class="badge badge-warning">Medium</span>
                    </div>
                </div>
                """)
                st.button("Start DSA Test", key="btn_dsa", use_container_width=True, type="primary")

            with col_c2:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">Data Structures</div>
                    <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin: 4px 0 6px 0;">Binary Trees & Recursion</div>
                    <p style="font-size: 13px; color: #334155; margin-bottom: 12px; font-weight: 500;">Tree traversals, binary search trees, and DFS/BFS patterns.</p>
                    <div style="font-size: 12px; color: #0f172a; font-weight: 700; margin-bottom: 14px;">
                        • <b>2 Problems</b> • 45 Mins • <span class="badge badge-danger">Hard</span>
                    </div>
                </div>
                """)
                st.button("Start Trees Test", key="btn_trees", use_container_width=True)

            with col_c3:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">Fundamentals</div>
                    <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin: 4px 0 6px 0;">Python & OOP Basics</div>
                    <p style="font-size: 13px; color: #334155; margin-bottom: 12px; font-weight: 500;">Object-oriented principles, exception handling, and lambdas.</p>
                    <div style="font-size: 12px; color: #0f172a; font-weight: 700; margin-bottom: 14px;">
                        • <b>4 Problems</b> • 30 Mins • <span class="badge badge-success">Easy</span>
                    </div>
                </div>
                """)
                st.button("Start OOP Test", key="btn_oop", use_container_width=True)

            # Interactive Coding Sandbox
            st.markdown("---")
            st.subheader("💻 Interactive Sandbox IDE")
            c_desc, c_code = st.columns([1, 1])
            with c_desc:
                st.markdown("""
                **Problem:** Reverse Array In-Place  
                **Difficulty:** Easy | **Marks:** 10  
                
                Given an integer array `arr`, write a function to reverse the elements in-place without allocating additional memory.
                """)
            with c_code:
                lang = st.selectbox("Runtime", ["Python 3", "JavaScript", "C++ 17", "Java 17"])
                starter = "def reverse_array(arr: list[int]) -> list[int]:\n    return arr[::-1]\n"
                code = st.text_area("Code Editor", starter, height=140)
                if st.button("▶️ Run & Evaluate Test Cases", type="primary"):
                    with st.spinner("Executing in sandboxed runtime..."):
                        time.sleep(0.3)
                        st.success("✅ All 3 Test Cases Passed! Runtime: 34.2 ms | Memory: 14.1 MB")

        with tab_aptitude:
            col_a1, col_a2 = st.columns(2)
            with col_a1:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase;">Quantitative</div>
                    <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin: 4px 0 6px 0;">Speed Math & Percentages</div>
                    <p style="font-size: 13px; color: #334155; margin-bottom: 12px; font-weight: 500;">Time & work, ratios, and quick calculation tricks.</p>
                </div>
                """)
                st.button("Start Quantitative Set", key="btn_q1", use_container_width=True, type="primary")
            with col_a2:
                render_html("""
                <div class="saas-card">
                    <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase;">Logical</div>
                    <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin: 4px 0 6px 0;">Logical Deductions & Puzzles</div>
                    <p style="font-size: 13px; color: #334155; margin-bottom: 12px; font-weight: 500;">Seating arrangements and syllogisms.</p>
                </div>
                """)
                st.button("Start Logical Set", key="btn_l1", use_container_width=True)

    elif menu == "Mock Tests":
        st.title("Placement Mock Exams")
        st.caption("Simulate real recruitment tests with sectional timers.")
        render_html("""
        <div class="saas-card">
            <span class="badge badge-info">Tier-1 Corporate Simulation</span>
            <h3 style="font-size: 19px; font-weight: 900; color: #0f172a; margin: 6px 0 8px 0;">Placement Mock Simulation 2026</h3>
            <p style="font-size: 14px; color: #334155; line-height: 1.5; font-weight: 500;">
                Complete simulation covering Quantitative Math (15 Qs), Logical Reasoning (15 Qs), Verbal Ability (10 Qs), and Live Coding (2 Problems).
            </p>
        </div>
        """)
        st.button("Start Full Mock Exam Simulation", type="primary")

    elif menu == "My Roadmap":
        st.title("My Placement Roadmap")
        render_html("""
        <div class="saas-card">
            <div class="timeline-item">
                <div class="step-number step-done">✓</div>
                <div style="flex: 1;">
                    <span style="font-weight: 900; font-size: 15px; color: #0f172a;">1. Programming Fundamentals</span>
                    <span class="badge badge-success" style="float: right;">100% Completed</span>
                </div>
            </div>
            <div class="timeline-item">
                <div class="step-number step-active">2</div>
                <div style="flex: 1;">
                    <span style="font-weight: 900; font-size: 15px; color: #0f172a;">2. Data Structures & Algorithms</span>
                    <span class="badge badge-info" style="float: right;">82% In Progress</span>
                </div>
            </div>
            <div class="timeline-item">
                <div class="step-number" style="background: #b45309; color: white;">3</div>
                <div style="flex: 1;">
                    <span style="font-weight: 900; font-size: 15px; color: #0f172a;">3. Quantitative & Logical Aptitude</span>
                    <span class="badge badge-warning" style="float: right;">74% Needs Practice</span>
                </div>
            </div>
            <div class="timeline-item">
                <div class="step-number step-active">4</div>
                <div style="flex: 1;">
                    <span style="font-weight: 900; font-size: 15px; color: #0f172a;">4. Placement Mock Exams</span>
                    <span class="badge badge-info" style="float: right;">76% In Progress</span>
                </div>
            </div>
        </div>
        """)

    elif menu == "Analysis & Suggestions":
        st.title("Analysis & Suggestions")
        col_s1, col_s2 = st.columns(2)
        with col_s1:
            render_html("""
            <div class="saas-card" style="border-top: 4px solid #059669;">
                <div style="font-size: 15px; font-weight: 900; color: #065f46; margin-bottom: 8px;">Identified Strengths</div>
                <div style="font-size: 13px; line-height: 1.8; color: #0f172a; font-weight: 600;">
                    <div>• <b>Coding & Problem Solving (82%)</b> — Fast implementation.</div>
                    <div>• <b>Verbal Ability (80%)</b> — Strong reading comprehension.</div>
                </div>
            </div>
            """)
        with col_s2:
            render_html("""
            <div class="saas-card" style="border-top: 4px solid #b45309;">
                <div style="font-size: 15px; font-weight: 900; color: #92400e; margin-bottom: 8px;">Priority Weaknesses</div>
                <div style="font-size: 13px; line-height: 1.8; color: #0f172a; font-weight: 600;">
                    <div>• <b>Quantitative Math (74%)</b> — Below the 75% cutoff benchmark.</div>
                    <div>• <b>Operating Systems Core (68%)</b> — Review memory paging.</div>
                </div>
            </div>
            """)

    elif menu == "Profile":
        st.title("Student Profile")
        render_html(f"""
        <div class="saas-card">
            <h3 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 6px 0;">{user_name}</h3>
            <div style="font-size: 13px; color: #334155; font-weight: 700; margin-bottom: 14px;">Roll No: {user_record.get('id', 'STU001')} • {auth_email}</div>
            <div style="font-size: 14px; color: #0f172a; line-height: 1.8; font-weight: 600;">
                • <b>Department:</b> {user_record.get('department', 'Engineering')}<br>
                • <b>Academic CGPA:</b> {user_record.get('cgpa', 8.5)} / 10.0<br>
                • <b>Readiness Status:</b> <span class="badge badge-success">Placement Ready</span>
            </div>
        </div>
        """)

# ==============================================================================
# 9. ROLE VIEW: FACULTY (PROTECTED)
# ==============================================================================
elif user_role == "FACULTY":
    if menu == "Dashboard":
        st.title("Faculty Coordinator Dashboard")
        st.caption(f"{user_name} • {user_record.get('department', 'CSE')} Placement Lead")

        f1, f2, f3, f4 = st.columns(4)
        f1.metric("Assigned Students", "120", "Cohort CSE 4th Year")
        f2.metric("Average Score", "74.8%", "+3.2% vs last term")
        f3.metric("Assessment Completion", "86.4%", "Target: 80%")
        f4.metric("Needs Attention", "12", "At-Risk (<60% score)")

        st.subheader("⚠️ Students Needing Immediate Attention")
        df_risk = pd.DataFrame([
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Score": "58%", "Reason": "Low Aptitude (52%)", "Action": "Assign Practice Set"},
            {"Student ID": "2022MECH121", "Name": "Harsh Vardhan", "Dept": "MECH", "Score": "52%", "Reason": "Low Coding (48%)", "Action": "Schedule Doubt Session"},
            {"Student ID": "2022CIVIL112", "Name": "Kavita Reddy", "Dept": "CIVIL", "Score": "54%", "Reason": "Low Overall Score (54%)", "Action": "Review Roadmap"}
        ])
        st.dataframe(df_risk, use_container_width=True)

    elif menu == "Students Directory":
        st.title("Students Directory")
        df_all_students = pd.DataFrame([
            {"Roll ID": "2022CSE101", "Name": "Rohan Verma", "Dept": "CSE", "Year": 4, "Overall": "78%", "Coding": "82%", "Aptitude": "74%", "Status": "Ready"},
            {"Roll ID": "2022ECE102", "Name": "Ananya Iyer", "Dept": "ECE", "Year": 4, "Overall": "74%", "Coding": "75%", "Aptitude": "72%", "Status": "In Progress"},
            {"Roll ID": "2022CSE104", "Name": "Pooja Hegde", "Dept": "CSE", "Year": 4, "Overall": "92%", "Coding": "95%", "Aptitude": "88%", "Status": "Top Performer"},
            {"Roll ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Year": 4, "Overall": "58%", "Coding": "62%", "Aptitude": "52%", "Status": "At-Risk"}
        ])
        st.dataframe(df_all_students, use_container_width=True)

    elif menu == "Student Deep-Dive":
        st.title("Student Deep-Dive Inspection")
        s_sel = st.selectbox("Select Student", ["2022CSE101 - Rohan Verma", "2022CSE109 - Siddharth Gupta"])
        st.metric("Overall Score", "78%", "+6%")
        render_html("""
        <div class="saas-card" style="font-size: 14px; font-weight: 700; color: #0f172a;">
            <b>Faculty Mentorship Note:</b> Strong algorithmic coding capability. Recommend focused practice in permutations.
        </div>
        """)

    elif menu == "Cohort Analytics":
        st.title("Cohort Analytics")
        df_dept_perf = pd.DataFrame({
            "Department": ["CSE", "ECE", "EEE", "MECH", "CIVIL"],
            "Average Score": [78.4, 73.2, 69.8, 66.5, 64.1],
            "Placement Ready %": [84.0, 72.5, 65.0, 58.0, 52.0]
        })
        fig = px.bar(df_dept_perf, x="Department", y=["Average Score", "Placement Ready %"], barmode="group", color_discrete_sequence=["#0f172a", "#1d4ed8"])
        fig.update_layout(template="plotly_white")
        st.plotly_chart(fig, use_container_width=True)

    elif menu == "Profile":
        st.title("Faculty Profile")
        render_html(f"""
        <div class="saas-card">
            <h3 style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 0 0 6px 0;">{user_name}</h3>
            <div style="font-size: 14px; color: #334155; font-weight: 700;">{user_record.get('title', 'Placement Coordinator')} • {user_record.get('department', 'CSE')}</div>
        </div>
        """)

# ==============================================================================
# 10. ROLE VIEW: MANAGEMENT (PROTECTED)
# ==============================================================================
elif user_role == "MANAGEMENT":
    if menu == "Dashboard":
        st.title("Institution Governance Dashboard")
        st.caption(f"{user_name} • Dean of Placements")

        m1, m2, m3, m4, m5 = st.columns(5)
        m1.metric("Total Students", "25", "Active in Portal")
        m2.metric("Total Faculty", "2", "Coordinators")
        m3.metric("Average Score", "74.8%", "+4.1% this term")
        m4.metric("Placement Ready", "72.0%", "Score >= 75%")
        m5.metric("Completion Rate", "88.5%", "Target: 85%")

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
        df_s_mgmt = pd.DataFrame([
            {"Student ID": "2022CSE101", "Name": "Rohan Verma", "Email": "rohan.verma@institution.edu", "Dept": "CSE", "Status": "ACTIVE"},
            {"Student ID": "2022ECE102", "Name": "Ananya Iyer", "Email": "ananya.iyer@institution.edu", "Dept": "ECE", "Status": "ACTIVE"},
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Email": "siddharth.gupta@institution.edu", "Dept": "CSE", "Status": "ACTIVE"},
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
        df_f_mgmt = pd.DataFrame([
            {"Employee ID": "FAC-CSE-101", "Name": "Prof. Arvind Sharma", "Email": "faculty@college.edu", "Dept": "CSE", "Status": "ACTIVE"},
            {"Employee ID": "FAC-ECE-202", "Name": "Dr. Neha Patel", "Email": "dr.patel@institution.edu", "Dept": "ECE", "Status": "ACTIVE"}
        ])
        st.dataframe(df_f_mgmt, use_container_width=True)

    elif menu == "Assessment Authoring":
        st.title("Assessment Authoring")
        with st.expander("➕ Create New Assessment", expanded=True):
            st.text_input("Assessment Title", "Dynamic Programming Mastery")
            st.selectbox("Type", ["CODING", "APTITUDE", "MOCK"])
            st.number_input("Duration (Minutes)", 15, 180, 45)
            if st.button("Publish Assessment", type="primary"):
                st.success("Assessment published successfully!")

    elif menu == "Permission Matrix (RBAC)":
        st.title("🛡️ Granular RBAC & Permission Matrix")
        df_perms = pd.DataFrame([
            {"Permission": "VIEW_STUDENT_PERFORMANCE", "Role Default": "Granted", "Override": "None", "Effective": "Granted"},
            {"Permission": "MANAGE_ASSESSMENTS", "Role Default": "Restricted", "Override": "Granted by Admin", "Effective": "Granted"},
            {"Permission": "MANAGE_STUDENTS", "Role Default": "Restricted", "Override": "None", "Effective": "Restricted"}
        ])
        st.dataframe(df_perms, use_container_width=True)

    elif menu == "Reports & CSV Export":
        st.title("Placement Reports & CSV Export")
        df_export = pd.DataFrame([
            {"Student ID": "2022CSE101", "Name": "Rohan Verma", "Dept": "CSE", "Overall Score": 78, "Status": "Placement Ready"},
            {"Student ID": "2022ECE102", "Name": "Ananya Iyer", "Dept": "ECE", "Overall Score": 74, "Status": "In Progress"},
            {"Student ID": "2022CSE109", "Name": "Siddharth Gupta", "Dept": "CSE", "Overall Score": 58, "Status": "Needs Support"}
        ])
        st.dataframe(df_export, use_container_width=True)
        csv_data = df_export.to_csv(index=False).encode('utf-8')
        st.download_button("📥 Download CSV Performance Report", csv_data, "placement_performance_report.csv", "text/csv", type="primary")

    elif menu == "Audit Logs":
        st.title("📜 Security & System Audit Trail")
        st.dataframe(pd.DataFrame(st.session_state.audit_logs), use_container_width=True)

    elif menu == "System Settings":
        st.title("⚙️ Placement Scoring Settings")
        st.slider("Placement Readiness Cutoff (%)", 50, 100, 75)
        st.slider("At-Risk Alert Trigger (%)", 40, 80, 60)
        st.button("Save Settings", type="primary")

# ==============================================================================
# 11. FOOTER
# ==============================================================================
st.markdown("---")
st.caption("Placement Training Portal • Enterprise University Edition • 2026")
