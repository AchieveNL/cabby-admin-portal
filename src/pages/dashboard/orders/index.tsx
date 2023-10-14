import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import Orders from '@/views/orders/Orders';

const OrdersPage = () => {
  return (
    <DashboardLayout>
      <Orders />
    </DashboardLayout>
  );
};

export default OrdersPage;
