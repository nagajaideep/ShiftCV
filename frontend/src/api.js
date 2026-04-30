import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_URL || '';
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

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

export const checkBackendStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/health`);
    return response.data.status === 'ok';
  } catch (err) {
    return false;
  }
};
