from typing import Dict, Any

from backend.app.services.analysis.analyzer import ResumeAnalyzer
from backend.app.services.analysis.mock_ai_client import MockAIClient


class AIResumeAnalyzer(ResumeAnalyzer):

    def __init__(self):
        self.ai_client = MockAIClient()

    def analyze(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        result = self.ai_client.analyze_resume(
            resume_data
        )

        return result


if __name__ == "__main__":

    analyzer = AIResumeAnalyzer()

    sample_resume = {
        "skills": [
            "Python",
            "FastAPI",
            "PostgreSQL"
        ],
        "sections": {
            "education": [
                "MCA"
            ],
            "projects": [
                "InterviewIQ"
            ]
        }
    }

    result = analyzer.analyze(sample_resume)

    print(result)