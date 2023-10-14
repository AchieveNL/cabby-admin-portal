import React from 'react';
import { OrderStatus } from '@/api/orders/types';
import { Table } from 'antd';
import { useOrders } from '@/api/orders/hooks';
import { getOrderColumns } from '@/views/orders/Orders';

const RejectedOrdersTab = () => {
  const { data, loading, error } = useOrders(OrderStatus.PENDING);

  const columns = getOrderColumns();
  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="px-6">
      <div className="flex items-end flex-wrap gap-4 mb-5">
        <div className="mr-auto">
          <h4 className="mb-1 capitalize text-neutral-100 font-bold text-xl sm:text-2xl">
            Pending Orders
          </h4>
          <h6 className="mb-4 font-medium text-base text-neutral-50">
            Total {data.length} pending orders
          </h6>
        </div>
      </div>
      <Table columns={columns} dataSource={data} loading={loading} />
    </div>
  );
};

export default RejectedOrdersTab;
