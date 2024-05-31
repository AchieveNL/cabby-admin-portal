import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import CreateVehicle from '@/views/vehicles/CreateVehicle';

const CreateVehiclePage = () => {
  return (
    <DashboardLayout headerTitle="Auto's">
      <CreateVehicle />
    </DashboardLayout>
  );
};

export default CreateVehiclePage;
