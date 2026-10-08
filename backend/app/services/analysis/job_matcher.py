from typing import Dict, Any
from abc import ABC, abstractmethod


class JobMatchAnalyzer(ABC):

    @abstractmethod
    def match(
        self,
        resume_data: Dict[str, Any],
        job_description: str
    ) -> Dict[str, Any]:
        """
        Compare a structured resume with a job description.
        """
        pass