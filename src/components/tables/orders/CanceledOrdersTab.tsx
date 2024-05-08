import React from 'react';
import { Table } from 'antd';
import { OrderStatus } from '@/api/orders/types';
import { useOrders } from '@/api/orders/hooks';
import { getOrderColumns } from '@/views/orders/Orders';

export default function CanceledOrdersTab() {
  const { data, isLoading, error } = useOrders(OrderStatus.CANCELED);

  const columns = getOrderColumns();

  if (error) {
    return <p>Error loading data!</p>;
  }

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Cancelation Orders
          </h4>
          <h6 className="mb-4 font-medium text-base text-neutral-50">
            Total {data?.length} cancelation orders
          </h6>
        </div>
      </div>
      <Table columns={columns} dataSource={data} loading={isLoading} />
    </div>
  );
}
