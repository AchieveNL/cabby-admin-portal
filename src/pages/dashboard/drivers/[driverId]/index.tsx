import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import DriverDetails from '@/views/drivers/DriverDetails';

const DriverDetailPage = () => {
  return (
    <DashboardLayout headerTitle="Bestuurders">
      <DriverDetails />
    </DashboardLayout>
  );
};

export default DriverDetailPage;
