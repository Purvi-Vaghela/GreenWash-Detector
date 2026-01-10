import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
});

export async function analyzeReport(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function getReports() {
  const response = await api.get('/reports');
  return response.data;
}

export async function getReport(reportId) {
  const response = await api.get(`/reports/${reportId}`);
  return response.data;
}

export async function deleteReport(reportId) {
  const response = await api.delete(`/reports/${reportId}`);
  return response.data;
}

export default api;
