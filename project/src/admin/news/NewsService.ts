import axios from 'axios';
import API_ROUTES from '../../config/api'; // Ajusta la ruta según la ubicación del archivo

export const NewsService = {
  fetchNews: async () => {
    const res = await axios.get(API_ROUTES.NEWS);
    return res.data;
  },
  createNews: async (newsData: any) => {
    const res = await axios.post(API_ROUTES.NEWS, newsData);
    return res.data;
  },
  updateNews: async (id: string, newsData: any) => {
    const res = await axios.put(API_ROUTES.NEWS_BY_ID(id), newsData);
    return res.data;
  },
  deleteNews: async (id: string) => {
    await axios.delete(API_ROUTES.NEWS_BY_ID(id));
  },
};