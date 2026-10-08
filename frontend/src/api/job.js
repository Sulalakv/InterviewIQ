import api from "./axios";

export const getJobs = async () => {
  const response = await api.get("/jobs/");

  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post("/jobs/", jobData);

  return response.data;
};

export const matchResumeWithJob = async (
  jobId,
  resumeId
) => {
  const response = await api.post(
    `/jobs/${jobId}/match/${resumeId}`,
    {}
  );

  return response.data;
};

export const getJobMatches = async (jobId) => {
  const response = await api.get(
    `/jobs/${jobId}/matches`
  );

  return response.data;
};

export const getJobMatch = async (matchId) => {
  const response = await api.get(
    `/jobs/matches/${matchId}`
  );

  return response.data;
};