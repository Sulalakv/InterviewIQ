import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await api.get("/dashboard/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data);
      } catch (error) {
        console.error("DASHBOARD ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
          return;
        }

        setError(
          error.response?.data?.detail ||
          "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-message">
        Loading dashboard...
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

  if (!dashboard) {
    return null;
  }

  const counts = dashboard.counts || {};
  const latestResume = dashboard.latest_resume;
  const latestAnalysis = dashboard.latest_analysis;

  const recentResumes = dashboard.recent_resumes || [];
  const recentJobs = dashboard.recent_jobs || [];
  const recentMatches = dashboard.recent_matches || [];

  return (
    <div className="dashboard">

      {/* HEADER */}

      <header className="dashboard-header">

        <div>
          <h1>InterviewIQ</h1>
          <p>AI-Powered Career Assistant</p>
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


      {/* MAIN */}

      <main className="dashboard-content">

        {/* WELCOME */}

        <section className="welcome-section">

          <div>
            <h2>Welcome to InterviewIQ 👋</h2>

            <p>
              Manage your resumes, analyze your skills,
              create jobs and discover your job matches.
            </p>
          </div>

        </section>


        {/* STATISTICS */}

        <section className="stats-grid">

          <Link
            to="/resumes"
            className="stat-card stat-link"
          >
            <span className="stat-icon">📄</span>

            <div>
              <h3>Resumes</h3>
              <strong>
                {counts.resumes || 0}
              </strong>
            </div>
          </Link>


          <Link
            to="/jobs"
            className="stat-card stat-link"
          >
            <span className="stat-icon">💼</span>

            <div>
              <h3>Jobs</h3>
              <strong>
                {counts.jobs || 0}
              </strong>
            </div>
          </Link>


          <Link
            to="/resumes"
            className="stat-card stat-link"
          >
            <span className="stat-icon">📊</span>

            <div>
              <h3>Analyses</h3>
              <strong>
                {counts.analyses || 0}
              </strong>
            </div>
          </Link>


          <Link
            to="/job-matches"
            className="stat-card stat-link"
          >
            <span className="stat-icon">🎯</span>

            <div>
              <h3>Job Matches</h3>
              <strong>
                {counts.matches || 0}
              </strong>
            </div>
          </Link>

        </section>


        {/* QUICK ACTIONS */}

        <section className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="quick-actions-grid">

            <Link
              to="/resumes"
              className="quick-action"
            >
              <span>📄</span>

              <div>
                <strong>Manage Resumes</strong>

                <small>
                  Upload and analyze your resume
                </small>
              </div>
            </Link>


            <Link
              to="/jobs"
              className="quick-action"
            >
              <span>💼</span>

              <div>
                <strong>Add a Job</strong>

                <small>
                  Create a job and match your resume
                </small>
              </div>
            </Link>


            <Link
              to="/job-matches"
              className="quick-action"
            >
              <span>🎯</span>

              <div>
                <strong>View Job Matches</strong>

                <small>
                  Review your previous matches
                </small>
              </div>
            </Link>

          </div>

        </section>


        {/* LATEST RESUME */}

        {latestResume && (
          <section className="dashboard-section">

            <div className="section-title">

              <div>
                <h2>Latest Resume</h2>

                <p>
                  Your most recently uploaded resume
                </p>
              </div>

              <Link
                to="/resumes"
                className="section-link"
              >
                View All
              </Link>

            </div>


            <div className="latest-resume-card">

              <div className="resume-info">

                <div className="resume-icon">
                  📄
                </div>

                <div>
                  <h3>
                    {latestResume.filename}
                  </h3>

                  <p>
                    Resume #{latestResume.id}
                  </p>
                </div>

              </div>

              <Link
                to={`/resumes/${latestResume.id}/analysis`}
                className="primary-button"
              >
                View Analysis
              </Link>

            </div>

          </section>
        )}


        {/* LATEST ANALYSIS */}

        {latestAnalysis && (
          <section className="analysis-card">

            <div className="section-title">

              <div>
                <h2>
                  Latest Resume Analysis
                </h2>

                <p>
                  Resume #{latestAnalysis.resume_id}
                </p>
              </div>

              <Link
                to={`/resumes/${latestAnalysis.resume_id}/analysis`}
                className="section-link"
              >
                View Full Analysis
              </Link>

            </div>


            {/* SCORES */}

            <div className="score-grid">

              <div className="score-card">

                <span>
                  Overall Score
                </span>

                <strong>
                  {latestAnalysis.overall_score}
                </strong>

                <small>
                  / 100
                </small>

              </div>


              <div className="score-card">

                <span>
                  ATS Score
                </span>

                <strong>
                  {latestAnalysis.ats_score}
                </strong>

                <small>
                  / 100
                </small>

              </div>

            </div>


            {/* STRENGTHS */}

            <div className="analysis-section">

              <h3>
                Strengths
              </h3>

              {latestAnalysis.analysis?.strengths?.length ? (
                <ul>

                  {latestAnalysis.analysis.strengths.map(
                    (strength, index) => (
                      <li key={index}>
                        {strength}
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p>
                  No strengths available.
                </p>
              )}

            </div>


            {/* WEAKNESSES */}

            <div className="analysis-section">

              <h3>
                Areas to Improve
              </h3>

              {latestAnalysis.analysis?.weaknesses?.length ? (
                <ul>

                  {latestAnalysis.analysis.weaknesses.map(
                    (weakness, index) => (
                      <li key={index}>
                        {weakness}
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p>
                  No weaknesses available.
                </p>
              )}

            </div>


            {/* MISSING SKILLS */}

            <div className="analysis-section">

              <h3>
                Missing Skills
              </h3>

              <div className="skill-list">

                {latestAnalysis.analysis?.missing_skills?.length ? (

                  latestAnalysis.analysis.missing_skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="skill-tag"
                      >
                        {skill}
                      </span>
                    )
                  )

                ) : (
                  <p>
                    No missing skills identified.
                  </p>
                )}

              </div>

            </div>

          </section>
        )}


        {/* RECENT JOBS */}

        <section className="dashboard-section">

          <div className="section-title">

            <div>
              <h2>Recent Jobs</h2>

              <p>
                Jobs you recently added
              </p>
            </div>

            <Link
              to="/jobs"
              className="section-link"
            >
              View All
            </Link>

          </div>


          {recentJobs.length === 0 ? (

            <div className="empty-dashboard">
              <p>
                No jobs created yet.
              </p>

              <Link
                to="/jobs"
                className="primary-button"
              >
                Create Your First Job
              </Link>
            </div>

          ) : (

            <div className="recent-list">

              {recentJobs.slice(0, 3).map(
                (job) => (

                  <div
                    className="recent-item"
                    key={job.id}
                  >

                    <div>
                      <h3>
                        {job.title}
                      </h3>

                      <p>
                        {job.company || "Company not specified"}
                      </p>
                    </div>

                    <Link
                      to="/jobs"
                      className="small-button"
                    >
                      View Job
                    </Link>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* RECENT MATCHES */}

        <section className="dashboard-section">

          <div className="section-title">

            <div>
              <h2>Recent Job Matches</h2>

              <p>
                Your latest resume-to-job matches
              </p>
            </div>

            <Link
              to="/job-matches"
              className="section-link"
            >
              View All
            </Link>

          </div>


          {recentMatches.length === 0 ? (

            <div className="empty-dashboard">

              <p>
                No job matches yet.
              </p>

              <Link
                to="/jobs"
                className="primary-button"
              >
                Match a Resume
              </Link>

            </div>

          ) : (

            <div className="recent-list">

              {recentMatches.slice(0, 3).map(
                (match) => (

                  <div
                    className="recent-item"
                    key={match.match_id}
                  >

                    <div>

                      <h3>
                        Job #{match.job_id}
                      </h3>

                      <p>
                        Resume #{match.resume_id}
                      </p>

                    </div>


                    <div className="dashboard-match-score">

                      <strong>
                        {match.match_score}
                      </strong>

                      <span>
                        /100
                      </span>

                    </div>


                    <Link
                      to={`/job-matches/${match.match_id}`}
                      className="small-button"
                    >
                      View Analysis
                    </Link>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;