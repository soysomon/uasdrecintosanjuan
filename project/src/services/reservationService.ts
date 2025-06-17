import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api';

export interface ReservationData { // Exporting for potential use in components
  space: 'aula' | 'auditorio';
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface Reservation extends ReservationData { // Exporting for use in components
  _id: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  userId: {
    _id: string;
    username: string;
    role?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const reservationService = {
  createReservation: async (data: ReservationData, token: string): Promise<Reservation> => {
    const response = await axios.post<Reservation>(`${API_BASE_URL}/reservations`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getUserReservations: async (userId: string, token: string): Promise<Reservation[]> => {
    const response = await axios.get<Reservation[]>(`${API_BASE_URL}/reservations/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getAllReservations: async (token: string): Promise<Reservation[]> => {
    const response = await axios.get<Reservation[]>(`${API_BASE_URL}/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateReservationStatus: async (id: string, status: 'aprobada' | 'rechazada', token: string): Promise<Reservation> => {
    const response = await axios.put<Reservation>(
      `${API_BASE_URL}/reservations/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};

export default reservationService;
