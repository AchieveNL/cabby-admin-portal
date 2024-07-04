import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import CreateRefund from '@/views/refunds/CreateRefund';

const Page = () => {
  return (
    <DashboardLayout>
      <CreateRefund />
    </DashboardLayout>
  );
};

export default Page;
