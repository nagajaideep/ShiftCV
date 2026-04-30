import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const transformResume = async (resumeFile, templateFile) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('template', templateFile);

  const response = await axios.post(`${API_BASE_URL}/api/transform`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.latex;
};

export const compileLatex = async (latex) => {
  const response = await axios.post(`${API_BASE_URL}/api/compile`, { latex }, {
    responseType: 'blob',
  });
  return URL.createObjectURL(response.data);
};
