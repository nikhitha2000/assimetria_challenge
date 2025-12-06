import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const articlesAPI = {
  // Get all articles
  getAll: async (limit = 50, offset = 0) => {
    const response = await apiClient.get('/articles', {
      params: { limit, offset },
    });
    return response.data;
  },

  // Get single article by ID
  getById: async (id) => {
    const response = await apiClient.get(`/articles/${id}`);
    return response.data;
  },
};

export default apiClient;


