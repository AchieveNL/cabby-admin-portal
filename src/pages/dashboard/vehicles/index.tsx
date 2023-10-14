import React from 'react';
import Vehicles from '@/views/vehicles/Vehicles';
import DashboardLayout from '@/layout/DashboardLayout';

const VehiclesPage = () => {
  return (
    <>
      <DashboardLayout>
        <Vehicles />
      </DashboardLayout>
    </>
  );
};

export default VehiclesPage;
