import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  matchResumeWithJob,
} from "../api/job";
import { getResumes } from "../api/resume";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const [selectedResume, setSelectedResume] = useState({});

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [matchingJob, setMatchingJob] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsData, resumesData] = await Promise.all([
        getJobs(),
        getResumes(),
      ]);

      setJobs(jobsData);
      setResumes(resumesData);
    } catch (error) {
      console.error("JOBS LOAD ERROR:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Job title and description are required.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setMessage("");

      const result = await createJob({
        title,
        company,
        description,
      });

      setMessage(
        `Job "${result.title}" created successfully.`
      );

      setTitle("");
      setCompany("");
      setDescription("");

      await loadData();
    } catch (error) {
      console.error("CREATE JOB ERROR:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to create job."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleMatch = async (jobId) => {
    const resumeId = selectedResume[jobId];

    if (!resumeId) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setMatchingJob(jobId);
      setError("");
      setMessage("");

      const result = await matchResumeWithJob(
        jobId,
        resumeId
      );

      navigate(`/jobs/${jobId}/match`);

    } catch (error) {
      console.error("JOB MATCH ERROR:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to match resume with job."
      );
    } finally {
      setMatchingJob(null);
    }
  };

  return (
    <div className="jobs-page">

      <header className="dashboard-header">

        <div>
          <h1>InterviewIQ</h1>
          <p>Job Management</p>
        </div>

        <nav className="dashboard-nav">
          <a href="/dashboard">Dashboard</a>
          <a href="/resumes">Resumes</a>
          <a href="/jobs">Jobs</a>
          <a href="/job-matches">Job Matches</a>

          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem(
                "access_token"
              );

              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </nav>

      </header>

      <main className="jobs-content">

        <div className="page-heading">
          <h2>Jobs</h2>

          <p>
            Add job descriptions and match them
            with your resumes.
          </p>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Create Job */}

        <section className="job-form-card">

          <h3>Add New Job</h3>

          <form onSubmit={handleCreateJob}>

            <div className="job-form-row">

              <div className="job-form-group">
                <label>Job Title</label>

                <input
                  type="text"
                  placeholder="Python Backend Developer"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                />
              </div>

              <div className="job-form-group">
                <label>Company</label>

                <input
                  type="text"
                  placeholder="Company name"
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                />
              </div>

            </div>

            <div className="job-form-group">

              <label>Job Description</label>

              <textarea
                placeholder="Paste the complete job description here..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows="7"
                required
              />

            </div>

            <button
              type="submit"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Job"}
            </button>

          </form>

        </section>

        {/* Job List */}

        <section className="jobs-list-section">

          <div className="section-heading">
            <h3>Your Jobs</h3>

            <span>
              {jobs.length} job
              {jobs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <p className="loading-text">
              Loading jobs...
            </p>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <p>No jobs created yet.</p>
            </div>
          ) : (
            <div className="job-list">

              {jobs.map((job) => (

                <div
                  className="job-card"
                  key={job.id}
                >

                  <div className="job-card-header">

                    <div>
                      <h3>{job.title}</h3>

                      {job.company && (
                        <p className="company-name">
                          {job.company}
                        </p>
                      )}
                    </div>

                    <span className="job-id">
                      Job #{job.id}
                    </span>

                  </div>

                  <div className="job-description">
                    {job.description}
                  </div>

                  <div className="match-area">

                    <label>
                      Select Resume
                    </label>

                    <select
                      value={
                        selectedResume[job.id] || ""
                      }
                      onChange={(e) =>
                        setSelectedResume({
                          ...selectedResume,
                          [job.id]: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Choose a resume
                      </option>

                      {resumes.map((resume) => (
                        <option
                        key={resume.id}
                        value={resume.id}
                        >
                            Resume #{resume.id} — {resume.filename}
                        </option>
                      ))}
                    </select>

                    <button
                      className="match-button"
                      onClick={() =>
                        handleMatch(job.id)
                      }
                      disabled={
                        matchingJob === job.id
                      }
                    >
                      {matchingJob === job.id
                        ? "Matching..."
                        : "Match Resume"}
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Jobs;