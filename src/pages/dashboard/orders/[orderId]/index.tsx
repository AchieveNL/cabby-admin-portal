import DashboardLayout from '@/layout/DashboardLayout';
import OrderDetails from '@/views/orders/OrderDetails';
import React from 'react';

export default function OrderDetailsPage() {
  return (
    <DashboardLayout>
      <OrderDetails />
    </DashboardLayout>
  );
}
