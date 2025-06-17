import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios'; // Removed
import { useAuth } from '../../auth/context/AuthContext'; // Adjusted path
import reservationService, { Reservation } from '../../services/reservationService'; // Added service import
// import './ManageReservationsPage.css'; // Optional CSS

// Interface Reservation is now imported from reservationService
// const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api'; // Removed

const ManageReservationsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pendiente' | 'aprobada' | 'rechazada'>('all');

  const fetchAllReservations = useCallback(async () => {
    if (!token || (user && (user.role !== 'admin' && user.role !== 'superadmin'))) {
      setError("No tienes permiso para ver esta página.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // const response = await axios.get(`${API_URL}/reservations`, { // Removed
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // Sort by creation date, newest first
      // setReservations(response.data.sort((a: Reservation, b: Reservation) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      const data = await reservationService.getAllReservations(token);
      setReservations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('No se pudieron cargar las reservas.');
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    fetchAllReservations();
  }, [fetchAllReservations]);

  const handleUpdateStatus = async (id: string, newStatus: 'aprobada' | 'rechazada') => {
    if (!token) return;
    // Optimistic update can be added here if desired
    try {
      // const response = await axios.put( // Removed
      //   `${API_URL}/reservations/${id}`,
      //   { status: newStatus },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      // setReservations((prevReservations) =>
      //   prevReservations.map((res) =>
      //     res._id === id ? { ...res, status: response.data.status, updatedAt: response.data.updatedAt } : res
      //   )
      // );
      const updatedReservation = await reservationService.updateReservationStatus(id, newStatus, token);
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res._id === id ? { ...res, status: updatedReservation.status, updatedAt: updatedReservation.updatedAt } : res
        )
      );
    } catch (err: any) {
      console.error('Error updating reservation status:', err);
      alert(`Error al actualizar la reserva: ${err.response?.data?.message || err.message}`);
      // Rollback optimistic update if implemented
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Assuming dates are UTC
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'aprobada': return 'bg-green-100 text-green-700 border-green-300';
      case 'rechazada': return 'bg-red-100 text-red-700 border-red-300';
      case 'pendiente': default: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const filteredReservations = reservations.filter(res => {
    if (filterStatus === 'all') return true;
    return res.status === filterStatus;
  });

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return <div className="p-4">Acceso denegado. Esta página es solo para administradores.</div>;
  }

  return (
    <div className="container mx-auto p-4 pt-8"> {/* Adjusted padding */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestionar Solicitudes de Reserva</h1>

      <div className="mb-4 flex justify-center">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="p-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="all">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>
      </div>

      {isLoading && <p className="text-center text-gray-600">Cargando solicitudes...</p>}
      {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md shadow">{error}</p>}

      {!isLoading && !error && filteredReservations.length === 0 && (
        <p className="text-center text-gray-600">
          {filterStatus === 'all' ? 'No hay solicitudes de reserva.' : `No hay solicitudes ${filterStatus}s.`}
        </p>
      )}

      {!isLoading && !error && filteredReservations.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propósito</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((res) => (
                <tr key={res._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{res.userId?.username || 'N/A'} ({res.userId?.role || 'N/A'})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{res.space}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(res.date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{res.startTime} - {res.endTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={res.purpose}>{res.purpose}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(res.status)} border`}>
                      {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(res.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {res.status === 'pendiente' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(res._id, 'aprobada')}
                          className="text-green-600 hover:text-green-900 mr-3 transition-colors"
                          title="Aprobar"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(res._id, 'rechazada')}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Rechazar"
                        >
                          Rechazar
                        </button>
                      </>
                    )}
                    {res.status !== 'pendiente' && (
                       <span className="text-gray-400">Gestionada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageReservationsPage;
