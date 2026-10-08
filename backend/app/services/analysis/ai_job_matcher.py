from typing import Dict, Any

from backend.app.services.analysis.job_matcher import JobMatchAnalyzer
from backend.app.services.analysis.mock_ai_client import MockAIClient


class AIJobMatchAnalyzer(JobMatchAnalyzer):

    def __init__(self):
        self.ai_client = MockAIClient()

    def match(
        self,
        resume_data: Dict[str, Any],
        job_description: str
    ) -> Dict[str, Any]:

        result = self.ai_client.match_job(
            resume_data,
            job_description
        )

        return result


if __name__ == "__main__":

    matcher = AIJobMatchAnalyzer()

    sample_resume = {
        "skills": [
            "Python",
            "FastAPI",
            "PostgreSQL",
            "React.js"
        ],
        "sections": {
            "experience": [
                "Python Developer Intern"
            ],
            "projects": [
                "InterviewIQ"
            ]
        }
    }

    job_description = """
    We are looking for a Python Backend Developer
    with FastAPI, PostgreSQL, Docker and AWS experience.
    """

    result = matcher.match(
        sample_resume,
        job_description
    )

    print("\n========== JOB MATCH RESULT ==========\n")
    print(result)
    print("\n======================================")