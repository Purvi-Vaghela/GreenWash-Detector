import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://136.113.183.167/docs';

const api = axios.create({
  baseURL: API_BASE,
});

// Auth APIs
export async function registerUser(userData) {
  const response = await api.post('/auth/register', userData);
  return response.data;
}

export async function registerAdmin(adminData) {
  const response = await api.post('/auth/admin/register', adminData);
  return response.data;
}

export async function loginUser(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function loginAdmin(email, password) {
  const response = await api.post('/auth/admin/login', { email, password });
  return response.data;
}

// Report APIs
export async function previewPdf(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function analyzeReport(file, userId) {
  const formData = new FormData();
  formData.append('file', file);
  
  const url = userId ? `/analyze?user_id=${userId}` : '/analyze';
  const response = await api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function getReports(userId) {
  const url = userId ? `/reports?user_id=${userId}` : '/reports';
  const response = await api.get(url);
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

// Admin APIs
export async function getAllUsers() {
  const response = await api.get('/admin/users');
  return response.data;
}

export async function getAllCompanies() {
  const response = await api.get('/admin/companies');
  return response.data;
}

export async function getAdminStats() {
  const response = await api.get('/admin/stats');
  return response.data;
}

export async function assignCredit(creditData) {
  const response = await api.post('/admin/credits', creditData);
  return response.data;
}

export async function getAllCredits() {
  const response = await api.get('/admin/credits');
  return response.data;
}

export async function revokeCredit(creditId) {
  const response = await api.delete(`/admin/credits/${creditId}`);
  return response.data;
}

export async function getUserCredits(userId) {
  const response = await api.get(`/users/${userId}/credits`);
  return response.data;
}

export async function getPublicStats() {
  const response = await api.get('/public/stats');
  return response.data;
}

export default api;
