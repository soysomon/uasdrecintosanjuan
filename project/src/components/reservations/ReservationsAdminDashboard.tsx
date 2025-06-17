import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReservationService, { AdminReservationView, PaginatedReservations } from '../../services/reservationService'; // Ajustar ruta
import { toast } from 'react-hot-toast';
import { format } from 'date-fns'; // Para formatear fechas

const ReservationsAdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: '' }); // Añadir más filtros según sea necesario

  const { data: paginatedData, isLoading, error, refetch } = useQuery<PaginatedReservations, Error>({
    queryKey: ['adminReservations', filters],
    queryFn: () => ReservationService.getAll(filters),
    keepPreviousData: true, // Útil para paginación
  });

  // Placeholder para mutaciones de aprobar/rechazar
  // const updateStatusMutation = useMutation(ReservationService.updateStatus, {
  //   onSuccess: () => {
  //     toast.success('Estado de la reserva actualizado.');
  //     queryClient.invalidateQueries(['adminReservations']);
  //   },
  //   onError: (err: any) => {
  //     toast.error(err.response?.data?.msg || 'Error al actualizar estado.');
  //   }
  // });

  const handleApprove = (id: string) => {
    console.log('Aprobar reserva:', id); // Placeholder
    // updateStatusMutation.mutate({ id, status: 'aprobada' });
    toast.info('Funcionalidad Aprobar: Pendiente de implementar mutación.');
  };

  const handleReject = (id: string) => {
    const reason = prompt("Motivo del rechazo (opcional):");
    console.log('Rechazar reserva:', id, "Motivo:", reason); // Placeholder
    // updateStatusMutation.mutate({ id, status: 'rechazada', comments: reason || '' });
    toast.info('Funcionalidad Rechazar: Pendiente de implementar mutación.');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));
  };

  if (isLoading) return <p className="text-center py-4">Cargando reservas...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Error al cargar reservas: {error.message}</p>;

  const reservations = paginatedData?.reservations || [];
  const totalPages = paginatedData?.totalPages || 1;
  const currentPage = paginatedData?.currentPage || 1;

  return (
    <div className="p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Panel de Administración de Reservas</h2>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div>
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filtrar por estado:</label>
          <select
            id="statusFilter"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="rechazada">Rechazada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        {/* Añadir más filtros aquí (ej. por espacio, fecha) */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actividad</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.length > 0 ? reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.activityName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.spaceId?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.userId?.name || reservation.userId?.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(reservation.reservationDate), 'dd/MM/yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.startTime} - {reservation.endTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    reservation.status === 'aprobada' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'rechazada' || reservation.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                    reservation.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {reservation.status === 'pendiente' && (
                    <>
                      <button onClick={() => handleApprove(reservation._id)} className="text-indigo-600 hover:text-indigo-900 mr-2">Aprobar</button>
                      <button onClick={() => handleReject(reservation._id)} className="text-red-600 hover:text-red-900">Rechazar</button>
                    </>
                  )}
                  {/* Podrían añadirse más acciones, como ver detalles */}
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="text-center py-4">No hay reservaciones que coincidan con los filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button onClick={() => setFilters(f => ({...f, page: Math.max(1, f.page - 1)}))} disabled={currentPage <= 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> Anterior </button>
          <button onClick={() => setFilters(f => ({...f, page: Math.min(totalPages, f.page + 1)}))} disabled={currentPage >= totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"> Siguiente </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button onClick={() => setFilters(f => ({...f, page: Math.max(1, f.page - 1)}))} disabled={currentPage <= 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"> Anterior </button>
              {/* Aquí se podrían generar números de página si es necesario */}
              <button onClick={() => setFilters(f => ({...f, page: Math.min(totalPages, f.page + 1)}))} disabled={currentPage >= totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"> Siguiente </button>
            </nav>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReservationsAdminDashboard;
