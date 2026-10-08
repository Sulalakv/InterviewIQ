import { useEffect, useState } from "react";
import { getJobs, getJobMatches } from "../api/job";

function JobMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const jobs = await getJobs();

      const allMatches = [];

      for (const job of jobs) {
        const jobMatches = await getJobMatches(job.id);

        jobMatches.forEach((match) => {
          allMatches.push({
            ...match,
            jobTitle: job.title,
            company: job.company,
          });
        });
      }

      allMatches.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

      setMatches(allMatches);
    } catch (error) {
      console.error("JOB MATCH HISTORY ERROR:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to load job matches."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-matches-page">

      <header className="dashboard-header">

        <div>
          <h1>InterviewIQ</h1>
          <p>Job Match History</p>
        </div>

        <nav className="dashboard-nav">
          <a href="/dashboard">Dashboard</a>
          <a href="/resumes">Resumes</a>
          <a href="/jobs">Jobs</a>
          <a href="/job-matches">Job Matches</a>

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

      <main className="job-matches-content">

        <div className="page-heading">
          <h2>Job Match History</h2>

          <p>
            View your previous resume-to-job matching
            results.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            Loading job matches...
          </div>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <h3>No job matches yet</h3>

            <p>
              Go to Jobs and match one of your resumes
              with a job.
            </p>

            <a
              className="primary-link"
              href="/jobs"
            >
              Go to Jobs
            </a>
          </div>
        ) : (
          <div className="match-history-list">

            {matches.map((match) => (

              <div
                className="match-history-card"
                key={match.match_id}
              >

                <div className="match-history-header">

                  <div>
                    <h3>{match.jobTitle}</h3>

                    {match.company && (
                      <p>{match.company}</p>
                    )}
                  </div>

                  <div className="history-score">
                    <strong>
                      {match.match_score}
                    </strong>

                    <span>/ 100</span>
                  </div>

                </div>

                <div className="match-history-info">

                  <div>
                    <span>Match ID</span>
                    <strong>
                      #{match.match_id}
                    </strong>
                  </div>

                  <div>
                    <span>Resume</span>
                    <strong>
                      #{match.resume_id}
                    </strong>
                  </div>

                  <div>
                    <span>Job</span>
                    <strong>
                      #{match.job_id}
                    </strong>
                  </div>

                  <div>
                    <span>Date</span>
                    <strong>
                      {new Date(
                        match.created_at
                      ).toLocaleDateString()}
                    </strong>
                  </div>

                </div>

                <div className="match-history-actions">

                  <a
                    href={`/job-matches/${match.match_id}`}
                    className="view-match-button"
                  >
                    View Analysis
                  </a>

                </div>

              </div>

            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default JobMatches;