import React from 'react';
import ReservationForm from '../../components/reservations/ReservationForm';
import MainLayout from '../../components/MainLayout'; // Asumiendo que MainLayout es el layout principal

const CreateReservationPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <ReservationForm />
      </div>
    </MainLayout>
  );
};

export default CreateReservationPage;
