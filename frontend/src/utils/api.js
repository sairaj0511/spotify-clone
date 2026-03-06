import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '/api' 
});

// Attach token
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('spotify_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const songsAPI = {
  getAll: (params) => API.get('/songs', { params }),
  getOne: (id) => API.get(`/songs/${id}`),
  getTrending: () => API.get('/songs/trending'),
  upload: (formData) => API.post('/songs', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/songs/${id}`),
  toggleLike: (id) => API.post(`/songs/${id}/like`),
  download: (id) => API.get(`/songs/${id}/download`),
};

export const albumsAPI = {
  getAll: () => API.get('/albums'),
  getOne: (id) => API.get(`/albums/${id}`),
  create: (formData) => API.post('/albums', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/albums/${id}`),
};

export const playlistsAPI = {
  getMy: () => API.get('/playlists/my'),
  getPublic: () => API.get('/playlists/public'),
  getOne: (id) => API.get(`/playlists/${id}`),
  create: (data) => API.post('/playlists', data),
  update: (id, data) => API.put(`/playlists/${id}`, data),
  delete: (id) => API.delete(`/playlists/${id}`),
  addSong: (id, songId) => API.post(`/playlists/${id}/songs`, { songId }),
  removeSong: (id, songId) => API.delete(`/playlists/${id}/songs/${songId}`),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  updateRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

export const discoverAPI = {
  getTrending: (params) => API.get('/discover/trending', { params }),
  search: (q) => API.get('/discover/search', { params: { q } }),
  getArtists: () => API.get('/discover/artists'),
};

export default API;
