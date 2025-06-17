import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // For dateClick, eventClick, etc.
// import listPlugin from '@fullcalendar/list'; // Optional: if you want a list view

// Import FullCalendar's core styles and theme (DayGrid)
import '@fullcalendar/core/main.css'; // Main CSS for FullCalendar structure
import '@fullcalendar/daygrid/main.css'; // CSS for DayGrid views (month, day, week)
// If you had a theme CSS like bootstrap or a custom one, you'd import it too.
// For Tailwind, we'll rely on global styles or try to apply classes directly.

interface PublicReservation {
  _id: string;
  space: 'aula' | 'auditorio';
  date: string; // ISO string date (e.g., "2024-07-28T00:00:00.000Z")
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  purpose: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO8601 string: YYYY-MM-DDTHH:mm:ss
  end: string;   // ISO8601 string: YYYY-MM-DDTHH:mm:ss
  allDay: boolean;
  extendedProps: {
    space: string;
    purpose: string;
  };
  className?: string; // For custom styling per event
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/api';

const PublicActivitiesCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const fetchApprovedReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<PublicReservation[]>(`${API_URL}/reservations/public/approved-reservations`);
      const transformedEvents = response.data.map((reservation) => {
        // Combine date and time correctly. Date from backend is likely YYYY-MM-DD.
        // Start and end times are HH:MM.
        const datePart = reservation.date.split('T')[0]; // Get YYYY-MM-DD from ISO string

        return {
          id: reservation._id,
          title: `${reservation.purpose.substring(0,30)}${reservation.purpose.length > 30 ? '...' : ''} (${reservation.space})`, // Shorten purpose for title
          start: `${datePart}T${reservation.startTime}:00`, // Assuming startTime is HH:MM
          end: `${datePart}T${reservation.endTime}:00`,     // Assuming endTime is HH:MM
          allDay: false, // Or determine based on duration if needed
          extendedProps: {
            space: reservation.space,
            purpose: reservation.purpose,
          },
          // Example of basic custom styling based on space
          backgroundColor: reservation.space === 'auditorio' ? '#003087' : '#007bff', // Dark blue for auditorio, lighter blue for aula
          borderColor: reservation.space === 'auditorio' ? '#00246b' : '#0056b3',
          textColor: '#ffffff',
          className: 'cursor-pointer rounded-md text-xs p-0.5' // Add some general styling
        };
      });
      setEvents(transformedEvents);
    } catch (err) {
      console.error('Error fetching approved reservations:', err);
      setError('No se pudieron cargar las actividades.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedReservations();
  }, [fetchApprovedReservations]);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };


  if (isLoading) {
    return <div className="text-center p-10">Cargando calendario de actividades...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-600 bg-red-50 rounded-md">{error}</div>;
  }

  return (
    <div className="bg-white p-2 sm:p-4 md:p-6 rounded-lg shadow-lg my-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-6">Calendario de Actividades</h2>
      <div className="calendar-container"> {/* For potential custom styling wrapper */}
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale="es" // Set locale to Spanish
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista'
          }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek' // Removed dayGridDay and listMonth for simplicity
          }}
          height="auto" // Adjust height as needed, 'auto' fits content
          contentHeight="auto"
          aspectRatio={1.5} // Adjust aspect ratio
          eventClick={handleEventClick}
          // Apply Tailwind classes via FullCalendar's classNames API if @fullcalendar/tailwind isn't used
          // Example (might need more specific targeting):
          // viewClassNames="bg-gray-50"
          // eventClassNames="border-blue-500"
          // dayHeaderClassNames="text-blue-700 font-semibold"
          // More specific styling can be done via a CSS file if needed.
          // For now, relying on default styles + event specific styles.
          eventTimeFormat={{ // Format time in events
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          displayEventEnd={true} // Display event end times
          slotMinTime="07:00:00" // Calendar start time
          slotMaxTime="22:00:00" // Calendar end time
          // Add more configurations as needed (e.g., businessHours, eventContent)
           eventDidMount={(info) => { // Tooltip on hover
            // Simple browser tooltip
            info.el.title = `${info.event.extendedProps.purpose} (${info.event.extendedProps.space})
${new Date(info.event.startStr).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})} - ${new Date(info.event.endStr).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}`;
          }}
        />
      </div>
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-3 text-blue-700">{selectedEvent.extendedProps.purpose}</h3>
            <p className="text-sm text-gray-600 mb-1"><strong>Espacio:</strong> <span className="capitalize">{selectedEvent.extendedProps.space}</span></p>
            <p className="text-sm text-gray-600 mb-1"><strong>Inicio:</strong> {new Date(selectedEvent.startStr).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            <p className="text-sm text-gray-600 mb-4"><strong>Fin:</strong> {new Date(selectedEvent.endStr).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            <button
              onClick={closeModal}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicActivitiesCalendar;
