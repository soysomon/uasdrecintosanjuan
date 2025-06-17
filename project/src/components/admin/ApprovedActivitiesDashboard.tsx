import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios'; // Removed
import { useAuth } from '../../auth/context/AuthContext'; // Adjust path as needed
import { CalendarCheck } from 'lucide-react'; // Icon for approved activities
import reservationService, { Reservation } from '../../services/reservationService'; // Added service import

// Removed local ApprovedReservation interface, will use Reservation from service
// const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api'; // Removed

const ApprovedActivitiesDashboard: React.FC = () => {
  const { token, isSuperAdmin } = useAuth(); // user object might not be needed if only isSuperAdmin is used
  const [approvedReservations, setApprovedReservations] = useState<Reservation[]>([]); // Changed type to Reservation[]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovedReservations = useCallback(async () => {
    if (!token || !isSuperAdmin) {
      // Silently return if not superadmin, the component rendering is already conditional
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all reservations and filter client-side.
      // const allReservationsResponse = await axios.get<ApprovedReservation[]>(`${API_URL}/reservations`, { // Removed
      //    headers: { Authorization: `Bearer ${token}` }
      // });
      const allReservations = await reservationService.getAllReservations(token);

      const approved = allReservations
        .filter(res => res.status === 'aprobada')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by upcoming date
        .slice(0, 5); // Displaying latest 5 upcoming approved reservations

      setApprovedReservations(approved); // No 'as any' cast needed if types align

    } catch (err) {
      console.error('Error fetching approved reservations:', err);
      setError('No se pudieron cargar las actividades aprobadas.');
    } finally {
      setIsLoading(false);
    }
  }, [token, isSuperAdmin]);

  useEffect(() => {
    fetchApprovedReservations();
  }, [fetchApprovedReservations]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  // The parent component AdminPanelPage already checks for isSuperAdmin before rendering this.
  // So, an explicit check here is redundant if this component is only ever rendered by AdminPanelPage.
  // However, keeping it doesn't harm and makes the component more self-contained if reused.
  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-6">
      <div className="flex items-center mb-3">
        <CalendarCheck size={20} className="text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-700">Próximas Actividades Aprobadas</h3>
      </div>
      {isLoading && <p className="text-sm text-gray-500">Cargando actividades...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!isLoading && !error && approvedReservations.length === 0 && (
        <p className="text-sm text-gray-500">No hay actividades aprobadas próximas.</p>
      )}
      {!isLoading && !error && approvedReservations.length > 0 && (
        <ul className="space-y-2">
          {approvedReservations.map(res => (
            <li key={res._id} className="p-2.5 bg-green-50 rounded-md border border-green-200">
              <p className="font-medium text-sm text-green-700 capitalize">{res.space}: {res.purpose}</p>
              <p className="text-xs text-gray-600">
                Usuario: {res.userId?.username || 'N/A'}
              </p>
              <p className="text-xs text-gray-600">
                Fecha: {formatDate(res.date)} ({res.startTime} - {res.endTime})
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprovedActivitiesDashboard;
