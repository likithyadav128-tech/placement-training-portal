from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_email = Column(String(255), nullable=True)
    user_role = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False, index=True)  # e.g., "GRANT_PERMISSION", "LOGIN", "UPDATE_STUDENT"
    target_type = Column(String(100), nullable=True)         # e.g., "USER", "ASSESSMENT", "PERMISSION"
    target_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)                    # JSON or descriptive text
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = relationship("User", back_populates="audit_logs")

    def __repr__(self):
        return f"<AuditLog action='{self.action}' user_id={self.user_id} timestamp='{self.timestamp}'>"
