import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SpaceService, { Space } from '../../services/spaceService';
import ResourceService, { Resource } from '../../services/resourceService';
import ReservationService from '../../services/reservationService';
import { toast } from 'react-hot-toast';

interface ReservationFormData {
  spaceId: string;
  activityName: string;
  reservationDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  requestedResources: string[];
  userComments?: string;
}

const ReservationForm: React.FC = () => {
  const [formData, setFormData] = useState<ReservationFormData>({
    spaceId: '',
    activityName: '',
    reservationDate: '',
    startTime: '',
    endTime: '',
    requestedResources: [],
    userComments: '',
  });

  const queryClient = useQueryClient();

  const { data: spaces, isLoading: isLoadingSpaces, error: errorSpaces } = useQuery<Space[], Error>({
    queryKey: ['spaces'],
    queryFn: SpaceService.getAllActive
  });

  const { data: resources, isLoading: isLoadingResources, error: errorResources } = useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: ResourceService.getAllAvailable
  });

  const createReservationMutation = useMutation({
    mutationFn: ReservationService.create,
    onSuccess: () => {
      toast.success('Solicitud de reserva enviada con éxito!');
      setFormData({ // Reset form
        spaceId: '',
        activityName: '',
        reservationDate: '',
        startTime: '',
        endTime: '',
        requestedResources: [],
        userComments: '',
      });
      queryClient.invalidateQueries({ queryKey: ['reservations'] }); // Invalidar para otras vistas/listas
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.msg || error.message || 'Error al enviar la solicitud.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newResources = checked
        ? [...prev.requestedResources, value]
        : prev.requestedResources.filter(id => id !== value);
      return { ...prev, requestedResources: newResources };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones básicas aquí
    if (!formData.spaceId || !formData.activityName || !formData.reservationDate || !formData.startTime || !formData.endTime) {
      toast.error('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // Validar fecha no pasada
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar para comparar solo la fecha
    // Ajustar la fecha seleccionada para que también esté en UTC a medianoche para una comparación justa
    const selectedDateParts = formData.reservationDate.split('-');
    const selectedDate = new Date(Date.UTC(Number(selectedDateParts[0]), Number(selectedDateParts[1]) - 1, Number(selectedDateParts[2])));

     if (selectedDate < today) {
         toast.error('No se puede seleccionar una fecha pasada.');
         return;
     }

    // Validar hora de fin > hora de inicio
    if (formData.startTime >= formData.endTime) {
      toast.error('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }
    createReservationMutation.mutate(formData);
  };

  if (isLoadingSpaces || isLoadingResources) return <p>Cargando datos necesarios...</p>;
  if (errorSpaces) return <p>Error cargando espacios: {errorSpaces.message}</p>;
  if (errorResources) return <p>Error cargando recursos: {errorResources.message}</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 md:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800">Crear Solicitud de Reserva</h2>

      <div>
        <label htmlFor="activityName" className="block text-sm font-medium text-gray-700">Nombre de la Actividad</label>
        <input
          type="text"
          name="activityName"
          id="activityName"
          value={formData.activityName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="spaceId" className="block text-sm font-medium text-gray-700">Espacio</label>
        <select
          name="spaceId"
          id="spaceId"
          value={formData.spaceId}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        >
          <option value="">Seleccione un espacio</option>
          {spaces?.map(space => <option key={space._id} value={space._id}>{space.name} (Cap: {space.capacity})</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            name="reservationDate"
            id="reservationDate"
            value={formData.reservationDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Hora Inicio</label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Hora Fin</label>
          <input
            type="time"
            name="endTime"
            id="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Recursos Adicionales</label>
        <div className="mt-2 space-y-2">
            {resources?.map(resource => (
            <div key={resource._id} className="flex items-center">
              <input
                id={`resource-${resource._id}`}
                name="requestedResources"
                type="checkbox"
                value={resource._id}
                checked={formData.requestedResources.includes(resource._id)}
                onChange={handleResourceChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={`resource-${resource._id}`} className="ml-2 block text-sm text-gray-900">
                {resource.name}
              </label>
            </div>
            ))}
            {resources?.length === 0 && <p className="text-sm text-gray-500">No hay recursos disponibles.</p>}
        </div>
      </div>

      <div>
        <label htmlFor="userComments" className="block text-sm font-medium text-gray-700">Comentarios Adicionales (Opcional)</label>
        <textarea
          name="userComments"
          id="userComments"
          value={formData.userComments}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={createReservationMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {createReservationMutation.isPending ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;
