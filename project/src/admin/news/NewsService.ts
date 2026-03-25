import axios from 'axios';
import API_ROUTES from '../../config/api'; // Ajusta la ruta según la ubicación del archivo

export interface ApiError extends Error {
  message: string;
  status?: number;
  data?: any;
}

export const NewsService = {
  fetchNews: async () => {
    try {
      const res = await axios.get(API_ROUTES.NEWS);
      return res.data;
    } catch (error) {
      const err = error as any;
      const apiError: ApiError = new Error('Error al obtener noticias: ' + (err.response?.data?.error || err.message));
      apiError.status = err.response?.status;
      apiError.data = err.response?.data;
      throw apiError;
    }
  },

  createNews: async (newsData: any) => {
    try {
      const res = await axios.post(API_ROUTES.NEWS, newsData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (error) {
      const err = error as any;
      const apiError: ApiError = new Error(
        'Error al crear noticia: ' + (err.response?.data?.error || err.message)
      );
      apiError.status = err.response?.status;
      apiError.data = err.response?.data;
      throw apiError;
    }
  },

  updateNews: async (id: string, newsData: any) => {
    try {
      const res = await axios.put(API_ROUTES.NEWS_BY_ID(id), newsData);
      return res.data;
    } catch (error) {
      const err = error as any;
      const apiError: ApiError = new Error(
        'Error al actualizar noticia: ' + (err.response?.data?.error || err.message)
      );
      apiError.status = err.response?.status;
      apiError.data = err.response?.data;
      throw apiError;
    }
  },

  deleteNews: async (id: string) => {
    try {
      await axios.delete(API_ROUTES.NEWS_BY_ID(id));
    } catch (error) {
      const err = error as any;
      const apiError: ApiError = new Error(
        'Error al eliminar noticia: ' + (err.response?.data?.error || err.message)
      );
      apiError.status = err.response?.status;
      apiError.data = err.response?.data;
      throw apiError;
    }
  },
};