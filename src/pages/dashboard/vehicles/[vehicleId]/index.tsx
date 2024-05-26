import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import VehicleDetails from '@/views/vehicles/VehicleDetails';

const VehicleDetailPage = () => {
  return (
    <DashboardLayout headerTitle="Auto's">
      <VehicleDetails />
    </DashboardLayout>
  );
};

export default VehicleDetailPage;
