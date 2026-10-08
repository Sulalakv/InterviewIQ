from abc import ABC, abstractmethod
from typing import Dict, Any


class ResumeAnalyzer(ABC):

    @abstractmethod
    def analyze(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze structured resume data and return an analysis result.
        """
        pass