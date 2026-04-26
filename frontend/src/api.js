import axios from 'axios';

export const transformResume = async (resumeFile, templateFile) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('template', templateFile);

  const response = await axios.post('/api/transform', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.latex;
};

export const compileLatex = async (latex) => {
  const response = await axios.post('/api/compile', { latex }, {
    responseType: 'blob',
  });
  return URL.createObjectURL(response.data);
};
