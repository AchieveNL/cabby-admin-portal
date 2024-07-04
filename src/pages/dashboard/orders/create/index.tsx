import DashboardLayout from '@/layout/DashboardLayout';
import CreateOrder from '@/views/orders/CreateOrder';
import React from 'react';

const Page = () => {
  return (
    <DashboardLayout>
      <CreateOrder />
    </DashboardLayout>
  );
};

export default Page;
