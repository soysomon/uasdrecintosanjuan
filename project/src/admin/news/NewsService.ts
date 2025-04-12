// src/admin/news/NewsService.ts
import axios from 'axios';

export const NewsService = {
  fetchNews: async () => {
    const res = await axios.get('http://localhost:5000/api/news');
    return res.data;
  },
  createNews: async (newsData: any) => {
    const res = await axios.post('http://localhost:5000/api/news', newsData);
    return res.data;
  },
  updateNews: async (id: string, newsData: any) => {
    const res = await axios.put(`http://localhost:5000/api/news/${id}`, newsData);
    return res.data;
  },
  deleteNews: async (id: string) => {
    await axios.delete(`http://localhost:5000/api/news/${id}`);
  },
};