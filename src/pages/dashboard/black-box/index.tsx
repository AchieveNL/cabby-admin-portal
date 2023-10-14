import React from 'react';
import Drivers from '@/views/drivers/Drivers';
import DashboardLayout from '@/layout/DashboardLayout';

const BlackBoxPage = () => {
  return (
    <>
      <DashboardLayout>
        <Drivers />
      </DashboardLayout>
    </>
  );
};

export default BlackBoxPage;
