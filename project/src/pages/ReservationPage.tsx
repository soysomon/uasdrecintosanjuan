import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios'; // Removed
import { useAuth } from '../auth/context/AuthContext';
import reservationService, { Reservation } from '../services/reservationService'; // Added service import
// import './ReservationPage.css'; // Optional: Create and import a CSS file if needed

// Interface Reservation is now imported from reservationService
// const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api'; // Removed

const ReservationPage: React.FC = () => {
  const { user, token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [space, setSpace] = useState<'aula' | 'auditorio'>('aula');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUserReservations = useCallback(async () => {
    if (!user || !token) return;
    setIsLoading(true);
    setError(null);
    try {
      // const response = await axios.get(`${API_BASE_URL}/reservations/user/${user.id}`, { // Removed
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // setReservations(response.data.sort((a: Reservation, b: Reservation) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      const data = await reservationService.getUserReservations(user.id, token);
      setReservations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('No se pudieron cargar las reservas.');
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchUserReservations();
  }, [fetchUserReservations]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!user || !token) {
      setFormError('Debes iniciar sesión para crear una reserva.');
      return;
    }

    if (!space || !date || !startTime || !endTime || !purpose) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      setFormError('La fecha de reserva no puede ser en el pasado.');
      return;
    }
    // Ensure time is correctly formatted for comparison if needed, or rely on backend
    if (endTime <= startTime) {
      setFormError('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }

    setIsLoading(true);
    try {
      // await axios.post( // Removed
      //   `${API_BASE_URL}/reservations`,
      //   { space, date, startTime, endTime, purpose },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      await reservationService.createReservation(
        { space, date, startTime, endTime, purpose },
        token
      );
      setSpace('aula');
      setDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
      fetchUserReservations(); // Refresh list after successful submission
    } catch (err: any) {
      console.error('Error creating reservation:', err);
      setFormError(err.response?.data?.message || 'Error al crear la reserva.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'aprobada':
        return 'bg-green-100 text-green-700';
      case 'rechazada':
        return 'bg-red-100 text-red-700';
      case 'pendiente':
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (!user) {
    return <div className="container mx-auto p-4 pt-20">Por favor, inicia sesión para gestionar tus reservas.</div>;
  }

  if (user.role !== 'estandar') {
    return (
      <div className="container mx-auto p-4 pt-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Gestión de Reservas</h1>
        <p>Esta sección es para usuarios estándar. Los administradores gestionan las reservas desde el panel de administración.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Mis Reservas</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Crear Nueva Reserva</h2>
        {formError && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{formError}</p>}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="space" className="block text-sm font-medium text-gray-700">Espacio:</label>
            <select
              id="space"
              value={space}
              onChange={(e) => setSpace(e.target.value as 'aula' | 'auditorio')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="aula">Aula</option>
              <option value="auditorio">Auditorio</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Hora Inicio:</label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Hora Fin:</label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Propósito:</label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Historial de Solicitudes</h2>
        {isLoading && <p>Cargando reservas...</p>}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
        {!isLoading && !error && reservations.length === 0 && (
          <p className="text-gray-600">No tienes reservas creadas.</p>
        )}
        {!isLoading && !error && reservations.length > 0 && (
          <ul className="space-y-4">
            {reservations.map((res) => (
              <li key={res._id} className={`p-4 border rounded-lg shadow-sm ${getStatusClass(res.status)}`}>
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-lg font-semibold capitalize">{res.space}</p>
                    <p className="text-sm text-gray-600"><strong>Propósito:</strong> {res.purpose}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:text-right">
                     <p className={`text-sm font-medium px-2 py-1 inline-block rounded-full ${getStatusClass(res.status)} border ${res.status === 'pendiente' ? 'border-yellow-500' : res.status === 'aprobada' ? 'border-green-500' : 'border-red-500'}`}>
                        Estado: {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                     </p>
                    <p className="text-xs text-gray-500">Solicitado: {formatDate(res.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>Fecha:</strong> {formatDate(res.date)}</p>
                  <p><strong>Horario:</strong> {res.startTime} - {res.endTime}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReservationPage;
