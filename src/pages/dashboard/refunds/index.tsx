import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import Refunds from '@/views/refunds/Refunds';

const VehiclesPage = () => {
  return (
    <>
      <DashboardLayout>
        <Refunds />
      </DashboardLayout>
    </>
  );
};

export default VehiclesPage;
