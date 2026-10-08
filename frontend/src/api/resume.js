import api from "./axios";

export const getResumes = async () => {
  const response = await api.get("/resume/");

  return response.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post(
    "/resume/upload",
    formData
  );

  return response.data;
};

export const analyzeResume = async (resumeId) => {
  const response = await api.post(
    `/resume/${resumeId}/analyze`,
    {}
  );

  return response.data;
};

export const getResumeAnalysis = async (resumeId) => {
  const response = await api.get(
    `/resume/${resumeId}/analysis`
  );

  return response.data;
};