import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResumeAnalysis } from "../api/resume";

function Analysis() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getResumeAnalysis(resumeId);

        setAnalysis(data);
      } catch (error) {
        console.error("ANALYSIS LOAD ERROR:", error);

        setError(
          error.response?.data?.detail ||
          "Unable to load resume analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading analysis...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-message error">
        {error}
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const data = analysis.analysis || {};

  return (
    <div className="analysis-page">

      <header className="dashboard-header">
        <div>
          <h1>InterviewIQ</h1>
          <p>Resume Analysis</p>
        </div>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </header>

      <main className="analysis-content">

        <button
          className="back-button"
          onClick={() => navigate("/resumes")}
        >
          ← Back to Resumes
        </button>

        <div className="analysis-heading">
          <h2>Resume Analysis</h2>
          <p>
            Resume #{analysis.resume_id}
          </p>
        </div>

        {/* Scores */}

        <section className="analysis-score-grid">

          <div className="analysis-score-card">
            <span>Overall Score</span>
            <strong>{analysis.overall_score}</strong>
            <small>/ 100</small>
          </div>

          <div className="analysis-score-card">
            <span>ATS Score</span>
            <strong>{analysis.ats_score}</strong>
            <small>/ 100</small>
          </div>

        </section>

        {/* Strengths and Weaknesses */}

        <section className="analysis-two-column">

          <div className="analysis-box">
            <h3>Strengths</h3>

            <ul>
              {data.strengths?.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>

          <div className="analysis-box">
            <h3>Weaknesses</h3>

            <ul>
              {data.weaknesses?.map(
                (item, index) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>
          </div>

        </section>

        {/* Missing Skills */}

        <section className="analysis-box">

          <h3>Missing Skills</h3>

          <div className="analysis-tags">

            {data.missing_skills?.map(
              (skill, index) => (
                <span key={index}>
                  {skill}
                </span>
              )
            )}

          </div>

        </section>

        {/* Skill Analysis */}

        <section className="analysis-box">

          <h3>Skill Analysis</h3>

          {data.skill_analysis?.map(
            (item, index) => (
              <p key={index}>{item}</p>
            )
          )}

        </section>

        {/* Experience */}

        <section className="analysis-box">

          <h3>Experience Analysis</h3>

          <p>
            {data.experience_analysis}
          </p>

        </section>

        {/* Projects */}

        <section className="analysis-box">

          <h3>Project Analysis</h3>

          <p>
            {data.project_analysis}
          </p>

        </section>

        {/* Education */}

        <section className="analysis-box">

          <h3>Education Analysis</h3>

          <p>
            {data.education_analysis}
          </p>

        </section>

        {/* Resume Quality */}

        <section className="analysis-box">

          <h3>Resume Quality</h3>

          <p>
            {data.resume_quality}
          </p>

        </section>

        {/* Recommendations */}

        <section className="analysis-box">

          <h3>Recommendations</h3>

          <ul>
            {data.recommendations?.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}
          </ul>

        </section>

        {/* Suggested Roles */}

        <section className="analysis-box">

          <h3>Suggested Roles</h3>

          <div className="analysis-tags role-tags">

            {data.suggested_roles?.map(
              (role, index) => (
                <span key={index}>
                  {role}
                </span>
              )
            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Analysis;