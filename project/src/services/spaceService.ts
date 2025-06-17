import axios from 'axios';
import API_ROUTES from '../config/api'; // Ajustar ruta si es necesario

export interface Space {
  _id: string;
  name: string;
  capacity: number;
  description?: string;
  isActive?: boolean;
}

const SpaceService = {
  getAllActive: async (): Promise<Space[]> => {
    const response = await axios.get(API_ROUTES.SPACES_ALL_ACTIVE); // Usa la ruta para espacios activos
    return response.data;
  }
  // Aquí podrían ir otros métodos como getById, create, update, delete si se gestionan desde el frontend
};
export default SpaceService;
