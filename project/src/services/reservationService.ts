import axios from 'axios';
import API_ROUTES from '../config/api'; // Ajustar ruta si es necesario

export interface ReservationFormData { // Ya definida en ReservationForm, podría ser compartida
  spaceId: string;
  activityName: string;
  reservationDate: string;
  startTime: string;
  endTime: string;
  requestedResources: string[];
  userComments?: string;
}

export interface Reservation extends ReservationFormData {
  _id: string;
  userId: string; // o un objeto User si se popula
  status: string;
  // ...otros campos que devuelve el backend
}

export interface PopulatedUser {
  _id: string;
  name?: string;
  email: string;
}
export interface PopulatedSpace {
  _id: string;
  name: string;
}
export interface PopulatedResource {
  _id: string;
  name: string;
}
export interface AdminReservationView extends Omit<Reservation, 'userId' | 'spaceId' | 'requestedResources'> {
  userId: PopulatedUser;
  spaceId: PopulatedSpace;
  requestedResources: PopulatedResource[];
}
export interface PaginatedReservations {
  reservations: AdminReservationView[];
  totalPages: number;
  currentPage: number;
}

const ReservationService = {
  create: async (data: ReservationFormData): Promise<Reservation> => {
    const response = await axios.post(API_ROUTES.RESERVATIONS_CREATE, data);
    return response.data;
  },

  getAll: async (filters: { status?: string; space?: string; dateFrom?: string; dateTo?: string; page?: number; limit?: number } = {}): Promise<PaginatedReservations> => {
    const response = await axios.get(API_ROUTES.RESERVATIONS_CRUD, { params: filters });
    return response.data;
  },
  // Otros métodos como getMyReservations, cancelReservation, etc.
};
export default ReservationService;
