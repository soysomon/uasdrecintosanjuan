import React from 'react';
import ReservationsAdminDashboard from '../../components/reservations/ReservationsAdminDashboard';
import MainLayout from '../../components/MainLayout'; // Asumiendo MainLayout

const AdminReservationsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <ReservationsAdminDashboard />
      </div>
    </MainLayout>
  );
};

export default AdminReservationsPage;
