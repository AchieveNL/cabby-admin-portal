import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import Orders from '@/views/orders/Orders';
import Link from 'next/link';

const OrdersPage = () => {
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
      ]}
    >
      <Orders />
    </DashboardLayout>
  );
};

export default OrdersPage;
