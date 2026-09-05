from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)

    # Relationships
    students = relationship("Student", back_populates="department")
    faculty = relationship("Faculty", back_populates="department")

    def __repr__(self):
        return f"<Department code='{self.code}' name='{self.name}'>"


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    student_id = Column(String(100), unique=True, index=True, nullable=False)  # Roll number / College ID
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    year = Column(Integer, nullable=False, default=4)  # 1st, 2nd, 3rd, 4th year
    section = Column(String(10), nullable=False, default="A")
    cgpa = Column(Float, nullable=False, default=8.0)
    faculty_advisor_id = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="student_profile", foreign_keys=[user_id])
    department = relationship("Department", back_populates="students", foreign_keys=[department_id])
    faculty_advisor = relationship("Faculty", back_populates="assigned_students", foreign_keys=[faculty_advisor_id])
    test_attempts = relationship("TestAttempt", back_populates="student", cascade="all, delete-orphan")
    performance_records = relationship("PerformanceRecord", back_populates="student", cascade="all, delete-orphan")
    roadmap_progress = relationship("StudentRoadmapProgress", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Student student_id='{self.student_id}' year={self.year}>"


class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    employee_id = Column(String(100), unique=True, index=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    designation = Column(String(150), nullable=False, default="Assistant Professor")

    # Relationships
    user = relationship("User", back_populates="faculty_profile", foreign_keys=[user_id])
    department = relationship("Department", back_populates="faculty", foreign_keys=[department_id])
    assigned_students = relationship("Student", back_populates="faculty_advisor", foreign_keys="[Student.faculty_advisor_id]")

    def __repr__(self):
        return f"<Faculty employee_id='{self.employee_id}'>"
