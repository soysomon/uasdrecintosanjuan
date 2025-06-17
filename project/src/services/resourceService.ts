import axios from 'axios';
import API_ROUTES from '../config/api'; // Ajustar ruta si es necesario

export interface Resource {
  _id: string;
  name: string;
  description?: string;
  isAvailable?: boolean;
}

const ResourceService = {
  getAllAvailable: async (): Promise<Resource[]> => {
    const response = await axios.get(API_ROUTES.RESOURCES_ALL_AVAILABLE); // Usa la ruta para recursos disponibles
    return response.data;
  }
  // Otros métodos CRUD si son necesarios
};
export default ResourceService;
