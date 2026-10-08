import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getResumes,
  uploadResume,
  analyzeResume,
} from "../api/resume";


function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getResumes();

      setResumes(data);
    } catch (error) {
      console.error("RESUME LOAD ERROR:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to load resumes."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF or DOCX file.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const result = await uploadResume(selectedFile);

      setMessage(
        `${result.filename} uploaded successfully.`
      );

      setSelectedFile(null);

      // Reset file input
      e.target.reset();

      await loadResumes();

    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      setError(
        error.response?.data?.detail ||
        "Unable to upload resume."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (resumeId) => {
  try {
    setAnalyzingId(resumeId);
    setError("");
    setMessage("");

    await analyzeResume(resumeId);

    navigate(`/resumes/${resumeId}/analysis`);

  } catch (error) {
    console.error("ANALYSIS ERROR:", error);

    setError(
      error.response?.data?.detail ||
      "Unable to analyze resume."
    );
  } finally {
    setAnalyzingId(null);
  }
};

  return (
    <div className="resumes-page">

      <header className="dashboard-header">
        <div>
          <h1>InterviewIQ</h1>
          <p>Resume Management</p>
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

      <main className="resumes-content">

        <div className="page-heading">
          <h2>My Resumes</h2>

          <p>
            Upload, analyze and manage your resumes.
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

        <section className="upload-card">

          <h3>Upload Resume</h3>

          <p>
            Supported formats: PDF and DOCX
          </p>

          <form onSubmit={handleUpload}>

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => {
                setSelectedFile(e.target.files[0]);
              }}
            />

            <button
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? "Uploading..."
                : "Upload Resume"}
            </button>

          </form>

        </section>

        <section className="resume-list-section">

          <div className="section-heading">
            <h3>Uploaded Resumes</h3>

            <span>
              {resumes.length} resume
              {resumes.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <p className="loading-text">
              Loading resumes...
            </p>
          ) : resumes.length === 0 ? (
            <div className="empty-state">
              <p>No resumes uploaded yet.</p>
            </div>
          ) : (
            <div className="resume-list">

              {resumes.map((resume) => (

                <div
                  className="resume-item"
                  key={resume.id}
                >

                  <div className="resume-info">

                    <div className="resume-icon">
                      PDF
                    </div>

                    <div>
                      <h4>
                        {resume.filename}
                      </h4>

                      <p>
                        Resume ID: {resume.id}
                      </p>
                    </div>

                  </div>

                  <button
                    className="analyze-button"
                    onClick={() =>
                      handleAnalyze(resume.id)
                    }
                    disabled={
                      analyzingId === resume.id
                    }
                  >
                    {analyzingId === resume.id
                      ? "Analyzing..."
                      : "Analyze"}
                  </button>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default Resumes;