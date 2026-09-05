import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class AssessmentType(str, enum.Enum):
    CODING = "CODING"
    APTITUDE = "APTITUDE"
    MOCK = "MOCK"


class AssessmentStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(Enum(AssessmentType), nullable=False, default=AssessmentType.APTITUDE)
    category = Column(String(100), nullable=False)  # e.g., "Python", "Quantitative", "Placement Mock"
    difficulty = Column(String(50), nullable=False, default="Intermediate")
    duration = Column(Integer, nullable=False, default=60)  # minutes
    passing_score = Column(Float, nullable=False, default=60.0)
    status = Column(Enum(AssessmentStatus), nullable=False, default=AssessmentStatus.PUBLISHED)
    created_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    questions = relationship("AssessmentQuestion", back_populates="assessment", cascade="all, delete-orphan")
    attempts = relationship("TestAttempt", back_populates="assessment", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question = Column(Text, nullable=False)
    type = Column(String(50), nullable=False, default="MCQ")  # MCQ, CODING, DESCRIPTIVE
    category = Column(String(100), nullable=False)
    difficulty = Column(String(50), nullable=False, default="Medium")
    marks = Column(Float, nullable=False, default=1.0)
    options = Column(Text, nullable=True)  # JSON string array for MCQ choices
    answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    code_template = Column(Text, nullable=True)  # Boilerplate code for coding questions
    test_cases = Column(Text, nullable=True)     # JSON string of test cases

    assessments = relationship("AssessmentQuestion", back_populates="question")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    order_index = Column(Integer, nullable=False, default=1)

    assessment = relationship("Assessment", back_populates="questions")
    question = relationship("Question", back_populates="assessments")


class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False, default=0.0)
    correct_count = Column(Integer, nullable=False, default=0)
    incorrect_count = Column(Integer, nullable=False, default=0)
    skipped_count = Column(Integer, nullable=False, default=0)
    status = Column(String(50), nullable=False, default="COMPLETED")  # IN_PROGRESS, COMPLETED, ABANDONED
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)

    student = relationship("Student", back_populates="test_attempts")
    assessment = relationship("Assessment", back_populates="attempts")


class PerformanceRecord(Base):
    __tablename__ = "performance_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), nullable=False)  # CODING, APTITUDE, TECHNICAL, MOCK
    score = Column(Float, nullable=False, default=0.0)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("Student", back_populates="performance_records")


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    steps = relationship("RoadmapStep", back_populates="roadmap", cascade="all, delete-orphan")


class RoadmapStep(Base):
    __tablename__ = "roadmap_steps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_score = Column(Float, nullable=False, default=75.0)
    order_index = Column(Integer, nullable=False, default=1)

    roadmap = relationship("Roadmap", back_populates="steps")
    student_progress = relationship("StudentRoadmapProgress", back_populates="roadmap_step")


class StudentRoadmapProgress(Base):
    __tablename__ = "student_roadmap_progress"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    roadmap_step_id = Column(Integer, ForeignKey("roadmap_steps.id", ondelete="CASCADE"), nullable=False)
    progress = Column(Float, nullable=False, default=0.0)
    status = Column(String(50), nullable=False, default="IN_PROGRESS")  # NOT_STARTED, IN_PROGRESS, COMPLETED

    student = relationship("Student", back_populates="roadmap_progress")
    roadmap_step = relationship("RoadmapStep", back_populates="student_progress")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String(50), nullable=False, default="HIGH")  # HIGH, MEDIUM, LOW
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("Student", back_populates="recommendations")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False, default="INFO")  # INFO, ALERT, SUCCESS
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
