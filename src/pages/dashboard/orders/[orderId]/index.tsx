import DashboardLayout from '@/layout/DashboardLayout';
import OrderDetails from '@/views/orders/OrderDetails';
import Link from 'next/link';
import React from 'react';

export default function OrderDetailsPage() {
  return (
    <DashboardLayout
      breadcrumbItems={[
        {
          title: (
            <Link href={'/dashboard/orders'}>
              <div className="text-primary-base">Orders</div>
            </Link>
          ),
        },
        { title: 'Order details' },
      ]}
    >
      <OrderDetails />
    </DashboardLayout>
  );
}
