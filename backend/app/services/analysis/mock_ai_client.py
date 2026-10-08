from typing import Dict, Any


class MockAIClient:

    def analyze_resume(
        self,
        resume_data: Dict[str, Any]
    ) -> Dict[str, Any]:

        skills = resume_data.get("skills", [])

        return {
            "overall_score": 75,
            "ats_score": 78,

            "strengths": [
                "Strong technical skill coverage",
                "Good academic background",
                "Includes practical projects"
            ],

            "weaknesses": [
                "Some project descriptions could include measurable results",
                "Professional experience could be described in more detail"
            ],

            "missing_skills": [
                "Docker",
                "AWS",
                "REST API design"
            ],

            "skill_analysis": [
                f"Detected {len(skills)} technical skills"
            ],

            "experience_analysis": (
                "The resume demonstrates relevant internship and "
                "training experience."
            ),

            "project_analysis": (
                "The resume contains multiple technical projects "
                "covering AI, machine learning and web development."
            ),

            "education_analysis": (
                "The candidate has a relevant postgraduate "
                "computer applications background."
            ),

            "resume_quality": (
                "The resume has a good technical foundation but "
                "could be improved with more measurable achievements."
            ),

            "recommendations": [
                "Add measurable outcomes to project descriptions",
                "Highlight REST API development",
                "Add SQL and cloud technologies",
                "Use stronger achievement-oriented bullet points"
            ],

            "suggested_roles": [
                "Python Developer",
                "Backend Developer",
                "Junior Machine Learning Engineer",
                "Data Analyst"
            ]
        }

    def match_job(
        self,
        resume_data: Dict[str, Any],
        job_description: str
    ) -> Dict[str, Any]:

        skills = resume_data.get("skills", [])

        return {
            "match_score": 82,

            "matched_skills": [
                skill
                for skill in skills
                if skill.lower() in job_description.lower()
            ],

            "missing_skills": [
                "Docker",
                "AWS",
                "REST API"
            ],

            "experience_match": (
                "The candidate has relevant internship and "
                "development experience."
            ),

            "project_match": (
                "The candidate has projects related to "
                "Python, machine learning and web development."
            ),

            "recommendations": [
                "Improve Docker knowledge",
                "Learn AWS fundamentals",
                "Strengthen REST API development"
            ]
        }