import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import CreateRefund from '@/views/refunds/CreateRefund';

const CreateVehiclePage = () => {
  return (
    <DashboardLayout>
      <CreateRefund />
    </DashboardLayout>
  );
};

export default CreateVehiclePage;
