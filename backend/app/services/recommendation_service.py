from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.assessments import Recommendation
from app.services.performance_service import PerformanceService


class RecommendationEngine:
    @staticmethod
    def generate_rule_based_recommendations(perf_summary: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generates clear, performance-grounded recommendations explaining the 'WHY'."""
        recommendations = []
        
        coding = perf_summary.get("coding_score", 0)
        aptitude = perf_summary.get("aptitude_score", 0)
        mock = perf_summary.get("mock_score", 0)
        overall = perf_summary.get("overall_score", 0)

        # 1. Aptitude Rule
        if aptitude < 65:
            recommendations.append({
                "category": "Quantitative Aptitude",
                "priority": "HIGH",
                "title": "Boost Quantitative Fundamentals",
                "message": f"Your aptitude score is {aptitude}%, which is below the placement readiness target of 70%. Practice time & work, percentages, and profit & loss before attempting further mock exams.",
                "action_label": "Practice Aptitude",
                "action_url": "/assessments?category=Quantitative"
            })
        elif aptitude < 75:
            recommendations.append({
                "category": "Logical Reasoning",
                "priority": "MEDIUM",
                "title": "Refine Logical Problem Solving",
                "message": f"Your aptitude performance is solid at {aptitude}%. Sharpening your syllogisms and data interpretation will push you into the top 10th percentile.",
                "action_label": "Practice Logical Reasoning",
                "action_url": "/assessments?category=Logical"
            })

        # 2. Coding Rule
        if coding < 65:
            recommendations.append({
                "category": "Coding & DSA",
                "priority": "HIGH",
                "title": "Master Data Structures Basics",
                "message": f"Your coding score stands at {coding}%. Solidify your fundamentals in Arrays, Strings, Hash Maps, and Binary Search to clear preliminary technical rounds.",
                "action_label": "Start Coding Practice",
                "action_url": "/assessments?type=CODING"
            })
        elif coding >= 80:
            recommendations.append({
                "category": "Advanced Coding",
                "priority": "LOW",
                "title": "Strong Coding Proficiency",
                "message": f"Outstanding coding score at {coding}%! Challenge yourself with Graph algorithms and Dynamic Programming to crack Tier-1 product company interviews.",
                "action_label": "Advanced Problems",
                "action_url": "/assessments?type=CODING&difficulty=Hard"
            })

        # 3. Mock Test Rule
        if mock < 70:
            recommendations.append({
                "category": "Mock Exams",
                "priority": "HIGH",
                "title": "Simulate Real Exam Time Pressure",
                "message": f"Your mock test average is {mock}%. Taking weekly full-length timed mock tests will improve your speed, accuracy, and test endurance.",
                "action_label": "Take Placement Mock Test",
                "action_url": "/mock-tests"
            })

        # 4. Overall Placement Readiness
        if overall >= 75:
            recommendations.append({
                "category": "Interview Preparation",
                "priority": "MEDIUM",
                "title": "Prepare for Technical & HR Interviews",
                "message": f"Great job! Your overall placement readiness is {overall}%. Review system design basics, core CS fundamentals (OS, DBMS, CN), and mock HR questions.",
                "action_label": "View Interview Roadmap",
                "action_url": "/roadmap"
            })

        # If no recommendations triggered, provide standard guidance
        if not recommendations:
            recommendations.append({
                "category": "General Placement Preparation",
                "priority": "MEDIUM",
                "title": "Maintain Consistent Daily Practice",
                "message": "Continue solving daily coding problems and full-length aptitude sets to maintain your readiness momentum.",
                "action_label": "Browse Assessments",
                "action_url": "/assessments"
            })

        return recommendations

    @staticmethod
    async def get_student_recommendations(student_id: int, db: AsyncSession) -> List[Dict[str, Any]]:
        """Get live rule-based recommendations grounded in student's actual performance."""
        perf_summary = await PerformanceService.get_student_performance_summary(student_id, db)
        return RecommendationEngine.generate_rule_based_recommendations(perf_summary)
