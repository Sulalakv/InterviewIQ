import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobMatch } from "../api/job";

function JobMatch() {
  const { matchId } = useParams();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMatch();
  }, [matchId]);

  const loadMatch = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobMatch(matchId);

      console.log("JOB MATCH:", data);

      setMatch(data);
    } catch (error) {
      console.error("JOB MATCH ERROR:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load job match analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="job-match-page">
        <header className="dashboard-header">
          <div>
            <h1>InterviewIQ</h1>
            <p>Job Match Analysis</p>
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

        <main className="job-match-content">
          <div className="empty-state">
            Loading job match analysis...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-match-page">
        <header className="dashboard-header">
          <div>
            <h1>InterviewIQ</h1>
            <p>Job Match Analysis</p>
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

        <main className="job-match-content">
          <div className="error-message">
            {error}
          </div>

          <Link
            to="/job-matches"
            className="back-button"
          >
            ← Back to Job Matches
          </Link>
        </main>
      </div>
    );
  }

  if (!match) {
    return null;
  }

  const analysis = match.analysis || {};

  return (
    <div className="job-match-page">

      {/* HEADER */}
      <header className="dashboard-header">

        <div>
          <h1>InterviewIQ</h1>
          <p>Job Match Analysis</p>
        </div>

        <nav className="dashboard-nav">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/resumes">
            Resumes
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          <Link to="/job-matches">
            Job Matches
          </Link>

          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("access_token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>

        </nav>

      </header>


      {/* MAIN CONTENT */}
      <main className="job-match-content">

        <Link
          to="/job-matches"
          className="back-button"
        >
          ← Back to Job Matches
        </Link>


        <div className="page-heading">

          <h2>
            Job Match Analysis
          </h2>

          <p>
            Resume #{match.resume_id} matched with Job #{match.job_id}
          </p>

        </div>


        {/* MATCH SCORE */}
        <section className="match-score-card">

          <h3>
            Match Score
          </h3>

          <div className="large-score">
            {match.match_score}
            <span>/ 100</span>
          </div>

        </section>


        {/* MATCHED SKILLS */}
        <section className="analysis-card">

          <h3>
            Matched Skills
          </h3>

          {analysis.matched_skills &&
          analysis.matched_skills.length > 0 ? (
            <div className="skill-list">

              {analysis.matched_skills.map(
                (skill, index) => (
                  <span
                    className="skill-tag matched"
                    key={index}
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          ) : (
            <p>
              No matched skills found.
            </p>
          )}

        </section>


        {/* MISSING SKILLS */}
        <section className="analysis-card">

          <h3>
            Missing Skills
          </h3>

          {analysis.missing_skills &&
          analysis.missing_skills.length > 0 ? (
            <div className="skill-list">

              {analysis.missing_skills.map(
                (skill, index) => (
                  <span
                    className="skill-tag missing"
                    key={index}
                  >
                    {skill}
                  </span>
                )
              )}

            </div>
          ) : (
            <p>
              No missing skills identified.
            </p>
          )}

        </section>


        {/* EXPERIENCE MATCH */}
        <section className="analysis-card">

          <h3>
            Experience Match
          </h3>

          <p>
            {analysis.experience_match ||
              "No experience analysis available."}
          </p>

        </section>


        {/* PROJECT MATCH */}
        <section className="analysis-card">

          <h3>
            Project Match
          </h3>

          <p>
            {analysis.project_match ||
              "No project analysis available."}
          </p>

        </section>


        {/* RECOMMENDATIONS */}
        <section className="analysis-card">

          <h3>
            Recommendations
          </h3>

          {analysis.recommendations &&
          analysis.recommendations.length > 0 ? (
            <ul>

              {analysis.recommendations.map(
                (recommendation, index) => (
                  <li key={index}>
                    {recommendation}
                  </li>
                )
              )}

            </ul>
          ) : (
            <p>
              No recommendations available.
            </p>
          )}

        </section>

      </main>

    </div>
  );
}

export default JobMatch;